# Supabase 数据库设置 SQL 脚本 🗄️

## 📋 概述

在 Supabase Dashboard → SQL Editor 中执行以下 SQL 脚本来创建必要的表和配置。

---

## 🚀 快速设置（复制粘贴执行）

### Step 1: 创建 waitlist 表

```sql
-- 创建 waitlist 表
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引（提高查询性能）
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at);
```

### Step 2: 配置 Row Level Security (RLS)

```sql
-- 启用 RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户插入（注册等待列表）
CREATE POLICY "Allow anonymous insert on waitlist"
  ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 允许匿名用户查询（检查邮箱是否已存在）
CREATE POLICY "Allow anonymous select on waitlist"
  ON waitlist
  FOR SELECT
  TO anon
  USING (true);
```

### Step 3: 验证表创建成功

```sql
-- 检查表是否存在
SELECT * FROM waitlist LIMIT 1;

-- 应该返回空结果（表存在但没有数据）
```

---

## 🔧 完整数据库架构（可选，未来使用）

### profiles 表

```sql
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  total_earnings NUMERIC(10, 2) DEFAULT 0,
  reputation_score INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 策略
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### tools 表

```sql
CREATE TABLE IF NOT EXISTS tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  website_url TEXT,
  logo_url TEXT,
  pricing_type TEXT,
  average_rating NUMERIC(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 策略
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tools are viewable by everyone"
  ON tools FOR SELECT
  USING (true);
```

### reviews 表

```sql
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  output_description TEXT,
  output_files JSONB,
  prompt_used TEXT,
  use_case TEXT,
  time_spent INTEGER,
  is_verified BOOLEAN DEFAULT false,
  ai_quality_score NUMERIC(3, 2),
  upvotes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 策略
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);
```

### tasks 表

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id UUID REFERENCES tools(id) ON DELETE SET NULL,
  creator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  reward_amount NUMERIC(10, 2) NOT NULL,
  total_slots INTEGER NOT NULL,
  filled_slots INTEGER DEFAULT 0,
  deadline TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 策略
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tasks are viewable by everyone"
  ON tasks FOR SELECT
  USING (true);
```

---

## 🔐 Storage Buckets 设置

### 在 Supabase Dashboard → Storage 中创建：

#### 1. review-outputs bucket
- **Name:** `review-outputs`
- **Public:** Yes
- **File size limit:** 50MB
- **Allowed MIME types:** 
  - image/jpeg, image/png, image/gif, image/webp
  - application/pdf
  - text/plain, text/javascript, text/css
  - application/x-python

#### 2. user-avatars bucket
- **Name:** `user-avatars`
- **Public:** Yes
- **File size limit:** 5MB
- **Allowed MIME types:**
  - image/jpeg, image/png, image/gif, image/webp

---

## 🌐 CORS 配置

### 在 Supabase Dashboard → Settings → API：

1. 找到 "Additional Allowed Origins"
2. 添加以下域名：
   ```
   http://localhost:3000
   http://localhost:5173
   https://your-domain.com
   ```

---

## ✅ 验证设置

### 测试数据库连接

在 Supabase Dashboard → SQL Editor 执行：

```sql
-- 测试插入
INSERT INTO waitlist (email, source) 
VALUES ('test@example.com', 'test')
ON CONFLICT (email) DO NOTHING;

-- 测试查询
SELECT * FROM waitlist WHERE email = 'test@example.com';

-- 清理测试数据（可选）
DELETE FROM waitlist WHERE email = 'test@example.com';
```

---

## 📝 执行顺序

1. ✅ 创建 waitlist 表（必须）
2. ✅ 配置 RLS 策略（必须）
3. ✅ 配置 CORS（必须）
4. ⏳ 创建其他表（可选，未来使用）
5. ⏳ 创建 Storage Buckets（可选，未来使用）

---

**最后更新**：2025-01-XX  
**状态**：📋 数据库设置脚本

