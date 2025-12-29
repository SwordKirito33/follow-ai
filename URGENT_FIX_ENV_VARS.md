# 🚨 紧急修复：环境变量未加载

## 问题确认

✅ `.env.local` 文件内容正确  
❌ 但代码仍在使用 `placeholder.supabase.co`  
🔴 **原因**：环境变量未被 Vite 读取

---

## ✅ 立即修复步骤

### 步骤 1: 确认文件格式

你的 `.env.local` 文件应该是：

```env
VITE_SUPABASE_URL=https://nbvnnhojvkxfnididast.supabase.co
VITE_SUPABASE_ANON_KEY=REDACTED
```

**检查点**：
- ✅ 等号两边**无空格**
- ✅ 无引号
- ✅ 无注释符号（`#`）在值前面
- ✅ 每行一个变量

### 步骤 2: 停止并重启开发服务器

```bash
# 1. 停止当前服务器（在运行 npm run dev 的终端按 Ctrl+C）

# 2. 完全停止后，重新启动
npm run dev
```

**⚠️ 关键**：必须完全停止后再启动，不能只是刷新浏览器！

### 步骤 3: 验证环境变量已加载

在浏览器控制台（F12 → Console）输入：

```javascript
console.log('🔍 URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('🔍 KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 30) + '...')
```

**期望结果**：
```
🔍 URL: https://nbvnnhojvkxfnididast.supabase.co
🔍 KEY: REDACTED_JWT
```

**如果仍然显示 `undefined` 或 `placeholder.supabase.co`**：
- 继续下一步

### 步骤 4: 检查文件位置

确认 `.env.local` 在项目**根目录**：

```bash
# 应该在项目根目录看到
ls -la .env.local

# 应该和这些文件在同一目录
ls -la package.json vite.config.ts .env.local
```

### 步骤 5: 如果仍然失败 - 重新创建文件

```bash
# 备份
cp .env.local .env.local.backup

# 删除旧文件
rm .env.local

# 创建新文件（使用你提供的正确值）
cat > .env.local << 'EOF'
VITE_SUPABASE_URL=https://nbvnnhojvkxfnididast.supabase.co
VITE_SUPABASE_ANON_KEY=REDACTED
EOF

# 确认文件内容
cat .env.local

# 重启服务器
npm run dev
```

---

## 🔍 调试技巧

### 在代码中添加日志

临时在 `src/lib/supabase.ts` 的 `getSupabaseClient()` 函数开头添加：

```typescript
function getSupabaseClient() {
  // 临时调试日志
  console.log('🔍 Environment Check:')
  console.log('URL from env:', import.meta.env.VITE_SUPABASE_URL)
  console.log('KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
  console.log('KEY length:', import.meta.env.VITE_SUPABASE_ANON_KEY?.length)
  
  // ... 原有代码
}
```

然后重启服务器，查看控制台输出。

### 检查 Vite 是否读取了文件

在浏览器控制台查看 Vite 的启动日志，应该看到：
- 没有 "⚠️ Supabase environment variables not found" 警告
- 如果有这个警告，说明环境变量确实未加载

---

## ✅ 验证清单

完成以下步骤后，应该能解决问题：

- [ ] `.env.local` 文件在项目根目录
- [ ] 文件格式正确（无空格、无引号）
- [ ] 开发服务器已**完全停止**
- [ ] 开发服务器已**重新启动**
- [ ] 浏览器已**强制刷新**（Ctrl+Shift+R）
- [ ] 控制台显示正确的 URL（不是 `undefined` 或 `placeholder`）
- [ ] 尝试注册，不再显示 "Failed to fetch"

---

## 🎯 如果仍然失败

如果完成所有步骤后仍然失败，请提供：

1. 浏览器控制台的完整输出（包括 `import.meta.env` 的值）
2. 终端中 `npm run dev` 的启动日志
3. `.env.local` 文件的完整内容（隐藏敏感部分）

