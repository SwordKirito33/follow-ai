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
    <div className="min-h-screen bg-gray-50">
      <ActivityFeed />
      <Hero />
      <Rankings />
      
      {/* Category Showcase */}
      <section id="categories" className="bg-white py-16 px-4 border-y border-gray-100">
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
            ].map((cat) => (
              <Link key={cat.title} to="/rankings" className="block bg-gray-50 hover:bg-white border border-gray-200 hover:border-blue-200 rounded-xl p-4 transition-all shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{cat.icon}</span>
                  {cat.badge && <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold">{cat.badge}</span>}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{cat.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{cat.stats}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Different Section */}
      <section className="bg-white py-16 px-4 border-y border-gray-100">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{t('whyDifferent.title')}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-4 border-b-2 border-gray-100 text-gray-500 font-medium">Feature</th>
                  <th className="p-4 border-b-2 border-gray-100 text-gray-400 font-medium">Product Hunt</th>
                  <th className="p-4 border-b-2 border-blue-100 bg-blue-50 text-blue-800 font-bold rounded-t-lg">Follow.ai</th>
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
      </section>

      {/* Main Content Area */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-[2fr_1fr] gap-8">
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
            
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-xl mb-2">Want to earn money?</h3>
              <p className="text-blue-100 text-sm mb-4">Complete specific testing tasks for guaranteed rewards.</p>
              <Link to="/tasks" className="block w-full bg-white text-blue-600 font-bold py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors text-center">
                View Tasks
              </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">📬 Weekly AI Tools Digest</h3>
              <p className="text-sm text-gray-600 mb-3">Get the top 10 AI tools every Monday. No spam, unsubscribe anytime.</p>
              <form
                onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }}
                className="space-y-3"
              >
                <input type="email" required placeholder="you@example.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700">Subscribe</button>
              </form>
              <p className="text-xs text-gray-400 mt-2">Join 2,340 subscribers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="bg-white py-16 px-4 border-t border-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">🔮 Coming Soon</h2>
              <p className="text-gray-600 text-sm">Be the first to review new AI tools.</p>
            </div>
            <Link to="/submit" className="text-blue-600 text-sm font-semibold hover:text-blue-700">Notify me →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'ToolName AI', date: 'Launching Dec 15', interest: 247, teaser: 'Revolutionary approach to design automation' },
              { title: 'VoiceCraft', date: 'Launching Jan 02', interest: 188, teaser: 'Ultra-natural multilingual voice synthesis' },
              { title: 'DataPilot', date: 'Launching Jan 10', interest: 162, teaser: 'Autonomous data analysis with compliance guardrails' },
            ].map((item) => (
              <div key={item.title} className="border border-gray-200 rounded-xl p-5 bg-gray-50 hover:bg-white hover:shadow-md transition-all">
                <div className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded-full inline-block mb-3">{item.date}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{item.teaser}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>{item.interest} people interested</span>
                  <button className="text-blue-600 font-semibold hover:text-blue-700">🔔 Notify</button>
                </div>
                <button className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-semibold hover:bg-black">Preview</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;