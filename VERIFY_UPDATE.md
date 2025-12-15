# ✅ 验证环境变量更新

## 🔍 检查清单

### Step 1: 确认 .env.local 文件内容

**在 Cursor 中打开 `.env.local` 文件，确认：**

```env
VITE_SUPABASE_URL=https://nbvnnhojvkxfnididast.supabase.co
```

**关键检查点：**
- ✅ 项目ID：`nbvnnhojvkxfnididast`（注意有两个 `d`）
- ✅ 没有末尾斜杠 `/`
- ✅ 格式：`https://` 开头，`.supabase.co` 结尾

**如果还是旧的URL（`nbvnnhojvkxfnidiast`），说明：**
- ❌ 文件未保存（按 `Cmd + S` 保存）
- ❌ 更新了错误的文件

---

### Step 2: 确认文件已保存

**在 Cursor 中：**
1. 检查文件标签是否有未保存标记（圆点）
2. 如果有，按 `Cmd + S` 保存
3. 确认文件标签没有未保存标记

---

### Step 3: 重启开发服务器

**重要：环境变量更新后必须重启！**

**在终端：**
1. 找到运行 `npm run dev` 的终端窗口
2. 按 `Ctrl + C` 停止服务器
3. 等待完全停止
4. 重新运行：`npm run dev`

**等待看到：**
```
VITE ready in xxx ms
➜  Local:   http://localhost:XXXX/
```

**注意：** 记下实际的端口号！

---

### Step 4: 验证环境变量已加载

**在浏览器中：**
1. 访问测试页面：`http://localhost:XXXX/#/test-supabase`
2. 打开控制台（`Cmd + Option + J`）
3. 执行：
   ```javascript
   console.log(import.meta.env.VITE_SUPABASE_URL)
   ```

**应该看到：**
```
https://nbvnnhojvkxfnididast.supabase.co
```

**如果看到：**
- `undefined` → 环境变量未加载，需要重启服务器
- 旧的URL → 文件未正确更新或未保存

---

## 🚨 常见问题

### 问题1: 文件已更新但测试仍失败

**可能原因：**
- 服务器未重启
- 访问了错误的端口号
- 浏览器缓存

**解决方案：**
1. 确认服务器已重启
2. 使用终端显示的实际端口号
3. 硬刷新浏览器（`Cmd + Shift + R`）

---

### 问题2: 多个Vite进程运行

**如果看到多个Vite进程：**
```bash
# 查看所有Vite进程
ps aux | grep vite

# 停止所有Vite进程
pkill -f vite

# 重新启动
npm run dev
```

---

### 问题3: 环境变量显示undefined

**检查：**
1. 环境变量名称是否正确（`VITE_` 开头）
2. 文件是否在项目根目录
3. 服务器是否已重启

---

## 📋 完整验证流程

1. [ ] 打开 `.env.local` 文件
2. [ ] 确认URL为：`https://nbvnnhojvkxfnididast.supabase.co`
3. [ ] 确认文件已保存（`Cmd + S`）
4. [ ] 停止开发服务器（`Ctrl + C`）
5. [ ] 重新启动服务器（`npm run dev`）
6. [ ] 确认终端显示的端口号
7. [ ] 访问测试页面（使用正确的端口号）
8. [ ] 在控制台验证环境变量
9. [ ] 查看测试结果

---

**最后更新**：2025-12-15  
**状态**：等待验证更新

