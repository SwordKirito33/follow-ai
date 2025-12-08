import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const About: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl space-y-8">
        <header>
          <h1 className="text-4xl font-bold text-gray-900">{t('about.title')}</h1>
          <p className="text-gray-600 mt-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('about.intro') }} />
        </header>

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">{t('about.whyWeExist')}</h2>
          <p className="text-gray-700">
            {t('about.whyWeExistText')}
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>{t('about.whyWeExistList1')}</li>
            <li>{t('about.whyWeExistList2')}</li>
            <li>{t('about.whyWeExistList3')}</li>
            <li>{t('about.whyWeExistList4')}</li>
          </ul>
        </section>

        <section className="grid md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('about.forTesters')}</h3>
            <p className="text-gray-700">{t('about.forTestersText')}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('about.forBuilders')}</h3>
            <p className="text-gray-700">{t('about.forBuildersText')}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('about.forInvestors')}</h3>
            <p className="text-gray-700">{t('about.forInvestorsText')}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('about.forCommunity')}</h3>
            <p className="text-gray-700">{t('about.forCommunityText')}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;

