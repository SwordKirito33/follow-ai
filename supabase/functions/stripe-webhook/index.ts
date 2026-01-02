import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2024-12-18.acacia',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// XP 包配置
const XP_PACKAGES: Record<string, number> = {
  'xp_100': 100,
  'xp_500': 500,
  'xp_1000': 1000,
  'xp_5000': 5000,
}

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

  if (!signature || !webhookSecret) {
    return new Response('Missing signature or secret', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    )

    console.log('Webhook event:', event.type)

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const { packageId, userId } = paymentIntent.metadata

        console.log('Payment succeeded:', { packageId, userId })

        // 发放 XP
        const xpAmount = XP_PACKAGES[packageId]
        
        // 更新支付状态（包含 xp_amount）
        await supabase
          .from('payments')
          .update({ 
            status: 'completed',
            xp_amount: xpAmount || null
          })
          .eq('stripe_payment_id', paymentIntent.id)

        if (xpAmount && userId) {
          // 创建 XP 事件
          await supabase.from('xp_events').insert({
            user_id: userId,
            amount: xpAmount,
            reason: `Purchased ${xpAmount} XP`,
            source: 'purchase',
          })

          // 更新钱包余额（如果是现金充值）
          if (packageId.startsWith('cash_')) {
            const amount = paymentIntent.amount / 100
            await supabase.rpc('update_wallet_balance', {
              p_user_id: userId,
              p_amount: amount,
              p_type: 'deposit',
              p_description: `Deposit from Stripe payment ${paymentIntent.id}`,
            })
          }

          console.log('XP granted:', { userId, xpAmount })
        }

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // 更新支付状态为失败
        await supabase
          .from('payments')
          .update({ status: 'failed' })
          .eq('stripe_payment_id', paymentIntent.id)

        console.log('Payment failed:', paymentIntent.id)
        break
      }

      default:
        console.log('Unhandled event type:', event.type)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
