// Pricing Component for Follow-ai
// Displays pricing plans with comparison features

import React, { useState } from 'react';
import { cn } from '../../lib/utils';

// ============================================
// Types
// ============================================

interface PricingFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  currency?: string;
  features: PricingFeature[];
  cta: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  popular?: boolean;
  badge?: string;
}

interface PricingProps {
  title?: string;
  subtitle?: string;
  plans: PricingPlan[];
  showToggle?: boolean;
  defaultBilling?: 'monthly' | 'yearly';
  yearlyDiscount?: number;
  className?: string;
}

// ============================================
// Default Plans
// ============================================

const defaultPlans: PricingPlan[] = [
  {
    id: 'free',
    name: '免费版',
    description: '适合个人用户体验',
    price: { monthly: 0, yearly: 0 },
    features: [
      { text: '浏览所有AI工具', included: true },
      { text: '每日3个任务', included: true },
      { text: '基础排行榜', included: true },
      { text: '社区评论', included: true },
      { text: '高级筛选', included: false },
      { text: '无广告体验', included: false },
      { text: 'API访问', included: false },
      { text: '优先客服', included: false },
    ],
    cta: { text: '免费开始', href: '/signup' },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: '适合专业用户',
    price: { monthly: 29, yearly: 290 },
    features: [
      { text: '浏览所有AI工具', included: true },
      { text: '无限任务', included: true, highlight: true },
      { text: '完整排行榜', included: true },
      { text: '社区评论', included: true },
      { text: '高级筛选', included: true, highlight: true },
      { text: '无广告体验', included: true },
      { text: 'API访问 (1000次/月)', included: true },
      { text: '优先客服', included: false },
    ],
    cta: { text: '升级 Pro', href: '/upgrade/pro' },
    popular: true,
    badge: '最受欢迎',
  },
  {
    id: 'enterprise',
    name: '企业版',
    description: '适合团队和企业',
    price: { monthly: 99, yearly: 990 },
    features: [
      { text: '浏览所有AI工具', included: true },
      { text: '无限任务', included: true },
      { text: '完整排行榜', included: true },
      { text: '社区评论', included: true },
      { text: '高级筛选', included: true },
      { text: '无广告体验', included: true },
      { text: 'API访问 (无限)', included: true, highlight: true },
      { text: '优先客服', included: true, highlight: true },
    ],
    cta: { text: '联系销售', href: '/contact' },
  },
];

// ============================================
// Pricing Card Component
// ============================================

interface PricingCardProps {
  plan: PricingPlan;
  billing: 'monthly' | 'yearly';
  yearlyDiscount: number;
}

function PricingCard({ plan, billing, yearlyDiscount }: PricingCardProps) {
  const price = billing === 'monthly' ? plan.price.monthly : plan.price.yearly;
  const monthlyEquivalent = billing === 'yearly' ? Math.round(plan.price.yearly / 12) : plan.price.monthly;
  const currency = plan.currency || '¥';

  return (
    <div
      className={cn(
        'relative flex flex-col p-8 rounded-2xl',
        'bg-slate-800/50 dark:bg-gray-800',
        'border-2 transition-all duration-300',
        plan.popular
          ? 'border-purple-500 shadow-xl scale-105 z-10'
          : 'border-white/10 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
      )}
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium">
            {plan.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white dark:text-white mb-2">
          {plan.name}
        </h3>
        <p className="text-gray-400 dark:text-gray-400 text-sm">
          {plan.description}
        </p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-white dark:text-white">
            {currency}{monthlyEquivalent}
          </span>
          <span className="text-gray-400 dark:text-gray-300">/月</span>
        </div>
        {billing === 'yearly' && price > 0 && (
          <p className="text-sm text-accent-green dark:text-green-400 mt-1">
            年付 {currency}{price}，节省 {yearlyDiscount}%
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="flex-1 space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            {feature.included ? (
              <svg
                className={cn(
                  'w-5 h-5 flex-shrink-0 mt-0.5',
                  feature.highlight
                    ? 'text-primary-purple dark:text-purple-400'
                    : 'text-green-500'
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-300 dark:text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            <span
              className={cn(
                'text-sm',
                feature.included
                  ? feature.highlight
                    ? 'text-white dark:text-white font-medium'
                    : 'text-gray-300 dark:text-gray-300'
                  : 'text-gray-400 dark:text-gray-400'
              )}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href={plan.cta.href}
        onClick={plan.cta.onClick}
        className={cn(
          'w-full py-3 px-6 rounded-xl font-semibold text-center transition-all duration-300',
          plan.popular
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
            : 'bg-gray-800/10 dark:bg-gray-700 text-white dark:text-white hover:bg-gray-800/10 dark:hover:bg-gray-600'
        )}
      >
        {plan.cta.text}
      </a>
    </div>
  );
}

// ============================================
// Pricing Component
// ============================================

export function Pricing({
  title = '选择适合您的方案',
  subtitle = '定价方案',
  plans = defaultPlans,
  showToggle = true,
  defaultBilling = 'monthly',
  yearlyDiscount = 17,
  className,
}: PricingProps) {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>(defaultBilling);

  return (
    <section className={cn('py-20 bg-gray-800/5 dark:bg-gray-900', className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          {subtitle && (
            <p className="text-sm font-semibold text-primary-purple dark:text-purple-400 uppercase tracking-wider mb-2">
              {subtitle}
            </p>
          )}
          <h2 className="text-3xl md:text-4xl font-bold text-white dark:text-white mb-4">
            {title}
          </h2>

          {/* Billing Toggle */}
          {showToggle && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <span
                className={cn(
                  'text-sm font-medium transition-colors',
                  billing === 'monthly'
                    ? 'text-white dark:text-white'
                    : 'text-gray-400 dark:text-gray-300'
                )}
              >
                月付
              </span>
              <button
                onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
                className={cn(
                  'relative w-14 h-7 rounded-full transition-colors',
                  billing === 'yearly'
                    ? 'bg-purple-600'
                    : 'bg-gray-300 dark:bg-gray-600'
                )}
              >
                <span
                  className={cn(
                    'absolute top-1 w-5 h-5 rounded-full bg-slate-800/50 shadow transition-transform',
                    billing === 'yearly' ? 'translate-x-8' : 'translate-x-1'
                  )}
                />
              </button>
              <span
                className={cn(
                  'text-sm font-medium transition-colors',
                  billing === 'yearly'
                    ? 'text-white dark:text-white'
                    : 'text-gray-400 dark:text-gray-300'
                )}
              >
                年付
                <span className="ml-1 px-2 py-0.5 rounded-full bg-accent-green/20 dark:bg-green-900/30 text-accent-green dark:text-green-400 text-xs">
                  省{yearlyDiscount}%
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              billing={billing}
              yearlyDiscount={yearlyDiscount}
            />
          ))}
        </div>

        {/* FAQ Link */}
        <div className="text-center mt-12">
          <p className="text-gray-400 dark:text-gray-400">
            有疑问？查看我们的{' '}
            <a
              href="/faq"
              className="text-primary-purple dark:text-purple-400 hover:underline"
            >
              常见问题
            </a>{' '}
            或{' '}
            <a
              href="/contact"
              className="text-primary-purple dark:text-purple-400 hover:underline"
            >
              联系我们
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Export
// ============================================

export default Pricing;
