# ✅ 数据库字段名修复总结

## 📋 修复内容

### 1. Payments 表字段修复 ✅

**修改的字段**：
- ❌ `stripe_payment_intent_id` → ✅ `stripe_payment_id`
- ❌ `amount_aud` → ✅ `amount`
- ✅ 新增：`xp_amount` 字段（记录发放的 XP 数量）

**修改的文件**：
- ✅ `supabase/functions/create-payment-intent/index.ts`
- ✅ `supabase/functions/create-bounty-payment/index.ts`
- ✅ `supabase/functions/stripe-webhook/index.ts`

### 2. XP Events 表字段验证 ✅

**确认正确的字段**：
- ✅ `amount` (不是 `xp_amount`)
- ✅ `reason` (不是 `description`)
- ✅ `source` (来源类型)

**验证的文件**：
- ✅ `src/lib/xp-service.ts` - 已使用正确字段
- ✅ `supabase/functions/stripe-webhook/index.ts` - 已使用正确字段

---

## 📝 详细修改

### create-payment-intent/index.ts

**修改前**：
```typescript
await supabase.from('payments').insert({
  user_id: user.id,
  stripe_payment_intent_id: paymentIntent.id,  // ❌ 错误
  amount_aud: amount / 100,                    // ❌ 错误
  type: 'xp_purchase',
  status: 'pending',
})
```

**修改后**：
```typescript
const XP_PACKAGES: Record<string, number> = {
  'xp_100': 100,
  'xp_500': 500,
  'xp_1000': 1000,
  'xp_5000': 5000,
}
const xpAmount = XP_PACKAGES[packageId] || null

await supabase.from('payments').insert({
  user_id: user.id,
  stripe_payment_id: paymentIntent.id,  // ✅ 正确
  amount: amount / 100,                 // ✅ 正确
  xp_amount: xpAmount,                   // ✅ 新增
  type: 'xp_purchase',
  status: 'pending',
})
```

### stripe-webhook/index.ts

**修改前**：
```typescript
await supabase
  .from('payments')
  .update({ status: 'completed' })
  .eq('stripe_payment_intent_id', paymentIntent.id)  // ❌ 错误

await supabase.from('xp_events').insert({
  user_id: userId,
  xp_amount: xpAmount,      // ❌ 错误
  description: 'Purchase',  // ❌ 错误
  source: 'purchase'
})
```

**修改后**：
```typescript
const xpAmount = XP_PACKAGES[packageId]

// 更新支付状态（包含 xp_amount）
await supabase
  .from('payments')
  .update({ 
    status: 'completed',
    xp_amount: xpAmount || null  // ✅ 新增
  })
  .eq('stripe_payment_id', paymentIntent.id)  // ✅ 正确

if (xpAmount && userId) {
  await supabase.from('xp_events').insert({
    user_id: userId,
    amount: xpAmount,                              // ✅ 正确
    reason: `Purchased ${xpAmount} XP`,           // ✅ 正确
    source: 'purchase',
  })
}
```

---

## ✅ 验证结果

### Payments 表字段使用检查

所有 Edge Functions 中 payments 表的使用：
- ✅ `stripe_payment_id` - 正确使用
- ✅ `amount` - 正确使用
- ✅ `xp_amount` - 已添加到更新操作中

### XP Events 表字段使用检查

所有 Edge Functions 中 xp_events 表的使用：
- ✅ `amount` - 正确使用（不是 `xp_amount`）
- ✅ `reason` - 正确使用（不是 `description`）
- ✅ `source` - 正确使用

---

## 📦 Git 提交

**提交信息**：
```
fix: Update database field names and add xp_amount to payments

- Changed stripe_payment_intent_id to stripe_payment_id
- Changed amount_aud to amount
- Added xp_amount field to payments table updates
- Fixed xp_events to use 'amount' and 'reason' fields
- Updated all Edge Functions with correct field names
- Added deployment scripts and documentation
```

**提交的文件**：
- ✅ 14 个文件已修改/新增
- ✅ 1829 行新增代码

---

## 🚀 下一步：部署 Edge Functions

### 部署命令

```bash
# 1. 登录 Supabase（如果还没登录）
supabase login

# 2. 链接项目
supabase link --project-ref nbvnnhojvkxfnididast

# 3. 部署修复后的函数
supabase functions deploy create-payment-intent
supabase functions deploy stripe-webhook
supabase functions deploy create-bounty-payment
supabase functions deploy request-payout
```

### 或使用部署脚本

```bash
./quick-deploy.sh
```

---

## ⚠️ 重要提示

### Git Push 状态

✅ **本地提交成功**  
⚠️ **远程推送失败**（SSL 证书问题）

**手动推送方法**：
```bash
# 在终端中手动执行
git push origin main
```

或者配置 Git SSL：
```bash
git config --global http.sslVerify false
git push origin main
```

---

## 📊 修复统计

- ✅ **修复的文件数**: 3 个 Edge Functions
- ✅ **修复的字段数**: 4 个字段名
- ✅ **新增的功能**: xp_amount 字段记录
- ✅ **验证通过**: 所有字段名已统一

---

## ✅ 完成检查清单

- [x] 修复 `stripe_payment_intent_id` → `stripe_payment_id`
- [x] 修复 `amount_aud` → `amount`
- [x] 添加 `xp_amount` 字段到 payments 更新
- [x] 验证 `xp_events` 使用 `amount` 和 `reason`
- [x] 验证所有 Edge Functions 字段名
- [x] Git 提交所有更改
- [ ] 部署 Edge Functions（待执行）
- [ ] Git Push 到远程（SSL 问题，需手动）

---

## 🎯 总结

所有数据库字段名已修复并统一：
- ✅ Payments 表字段名正确
- ✅ XP Events 表字段名正确
- ✅ 所有 Edge Functions 已更新
- ✅ 代码已提交到本地 Git

**下一步**：部署 Edge Functions 并手动推送代码到 GitHub。

