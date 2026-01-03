import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Filter,
  Download,
  Search,
  ChevronDown,
  Zap,
  CreditCard,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Gift,
  ShoppingCart,
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'purchase' | 'earn' | 'spend' | 'refund' | 'bonus';
  title: string;
  description?: string;
  amount: number;
  xp: number;
  status: 'completed' | 'pending' | 'failed';
  timestamp: Date;
  reference?: string;
}

interface WalletStats {
  totalXp: number;
  totalPurchased: number;
  totalEarned: number;
  totalSpent: number;
  monthlyChange: number;
}

interface XPPackage {
  id: string;
  xp: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  popular?: boolean;
  bestValue?: boolean;
  label?: string;
}

interface EnhancedWalletProps {
  stats: WalletStats;
  transactions: Transaction[];
  packages: XPPackage[];
  currency: string;
  onPurchase: (packageId: string) => Promise<void>;
  onExport: (format: 'csv' | 'pdf') => void;
}

const EnhancedWallet: React.FC<EnhancedWalletProps> = ({
  stats,
  transactions,
  packages,
  currency,
  onPurchase,
  onExport,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'purchase'>('overview');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<'all' | 'week' | 'month' | 'year'>('all');
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'purchase':
        return <ShoppingCart className="w-5 h-5 text-blue-500" />;
      case 'earn':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'spend':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'refund':
        return <RefreshCw className="w-5 h-5 text-orange-500" />;
      case 'bonus':
        return <Gift className="w-5 h-5 text-purple-500" />;
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full text-xs">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full text-xs">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1 text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full text-xs">
            <XCircle className="w-3 h-3" />
            Failed
          </span>
        );
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType !== 'all' && tx.type !== filterType) return false;
    if (searchQuery && !tx.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (dateRange !== 'all') {
      const now = new Date();
      const txDate = new Date(tx.timestamp);
      const diffDays = Math.floor((now.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dateRange === 'week' && diffDays > 7) return false;
      if (dateRange === 'month' && diffDays > 30) return false;
      if (dateRange === 'year' && diffDays > 365) return false;
    }
    return true;
  });

  const handlePurchase = async (packageId: string) => {
    setPurchasingId(packageId);
    try {
      await onPurchase(packageId);
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl text-white">
              <Wallet className="w-8 h-8" />
            </div>
            Developer Wallet
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your XP balance and purchase packages
          </p>
        </div>
      </div>

      {/* Balance card */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-3xl p-8 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <p className="text-white/80 text-sm font-medium">Current Balance</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-5xl font-bold">{stats.totalXp.toLocaleString()}</span>
            <span className="text-2xl font-medium text-white/80">XP</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {stats.monthlyChange >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-300" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-300" />
            )}
            <span className={stats.monthlyChange >= 0 ? 'text-green-300' : 'text-red-300'}>
              {stats.monthlyChange >= 0 ? '+' : ''}{stats.monthlyChange}% this month
            </span>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <ArrowDownLeft className="w-5 h-5 text-green-300 mb-2" />
              <p className="text-2xl font-bold">{stats.totalPurchased.toLocaleString()}</p>
              <p className="text-sm text-white/70">Purchased</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <Zap className="w-5 h-5 text-yellow-300 mb-2" />
              <p className="text-2xl font-bold">{stats.totalEarned.toLocaleString()}</p>
              <p className="text-sm text-white/70">Earned</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <ArrowUpRight className="w-5 h-5 text-red-300 mb-2" />
              <p className="text-2xl font-bold">{stats.totalSpent.toLocaleString()}</p>
              <p className="text-sm text-white/70">Spent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {(['overview', 'transactions', 'purchase'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              activeTab === tab
                ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Overview tab */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Recent transactions */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  View all
                </button>
              </div>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    {getTransactionIcon(tx.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{tx.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`font-semibold ${tx.xp >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.xp >= 0 ? '+' : ''}{tx.xp} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick purchase */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Quick Purchase</h3>
              <div className="space-y-3">
                {packages.slice(0, 3).map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={purchasingId === pkg.id}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Zap className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {pkg.xp.toLocaleString()} XP
                        </p>
                        {pkg.discount && (
                          <p className="text-xs text-green-600">{pkg.discount}% OFF</p>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-blue-600">{formatCurrency(pkg.price)}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setActiveTab('purchase')}
                className="w-full mt-4 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                View All Packages
              </button>
            </div>
          </motion.div>
        )}

        {/* Transactions tab */}
        {activeTab === 'transactions' && (
          <motion.div
            key="transactions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Filters */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search transactions..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="purchase">Purchases</option>
                <option value="earn">Earnings</option>
                <option value="spend">Spending</option>
                <option value="refund">Refunds</option>
                <option value="bonus">Bonuses</option>
              </select>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => onExport('csv')}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  CSV
                </button>
                <button
                  onClick={() => onExport('pdf')}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </button>
              </div>
            </div>

            {/* Transaction list */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No transactions found
                </div>
              ) : (
                filteredTransactions.map((tx) => (
                  <div key={tx.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 dark:text-white">{tx.title}</p>
                          {getStatusBadge(tx.status)}
                        </div>
                        {tx.description && (
                          <p className="text-sm text-gray-500 truncate">{tx.description}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(tx.timestamp).toLocaleString()}
                          {tx.reference && ` • Ref: ${tx.reference}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${tx.xp >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.xp >= 0 ? '+' : ''}{tx.xp.toLocaleString()} XP
                        </p>
                        {tx.amount !== 0 && (
                          <p className="text-sm text-gray-500">{formatCurrency(tx.amount)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* Purchase tab */}
        {activeTab === 'purchase' && (
          <motion.div
            key="purchase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                XP Packages
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Choose a package to purchase XP
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`relative p-6 rounded-2xl border-2 transition-all ${
                      pkg.popular
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : pkg.bestValue
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                    }`}
                  >
                    {/* Badge */}
                    {(pkg.popular || pkg.bestValue || pkg.discount) && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                          pkg.popular ? 'bg-blue-500' :
                          pkg.bestValue ? 'bg-green-500' : 'bg-orange-500'
                        }`}>
                          {pkg.popular ? 'Popular' : pkg.bestValue ? 'Best Value' : `${pkg.discount}% OFF`}
                        </span>
                      </div>
                    )}

                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {pkg.xp.toLocaleString()}
                      </p>
                      <p className="text-gray-500 mb-4">XP</p>

                      <div className="mb-4">
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(pkg.price)}</p>
                        {pkg.originalPrice && (
                          <p className="text-sm text-gray-400 line-through">
                            {formatCurrency(pkg.originalPrice)}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handlePurchase(pkg.id)}
                        disabled={purchasingId === pkg.id}
                        className={`w-full py-3 rounded-xl font-medium transition-all ${
                          pkg.popular
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                        } disabled:opacity-50`}
                      >
                        {purchasingId === pkg.id ? 'Processing...' : 'Purchase'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment methods */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Accepted Payment Methods
              </h3>
              <div className="flex flex-wrap gap-4">
                {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay', 'Google Pay', 'Alipay', 'WeChat Pay'].map((method) => (
                  <div key={method} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedWallet;
