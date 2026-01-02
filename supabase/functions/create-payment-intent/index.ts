import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2024-12-18.acacia',
      httpClient: Stripe.createFetchHttpClient(),
    })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // 验证用户
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    const { packageId, amount, currency } = await req.json()

    // 创建 Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // 确保是整数
      currency: currency.toLowerCase(),
      metadata: {
        packageId,
        userId: user.id,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // 获取 XP 数量
    const XP_PACKAGES: Record<string, number> = {
      'xp_100': 100,
      'xp_500': 500,
      'xp_1000': 1000,
      'xp_5000': 5000,
    }
    const xpAmount = XP_PACKAGES[packageId] || null

    // 记录到数据库
    await supabase.from('payments').insert({
      user_id: user.id,
      stripe_payment_id: paymentIntent.id,
      amount: amount / 100,
      xp_amount: xpAmount,
      type: 'xp_purchase',
      status: 'pending',
    })

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
