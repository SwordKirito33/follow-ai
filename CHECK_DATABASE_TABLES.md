# 🔍 检查数据库表状态

## 当前问题分析

你已经配置了 Supabase 环境变量（✅），但仍然出现 "Failed to fetch" 错误。

**最可能的原因**：数据库表还没有创建！

---

## 🚀 快速修复步骤

### Step 1: 登录 Supabase Dashboard

1. 访问 https://app.supabase.com
2. 登录你的账户
3. 选择项目：`nbvnnhojvkxfnididast`

### Step 2: 检查表是否存在

在 Supabase Dashboard → **Table Editor**，检查是否有以下表：
- ❓ `profiles` - **必需**
- ❓ `waitlist` - 可选（用于测试）
- ❓ `tools` - 可选（目前使用mock数据）
- ❓ `reviews` - 可选（目前使用mock数据）

### Step 3: 创建必需的表

如果 `profiles` 表不存在，在 **SQL Editor** 中运行以下 SQL：

```sql
-- 创建 profiles 表
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  reputation_score INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 删除旧策略（如果存在）
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- 创建 RLS 策略
-- 1. 用户可以读取自己的 profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- 2. 用户可以更新自己的 profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 3. 用户可以插入自己的 profile（注册时）
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 4. 允许公开读取（可选，用于显示用户信息）
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);
```

### Step 4: 创建触发器（自动更新 updated_at）

```sql
-- 创建更新 updated_at 的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为 profiles 表创建触发器
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Step 5: 测试连接

1. 重启开发服务器（如果正在运行）
2. 访问 `http://localhost:5173/#/test-supabase`
3. 应该看到：
   - ✅ Supabase client initialized
   - ✅ Database query successful
   - ✅ Waitlist service working

### Step 6: 测试注册

1. 回到首页
2. 点击 "Sign up"
3. 填写表单
4. 应该可以成功注册！

---

## 🐛 如果仍然失败

### 检查 1: 浏览器控制台

打开浏览器控制台（F12），查看：
- 网络请求是否发送到正确的 Supabase URL
- 错误详情是什么

### 检查 2: Supabase Dashboard

在 Supabase Dashboard → **Logs** → **API Logs**，查看：
- 是否有请求到达
- 错误信息是什么

### 检查 3: CORS 配置

在 Supabase Dashboard → **Settings** → **API**：
- 检查 "Additional Allowed Origins"
- 确保 `http://localhost:5173` 在列表中（或使用通配符）

---

## ✅ 验证清单

- [ ] Supabase 项目已创建
- [ ] `.env.local` 文件已配置
- [ ] `profiles` 表已创建
- [ ] RLS 策略已配置
- [ ] 触发器已创建（可选）
- [ ] 开发服务器已重启
- [ ] `/test-supabase` 页面测试通过
- [ ] 注册功能正常工作

---

**完成这些步骤后，注册功能应该可以正常工作了！**

