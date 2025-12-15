# 快速修复指南 🚀

## 🔴 当前问题

测试显示：
- ✅ Supabase Client Initialization - 通过
- ❌ Database Connection - "TypeError: Failed to fetch"
- ❌ Waitlist Service - "TypeError: Failed to fetch"

**原因：** 环境变量未配置或配置不正确

---

## ⚡ 快速修复（5分钟）

### Step 1: 检查环境变量文件

```bash
# 在 Cursor 终端执行
cat .env.local
```

**应该看到：**
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

**如果没有看到这些内容，继续下一步。**

---

### Step 2: 获取 Supabase 凭证

#### 2.1 访问 Supabase Dashboard
```
https://supabase.com/dashboard
```

#### 2.2 选择你的项目
- 如果还没有项目，点击 "New Project" 创建

#### 2.3 获取 API 凭证
1. 点击左侧菜单 **Settings** → **API**
2. 找到：
   - **Project URL** - 例如：`https://nbvnnhojvkxfnidiast.supabase.co`
   - **anon/public key** - 很长的字符串（200+字符）

---

### Step 3: 配置环境变量

#### 3.1 编辑 `.env.local` 文件

在 Cursor 中打开 `.env.local`，添加或修改：

```env
VITE_SUPABASE_URL=https://你的项目ID.supabase.co
VITE_SUPABASE_ANON_KEY=你的完整anon key
```

**重要：**
- ✅ 不要有引号
- ✅ 不要有多余的空格
- ✅ URL 格式：`https://xxxxx.supabase.co`
- ✅ Key 是完整的字符串（200+字符）

#### 3.2 示例格式

```env
VITE_SUPABASE_URL=https://nbvnnhojvkxfnidiast.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5idm5uaG9qdm14Zm5pZGlhc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTc2ODAwMCwiZXhwIjoxOTYxMzQ0MDAwfQ.你的完整key
```

---

### Step 4: 重启开发服务器

**重要：修改环境变量后必须重启！**

```bash
# 在终端按 Ctrl+C 停止服务器
# 然后重新启动
npm run dev
```

---

### Step 5: 重新测试

访问：
```
http://localhost:3000/#/test-supabase
```

**应该看到：**
```
✅ All Tests Passed!
3 passed, 0 failed out of 3 tests
```

---

## 🔍 如果仍然失败

### 检查清单

- [ ] `.env.local` 文件存在
- [ ] `VITE_SUPABASE_URL` 格式正确（https://开头）
- [ ] `VITE_SUPABASE_ANON_KEY` 完整（200+字符）
- [ ] 没有引号或多余空格
- [ ] 开发服务器已重启
- [ ] Supabase 项目状态为 "Active"

### 常见错误

#### 错误1: "Failed to fetch" 仍然出现

**可能原因：**
1. CORS 问题
2. Supabase 项目未激活
3. URL 或 Key 不正确

**解决方案：**
1. 在 Supabase Dashboard → Settings → API
2. 检查 "Additional Allowed Origins"
3. 添加：`http://localhost:3000`

#### 错误2: "Database query failed"

**可能原因：** 数据库表不存在

**解决方案：**
在 Supabase Dashboard → SQL Editor 执行：

```sql
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 📞 需要帮助？

如果按照以上步骤仍然失败：

1. **截图给我看：**
   - `.env.local` 文件内容（隐藏key的后半部分）
   - 浏览器控制台错误（Cmd + Option + J）
   - 测试页面的详细错误信息

2. **检查 Supabase 项目：**
   - 项目状态是否为 "Active"
   - Database 是否在运行
   - API 设置是否正确

---

**快速修复时间：** 5-10分钟  
**状态**：📋 待配置环境变量

