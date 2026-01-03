import { loadStripe, Stripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabase';

// Supabase Edge Functions 基础 URL
const FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_URL + '/functions/v1';

// 初始化 Stripe
let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error('Stripe publishable key not found');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

// XP 包配置 - 与 XPPackages.tsx 保持同步
export const XP_PACKAGES = [
  { id: 'xp_500', amount: 500, price: 10, currency: 'USD', label: '入门', popular: false },
  { id: 'xp_1000', amount: 1000, price: 18, currency: 'USD', label: '标准', popular: true },
  { id: 'xp_5000', amount: 5000, price: 80, currency: 'USD', label: '专业', popular: false },
  { id: 'xp_10000', amount: 10000, price: 140, currency: 'USD', label: '企业', popular: false },
];

// 获取认证 token
async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
}

// 购买 XP
export async function purchaseXP(packageId: string, userId: string) {
  const pkg = XP_PACKAGES.find(p => p.id === packageId);
  if (!pkg) {
    throw new Error('Invalid package');
  }

  const token = await getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${FUNCTIONS_URL}/create-payment-intent`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      packageId,
      amount: pkg.price * 100, // 转换为分
      currency: pkg.currency.toLowerCase(),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create payment intent');
  }

  const { clientSecret } = await response.json();
  
  const stripe = await getStripe();
  if (!stripe) {
    throw new Error('Stripe not initialized');
  }

  // 跳转到 Stripe Checkout
  const { error } = await stripe.confirmPayment({
    clientSecret,
    confirmParams: {
      return_url: `${window.location.origin}/payment-success`,
    },
  });

  if (error) {
    throw error;
  }
}

// 创建悬赏支付
export async function createBountyPayment(taskId: string, amount: number, currency: string = 'AUD') {
  const token = await getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${FUNCTIONS_URL}/create-bounty-payment`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      taskId,
      amount: amount * 100, // 转换为分
      currency: currency.toLowerCase(),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create bounty payment');
  }

  return response.json();
}

// 提现到银行账户
export async function requestPayout(amount: number) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${FUNCTIONS_URL}/request-payout`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ amount: amount * 100 }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to request payout');
  }

  return response.json();
}

export default {
  getStripe,
  purchaseXP,
  createBountyPayment,
  requestPayout,
  XP_PACKAGES,
};
