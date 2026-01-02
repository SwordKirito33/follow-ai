# 🚀 Supabase Edge Functions 部署指南

## ✅ 确认：所有 Edge Functions 已创建

根据你的说明，以下函数已在服务器上创建：
- ✅ `create-payment-intent`
- ✅ `stripe-webhook`
- ✅ `create-bounty-payment`
- ✅ `request-payout`

**文件位置**：`/home/ubuntu/follow-ai-source/follow.ai/supabase/functions/`

---

## 📋 部署步骤

### Step 1: 登录 Supabase（如果还未登录）

```bash
cd /Users/kirito/Downloads/follow.ai
supabase login
```

**说明**：会打开浏览器让你登录，登录成功后 CLI 会保存访问令牌。

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

### Step 3: 部署所有 Edge Functions

#### 方法 A: 使用部署脚本（推荐）

```bash
# 确保脚本有执行权限
chmod +x deploy-supabase.sh

# 运行部署脚本
./deploy-supabase.sh
```

#### 方法 B: 手动部署（逐个执行）

```bash
# 部署现有函数
supabase functions deploy task-generator
supabase functions deploy tool-scout

# 部署支付相关函数
supabase functions deploy create-payment-intent
supabase functions deploy stripe-webhook
supabase functions deploy create-bounty-payment
supabase functions deploy request-payout
```

---

## ⚠️ 重要提示

### 如果文件在远程服务器上

如果你的 Edge Functions 文件在 `/home/ubuntu/follow-ai-source/follow.ai/`，而当前工作目录是 `/Users/kirito/Downloads/follow.ai`，你需要：

**选项 1: 从服务器同步文件到本地**

```bash
# 使用 scp 或其他方式同步文件
# 例如：
scp -r user@server:/home/ubuntu/follow-ai-source/follow.ai/supabase/functions/create-payment-intent \
  /Users/kirito/Downloads/follow.ai/supabase/functions/

scp -r user@server:/home/ubuntu/follow-ai-source/follow.ai/supabase/functions/stripe-webhook \
  /Users/kirito/Downloads/follow.ai/supabase/functions/

scp -r user@server:/home/ubuntu/follow-ai-source/follow.ai/supabase/functions/create-bounty-payment \
  /Users/kirito/Downloads/follow.ai/supabase/functions/

scp -r user@server:/home/ubuntu/follow-ai-source/follow.ai/supabase/functions/request-payout \
  /Users/kirito/Downloads/follow.ai/supabase/functions/
```

**选项 2: 在服务器上直接部署**

如果你在服务器上工作，直接在服务器上执行：

```bash
cd /home/ubuntu/follow-ai-source/follow.ai
supabase login
supabase link --project-ref nbvnnhojvkxfnididast
supabase functions deploy create-payment-intent
supabase functions deploy stripe-webhook
supabase functions deploy create-bounty-payment
supabase functions deploy request-payout
```

---

## 🔍 验证部署

部署完成后，验证函数是否成功部署：

```bash
# 列出所有已部署的函数
supabase functions list
```

**预期输出**应该包含：
- task-generator
- tool-scout
- create-payment-intent
- stripe-webhook
- create-bounty-payment
- request-payout

---

## 📝 快速执行命令

如果你想立即开始部署，执行以下命令：

```bash
cd /Users/kirito/Downloads/follow.ai

# 1. 登录（如果需要）
supabase login

# 2. 链接项目
supabase link --project-ref nbvnnhojvkxfnididast

# 3. 部署所有函数
supabase functions deploy task-generator
supabase functions deploy tool-scout
supabase functions deploy create-payment-intent
supabase functions deploy stripe-webhook
supabase functions deploy create-bounty-payment
supabase functions deploy request-payout
```

---

## ❓ 常见问题

### Q: 提示 "Function not found"
**A**: 确保函数文件在正确的路径：`supabase/functions/{function-name}/index.ts`

### Q: 部署失败，提示权限错误
**A**: 确保已正确登录 Supabase，并且有项目访问权限

### Q: 如何查看部署日志？
**A**: 使用 `--debug` 标志：
```bash
supabase functions deploy create-payment-intent --debug
```

---

## ✅ 完成检查清单

- [ ] Supabase CLI 已安装
- [ ] 已登录 Supabase
- [ ] 已链接项目（project-ref: nbvnnhojvkxfnididast）
- [ ] 所有 Edge Functions 文件已同步到本地（如果在服务器上）
- [ ] 已部署 task-generator
- [ ] 已部署 tool-scout
- [ ] 已部署 create-payment-intent
- [ ] 已部署 stripe-webhook
- [ ] 已部署 create-bounty-payment
- [ ] 已部署 request-payout
- [ ] 已验证所有函数已成功部署

