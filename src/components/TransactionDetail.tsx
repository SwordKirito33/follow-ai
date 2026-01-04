import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, CreditCard, Zap, CheckCircle, Clock, XCircle, Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Transaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  currency: string;
  xp: number;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod?: string;
  stripePaymentId?: string;
}

interface TransactionDetailProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!transaction) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-accent-green/20 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-accent-gold/20 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-800/10 text-gray-200';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReceipt = () => {
    // Generate receipt content
    const receiptContent = `
FOLLOW.AI RECEIPT
==================

Transaction ID: ${transaction.id}
Date: ${formatDate(transaction.date)}

Type: ${transaction.type}
Amount: ${formatPrice(transaction.amount, transaction.currency)}
XP Received: ${transaction.xp.toLocaleString()} XP
Status: ${transaction.status.toUpperCase()}

${transaction.stripePaymentId ? `Stripe Payment ID: ${transaction.stripePaymentId}` : ''}

Thank you for your purchase!
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${transaction.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 border-b border-white/10 dark:border-gray-700">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                <X size={24} />
              </button>
              <h2 className="text-xl font-bold text-white dark:text-white">
                Transaction Details
              </h2>
              <p className="text-sm text-gray-400 dark:text-gray-300 mt-1">
                {transaction.type}
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(transaction.status)}`}>
                  {getStatusIcon(transaction.status)}
                  <span className="font-semibold capitalize">{transaction.status}</span>
                </div>
              </div>

              {/* Amount */}
              <div className="text-center">
                <p className="text-4xl font-bold text-white dark:text-white">
                  +{transaction.xp.toLocaleString()} XP
                </p>
                <p className="text-lg text-gray-400 dark:text-gray-300 mt-1">
                  {formatPrice(transaction.amount, transaction.currency)}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-white/10 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-gray-400 dark:text-gray-300">
                    <Calendar size={18} />
                    <span>Date</span>
                  </div>
                  <span className="font-medium text-white dark:text-white">
                    {formatDate(transaction.date)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-white/10 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-gray-400 dark:text-gray-300">
                    <CreditCard size={18} />
                    <span>Payment Method</span>
                  </div>
                  <span className="font-medium text-white dark:text-white">
                    {transaction.paymentMethod || 'Credit Card'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-white/10 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-gray-400 dark:text-gray-300">
                    <Zap size={18} />
                    <span>XP Rate</span>
                  </div>
                  <span className="font-medium text-white dark:text-white">
                    {(transaction.xp / transaction.amount).toFixed(0)} XP per {transaction.currency}
                  </span>
                </div>

                {/* Transaction ID */}
                <div className="py-3">
                  <p className="text-sm text-gray-400 dark:text-gray-300 mb-2">Transaction ID</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-gray-800/10 dark:bg-gray-800 rounded-lg text-sm font-mono text-gray-300 dark:text-gray-300 truncate">
                      {transaction.id}
                    </code>
                    <button
                      onClick={() => copyToClipboard(transaction.id)}
                      className="p-2 hover:bg-gray-800/10 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <Check size={18} className="text-green-500" />
                      ) : (
                        <Copy size={18} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-0">
              {transaction.status === 'completed' && (
                <button
                  onClick={handleDownloadReceipt}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-white/20 dark:border-gray-600 text-gray-300 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-800/5 dark:hover:bg-gray-800 transition-colors"
                >
                  <Download size={18} />
                  Download Receipt
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransactionDetail;
