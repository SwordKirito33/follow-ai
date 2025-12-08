import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CURRENT_USER, REVIEWS } from '../data';
import ReviewCard from '../components/ReviewCard';
import { Award, DollarSign, Star } from 'lucide-react';

const Profile: React.FC = () => {
  const { t } = useLanguage();
  const userReviews = REVIEWS.filter(r => r.user.id === CURRENT_USER.id); // In mock data, might be empty if IDs don't match, so we can fallback or show empty state. 
  // Let's pretend the user has some reviews for demo purposes if list is empty
  const displayReviews = userReviews.length > 0 ? userReviews : REVIEWS.slice(0, 1);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="flex items-end gap-6">
                <img src={CURRENT_USER.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white" />
                <div className="mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{CURRENT_USER.name}</h1>
                  <p className="text-gray-500">@{CURRENT_USER.id} • Joined Dec 2024</p>
                </div>
              </div>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                {t('profile.editProfile')}
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg text-green-600">
                  <DollarSign size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Earnings</p>
                  <p className="text-xl font-bold text-gray-900">$1,250</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reputation Level</p>
                  <p className="text-xl font-bold text-gray-900">Level 4 Expert</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                  <Star size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Quality Score</p>
                  <p className="text-xl font-bold text-gray-900">9.1/10</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t('profile.myReviews')}</h2>
            <div className="space-y-6">
              {displayReviews.map(review => (
                <div key={review.id} className="relative">
                    <div className="absolute top-4 right-4 z-10 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                        {t('profile.statusLive')}
                    </div>
                    <ReviewCard review={{...review, user: CURRENT_USER}} />
                </div>
              ))}
              {displayReviews.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                      <p className="text-gray-500">{t('profile.noReviewsYet')}</p>
                  </div>
              )}
            </div>
          </div>

          <div>
             <h2 className="text-xl font-bold text-gray-900 mb-6">Achievements</h2>
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                <div className="flex items-center gap-3 opacity-100">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-xl">🏆</div>
                    <div>
                        <h4 className="font-bold text-sm text-gray-900">First Review</h4>
                        <p className="text-xs text-gray-500">Submitted 1 valid review</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 opacity-50 grayscale">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">⭐</div>
                    <div>
                        <h4 className="font-bold text-sm text-gray-900">Top Rated</h4>
                        <p className="text-xs text-gray-500">Get a 10/10 quality score</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 opacity-50 grayscale">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">💰</div>
                    <div>
                        <h4 className="font-bold text-sm text-gray-900">Earner</h4>
                        <p className="text-xs text-gray-500">Earn your first $100</p>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;