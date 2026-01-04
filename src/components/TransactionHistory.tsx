import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Database } from '@/types/database';
import { formatCurrencyWithUSD, detectUserCurrency } from '@/lib/currency';

type Payment = Database['public']['Tables']['payments']['Row'];

interface TransactionHistoryProps {
  userId: string;
  limit?: number;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ userId, limit = 50 }) => {
  const { t, language } = useLanguage();
  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userCurrency = detectUserCurrency();

  useEffect(() => {
    loadTransactions();
  }, [userId]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (fetchError) throw fetchError;
      setTransactions(data || []);
    } catch (err: any) {
      console.error('Failed to load transactions:', err);
      setError(err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = language === 'zh' ? 'zh-CN' : language === 'ja' ? 'ja-JP' : language === 'ko' ? 'ko-KR' : 'en-US';
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-accent-green" />;
      case 'failed':
        return <XCircle size={16} className="text-red-400" />;
      default:
        return <Clock size={16} className="text-accent-gold" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-accent-green/20 text-accent-green border-accent-green/30';
      case 'failed':
        return 'bg-red-900/30 text-red-400 border-red-500/30';
      default:
        return 'bg-accent-gold/20 text-accent-gold border-accent-gold/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return t('transactionHistory.completed');
      case 'failed':
        return t('transactionHistory.failed');
      default:
        return t('transactionHistory.pending');
    }
  };

  if (loading) {
    return (
      <div className="glass-card rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-black text-white mb-6 tracking-tight">{t('transactionHistory.title')}</h2>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">{t('transactionHistory.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-black text-white mb-6 tracking-tight">{t('transactionHistory.title')}</h2>
        <div className="p-4 bg-red-900/30 border border-red-500/30 rounded-lg">
          <p className="text-red-400">{t('transactionHistory.error')}: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl shadow-xl p-6">
      <h2 className="text-2xl font-black text-white mb-6 tracking-tight">{t('transactionHistory.title')}</h2>
      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-2">{t('transactionHistory.noTransactions')}</p>
          <p className="text-sm text-gray-400">
            {t('transactionHistory.noTransactionsDesc')}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">{t('transactionHistory.date')}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">{t('transactionHistory.type')}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">{t('transactionHistory.amount')}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">{t('transactionHistory.xp')}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">{t('transactionHistory.status')}</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar size={14} />
                      <span>{formatDate(transaction.created_at)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-white capitalize">
                      {transaction.type || t('transactionHistory.xpPurchase')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-semibold text-white">
                      {formatCurrencyWithUSD(transaction.amount, userCurrency, false)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-semibold text-primary-cyan">
                      {transaction.xp_amount ? `+${transaction.xp_amount.toLocaleString()} XP` : '-'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(transaction.status)}
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded border ${getStatusColor(transaction.status)}`}
                      >
                        {getStatusText(transaction.status)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
