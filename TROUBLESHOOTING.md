# 故障排除指南 🔧

## 🔴 常见问题及解决方案

### 问题1: 端口号不匹配 ⭐⭐⭐

**症状：**
- 终端显示：`Port 3000 is in use, trying another one...`
- 服务器运行在：`http://localhost:3001/`
- 但访问的是：`http://localhost:3000/`

**原因：**
- 3000端口被其他程序占用
- Vite自动切换到下一个可用端口（3001）

**解决方案：**

#### 方案A：使用新端口（推荐）
```
访问：http://localhost:3001/#/test-supabase
```

#### 方案B：释放3000端口
```bash
# 查看占用3000端口的进程
lsof -i :3000

# 杀掉进程（替换<PID>为实际的进程ID）
kill -9 <PID>

# 重启开发服务器
npm run dev
```

---

### 问题2: "Failed to fetch" 错误 ⭐⭐⭐

**症状：**
- ✅ Supabase Client Initialization - 通过
- ❌ Database Connection - "TypeError: Failed to fetch"
- ❌ Waitlist Service - "TypeError: Failed to fetch"

**可能原因：**

#### A. CORS配置问题（最常见）

**解决方案：**

1. **访问 Supabase Dashboard**
   ```
   https://supabase.com/dashboard/project/nbvnnhojvkxfnidiast
   ```

2. **检查API设置**
   - Settings → API
   - 查看是否有 "Additional Allowed Origins" 或类似选项
   - 如果没有，新版Supabase可能默认允许localhost

3. **如果仍然失败，尝试：**
   - Settings → General
   - 查找 "Allowed Origins" 或 "CORS" 相关设置
   - 添加：`http://localhost:3000` 和 `http://localhost:3001`

#### B. 数据库表不存在

**检查：**
```sql
-- 在 Supabase SQL Editor 执行
SELECT * FROM waitlist LIMIT 1;
```

**如果表不存在，执行：**
```sql
-- 创建 waitlist 表
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户插入
CREATE POLICY "Allow anonymous insert on waitlist"
  ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 允许匿名用户查询
CREATE POLICY "Allow anonymous select on waitlist"
  ON waitlist
  FOR SELECT
  TO anon
  USING (true);
```

#### C. RLS策略阻止访问

**检查：**
```sql
-- 查看当前策略
SELECT * FROM pg_policies WHERE tablename = 'waitlist';
```

**如果策略不存在，执行上面的SQL脚本**

#### D. 网络连接问题

**测试Supabase连接：**
```bash
# 在终端执行
curl https://nbvnnhojvkxfnidiast.supabase.co/rest/v1/
```

**应该看到：**
```json
{"message":"The server is running."}
```

**如果看到错误，可能是：**
- 网络连接问题
- Supabase项目未激活
- URL不正确

---

### 问题3: 环境变量未加载 ⭐⭐

**症状：**
- "Missing Supabase environment variables"

**检查步骤：**

1. **确认文件位置**
   ```bash
   cd /Users/kirito/Downloads/follow.ai
   cat .env.local
   ```

2. **确认文件内容**
   ```env
   VITE_SUPABASE_URL=https://nbvnnhojvkxfnidiast.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```

3. **确认变量名正确**
   - ✅ `VITE_SUPABASE_URL`（不是 `SUPABASE_URL`）
   - ✅ `VITE_SUPABASE_ANON_KEY`（不是 `SUPABASE_ANON_KEY`）

4. **重启开发服务器**
   ```bash
   # 必须重启才能加载新的环境变量
   npm run dev
   ```

---

### 问题4: 控制台错误 "ERR_NAME_NOT_RESOLVED" ⭐⭐

**症状：**
- 浏览器控制台显示：`Failed to load resource: net::ERR_NAME_NOT_RESOLVED`
- URL看起来被截断：`nbvnnhojvkxfnidiast...waitlist`

**原因：**
- Supabase URL可能不正确
- 网络请求被阻止

**解决方案：**

1. **验证Supabase URL**
   ```bash
   # 在终端测试
   curl https://nbvnnhojvkxfnidiast.supabase.co/rest/v1/
   ```

