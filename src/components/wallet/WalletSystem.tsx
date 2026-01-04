// Wallet System Component for Follow.ai
// Comprehensive wallet with balance, transactions, and XP packages

import React, { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// ============================================
// Types
// ============================================

type TransactionType = 'purchase' | 'earn' | 'spend' | 'refund' | 'bonus';
type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';
type Currency = 'CNY' | 'USD' | 'EUR';

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  xp: number;
  currency: Currency;
  status: TransactionStatus;
  description: string;
  createdAt: string;
  completedAt?: string;
  metadata?: Record<string, unknown>;
}

interface XPPackage {
  id: string;
  name: string;
  xp: number;
  price: number;
  originalPrice?: number;
  currency: Currency;
  discount?: number;
  popular?: boolean;
  bestValue?: boolean;
}

interface WalletData {
  balance: number;
  totalPurchased: number;
  totalSpent: number;
  totalEarned: number;
  currency: Currency;
  transactions: Transaction[];
}

interface WalletSystemProps {
  wallet: WalletData;
  packages: XPPackage[];
  onPurchase: (packageId: string) => void;
  onExportTransactions?: () => void;
  className?: string;
}

// ============================================
// Constants
// ============================================

const currencySymbols: Record<Currency, string> = {
  CNY: '¥',
  USD: '$',
  EUR: '€',
};

const transactionTypeConfig: Record<TransactionType, { label: string; icon: string; color: string }> = {
  purchase: { label: '购买', icon: '💳', color: 'blue' },
  earn: { label: '获得', icon: '⭐', color: 'green' },
  spend: { label: '消费', icon: '🛒', color: 'orange' },
  refund: { label: '退款', icon: '↩️', color: 'purple' },
  bonus: { label: '奖励', icon: '🎁', color: 'pink' },
};

const statusConfig: Record<TransactionStatus, { label: string; color: string }> = {
  pending: { label: '处理中', color: 'yellow' },
  completed: { label: '已完成', color: 'green' },
  failed: { label: '失败', color: 'red' },
  refunded: { label: '已退款', color: 'gray' },
};

// ============================================
// Helper Functions
// ============================================

function formatCurrency(amount: number, currency: Currency): string {
  return `${currencySymbols[currency]}${amount.toFixed(2)}`;
}

function formatXP(xp: number): string {
  if (xp >= 10000) {
    return `${(xp / 1000).toFixed(1)}K`;
  }
  return xp.toLocaleString();
}

// ============================================
// Helper Components
// ============================================

function BalanceCard({ wallet }: { wallet: WalletData }) {
  const xpToUsd = wallet.balance * 0.01;

  return (
    <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-2xl p-6 text-white">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-purple-200 text-sm mb-1">当前余额</p>
          <h2 className="text-4xl font-bold">{wallet.balance.toLocaleString()} XP</h2>
          <p className="text-purple-200 text-sm mt-1">
            ≈ {formatCurrency(xpToUsd, 'USD')}
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-purple-200 text-xs mb-1">总购买</p>
          <p className="font-semibold">{wallet.totalPurchased.toLocaleString()} XP</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-purple-200 text-xs mb-1">总消费</p>
          <p className="font-semibold">{wallet.totalSpent.toLocaleString()} XP</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-purple-200 text-xs mb-1">总获得</p>
          <p className="font-semibold">{wallet.totalEarned.toLocaleString()} XP</p>
        </div>
      </div>
    </div>
  );
}

