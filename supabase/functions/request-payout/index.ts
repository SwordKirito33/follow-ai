import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    const { amount } = await req.json()

    // 检查钱包余额
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (walletError || !wallet) {
      throw new Error('Wallet not found')
    }

    if (wallet.balance < amount / 100) {
      throw new Error('Insufficient balance')
    }

    // 最小提现金额检查
    if (amount < 1000) {
      // 10 AUD
      throw new Error('Minimum payout amount is $10')
    }

    // 创建提现请求
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        wallet_id: wallet.id,
        type: 'payout',
        amount: -(amount / 100),
        status: 'pending',
        description: 'Payout request',
      })
      .select()
      .single()

    if (txError) {
      throw txError
    }

    // 更新钱包余额
    await supabase.rpc('update_wallet_balance', {
      p_user_id: user.id,
      p_amount: -(amount / 100),
      p_type: 'payout',
      p_description: `Payout request ${transaction.id}`,
    })

    // TODO: 集成 Stripe Connect 或其他支付提供商进行实际转账
    // 目前只是创建记录，实际转账需要手动处理或后续集成

    return new Response(
      JSON.stringify({
        success: true,
        transactionId: transaction.id,
        message: 'Payout request submitted. Processing time: 3-5 business days.',
      }),
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
