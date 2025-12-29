# 🔧 修复 placeholder.supabase.co 问题

## 问题诊断

错误信息显示 `placeholder.supabase.co`，说明代码在使用 mock/placeholder URL 而不是真实的 Supabase URL。

## 原因分析

`src/lib/supabase.ts` 在以下情况会使用 placeholder URL：
1. `VITE_SUPABASE_URL` 未定义或为空
2. `VITE_SUPABASE_ANON_KEY` 未定义或为空

即使 `.env.local` 文件中有正确的配置，如果：
- 开发服务器未重启
- 环境变量格式错误
- 文件位置不对

也会导致使用 placeholder。

## ✅ 解决方案

### 步骤 1: 确认 .env.local 文件内容

你的 `.env.local` 文件应该包含：

```env
VITE_SUPABASE_URL=https://nbvnnhojvkxfnididast.supabase.co
VITE_SUPABASE_ANON_KEY=REDACTED
```

**重要检查点**：
- ✅ 变量名必须是 `VITE_SUPABASE_URL`（不是 `SUPABASE_URL`）
- ✅ 变量名必须是 `VITE_SUPABASE_ANON_KEY`（不是 `SUPABASE_ANON_KEY`）
- ✅ 等号两边**不能有空格**
- ✅ URL 必须是 `https://` 开头
- ✅ 文件必须在项目**根目录**（与 `package.json` 同级）

### 步骤 2: 验证文件格式

```bash
# 检查文件是否存在
ls -la .env.local

# 查看文件内容（确认格式）
cat .env.local
```

**正确格式示例**：
```env
VITE_SUPABASE_URL=https://nbvnnhojvkxfnididast.supabase.co
VITE_SUPABASE_ANON_KEY=REDACTED
```

**错误格式示例**：
```env
# ❌ 等号两边有空格
VITE_SUPABASE_URL = https://...
# ❌ 缺少 VITE_ 前缀
SUPABASE_URL=https://...
# ❌ 有引号（不需要）
VITE_SUPABASE_URL="https://..."
```

### 步骤 3: 重启开发服务器

**这是关键步骤！**

```bash
# 1. 停止当前服务器（按 Ctrl+C）

# 2. 重新启动
npm run dev
```

**为什么需要重启？**
- Vite 只在启动时读取 `.env.local` 文件
- 修改环境变量后必须重启才能生效

### 步骤 4: 验证环境变量已加载

在浏览器控制台（F12 → Console）输入：

```javascript
console.log('URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 30) + '...')
```

**期望结果**：
```
URL: https://nbvnnhojvkxfnididast.supabase.co
KEY: REDACTED_JWT
```

**如果显示 `undefined` 或 `placeholder.supabase.co`**：
- ❌ 环境变量未加载
- 检查文件位置和格式
- 确认已重启服务器

### 步骤 5: 强制刷新浏览器

```
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

清除缓存，确保加载最新代码。

## 🔍 调试技巧

### 检查代码逻辑

`src/lib/supabase.ts` 的逻辑：

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // 如果环境变量缺失，使用 placeholder
  const mockUrl = 'https://placeholder.supabase.co'
  // ...
}
```

### 添加调试日志

如果问题仍然存在，可以在 `supabase.ts` 中添加日志：

```typescript
console.log('🔍 Environment Check:')
console.log('URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
```

## ✅ 验证清单

- [ ] `.env.local` 文件在项目根目录
- [ ] 变量名正确（`VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`）
- [ ] 等号两边无空格
- [ ] URL 格式正确（`https://项目ID.supabase.co`）
- [ ] ANON_KEY 完整（200+ 字符）
- [ ] 开发服务器已重启
- [ ] 浏览器已强制刷新
- [ ] 控制台显示正确的 URL（不是 placeholder）

## 🚨 如果仍然失败

如果完成所有步骤后仍然显示 `placeholder.supabase.co`：

1. **检查文件编码**：
   ```bash
   file .env.local
   # 应该是 ASCII 或 UTF-8
   ```

2. **检查隐藏字符**：
   ```bash
   cat -A .env.local
   # 查看是否有特殊字符
   ```

3. **重新创建文件**：
   ```bash
   # 备份
   cp .env.local .env.local.backup
   
   # 删除并重新创建
   rm .env.local
   # 然后手动创建新文件
   ```

4. **检查 Vite 配置**：
   确认 `vite.config.ts` 没有覆盖环境变量

## 📝 你的当前配置

根据你提供的信息，`.env.local` 文件内容应该是：

```env
VITE_SUPABASE_URL=https://nbvnnhojvkxfnididast.supabase.co
VITE_SUPABASE_ANON_KEY=REDACTED
```

**下一步**：
1. ✅ 确认文件格式正确（无空格、无引号）
2. ✅ 重启开发服务器
3. ✅ 强制刷新浏览器
4. ✅ 在控制台验证环境变量

