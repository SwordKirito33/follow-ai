#!/bin/bash
# 快速部署所有 Edge Functions

echo "🚀 开始部署 Supabase Edge Functions..."
echo ""

# 检查登录状态
if ! supabase projects list &>/dev/null 2>&1; then
    echo "⚠️  需要先登录 Supabase"
    echo "请运行: supabase login"
    exit 1
fi

echo "✅ 已登录 Supabase"
echo ""

# 部署所有函数
FUNCTIONS=(
    "task-generator"
    "tool-scout"
    "create-payment-intent"
    "stripe-webhook"
    "create-bounty-payment"
    "request-payout"
)

for func in "${FUNCTIONS[@]}"; do
    echo "📦 部署 $func..."
    if supabase functions deploy "$func"; then
        echo "✅ $func 部署成功"
    else
        echo "❌ $func 部署失败"
    fi
    echo ""
done

echo "🎉 部署流程完成！"
echo ""
echo "验证部署结果："
supabase functions list
