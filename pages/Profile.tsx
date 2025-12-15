import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { REVIEWS } from '../data';
import ReviewCard from '../components/ReviewCard';
import EditProfileModal from '../components/EditProfileModal';
import AuthModal from '../components/AuthModal';
import ProfileTabs from '../components/ProfileTabs';
import FollowButton from '../components/ui/follow-button';
import { Award, DollarSign, Star, LogOut, Edit } from 'lucide-react';
import LazyImage from '../components/LazyImage';
import { calculateProfileCompletion } from '../lib/xp-system';
import { getLevelFromXp } from '../lib/xp-system';

const Profile: React.FC = () => {
  const { t } = useLanguage();
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // 如果未登录，显示登录提示
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('auth.login')}</h2>
          <p className="text-gray-600 mb-6">{t('auth.loginSubtitle')}</p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {t('auth.login')}
          </button>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode="login"
        />
      </div>
    );
  }

  const userReviews = REVIEWS.filter(r => r.user.id === user.id);
  const displayReviews = userReviews.length > 0 ? userReviews : REVIEWS.slice(0, 1);

  const handleLogout = () => {
    if (window.confirm(t('auth.logoutConfirm'))) {
      logout();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/20 to-purple-50/20"></div>
      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Header Card */}
        <div className="glass-card rounded-2xl shadow-xl overflow-hidden mb-8 animate-slideDown">
          <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          </div>
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="flex items-end gap-6">
                <LazyImage src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white" />
                <div className="mb-2">
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight">{user.name}</h1>
                  <p className="text-gray-600 font-medium">{user.email} • Joined Dec 2024</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                >
                  <Edit size={16} />
                  {t('profile.editProfile')}
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                >
                  <LogOut size={16} />
                  {t('auth.logout')}
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card rounded-xl p-4 flex items-center gap-4 hover:bg-white/90 transition-all transform hover:scale-105">
                <div className="bg-green-100 p-3 rounded-lg text-green-600">
                  <DollarSign size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('profile.totalEarnings')}</p>
                  <p className="text-xl font-bold text-gray-900">${user.earnings.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="glass-card rounded-xl p-4 flex items-center gap-4 hover:bg-white/90 transition-all transform hover:scale-105">
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('profile.reputationLevel')}</p>
                  <p className="text-xl font-bold text-gray-900">{user.levelName}</p>
                </div>
              </div>

              <div className="glass-card rounded-xl p-4 flex items-center gap-4 hover:bg-white/90 transition-all transform hover:scale-105">
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

        {/* Profile Tabs */}
        <div className="glass-card rounded-xl shadow-xl p-8 mb-8">
          <ProfileTabs
            user={{
              id: user.id,
              skills: user.skills || [],
              aiTools: user.aiTools || [],
              portfolioItems: user.portfolioItems || [],
              progression: user.progression || {
                xp: 0,
                level: 1,
                xpToNextLevel: 100,
                unlockedFeatures: [],
                profileCompletion: 0,
                badges: [],
              },
            }}
            onUpdate={async (updates) => {
              // Update user data (mock for now - integrate with AuthContext later)
              await updateUser(updates);
            }}
          />
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
                    <ReviewCard review={{...review, user: user}} />
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
             <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Achievements</h2>
             <div className="glass-card rounded-xl shadow-xl p-6 space-y-4">
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
      
      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </div>
  );
};

export default Profile;