import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Hero from '../components/Hero';
import Rankings from '../components/Rankings';
import ActivityFeed from '../components/ActivityFeed';
import ReviewCard from '../components/ReviewCard';
import ReviewCardSkeleton from '../components/ReviewCardSkeleton';
import NewsWidget from '../components/NewsWidget';
import { REVIEWS } from '../data';

const Home: React.FC = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data fetch
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen page-transition">
      <ActivityFeed />
      <Hero />
      <Rankings />
      
      {/* Category Showcase */}
      <section id="categories" className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-blue-50/10"></div>
        <div className="container mx-auto max-w-5xl relative z-10">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{t('categories.title')}</h2>
              <p className="text-gray-600 text-sm">{t('categories.subtitle')}</p>
            </div>
            <Link to="/rankings" className="text-blue-600 text-sm font-semibold hover:text-blue-700">{t('categories.viewRankings')}</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '💻', title: 'AI Coding', stats: '127 tools • 1,240 reviews', badge: '🔥 Trending' },
              { icon: '🎨', title: 'Image Generation', stats: '89 tools • 980 reviews', badge: '📈 Growing' },
              { icon: '✍️', title: 'AI Writing', stats: '156 tools • 1,450 reviews', badge: '' },
              { icon: '🎬', title: 'Video Generation', stats: '45 tools • 520 reviews', badge: '🚀 New' },
              { icon: '🎵', title: 'Audio & Voice', stats: '67 tools • 640 reviews', badge: '' },
              { icon: '📊', title: 'Data & Analytics', stats: '72 tools • 810 reviews', badge: '' },
            ].map((cat, idx) => (
              <Link key={cat.title} to="/rankings" className="block glass-card hover:bg-white/95 border border-white/30 rounded-xl p-5 transition-all transform hover:scale-105 hover:shadow-xl card-3d animate-slideUp" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl transform hover:scale-110 transition-transform">{cat.icon}</span>
                  {cat.badge && <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 font-semibold border border-amber-200 animate-pulse">{cat.badge}</span>}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{cat.title}</h3>
                <p className="text-sm text-gray-600">{cat.stats}</p>
              </Link>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* Why Different Section */}
      <section className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/20 to-white"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12 animate-slideDown">
            <h2 className="text-3xl font-bold gradient-text">{t('whyDifferent.title')}</h2>
          </div>
          <div className="overflow-x-auto">
            <div className="glass-card rounded-2xl p-2 shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-4 border-b-2 border-gray-100 text-gray-500 font-medium">{t('home.feature')}</th>
                  <th className="p-4 border-b-2 border-gray-100 text-gray-400 font-medium">{t('home.productHunt')}</th>
                  <th className="p-4 border-b-2 border-blue-100 bg-blue-50 text-blue-800 font-bold rounded-t-lg">{t('home.followAi')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 border-b border-gray-100 font-medium">{t('whyDifferent.proofRequired')}</td>
                  <td className="p-4 border-b border-gray-100 text-red-500">❌ {t('whyDifferent.no')}</td>
                  <td className="p-4 border-b border-blue-100 bg-blue-50/50 text-green-600 font-bold">✅ {t('whyDifferent.yes')} {t('whyDifferent.mandatory')}</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-100 font-medium">{t('whyDifferent.realOutputs')}</td>
                  <td className="p-4 border-b border-gray-100 text-red-500">❌ {t('whyDifferent.no')}</td>
                  <td className="p-4 border-b border-blue-100 bg-blue-50/50 text-green-600 font-bold">✅ {t('whyDifferent.everyReview')}</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-100 font-medium">{t('whyDifferent.earnMoney')}</td>
                  <td className="p-4 border-b border-gray-100 text-red-500">❌ {t('whyDifferent.no')}</td>
                  <td className="p-4 border-b border-blue-100 bg-blue-50/50 text-green-600 font-bold">✅ $20-200/review</td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white"></div>
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-[2fr_1fr] gap-8 relative z-10">
          {/* Feed */}
          <div>
             <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-bold text-gray-900">{t('reviews.title')}</h2>
               <div className="hidden sm:flex gap-2">
                 <button className="px-3 py-1 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">{t('reviews.all')}</button>
                 <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-full text-sm font-medium transition-colors">{t('reviews.coding')}</button>
                 <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-full text-sm font-medium transition-colors">{t('reviews.design')}</button>
               </div>
             </div>
             
             <div className="grid gap-6">
               {loading 
                 ? Array.from({ length: 3 }).map((_, i) => <ReviewCardSkeleton key={i} />)
                 : REVIEWS.map(review => (
                     <ReviewCard key={review.id} review={review} />
                   ))
               }
             </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <NewsWidget />
            
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl p-6 text-white shadow-2xl relative overflow-hidden animate-glow">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <h3 className="font-bold text-xl mb-2">Want to earn money?</h3>
                <p className="text-blue-100 text-sm mb-4">Complete specific testing tasks for guaranteed rewards.</p>
                <Link to="/tasks" className="block w-full bg-white text-blue-600 font-bold py-2 rounded-lg text-sm hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg text-center">
                  {t('home.viewTasks')}
                </Link>
              </div>
            </div>

                   <div className="glass-card rounded-xl p-5 shadow-xl">
                     <h3 className="font-bold text-gray-900 mb-2">{t('home.weeklyDigest')}</h3>
                     <p className="text-sm text-gray-600 mb-3">{t('home.weeklyDigestDesc')}</p>
                     <form
                       onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }}
                       className="space-y-3"
                     >
                       <input type="email" required placeholder="you@example.com" className="w-full px-3 py-2 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white/50 backdrop-blur-sm" />
                       <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">{t('home.subscribe')}</button>
                     </form>
                     <p className="text-xs text-gray-400 mt-2">{t('home.subscribers').replace('{count}', '2,340')}</p>
                   </div>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-purple-50/20"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex items-center justify-between mb-8 animate-slideDown">
            <div>
              <h2 className="text-3xl font-bold gradient-text">{t('home.comingSoon')}</h2>
              <p className="text-gray-600 text-sm">{t('home.comingSoonDesc')}</p>
            </div>
            <Link to="/submit" className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-all transform hover:scale-105">{t('home.notifyMe')}</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'ToolName AI', date: 'Launching Dec 15', interest: 247, teaser: 'Revolutionary approach to design automation' },
              { title: 'VoiceCraft', date: 'Launching Jan 02', interest: 188, teaser: 'Ultra-natural multilingual voice synthesis' },
              { title: 'DataPilot', date: 'Launching Jan 10', interest: 162, teaser: 'Autonomous data analysis with compliance guardrails' },
            ].map((item, idx) => (
              <div key={item.title} className="glass-card rounded-xl p-5 card-3d hover:shadow-2xl transition-all duration-300 animate-slideUp" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="text-xs font-semibold text-amber-700 bg-gradient-to-r from-amber-100 to-orange-100 px-3 py-1 rounded-full inline-block mb-3 border border-amber-200">{item.date}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{item.teaser}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>{item.interest} {t('home.peopleInterested')}</span>
                  <button className="text-blue-600 font-semibold hover:text-blue-700 transition-all transform hover:scale-110">{t('home.notify')}</button>
                </div>
                <button className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-2 rounded-lg text-sm font-semibold hover:from-gray-800 hover:to-gray-700 transition-all transform hover:scale-105 shadow-lg">{t('home.preview')}</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;