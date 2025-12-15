# 🔄 重启开发服务器指南

## ⚠️ 重要：环境变量更新后必须重启

修改 `.env.local` 文件后，**必须重启开发服务器**才能生效！

Vite 只在启动时读取环境变量，HMR（热更新）不会重新加载环境变量。

---

## 🚀 重启步骤

### Step 1: 停止当前服务器

**在运行 `npm run dev` 的终端窗口：**

1. 按 `Ctrl + C` 停止服务器
2. 等待服务器完全停止（看到命令提示符）

### Step 2: 重新启动服务器

**在同一个终端窗口：**

```bash
npm run dev
```

**等待看到：**
```
VITE ready in xxx ms

➜  Local:   http://localhost:XXXX/
```

**注意：** 记下实际的端口号（可能是 3000 或 3001）

---

## ✅ 验证环境变量已加载

### 方法1: 检查终端输出

重启后，在浏览器控制台（Cmd + Option + J）中：

```javascript
// 在控制台执行
console.log(import.meta.env.VITE_SUPABASE_URL)
```

**应该看到：**
```
https://nbvnnhojvkxfnididast.supabase.co
```

**如果看到 `undefined`，说明环境变量未加载，需要重启！**

---

## 🧪 测试连接

### Step 1: 访问测试页面

根据终端显示的端口号，访问：

```
http://localhost:XXXX/#/test-supabase
```

**注意：** 
- 使用 `#` 符号（HashRouter）
- 使用终端显示的实际端口号

### Step 2: 查看测试结果

**应该看到：**
```
✅ All Tests Passed!
3 passed, 0 failed out of 3 tests

✅ Supabase Client Initialization
✅ Database Connection
✅ Waitlist Service
```

---

## 🔍 如果仍然失败

### 检查1: 确认环境变量格式

**在 `.env.local` 中：**
```env
VITE_SUPABASE_URL=https://nbvnnhojvkxfnididast.supabase.co
VITE_SUPABASE_ANON_KEY=REDACTED
```

**确保：**
- ✅ 没有引号
- ✅ 没有多余的空格
- ✅ URL 格式正确（`https://` 开头，`.supabase.co` 结尾）
- ✅ 项目 ID 正确：`nbvnnhojvkxfnididast`

### 检查2: 确认服务器已重启

**在浏览器控制台执行：**
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL)
```

**如果显示 `undefined`：**
- ❌ 服务器未重启
- ❌ 环境变量名称错误（应该是 `VITE_` 开头）

**如果显示正确的 URL：**
- ✅ 环境变量已加载
- 继续检查其他问题

### 检查3: 检查端口号

**确认访问的端口号与终端显示的端口号一致！**

如果终端显示：
```
➜  Local:   http://localhost:3001/
```

那么应该访问：
```
http://localhost:3001/#/test-supabase
```

**不要访问错误的端口号！**

---

## 📋 完整检查清单

- [ ] `.env.local` 文件已更新为正确的 URL
- [ ] 开发服务器已完全停止（Ctrl + C）
- [ ] 开发服务器已重新启动（`npm run dev`）
- [ ] 确认终端显示的端口号
- [ ] 使用正确的端口号访问测试页面
- [ ] 使用 `#` 符号（HashRouter）
- [ ] 浏览器控制台显示正确的环境变量
- [ ] 所有测试通过

---

## 🎯 预期结果

**重启并访问测试页面后：**

```
✅ All Tests Passed!
3 passed, 0 failed out of 3 tests

✅ Supabase Client Initialization
   Client initialized successfully

✅ Database Connection
   Database connection successful

✅ Waitlist Service
   Waitlist service works
```

---

**最后更新**：2025-12-15  
**状态**：等待重启服务器并测试

