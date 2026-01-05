import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { REVIEWS } from '@/data';
import ReviewCard from '@/components/ReviewCard';
import EditProfileModal from '@/components/EditProfileModal';
import AuthModal from '@/components/AuthModal';
import ProfileTabs from '@/components/ProfileTabs';
import FollowButton from '@/components/ui/follow-button';
import { Award, DollarSign, Star, LogOut, Edit, Trophy } from 'lucide-react';
import { toast } from '@/lib/toast';
import LazyImage from '@/components/LazyImage';
import { calculateProfileCompletion } from '@/lib/xp-system';
import { getLevelFromXp } from '@/lib/xp-system';
import UserInfo from '@/components/UserInfo';
import LevelProgress from '@/components/LevelProgress';
import BadgeGrid from '@/components/BadgeGrid';
import XPHistory from '@/components/XPHistory';
import { getLevelInfo, getBadgesForLevel } from '@/lib/level-calculation';

const Profile: React.FC = () => {
  const { t } = useLanguage();
  const { user, isAuthenticated, isLoading, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // 🔥 CRITICAL: Wait for loading first
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // ✅ Only check user after loading is complete
  // 如果未登录，显示登录提示
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-800/5 py-12 px-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">{t('auth.login')}</h2>
          <p className="text-gray-400 mb-6">{t('auth.loginSubtitle')}</p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-gradient-to-r from-primary-cyan to-primary-blue hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
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
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Calculate level info using the new level calculation
  const totalXp = user.profile?.total_xp ?? 0;
  const currentXp = user.profile?.xp ?? 0;
  const levelInfo = getLevelInfo(totalXp);
  const badges = getBadgesForLevel(levelInfo.level);
  const isLevel100 = levelInfo.level >= 100;
  const joinedDate = user.profile?.created_at || new Date().toISOString();

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-transparent"></div>
      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Level 100 Special Reward Banner */}
        {isLevel100 && (
          <div className="glass-card rounded-xl shadow-xl p-6 mb-8 bg-gradient-to-r from-yellow-50 via-orange-50 to-yellow-50 border-2 border-yellow-300 animate-slideDown">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-accent-gold/20 rounded-full flex items-center justify-center text-4xl">
                <Trophy className="text-accent-gold" size={32} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
                  🏆 Level 100 Achievement Unlocked!
                </h2>
                <p className="text-lg text-gray-300 font-semibold mb-1">
                  Congratulations! You've reached Level 100!
                </p>
                <p className="text-gray-400">
                  You are eligible for: <strong>G63 全新车一辆</strong> or <strong>成为 Follow-ai 合伙人（享受分红）</strong>
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Please contact support to claim your reward.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* User Info */}
        <UserInfo
          userId={user.id}
          username={user.profile?.username || user.name}
          fullName={user.profile?.full_name || user.name}
          email={user.email}
          avatarUrl={user.profile?.avatar_url || user.avatar || user.avatarUrl}
          level={levelInfo.level}
          totalXp={totalXp}
          joinedDate={joinedDate}
          onEditClick={() => setShowEditModal(true)}
        />

        {/* Level Progress */}
        <LevelProgress
          levelInfo={levelInfo}
          currentXp={currentXp}
          totalXp={totalXp}
        />

        {/* Badges Grid */}
        <BadgeGrid badges={badges} />

        {/* XP History */}
        <XPHistory userId={user.id} limit={50} />

        {/* Profile Tabs (Optional - keep for backward compatibility) */}
        <div className="glass-card rounded-xl shadow-xl p-8 mb-8 mt-8">
          <ProfileTabs
            user={{
              id: user.id,
              skills: user.skills || [],
              aiTools: user.aiTools || [],
              portfolioItems: user.portfolioItems || [],
              profile: user.profile,
              progression: {
                xp: totalXp,
                level: levelInfo.level,
                xpForNext: levelInfo.xpForNextLevel,
                xpInCurrentLevel: levelInfo.xpInCurrentLevel,
                xpToNextLevel: levelInfo.xpToNext,
                unlockedFeatures: [],
                profileCompletion: calculateProfileCompletion({
                  displayName: user.name,
                  avatarUrl: user.avatar,
                  bio: user.profile?.bio,
                  skills: user.skills || [],
                  aiTools: user.aiTools || [],
                  portfolioItems: user.portfolioItems || [],
                }),
                badges: badges.filter(b => b.unlocked).map(b => b.id),
              },
            }}
            onUpdate={async (updates) => {
              await updateUser(updates);
            }}
          />
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