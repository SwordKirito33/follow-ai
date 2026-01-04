import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Zap, Shield, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface XPPackage {
  id: string;
  xp: number;
  price: number;
  currency: string;
  discount?: number;
  label?: string;
}

interface PurchaseConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  package_: XPPackage;
  isLoading?: boolean;
}

const PurchaseConfirmModal: React.FC<PurchaseConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  package_,
  isLoading = false,
}) => {
  const { t } = useLanguage();

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
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
            <div className="relative bg-gradient-to-r from-primary-blue to-primary-purple p-6 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                disabled={isLoading}
              >
                <X size={24} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-800/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Confirm Purchase</h2>
                  <p className="text-sm text-white/80">Review your order details</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Package Details */}
              <div className="bg-gray-800/5 dark:bg-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400 dark:text-gray-300">Package</span>
                  {package_.discount && (
                    <span className="px-2 py-0.5 bg-accent-green/20 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                      {package_.discount}% OFF
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white dark:text-white text-lg">
                        {package_.xp.toLocaleString()} XP
                      </p>
                      {package_.label && (
                        <p className="text-xs text-gray-400 dark:text-gray-300">{package_.label}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-xl font-bold text-white dark:text-white">
                    {formatPrice(package_.price, package_.currency)}
                  </p>
                </div>
              </div>

              {/* Security Notice */}
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Shield className="w-5 h-5 text-primary-cyan dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 dark:text-blue-100">Secure Payment</p>
                  <p className="text-primary-blue dark:text-blue-300 text-xs mt-0.5">
                    Your payment is processed securely via Stripe. We never store your card details.
                  </p>
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-900 dark:text-amber-100">Non-refundable</p>
                  <p className="text-amber-700 dark:text-amber-300 text-xs mt-0.5">
                    XP purchases are final and cannot be refunded. Please confirm before proceeding.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-white/20 dark:border-gray-600 text-gray-300 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-800/5 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-blue to-primary-purple text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Pay {formatPrice(package_.price, package_.currency)}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PurchaseConfirmModal;