function PackageCard({ pkg, onPurchase }: { pkg: XPPackage; onPurchase: () => void }) {
  return (
    <div
      className={cn(
        'relative bg-white dark:bg-gray-800 rounded-xl p-6 border-2 transition-all hover:shadow-lg',
        pkg.popular
          ? 'border-purple-500 dark:border-purple-400'
          : 'border-white/10 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
      )}
    >
      {/* Badges */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-2">
        {pkg.popular && (
          <span className="px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-medium">
            热门
          </span>
        )}
        {pkg.discount && (
          <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-medium">
            {pkg.discount}% OFF
          </span>
        )}
        {pkg.bestValue && (
          <span className="px-3 py-1 rounded-full bg-green-500 text-white text-xs font-medium">
            最划算
          </span>
        )}
      </div>

      {/* XP Amount */}
      <div className="text-center mb-4 mt-2">
        <div className="text-3xl font-bold text-white dark:text-white">
          {formatXP(pkg.xp)} XP
        </div>
        <div className="text-sm text-gray-400 dark:text-gray-300">{pkg.name}</div>
      </div>

      {/* Price */}
      <div className="text-center mb-4">
        <div className="text-2xl font-bold text-primary-purple dark:text-purple-400">
          {formatCurrency(pkg.price, pkg.currency)}
        </div>
        {pkg.originalPrice && (
          <div className="text-sm text-gray-400 line-through">
            {formatCurrency(pkg.originalPrice, pkg.currency)}
          </div>
        )}
      </div>

      {/* Per XP Price */}
      <div className="text-center text-sm text-gray-400 dark:text-gray-300 mb-4">
        {formatCurrency(pkg.price / pkg.xp, pkg.currency)} / XP
      </div>

      {/* Purchase Button */}
      <button
        onClick={onPurchase}
        className={cn(
          'w-full py-3 rounded-lg font-medium transition-colors',
          pkg.popular
            ? 'bg-purple-600 text-white hover:bg-purple-700'
            : 'bg-white/10 dark:bg-gray-700 text-white dark:text-white hover:bg-white/10 dark:hover:bg-gray-600'
        )}
      >
        购买
      </button>
    </div>
  );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const typeConfig = transactionTypeConfig[transaction.type];
  const status = statusConfig[transaction.status];

  const colorClasses: Record<string, { bg: string; text: string }> = {
    blue: { bg: 'bg-primary-blue/20 dark:bg-blue-900/30', text: 'text-primary-cyan dark:text-blue-400' },
    green: { bg: 'bg-accent-green/20 dark:bg-green-900/30', text: 'text-accent-green dark:text-green-400' },
    orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400' },
    purple: { bg: 'bg-primary-purple/20 dark:bg-purple-900/30', text: 'text-primary-purple dark:text-purple-400' },
    pink: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400' },
    yellow: { bg: 'bg-accent-gold/20 dark:bg-yellow-900/30', text: 'text-accent-gold dark:text-yellow-400' },
    red: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' },
    gray: { bg: 'bg-white/10 dark:bg-gray-700', text: 'text-gray-400 dark:text-gray-400' },
  };

  const typeColors = colorClasses[typeConfig.color];
  const statusColors = colorClasses[status.color];

  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-white/10 dark:border-gray-700">
      {/* Icon */}
      <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', typeColors.bg)}>
        <span className="text-lg">{typeConfig.icon}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white dark:text-white truncate">
            {transaction.description}
          </span>
          <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusColors.bg, statusColors.text)}>
            {status.label}
          </span>
        </div>
        <div className="text-sm text-gray-400 dark:text-gray-300">
          {new Date(transaction.createdAt).toLocaleString()}
        </div>
      </div>

      {/* Amount */}
      <div className="text-right">
        {transaction.amount > 0 && (
          <div className="text-sm text-gray-400 dark:text-gray-300">
            {formatCurrency(transaction.amount, transaction.currency)}
          </div>
        )}
        <div className={cn(
          'font-semibold',
          transaction.type === 'spend' ? 'text-red-500' : 'text-green-500'
        )}>
          {transaction.type === 'spend' ? '-' : '+'}{transaction.xp.toLocaleString()} XP
        </div>
      </div>
    </div>
  );
}

// ============================================
// Wallet System Component
// ============================================

