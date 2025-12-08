import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CreditCard, Send, ExternalLink } from 'lucide-react';

const paymentLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK_URL;
const connectOnboardingLink = import.meta.env.VITE_STRIPE_CONNECT_ONBOARD_URL;

const Payments: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/20 to-purple-50/20"></div>
      <div className="container mx-auto max-w-4xl space-y-8 relative z-10">
        <div className="animate-slideDown">
          <h1 className="text-3xl font-bold gradient-text">{t('payments.title')}</h1>
          <p className="text-gray-600 mt-2">{t('payments.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card rounded-xl shadow-xl p-6 space-y-4 hover:shadow-2xl transition-all duration-300 card-3d animate-slideUp">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <CreditCard />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{t('payments.receivePayments')}</h2>
                <p className="text-sm text-gray-500">{t('payments.receivePaymentsDesc')}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {t('payments.receivePaymentsNote')}
            </p>
            <button
              onClick={() => paymentLink && window.open(paymentLink, '_blank')}
              disabled={!paymentLink}
              className={`w-full justify-center inline-flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
                paymentLink ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t('payments.openPaymentLink')} <ExternalLink size={16} />
            </button>
            {!paymentLink && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg p-3">
                {t('payments.notConfigured')}
              </p>
            )}
          </div>

          <div className="glass-card rounded-xl shadow-xl p-6 space-y-4 hover:shadow-2xl transition-all duration-300 card-3d animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <Send />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{t('payments.payTesters')}</h2>
                <p className="text-sm text-gray-500">{t('payments.payTestersDesc')}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {t('payments.payTestersNote')}
            </p>
            <button
              onClick={() => connectOnboardingLink && window.open(connectOnboardingLink, '_blank')}
              disabled={!connectOnboardingLink}
              className={`w-full justify-center inline-flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
                connectOnboardingLink ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t('payments.connectOnboarding')} <ExternalLink size={16} />
            </button>
            {!connectOnboardingLink && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg p-3">
                {t('payments.connectNotConfigured')}
              </p>
            )}
          </div>
        </div>

        <div className="glass-card rounded-xl shadow-xl p-6 space-y-2 animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-lg font-bold gradient-text">{t('payments.setupSteps')}</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>{t('payments.step1')}</li>
            <li>{t('payments.step2')}</li>
            <li>{t('payments.step3')}</li>
            <li>{t('payments.step4')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Payments;