2. **检查.env.local中的URL**
   - 确保完整：`https://nbvnnhojvkxfnidiast.supabase.co`
   - 没有多余的斜杠
   - 没有引号

3. **检查浏览器网络请求**
   - 打开开发者工具 → Network标签
   - 查看失败的请求
   - 检查请求URL是否正确

---

## 🔍 诊断步骤

### Step 1: 验证环境变量

```bash
cd /Users/kirito/Downloads/follow.ai
cat .env.local
```

**应该看到：**
```
VITE_SUPABASE_URL=https://nbvnnhojvkxfnidiast.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...（很长的字符串）
```

---

### Step 2: 验证Supabase连接

```bash
# 测试API端点
curl https://nbvnnhojvkxfnidiast.supabase.co/rest/v1/
```

**应该看到：**
```json
{"message":"The server is running."}
```

---

### Step 3: 验证数据库表

在 Supabase Dashboard → SQL Editor 执行：

```sql
-- 检查表是否存在
SELECT * FROM waitlist LIMIT 1;

-- 检查RLS策略
SELECT * FROM pg_policies WHERE tablename = 'waitlist';
```

---

### Step 4: 检查开发服务器端口

```bash
# 查看终端输出
npm run dev
```

**注意显示的端口号：**
- 如果是 `localhost:3001`，访问时也要用 `3001`
- 如果是 `localhost:3000`，访问时用 `3000`

---

### Step 5: 检查浏览器控制台

1. 打开浏览器控制台（Cmd + Option + J）
2. 查看 Console 标签
3. 查看 Network 标签
4. 查找失败的请求
5. 检查错误详情

---

## 🎯 快速检查清单

- [ ] `.env.local` 文件在项目根目录
- [ ] 环境变量名称正确（`VITE_` 前缀）
- [ ] Supabase URL格式正确（`https://xxx.supabase.co`）
- [ ] API Key完整（200+字符）
- [ ] 开发服务器已重启
- [ ] 访问的端口号与服务器端口一致
- [ ] `waitlist` 表已创建
- [ ] RLS策略已配置
- [ ] Supabase项目状态为 "Active"
- [ ] 浏览器控制台无CORS错误

---

## 🚀 完整修复流程

### 1. 确认环境变量
```bash
cd /Users/kirito/Downloads/follow.ai
cat .env.local
```

### 2. 确认数据库表
在 Supabase Dashboard → SQL Editor 执行：
```sql
SELECT * FROM waitlist LIMIT 1;
```

### 3. 确认端口号
查看终端输出，确认服务器运行的端口

### 4. 重启开发服务器
```bash
npm run dev
```

### 5. 访问正确的URL
```
http://localhost:XXXX/#/test-supabase
```
（XXXX是实际端口号）

---

## 📞 如果仍然失败

### 收集信息

1. **截图：**
   - 测试页面结果
   - 浏览器控制台错误（Console + Network）
   - Supabase Dashboard → Settings → API 页面

2. **终端输出：**
   ```bash
   # 测试Supabase连接
   curl https://nbvnnhojvkxfnidiast.supabase.co/rest/v1/
   
   # 查看环境变量（隐藏key后半部分）
   cat .env.local | sed 's/\(.*KEY=.*\)\(.\{20\}\)$/\1.../'
   ```

3. **Supabase项目信息：**
   - 项目状态（Active/Inactive）
   - 数据库状态
   - API设置截图

---

## 💡 新版Supabase注意事项

### CORS配置变化

新版Supabase（2024+）可能：
- ✅ 默认允许 localhost 连接
- ✅ 不需要手动配置CORS
- ✅ 更智能的权限管理

### 如果仍然需要配置CORS

1. **Settings → API**
   - 查找 "Additional Allowed Origins"
   - 或 "CORS Configuration"
   - 或 "Allowed Origins"

2. **Settings → General**
   - 查找 "Security" 或 "CORS" 相关设置

3. **如果找不到，可能默认已允许**
   - 先测试功能
   - 如果失败，联系Supabase支持

---

**最后更新**：2025-12-15  
**状态**：📋 故障排除指南

