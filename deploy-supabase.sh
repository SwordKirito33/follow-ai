#!/bin/bash
# Supabase Edge Functions 部署脚本

echo "🚀 开始 Supabase 部署流程..."

# Step 1: 检查登录状态
echo ""
echo "📋 Step 1: 检查 Supabase 登录状态..."
if supabase projects list &>/dev/null; then
    echo "✅ 已登录"
else
    echo "⚠️  需要登录，请运行: supabase login"
    exit 1
fi

# Step 2: 链接项目
echo ""
echo "📋 Step 2: 链接项目..."
supabase link --project-ref nbvnnhojvkxfnididast

# Step 3: 列出现有函数
echo ""
echo "📋 Step 3: 列出现有 Edge Functions..."
supabase functions list

# Step 4: 部署所有 Edge Functions
echo ""
echo "📋 Step 4: 部署所有 Edge Functions..."

echo "部署 task-generator..."
supabase functions deploy task-generator

echo "部署 tool-scout..."
supabase functions deploy tool-scout

echo "部署 create-payment-intent..."
supabase functions deploy create-payment-intent

echo "部署 stripe-webhook..."
supabase functions deploy stripe-webhook

echo "部署 create-bounty-payment..."
supabase functions deploy create-bounty-payment

echo "部署 request-payout..."
supabase functions deploy request-payout

echo ""
echo "✅ 所有 Edge Functions 部署完成！"
