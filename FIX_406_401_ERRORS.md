# 🔧 修复 406 和 401 错误

## 问题分析

从错误日志可以看到：

1. **406 错误**：`/rest/v1/profiles?select=id&username=eq.testuser1`
   - 这通常表示请求头格式问题
   - Supabase REST API 需要正确的 `Accept` 和 `Prefer` 头

2. **401 错误**：`/rest/v1/profiles?select=*`
   - 认证失败
   - 可能是 RLS 策略不允许匿名查询

3. **Profile 创建失败**
   - RLS 策略可能不允许插入
   - 或者触发器/函数问题

---

## 🔧 修复步骤

### Step 1: 更新 RLS 策略（最重要）

在 Supabase Dashboard → SQL Editor，运行以下 SQL：

```sql
-- 删除旧策略
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Allow anonymous username check" ON profiles;

-- 1. 允许匿名用户检查用户名是否存在（注册时）
CREATE POLICY "Allow anonymous username check"
  ON profiles FOR SELECT
  TO anon
  USING (true);

-- 2. 允许认证用户读取所有 profiles（用于显示用户信息）
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- 3. 允许认证用户插入自己的 profile（注册时）
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 4. 允许认证用户更新自己的 profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- 5. 允许认证用户读取自己的 profile（用于编辑）
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
```

### Step 2: 使用数据库触发器自动创建 Profile（推荐）

这样可以避免在代码中处理 profile 创建失败的情况：

```sql
-- 创建函数：自动为新用户创建 profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器：在 auth.users 插入时自动创建 profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

**注意**：如果使用触发器，需要修改 `authService.ts`，移除手动创建 profile 的代码，或者让触发器处理，代码中只检查 profile 是否存在。

### Step 3: 更新代码以处理错误

代码已经更新，现在会：
- 使用 `maybeSingle()` 而不是 `single()` 来检查用户名
- 提供更详细的错误信息
- 处理权限错误和重复用户名错误

### Step 4: 检查 Supabase 配置

在 Supabase Dashboard → Settings → API：
- 确保 "Enable email confirmations" 设置正确
- 对于开发环境，可以禁用邮箱确认

---

## 🧪 测试步骤

1. **清理测试数据**（如果有）：
```sql
DELETE FROM profiles WHERE username LIKE 'test%';
DELETE FROM auth.users WHERE email LIKE 'test%';
```

2. **重启开发服务器**：
```bash
npm run dev
```

3. **测试注册**：
   - 使用新的邮箱和用户名
   - 应该可以成功注册

---

## 📝 如果仍然失败

### 检查 1: 查看详细错误

在浏览器控制台查看完整的错误对象：
```javascript
// 在 authService.ts 中添加
console.error('Full error:', JSON.stringify(profileError, null, 2))
```

### 检查 2: 验证 RLS 策略

在 Supabase Dashboard → Authentication → Policies，检查：
- `profiles` 表的策略是否正确
- 是否有冲突的策略

### 检查 3: 手动测试 SQL

在 SQL Editor 中测试：
```sql
-- 测试插入（需要替换为实际的 user_id）
INSERT INTO profiles (id, username, full_name)
VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid,
  'testuser',
  'Test User'
);
```

如果这个也失败，说明是 RLS 策略问题。

---

## ✅ 验证清单

- [ ] RLS 策略已更新
- [ ] 触发器已创建（如果使用）
- [ ] 代码已更新
- [ ] 开发服务器已重启
- [ ] 测试注册成功

