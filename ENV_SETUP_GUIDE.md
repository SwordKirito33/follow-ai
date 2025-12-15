# Supabase 环境变量配置指南 🔑

## 📋 问题诊断

### 当前错误
- ❌ Database Connection - "TypeError: Failed to fetch"
- ❌ Waitlist Service - "TypeError: Failed to fetch"

**原因：** 环境变量未配置或配置不正确

---

## 🔧 解决方案

### Step 1: 获取 Supabase 凭证

#### 1.1 访问 Supabase Dashboard
```
https://supabase.com/dashboard
```

#### 1.2 选择或创建项目
- 如果已有项目，点击进入
- 如果没有，点击 "New Project" 创建

#### 1.3 获取 API 凭证
1. 进入项目后，点击左侧菜单 **Settings** → **API**
2. 找到以下信息：
   - **Project URL** - 例如：`https://xxxxx.supabase.co`
   - **anon/public key** - 一个很长的字符串（200+字符）

---

### Step 2: 创建环境变量文件

#### 2.1 在项目根目录创建 `.env.local` 文件

```bash
# 在 Cursor 终端执行
cd /Users/kirito/Downloads/follow.ai
touch .env.local
```

#### 2.2 添加环境变量

打开 `.env.local` 文件，添加：

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=REDACTED
```

**重要：**
- ✅ 替换 `your-project-id` 为你的实际项目ID
- ✅ 替换 `your-key-here` 为你的实际 anon key
- ✅ 不要有引号
- ✅ 不要有多余的空格

---

### Step 3: 验证配置

#### 3.1 检查文件是否存在
```bash
cat .env.local
```

应该看到：
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=REDACTED
```

#### 3.2 重启开发服务器

**重要：修改环境变量后必须重启服务器！**

```bash
# 在终端按 Ctrl+C 停止服务器
# 然后重新启动
npm run dev
```

#### 3.3 验证环境变量加载

在浏览器控制台（Cmd + Option + J）运行：

```javascript
console.log('URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...')
```

应该看到：
- URL: `https://xxxxx.supabase.co`
- Key: `REDACTED_JWT`

---

## 🎯 完整配置示例

### 示例 `.env.local` 文件

```env
# Supabase Configuration
# 从 https://supabase.com/dashboard → Settings → API 获取

VITE_SUPABASE_URL=https://nbvnnhojvkxfnidiast.supabase.co
VITE_SUPABASE_ANON_KEY=REDACTED
```

---

## ❌ 常见错误及解决方案

### 错误1: "Missing Supabase environment variables"

**原因：** `.env.local` 文件不存在或变量名错误

**解决方案：**
1. 确认文件名为 `.env.local`（不是 `.env`）
2. 确认变量名为 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`
3. 确认文件在项目根目录
4. 重启开发服务器

---

### 错误2: "TypeError: Failed to fetch"

**可能原因：**

#### A. CORS 问题
**解决方案：**
1. 访问 Supabase Dashboard
2. Settings → API
3. 找到 "Additional Allowed Origins"
4. 添加：`http://localhost:3000`

#### B. Supabase URL 不正确
**解决方案：**
1. 检查 URL 格式：`https://xxxxx.supabase.co`
2. 确认没有多余的斜杠
3. 确认没有引号

#### C. API Key 不正确
**解决方案：**
1. 确认使用的是 `anon/public` key（不是 `service_role` key）
2. 确认 key 完整（200+字符）
3. 确认没有多余的空格或换行

---

### 错误3: "Database query failed"

**可能原因：**

#### A. 数据库表不存在
**解决方案：**
1. 在 Supabase Dashboard → SQL Editor
2. 创建 `waitlist` 表（如果还没有）

```sql
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### B. RLS (Row Level Security) 阻止访问
**解决方案：**
1. 在 Supabase Dashboard → Authentication → Policies
2. 为 `waitlist` 表创建策略：

```sql
-- 允许匿名用户插入
CREATE POLICY "Allow anonymous insert" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 允许匿名用户查询
CREATE POLICY "Allow anonymous select" ON waitlist
  FOR SELECT
  TO anon
  USING (true);
```

---

## 🔍 调试步骤

### Step 1: 验证环境变量

```bash
# 在项目根目录
cat .env.local
```

### Step 2: 测试 Supabase 连接

```bash
# 使用 curl 测试 API
curl https://your-project-id.supabase.co/rest/v1/
```

应该看到：
```json
{"message":"The server is running."}
```

### Step 3: 检查浏览器控制台

1. 打开浏览器控制台（Cmd + Option + J）
2. 查看 Network 标签
3. 查看失败的请求
4. 检查请求URL和响应

---

## 📝 配置检查清单

- [ ] `.env.local` 文件已创建
- [ ] `VITE_SUPABASE_URL` 已配置（格式正确）
- [ ] `VITE_SUPABASE_ANON_KEY` 已配置（完整key）
- [ ] 文件在项目根目录
- [ ] 开发服务器已重启
- [ ] Supabase 项目状态为 "Active"
- [ ] CORS 已配置（如果需要）
- [ ] 数据库表已创建
- [ ] RLS 策略已配置（如果需要）

---

## 🚀 快速开始

### 如果你还没有 Supabase 项目：

1. **注册 Supabase 账户**
   ```
   https://supabase.com
   ```

2. **创建新项目**
   - 点击 "New Project"
   - 项目名称：`follow-ai`
   - 数据库密码：设置强密码（保存好）
   - 区域：选择 `Southeast Asia (Singapore)` 或 `Australia (Sydney)`
   - 点击 "Create new project"

3. **等待项目创建完成**（1-2分钟）

4. **获取 API 凭证**
   - Settings → API
   - 复制 Project URL 和 anon key

5. **创建 `.env.local` 文件**
   ```bash
   cd /Users/kirito/Downloads/follow.ai
   touch .env.local
   ```

6. **添加环境变量**
   ```env
   VITE_SUPABASE_URL=你的项目URL
   VITE_SUPABASE_ANON_KEY=REDACTED
   ```

7. **重启开发服务器**
   ```bash
   npm run dev
   ```

8. **测试连接**
   ```
   http://localhost:3000/#/test-supabase
   ```

---

## 🎯 测试成功标志

配置正确后，测试页面应该显示：

```
✅ All Tests Passed!
3 passed, 0 failed out of 3 tests

✅ Supabase Client Initialization
✅ Client initialized successfully

✅ Database Connection
✅ Database connection successful

✅ Waitlist Service
✅ Waitlist service works
```

---

**最后更新**：2025-01-XX  
**状态**：📋 配置指南

