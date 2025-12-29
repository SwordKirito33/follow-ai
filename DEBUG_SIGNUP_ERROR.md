# 🔍 注册错误 "Failed to fetch" 调试指南

## 问题描述

注册表单显示 "Failed to fetch" 错误，无法完成用户注册。

---

## 🔍 可能的原因

### 1. Supabase 环境变量问题 ⚠️ 最常见

**检查方法**：
```bash
# 检查 .env.local 文件
cat .env.local

# 应该看到：
# VITE_SUPABASE_URL=https://xxxxx.supabase.co
# VITE_SUPABASE_ANON_KEY=REDACTED
```

**可能的问题**：
- ❌ 环境变量未设置
- ❌ 变量名错误（应该是 `VITE_SUPABASE_URL`，不是 `SUPABASE_URL`）
- ❌ URL 或 Key 格式错误
- ❌ 开发服务器未重启（修改 .env.local 后需要重启）

**解决方案**：
1. 确认 `.env.local` 文件存在且格式正确
2. 重启开发服务器：`npm run dev`
3. 检查浏览器控制台是否有 "⚠️ Supabase environment variables not found" 警告

---

### 2. Supabase 服务不可用

**检查方法**：
- 访问 Supabase Dashboard：https://supabase.com/dashboard
- 检查项目状态是否为 "Active"
- 检查项目是否被暂停（免费额度用完）

**解决方案**：
- 如果项目被暂停，需要升级或等待重置
- 检查 Supabase 服务状态页面

---

### 3. 网络连接问题

**检查方法**：
- 打开浏览器开发者工具 → Network 标签
- 查看是否有红色错误请求
- 检查请求 URL 是否正确

**可能的问题**：
- ❌ 网络连接不稳定
- ❌ 防火墙阻止请求
- ❌ CORS 配置问题

---

### 4. 数据库表不存在

**检查方法**：
- 访问 Supabase Dashboard → Table Editor
- 确认 `profiles` 表存在
- 确认表结构正确

**解决方案**：
- 如果表不存在，需要执行 SQL 脚本创建表
- 参考 `SUPABASE_SETUP_SQL.md`

---

### 5. RLS (Row Level Security) 策略问题

**检查方法**：
- 访问 Supabase Dashboard → Authentication → Policies
- 检查 `profiles` 表的 RLS 策略

**可能的问题**：
- ❌ RLS 已启用但无允许插入的策略
- ❌ 策略配置错误

**解决方案**：
- 需要配置允许匿名用户检查用户名和插入 profile 的策略
- 参考之前的修复文档

---

### 6. 用户名检查失败

**检查方法**：
- 查看浏览器控制台的详细错误信息
- 检查 Network 标签中的请求详情

**可能的问题**：
- ❌ 用户名检查查询失败（表不存在或 RLS 阻止）
- ❌ 网络请求超时

---

## 🛠️ 快速诊断步骤

### 步骤 1: 检查环境变量

```bash
# 在项目根目录
cat .env.local

# 应该看到类似：
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=REDACTED
```

### 步骤 2: 检查浏览器控制台

打开浏览器开发者工具（F12），查看：
1. **Console 标签**：是否有错误信息
2. **Network 标签**：查看失败的请求详情

### 步骤 3: 检查 Supabase 连接

访问测试页面：`/#/test-supabase`

如果测试页面也失败，说明是 Supabase 配置问题。

### 步骤 4: 检查 Supabase Dashboard

1. 登录 https://supabase.com/dashboard
2. 选择你的项目
3. 检查：
   - 项目状态（应该是 Active）
   - API Settings → 确认 URL 和 anon key 匹配
   - Table Editor → 确认 `profiles` 表存在
   - Authentication → Settings → 确认 "Confirm email" 已关闭（开发环境）

---

## 🔧 常见解决方案

### 方案 1: 重启开发服务器

```bash
# 停止当前服务器 (Ctrl+C)
# 然后重新启动
npm run dev
```

**原因**：修改 `.env.local` 后，Vite 需要重启才能读取新变量。

### 方案 2: 检查环境变量格式

确保 `.env.local` 文件格式正确：

```env
# ✅ 正确格式
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=REDACTED

# ❌ 错误格式
SUPABASE_URL=https://...  # 缺少 VITE_ 前缀
VITE_SUPABASE_URL = https://...  # 等号两边有空格
```

### 方案 3: 验证 Supabase 配置

1. 访问 Supabase Dashboard
2. 进入 Settings → API
3. 复制：
   - Project URL → 应该是 `VITE_SUPABASE_URL`
   - anon/public key → 应该是 `VITE_SUPABASE_ANON_KEY`

### 方案 4: 检查数据库表

如果 `profiles` 表不存在：

1. 访问 Supabase Dashboard → SQL Editor
2. 执行创建表的 SQL（参考 `SUPABASE_SETUP_SQL.md`）
3. 配置 RLS 策略

### 方案 5: 配置 RLS 策略

如果表存在但插入失败，需要配置 RLS：

```sql
-- 允许匿名用户检查用户名
CREATE POLICY "Allow anonymous username check"
ON profiles FOR SELECT
TO anon
USING (true);

-- 允许认证用户插入自己的 profile
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);
```

---

## 📋 检查清单

- [ ] `.env.local` 文件存在
- [ ] `VITE_SUPABASE_URL` 格式正确（https://开头）
- [ ] `VITE_SUPABASE_ANON_KEY` 完整（200+ 字符）
- [ ] 开发服务器已重启
- [ ] Supabase 项目状态为 Active
- [ ] `profiles` 表已创建
- [ ] RLS 策略已配置
- [ ] 浏览器控制台无其他错误
- [ ] 网络连接正常

---

## 🚨 如果以上都正常

如果所有检查都通过但仍然失败：

1. **查看详细错误**：
   - 打开浏览器开发者工具
   - 查看 Network 标签中的失败请求
   - 查看 Response 和 Headers

2. **检查 Supabase 日志**：
   - 访问 Supabase Dashboard → Logs
   - 查看是否有相关错误日志

3. **临时禁用 RLS**（仅用于测试）：
   ```sql
   ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
   ```
   ⚠️ **注意**：测试后记得重新启用并配置正确的策略

---

## 💡 下一步

根据检查结果，选择对应的解决方案。如果问题仍然存在，请提供：
1. 浏览器控制台的完整错误信息
2. Network 标签中失败请求的详情
3. `.env.local` 文件内容（隐藏敏感信息）