export function WalletSystem({
  wallet,
  packages,
  onPurchase,
  onExportTransactions,
  className,
}: WalletSystemProps) {
  const [activeTab, setActiveTab] = useState<'packages' | 'history'>('packages');
  const [transactionFilter, setTransactionFilter] = useState<TransactionType | 'all'>('all');

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    if (transactionFilter === 'all') return wallet.transactions;
    return wallet.transactions.filter((t) => t.type === transactionFilter);
  }, [wallet.transactions, transactionFilter]);

  // Transaction stats
  const transactionStats = useMemo(() => {
    const stats: Record<TransactionType, number> = {
      purchase: 0,
      earn: 0,
      spend: 0,
      refund: 0,
      bonus: 0,
    };
    wallet.transactions.forEach((t) => {
      stats[t.type]++;
    });
    return stats;
  }, [wallet.transactions]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Balance Card */}
      <BalanceCard wallet={wallet} />

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-white/10 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('packages')}
          className={cn(
            'py-3 px-1 border-b-2 font-medium transition-colors',
            activeTab === 'packages'
              ? 'border-purple-600 text-primary-purple dark:text-purple-400'
              : 'border-transparent text-gray-400 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-300'
          )}
        >
          购买 XP
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            'py-3 px-1 border-b-2 font-medium transition-colors',
            activeTab === 'history'
              ? 'border-purple-600 text-primary-purple dark:text-purple-400'
              : 'border-transparent text-gray-400 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-300'
          )}
        >
          交易记录 ({wallet.transactions.length})
        </button>
      </div>

      {/* Packages Tab */}
      {activeTab === 'packages' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white dark:text-white">
              选择 XP 套餐
            </h3>
            <p className="text-sm text-gray-400 dark:text-gray-300">
              支持多种支付方式
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onPurchase={() => onPurchase(pkg.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button
              onClick={() => setTransactionFilter('all')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                transactionFilter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 dark:bg-gray-800 text-gray-400 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-gray-700'
              )}
            >
              全部 ({wallet.transactions.length})
            </button>
            {(Object.keys(transactionTypeConfig) as TransactionType[]).map((type) => (
              <button
                key={type}
                onClick={() => setTransactionFilter(type)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  transactionFilter === type
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 dark:bg-gray-800 text-gray-400 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-gray-700'
                )}
              >
                {transactionTypeConfig[type].icon} {transactionTypeConfig[type].label} ({transactionStats[type]})
              </button>
            ))}

            {onExportTransactions && (
              <button
                onClick={onExportTransactions}
                className="ml-auto px-3 py-1.5 rounded-lg text-sm font-medium bg-white/10 dark:bg-gray-800 text-gray-400 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-gray-700 transition-colors"
              >
                📥 导出
              </button>
            )}
          </div>

          {/* Transaction List */}
          {filteredTransactions.length > 0 ? (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <TransactionRow key={transaction.id} transaction={transaction} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/5 dark:bg-gray-800/50 rounded-xl">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-gray-400 dark:text-gray-300">暂无交易记录</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// Demo Data
// ============================================

export const demoWallet: WalletData = {
  balance: 1350,
  totalPurchased: 1000,
  totalSpent: 200,
  totalEarned: 550,
  currency: 'CNY',
  transactions: [
    { id: '1', type: 'purchase', amount: 10, xp: 100, currency: 'CNY', status: 'completed', description: 'XP 购买', createdAt: '2024-01-03T12:33:00Z' },
    { id: '2', type: 'earn', amount: 0, xp: 50, currency: 'CNY', status: 'completed', description: '完成每日任务', createdAt: '2024-01-03T10:00:00Z' },
    { id: '3', type: 'earn', amount: 0, xp: 100, currency: 'CNY', status: 'completed', description: '发表工具评价', createdAt: '2024-01-02T15:00:00Z' },
    { id: '4', type: 'purchase', amount: 20, xp: 500, currency: 'CNY', status: 'completed', description: 'XP 购买', createdAt: '2024-01-02T09:55:00Z' },
    { id: '5', type: 'spend', amount: 0, xp: 200, currency: 'CNY', status: 'completed', description: '解锁高级功能', createdAt: '2024-01-01T14:00:00Z' },
    { id: '6', type: 'bonus', amount: 0, xp: 200, currency: 'CNY', status: 'completed', description: '新用户奖励', createdAt: '2023-12-01T10:00:00Z' },
  ],
};

export const demoPackages: XPPackage[] = [
  { id: '1', name: '入门', xp: 500, price: 10, currency: 'CNY' },
  { id: '2', name: '标准', xp: 1000, price: 18, originalPrice: 20, currency: 'CNY', discount: 10, popular: true },
  { id: '3', name: '专业', xp: 5000, price: 80, originalPrice: 100, currency: 'CNY', discount: 20 },
  { id: '4', name: '企业', xp: 10000, price: 140, originalPrice: 200, currency: 'CNY', discount: 30, bestValue: true },
];

// ============================================
// Export
// ============================================

export default WalletSystem;
