import React from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrencyWithUSD, detectUserCurrency } from '@/lib/currency';

interface WalletBalanceProps {
  balance: number;
  totalPurchased: number;
  totalSpent: number;
  currency?: string;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({
  balance,
  totalPurchased,
  totalSpent,
  currency,
}) => {
  const userCurrency = currency || detectUserCurrency();

  return (
    <div className="glass-card rounded-xl shadow-xl p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
          <Wallet size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Wallet Balance</h2>
          <p className="text-sm text-gray-600">Your XP wallet overview</p>
        </div>
      </div>

      {/* Main Balance */}
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-2">Current Balance</div>
        <div className="text-5xl font-black text-gray-900 mb-2">
          {balance.toLocaleString()} XP
        </div>
        <div className="text-sm text-gray-500">
          {formatCurrencyWithUSD(balance / 100, userCurrency)}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <TrendingUp size={16} />
            <span className="text-sm font-semibold">Total Purchased</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {totalPurchased.toLocaleString()} XP
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {formatCurrencyWithUSD(totalPurchased / 100, userCurrency)}
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <TrendingDown size={16} />
            <span className="text-sm font-semibold">Total Spent</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {totalSpent.toLocaleString()} XP
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {formatCurrencyWithUSD(totalSpent / 100, userCurrency)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletBalance;

