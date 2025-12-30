import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const About: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/20 to-purple-50/20"></div>
      <div className="container mx-auto max-w-4xl space-y-8 relative z-10">
        <header className="animate-slideDown">
          <h1 className="text-4xl font-bold gradient-text">{t('about.title')}</h1>
          <p className="text-gray-600 mt-3 leading-relaxed">
            {t('about.intro')}
          </p>
        </header>

        <section className="glass-card rounded-2xl shadow-xl p-6 space-y-4 animate-slideUp">
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
          {[
            { title: t('about.forTesters'), text: t('about.forTestersText'), delay: '0s' },
            { title: t('about.forBuilders'), text: t('about.forBuildersText'), delay: '0.1s' },
            { title: t('about.forInvestors'), text: t('about.forInvestorsText'), delay: '0.2s' },
            { title: t('about.forCommunity'), text: t('about.forCommunityText'), delay: '0.3s' },
          ].map((item, idx) => (
            <div key={idx} className="glass-card rounded-2xl shadow-xl p-5 hover:shadow-2xl transition-all duration-300 card-3d animate-slideUp" style={{ animationDelay: item.delay }}>
              <h3 className="text-xl font-bold gradient-text mb-2">{item.title}</h3>
              <p className="text-gray-700">{item.text}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default About;

