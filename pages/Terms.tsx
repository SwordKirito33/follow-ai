import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Terms: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">{t('terms.title')}</h1>
          <p className="text-gray-600 mt-2">{t('terms.lastUpdated')}</p>
        </header>

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-3 text-sm text-gray-700 leading-relaxed">
          <p><strong>{t('terms.userContent')}</strong> {t('terms.userContentText')}</p>
          <p><strong>{t('terms.payments')}</strong> {t('terms.paymentsText')}</p>
          <p><strong>{t('terms.acceptableUse')}</strong> {t('terms.acceptableUseText')}</p>
          <p><strong>{t('terms.intellectualProperty')}</strong> {t('terms.intellectualPropertyText')}</p>
          <p><strong>{t('terms.liability')}</strong> {t('terms.liabilityText')}</p>
          <p><strong>{t('terms.privacy')}</strong> {t('terms.privacyText')}</p>
          <p><strong>{t('terms.changes')}</strong> {t('terms.changesText')}</p>
        </section>
      </div>
    </div>
  );
};

export default Terms;

