# Supabase Edge Functions 部署步骤

## 📋 当前状态

✅ Supabase CLI 已安装（v2.65.2）  
⚠️ 需要先登录 Supabase  
⚠️ 支付相关的 Edge Functions 尚未创建

---

## 🚀 执行步骤

### Step 1: 登录 Supabase

```bash
cd /Users/kirito/Downloads/follow.ai
supabase login
```

**操作说明**：
- 命令会打开浏览器，让你登录 Supabase 账户
- 登录成功后，CLI 会自动保存访问令牌

---

### Step 2: 链接项目

```bash
supabase link --project-ref nbvnnhojvkxfnididast
```

**预期输出**：
```
Finished supabase link.
```

---

### Step 3: 检查现有 Edge Functions

当前已存在的函数：
- ✅ `task-generator` - 任务生成器
- ✅ `tool-scout` - 工具搜索

**检查命令**：
```bash
supabase functions list
```

---

### Step 4: 部署现有函数（可选）

如果你想重新部署现有的函数：

```bash
# 部署任务生成器
supabase functions deploy task-generator

# 部署工具搜索
supabase functions deploy tool-scout
```

---

## ⚠️ 重要提示

### 支付相关的 Edge Functions 尚未创建

你提到的以下函数还不存在：
- ❌ `create-payment-intent`
- ❌ `stripe-webhook`
- ❌ `create-bounty-payment`
- ❌ `request-payout`

**需要先创建这些函数才能部署！**

---

## 📝 下一步操作

### 选项 A: 先测试现有函数部署

1. 登录 Supabase
2. 链接项目
3. 部署现有的 `task-generator` 和 `tool-scout`

### 选项 B: 创建支付相关函数（推荐）

在部署之前，需要先创建这些函数：

1. 创建 `supabase/functions/create-payment-intent/index.ts`
2. 创建 `supabase/functions/stripe-webhook/index.ts`
3. 创建 `supabase/functions/create-bounty-payment/index.ts`
4. 创建 `supabase/functions/request-payout/index.ts`

然后才能执行部署命令。

---

## 🔧 快速执行命令

如果你想现在就开始，可以在终端执行：

```bash
# 1. 登录（需要交互）
supabase login

# 2. 链接项目
supabase link --project-ref nbvnnhojvkxfnididast

# 3. 检查函数列表
supabase functions list

# 4. 部署现有函数
supabase functions deploy task-generator
supabase functions deploy tool-scout
```

---

## ❓ 需要帮助？

如果你需要我帮你创建支付相关的 Edge Functions，请告诉我！

