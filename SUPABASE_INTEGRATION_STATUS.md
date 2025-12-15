# 🔍 Supabase 集成状态检查

## 当前状态

### ✅ 已完成的集成
1. **Supabase Client 配置** (`src/lib/supabase.ts`)
   - 客户端初始化
   - 延迟初始化模式（避免环境变量缺失时崩溃）
   - Mock客户端支持

2. **Service 层** (`src/services/`)
   - ✅ `authService.ts` - 认证服务
   - ✅ `reviewService.ts` - 评论服务
   - ✅ `storageService.ts` - 存储服务
   - ✅ `waitlistService.ts` - 等待列表服务

3. **类型定义** (`src/types/database.types.ts`)
   - 完整的数据库类型定义

4. **AuthContext 集成**
   - 使用真实的 Supabase Auth
   - 自动创建 Profile
   - Session 管理

### ⚠️ 当前问题

**"Failed to fetch" 错误**通常由以下原因引起：

1. **环境变量未配置**
   - `.env.local` 文件不存在或配置错误
   - `VITE_SUPABASE_URL` 或 `VITE_SUPABASE_ANON_KEY` 缺失

2. **Supabase 项目未设置**
   - 数据库表未创建
   - RLS 策略未配置
   - CORS 未配置

3. **网络问题**
   - Supabase URL 不正确
   - 网络连接问题

---

## 🔧 快速检查清单

### Step 1: 检查环境变量

创建或检查 `.env.local` 文件（项目根目录）：

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 2: 检查 Supabase 项目

1. 登录 [Supabase Dashboard](https://app.supabase.com)
2. 选择你的项目
3. 检查以下内容：

#### 数据库表
确保以下表已创建：
- `profiles`
- `tools`
- `reviews`
- `tasks`
- `waitlist`

#### RLS 策略
确保 RLS 策略已配置，允许：
- 匿名用户注册（`auth.users` 表）
- 用户读取/更新自己的 profile

#### CORS 配置
在 Supabase Dashboard → Settings → API：
- 确保 `localhost:5173` 或你的开发端口在允许列表中

### Step 3: 检查网络连接

在浏览器控制台运行：
```javascript
fetch('https://your-project.supabase.co/rest/v1/', {
  headers: {
    'apikey': 'your-anon-key'
  }
}).then(r => console.log('Connected:', r.status))
```

---

## 🚀 完整设置指南

### 1. 创建 Supabase 项目

1. 访问 https://app.supabase.com
2. 创建新项目
3. 等待项目初始化完成

### 2. 获取凭据

在 Supabase Dashboard → Settings → API：
- **Project URL**: `https://xxxxx.supabase.co`
- **anon/public key**: 复制 `anon` `public` key

### 3. 配置环境变量

在项目根目录创建 `.env.local`：

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. 创建数据库表

运行 SQL 脚本（见 `SUPABASE_SETUP_SQL.md`）：

```sql
-- Profiles 表
CREATE TABLE profiles (
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

-- 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS 策略
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### 5. 重启开发服务器

```bash
npm run dev
```

---

## 🐛 调试步骤

### 检查 1: 环境变量

```bash
# 在项目根目录
cat .env.local
```

应该看到：
```
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 检查 2: 浏览器控制台

打开浏览器控制台（F12），查看：
- 是否有 "Missing Supabase environment variables" 警告
- 网络请求是否失败
- 错误详情

### 检查 3: Supabase 连接测试

访问 `http://localhost:5173/#/test-supabase`（或你的开发端口）

应该看到：
- ✅ Supabase client initialized
- ✅ Database query successful
- ✅ Waitlist service working

---

## 📝 下一步

1. **配置环境变量** - 创建 `.env.local` 文件
2. **设置数据库** - 运行 SQL 脚本创建表
3. **测试连接** - 使用 `/test-supabase` 页面
4. **重新尝试注册** - 应该可以正常工作

---

**注意**: 如果环境变量未配置，应用会使用 Mock 客户端，但注册功能不会真正工作。必须配置真实的 Supabase 凭据才能使用认证功能。

