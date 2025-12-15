# ⚡ 快速 Supabase 设置指南

## 🎯 解决 "Failed to fetch" 错误

这个错误表示 Supabase 后端还没有正确配置。按照以下步骤快速设置：

---

## Step 1: 创建 Supabase 项目（如果还没有）

1. 访问 https://app.supabase.com
2. 登录或注册
3. 点击 "New Project"
4. 填写项目信息：
   - **Name**: follow-ai
   - **Database Password**: 记住这个密码
   - **Region**: 选择离你最近的区域
5. 等待项目创建完成（约2分钟）

---

## Step 2: 获取 API 凭据

1. 在 Supabase Dashboard，进入你的项目
2. 点击左侧菜单 **Settings** → **API**
3. 复制以下信息：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (很长的字符串)

---

## Step 3: 配置环境变量

在项目根目录创建 `.env.local` 文件：

```bash
# 在项目根目录运行
touch .env.local
```

然后编辑 `.env.local`，添加：

```env
VITE_SUPABASE_URL=https://你的项目ID.supabase.co
VITE_SUPABASE_ANON_KEY=REDACTED
```

**示例**：
```env
VITE_SUPABASE_URL=https://nbvnnhojvkxfnididast.supabase.co
VITE_SUPABASE_ANON_KEY=REDACTED
```

---

## Step 4: 创建数据库表

在 Supabase Dashboard → **SQL Editor**，运行以下 SQL：

```sql
-- 1. 创建 profiles 表
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  reputation_score INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. 创建 RLS 策略
-- 用户可以读取自己的 profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- 用户可以更新自己的 profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 用户可以插入自己的 profile（注册时）
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 允许匿名用户注册（通过 auth.users）
-- 这个通常已经默认启用
```

---

## Step 5: 配置 CORS（如果需要）

在 Supabase Dashboard → **Settings** → **API**：
- 找到 "Additional Allowed Origins"
- 添加你的开发URL：`http://localhost:5173`（或你的端口）

**注意**: 新版本的 Supabase 默认允许 localhost，可能不需要这一步。

---

## Step 6: 重启开发服务器

```bash
# 停止当前服务器 (Ctrl+C)
# 然后重新启动
npm run dev
```

**重要**: 修改 `.env.local` 后必须重启服务器！

---

## Step 7: 测试连接

1. 访问 `http://localhost:5173/#/test-supabase`
2. 应该看到：
   - ✅ Supabase client initialized
   - ✅ Database query successful
   - ✅ Waitlist service working

如果看到错误，检查：
- 环境变量是否正确
- Supabase URL 是否正确
- 网络连接是否正常

---

## Step 8: 测试注册

1. 回到首页
2. 点击 "Sign up"
3. 填写表单
4. 应该可以成功注册

---

## 🐛 常见问题

### 问题 1: "Missing Supabase environment variables"
**解决**: 检查 `.env.local` 文件是否存在且格式正确

### 问题 2: "Failed to fetch"
**可能原因**:
- Supabase URL 错误
- 网络连接问题
- CORS 未配置

**解决**:
1. 检查 Supabase Dashboard 中的 URL 是否正确
2. 检查浏览器控制台的网络请求详情
3. 确认 Supabase 项目状态为 "Active"

### 问题 3: "User already registered"
**解决**: 这个错误是正常的，表示邮箱已被注册。尝试使用不同的邮箱。

### 问题 4: "Table does not exist"
**解决**: 运行 Step 4 的 SQL 脚本创建表

---

## ✅ 验证清单

- [ ] Supabase 项目已创建
- [ ] `.env.local` 文件已创建并配置
- [ ] 数据库表已创建（profiles）
- [ ] RLS 策略已配置
- [ ] 开发服务器已重启
- [ ] `/test-supabase` 页面测试通过
- [ ] 注册功能正常工作

---

**完成这些步骤后，注册功能应该可以正常工作了！**

