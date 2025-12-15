# 🔧 手动更新 .env.local 文件

## ⚠️ 重要：需要手动更新

由于 `.env.local` 文件被 gitignore 保护，需要你手动更新。

---

## 📝 更新步骤

### Step 1: 打开 .env.local 文件

在 Cursor 中打开：
```
/Users/kirito/Downloads/follow.ai/.env.local
```

### Step 2: 更新 URL

**找到这一行：**
```env
VITE_SUPABASE_URL=https://nbvnnhojvkxfnidiast.supabase.co
```

**改为：**
```env
VITE_SUPABASE_URL=https://nbvnnhojvkxfnididast.supabase.co
```

**重要：**
- ✅ 项目ID：`nbvnnhojvkxfnididast`（注意有两个 `d`）
- ✅ 去掉末尾的斜杠 `/`
- ✅ 保持 `https://` 开头

### Step 3: 确认 Anon Key

**确保这一行正确：**
```env
VITE_SUPABASE_ANON_KEY=REDACTED
```

---

## ✅ 完整的 .env.local 文件内容

```env
VITE_SUPABASE_URL=https://nbvnnhojvkxfnididast.supabase.co
VITE_SUPABASE_ANON_KEY=REDACTED
```

---

## 🚀 更新后操作

### Step 1: 保存文件
按 `Cmd + S` 保存

### Step 2: 重启开发服务器

**在终端：**
```bash
# 按 Ctrl+C 停止服务器
# 然后重新启动
npm run dev
```

### Step 3: 访问测试页面

查看终端输出的实际端口号，然后访问：
```
http://localhost:XXXX/#/test-supabase
```

**应该看到：**
```
✅ All Tests Passed!
3 passed, 0 failed out of 3 tests
```

---

## 🔍 验证

### 验证1: 检查URL格式

**正确的格式：**
```
https://nbvnnhojvkxfnididast.supabase.co
```

**常见错误：**
- ❌ `http://`（应该是 `https://`）
- ❌ 末尾有斜杠 `/`
- ❌ 项目ID拼写错误

### 验证2: 测试URL可访问

在终端执行：
```bash
curl -I https://nbvnnhojvkxfnididast.supabase.co/rest/v1/
```

**应该看到：**
```
HTTP/2 401
```

（401是正常的，说明URL可以访问，只是需要认证）

---

## 📋 检查清单

- [ ] 打开 `.env.local` 文件
- [ ] 更新 `VITE_SUPABASE_URL` 为正确的URL
- [ ] 确认 `VITE_SUPABASE_ANON_KEY` 正确
- [ ] 保存文件（Cmd + S）
- [ ] 重启开发服务器
- [ ] 访问测试页面验证

---

**最后更新**：2025-12-15  
**状态**：✅ 等待手动更新 .env.local 文件

