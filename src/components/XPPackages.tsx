import React, { useState } from 'react';
import { Zap, Check } from 'lucide-react';
import FollowButton from './ui/follow-button';
import { formatCurrencyWithUSD, detectUserCurrency } from '@/lib/currency';
import { useToast } from './ui/toast';
import { purchaseXP } from '@/services/stripeService';
import { useLanguage } from '@/contexts/LanguageContext';

export interface XPPackage {
  id: string;
  amount: number;
  price: number;
  currency: string;
  label: string;
  popular?: boolean;
}

const XP_PACKAGES: XPPackage[] = [
  { id: 'xp_500', amount: 500, price: 10, currency: 'USD', label: 'Starter', popular: false },
  { id: 'xp_1000', amount: 1000, price: 18, currency: 'USD', label: 'Standard', popular: true },
  { id: 'xp_5000', amount: 5000, price: 80, currency: 'USD', label: 'Professional', popular: false },
  { id: 'xp_10000', amount: 10000, price: 140, currency: 'USD', label: 'Enterprise', popular: false },
];

interface XPPackagesProps {
  userId: string;
  onPurchaseComplete?: () => void;
}

const XPPackages: React.FC<XPPackagesProps> = ({ userId, onPurchaseComplete }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const userCurrency = detectUserCurrency();

  const handlePurchase = async (pkg: XPPackage) => {
    try {
      setLoading(pkg.id);
      await purchaseXP(pkg.id, userId);
      toast.success('Redirecting to payment...', 'You will be redirected to Stripe Checkout');
      if (onPurchaseComplete) {
        onPurchaseComplete();
      }
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast.error('Purchase failed', error.message || 'Failed to initiate purchase');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="glass-card rounded-xl shadow-xl p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary-purple/20 p-3 rounded-lg text-primary-purple">
          <Zap size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">{t('wallet.xpPackages')}</h2>
          <p className="text-sm text-gray-400">{t('wallet.choosePackage')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {XP_PACKAGES.map((pkg) => {
          const discount = pkg.id === 'xp_1000' ? 10 :
                          pkg.id === 'xp_5000' ? 20 :
                          pkg.id === 'xp_10000' ? 30 : 0;
          const isProcessing = loading === pkg.id;

          return (
            <div
              key={pkg.id}
              className={`relative rounded-xl p-6 border-2 transition-all ${
                pkg.popular
                  ? 'bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-purple-500/50 shadow-lg'
                  : 'bg-gray-800/5 border-white/10 hover:border-white/20'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {t('wallet.popular')}
                  </span>
                </div>
              )}

              {discount > 0 && (
                <div className="absolute top-2 right-2">
                  <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    {discount}% OFF
                  </span>
                </div>
              )}

              <div className="text-center mb-4">
                <div className="text-3xl font-black text-white mb-2">
                  {pkg.amount.toLocaleString()} XP
                </div>
                <div className="text-sm text-gray-300 mb-1">{pkg.label}</div>
                <div className="text-2xl font-bold text-white mb-1">
                  {formatCurrencyWithUSD(pkg.price, userCurrency, false)}
                </div>
                {discount > 0 && (
                  <div className="text-xs text-gray-400 line-through">
                    {formatCurrencyWithUSD((pkg.price * 100) / (100 - discount), userCurrency, false)}
                  </div>
                )}
              </div>

              <FollowButton
                onClick={() => handlePurchase(pkg)}
                variant={pkg.popular ? 'primary' : 'secondary'}
                size="md"
                className="w-full"
                disabled={isProcessing}
              >
                {isProcessing ? t('wallet.processing') : t('wallet.purchase')}
              </FollowButton>

              {pkg.popular && (
                <div className="mt-3 flex items-center justify-center gap-1 text-xs text-primary-purple">
                  <Check size={12} />
                  <span>{t('wallet.bestValue')}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default XPPackages;

