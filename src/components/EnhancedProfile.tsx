import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Link2,
  Twitter,
  Github,
  Linkedin,
  Edit2,
  Camera,
  Trophy,
  Zap,
  Target,
  Clock,
  TrendingUp,
  Award,
  Share2,
  Settings,
  CheckCircle,
  Star,
} from 'lucide-react';

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  coverImage?: string;
  bio: string;
  location?: string;
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  joinedAt: Date;
  level: number;
  totalXp: number;
  currentLevelXp: number;
  xpToNextLevel: number;
  rank: number;
  totalRanked: number;
  tasksCompleted: number;
  streak: number;
  longestStreak: number;
  totalEarnings: number;
  badges: {
    id: string;
    name: string;
    icon: string;
    description: string;
    earnedAt: Date;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }[];
  recentActivity: {
    id: string;
    type: 'task_completed' | 'level_up' | 'badge_earned' | 'streak';
    title: string;
    xp?: number;
    timestamp: Date;
  }[];
  stats: {
    avgRating: number;
    totalReviews: number;
    toolsTested: number;
    avgCompletionTime: string;
  };
}

interface EnhancedProfileProps {
  profile: UserProfile;
  isOwnProfile: boolean;
  onEditProfile: () => void;
  onShareProfile: () => void;
  onFollowUser?: () => void;
  isFollowing?: boolean;
}

const EnhancedProfile: React.FC<EnhancedProfileProps> = ({
  profile,
  isOwnProfile,
  onEditProfile,
  onShareProfile,
  onFollowUser,
  isFollowing,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'activity'>('overview');

  const rarityColors = {
    common: 'from-gray-400 to-gray-500',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-500',
  };

  const levelProgress = (profile.currentLevelXp / (profile.currentLevelXp + profile.xpToNextLevel)) * 100;

  return (
    <div className="min-h-screen bg-gray-800/5 dark:bg-gray-950">
      {/* Cover & Avatar */}
      <div className="relative">
        {/* Cover image */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-primary-blue to-primary-purple relative overflow-hidden">
          {profile.coverImage && (
            <img
              src={profile.coverImage}
              alt="Cover"
              className="w-full h-full object-cover opacity-50"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Avatar */}
        <div className="container mx-auto px-4">
          <div className="relative -mt-20 flex flex-col md:flex-row md:items-end gap-4">
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.displayName}
                className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-white dark:border-gray-900 shadow-xl object-cover"
              />
              {isOwnProfile && (
                <button className="absolute bottom-2 right-2 p-2 bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-gray-800/10 dark:hover:bg-gray-700 transition-colors">
                  <Camera className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                </button>
              )}
              {/* Level badge */}
              <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-full text-sm font-bold shadow-lg">
                Lv.{profile.level}
              </div>
            </div>

            {/* Name & actions */}
            <div className="flex-1 pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white dark:text-white">
                    {profile.displayName}
                  </h1>
                  <p className="text-gray-400 dark:text-gray-300">@{profile.username}</p>
                </div>
                <div className="flex gap-2">
                  {isOwnProfile ? (
                    <>
                      <button
                        onClick={onEditProfile}
                        className="px-4 py-2 bg-gray-800/90 backdrop-blur-sm border border-white/10 dark:border-gray-700 rounded-xl font-medium flex items-center gap-2 hover:bg-gray-800/5 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                      </button>
                      <button className="p-2 bg-gray-800/90 backdrop-blur-sm border border-white/10 dark:border-gray-700 rounded-xl hover:bg-gray-800/5 dark:hover:bg-gray-700 transition-colors">
                        <Settings className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={onFollowUser}
                      className={`px-6 py-2 rounded-xl font-medium flex items-center gap-2 transition-all ${
                        isFollowing
                          ? 'bg-gray-800/10 dark:bg-gray-800 text-gray-300 dark:text-gray-300'
                          : 'bg-gradient-to-r from-primary-cyan to-primary-blue text-white hover:bg-blue-700'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  )}
                  <button
                    onClick={onShareProfile}
                    className="p-2 bg-gray-800/90 backdrop-blur-sm border border-white/10 dark:border-gray-700 rounded-xl hover:bg-gray-800/5 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Bio card */}
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              {profile.bio && (
                <p className="text-gray-400 dark:text-gray-400 mb-4">{profile.bio}</p>
              )}
              <div className="space-y-3 text-sm">
                {profile.location && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </div>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary-cyan hover:underline"
                  >
                    <Link2 className="w-4 h-4" />
                    {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  Joined {profile.joinedAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </div>

              {/* Social links */}
              {(profile.twitter || profile.github || profile.linkedin) && (
                <div className="flex gap-3 mt-4 pt-4 border-t border-white/10 dark:border-gray-700">
                  {profile.twitter && (
                    <a
                      href={`https://twitter.com/${profile.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-800/10 dark:bg-gray-800 rounded-lg hover:bg-gray-800/10 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Twitter className="w-5 h-5 text-gray-400 dark:text-gray-400" />
                    </a>
                  )}
                  {profile.github && (
                    <a
                      href={`https://github.com/${profile.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-800/10 dark:bg-gray-800 rounded-lg hover:bg-gray-800/10 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Github className="w-5 h-5 text-gray-400 dark:text-gray-400" />
                    </a>
                  )}
                  {profile.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${profile.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-800/10 dark:bg-gray-800 rounded-lg hover:bg-gray-800/10 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Linkedin className="w-5 h-5 text-gray-400 dark:text-gray-400" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Level progress */}
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-white dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-cyan" />
                Level Progress
              </h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Level {profile.level}</span>
                <span className="text-sm text-gray-400">Level {profile.level + 1}</span>
              </div>
              <div className="h-3 bg-gray-800/10 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  className="h-full bg-gradient-to-r from-primary-blue to-primary-purple"
                />
              </div>
              <p className="text-sm text-gray-400 mt-2 text-center">
                {profile.currentLevelXp.toLocaleString()} / {(profile.currentLevelXp + profile.xpToNextLevel).toLocaleString()} XP
              </p>
            </div>

            {/* Quick stats */}
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-white dark:text-white mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-800/5 dark:bg-gray-800 rounded-xl">
                  <p className="text-2xl font-bold text-primary-cyan">{profile.totalXp.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Total XP</p>
                </div>
                <div className="text-center p-3 bg-gray-800/5 dark:bg-gray-800 rounded-xl">
                  <p className="text-2xl font-bold text-primary-purple">#{profile.rank}</p>
                  <p className="text-xs text-gray-400">Global Rank</p>
                </div>
                <div className="text-center p-3 bg-gray-800/5 dark:bg-gray-800 rounded-xl">
                  <p className="text-2xl font-bold text-accent-green">{profile.tasksCompleted}</p>
                  <p className="text-xs text-gray-400">Tasks Done</p>
                </div>
                <div className="text-center p-3 bg-gray-800/5 dark:bg-gray-800 rounded-xl">
                  <p className="text-2xl font-bold text-orange-500">🔥 {profile.streak}</p>
                  <p className="text-xs text-gray-400">Day Streak</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 bg-gray-900/90 backdrop-blur-sm rounded-xl p-1 shadow-lg">
              {(['overview', 'badges', 'activity'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-primary-cyan to-primary-blue text-white'
                      : 'text-gray-400 dark:text-gray-400 hover:bg-gray-800/10 dark:hover:bg-gray-800'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Stats cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <Star className="w-8 h-8 text-yellow-500 mb-2" />
                      <p className="text-2xl font-bold text-white dark:text-white">
                        {profile.stats.avgRating.toFixed(1)}
                      </p>
                      <p className="text-sm text-gray-400">Avg Rating</p>
                    </div>
                    <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <Target className="w-8 h-8 text-blue-500 mb-2" />
                      <p className="text-2xl font-bold text-white dark:text-white">
                        {profile.stats.toolsTested}
                      </p>
                      <p className="text-sm text-gray-400">Tools Tested</p>
                    </div>
                    <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <Clock className="w-8 h-8 text-green-500 mb-2" />
                      <p className="text-2xl font-bold text-white dark:text-white">
                        {profile.stats.avgCompletionTime}
                      </p>
                      <p className="text-sm text-gray-400">Avg Time</p>
                    </div>
                    <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <Award className="w-8 h-8 text-purple-500 mb-2" />
                      <p className="text-2xl font-bold text-white dark:text-white">
                        {profile.badges.length}
                      </p>
                      <p className="text-sm text-gray-400">Badges</p>
                    </div>
                  </div>

                  {/* Featured badges */}
                  <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                    <h3 className="font-bold text-white dark:text-white mb-4 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      Featured Badges
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {profile.badges.slice(0, 6).map((badge) => (
                        <div
                          key={badge.id}
                          className={`p-3 rounded-xl bg-gradient-to-br ${rarityColors[badge.rarity]} text-white`}
                        >
                          <span className="text-2xl">{badge.icon}</span>
                        </div>
                      ))}
                      {profile.badges.length > 6 && (
                        <button
                          onClick={() => setActiveTab('badges')}
                          className="p-3 rounded-xl bg-gray-800/10 dark:bg-gray-800 text-gray-400 dark:text-gray-400 font-medium"
                        >
                          +{profile.badges.length - 6} more
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'badges' && (
                <motion.div
                  key="badges"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
                >
                  <h3 className="font-bold text-white dark:text-white mb-6">
                    All Badges ({profile.badges.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {profile.badges.map((badge) => (
                      <div
                        key={badge.id}
                        className="p-4 rounded-xl border border-white/10 dark:border-gray-700 hover:shadow-lg transition-shadow"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rarityColors[badge.rarity]} flex items-center justify-center text-2xl mb-3`}>
                          {badge.icon}
                        </div>
                        <h4 className="font-semibold text-white dark:text-white">
                          {badge.name}
                        </h4>
                        <p className="text-sm text-gray-400 mt-1">{badge.description}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          Earned {badge.earnedAt.toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'activity' && (
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
                >
                  <h3 className="font-bold text-white dark:text-white mb-6">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {profile.recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 p-4 bg-gray-800/5 dark:bg-gray-800 rounded-xl"
                      >
                        <div className={`p-2 rounded-lg ${
                          activity.type === 'task_completed' ? 'bg-accent-green/20 dark:bg-green-900/30' :
                          activity.type === 'level_up' ? 'bg-primary-blue/20 dark:bg-blue-900/30' :
                          activity.type === 'badge_earned' ? 'bg-primary-purple/20 dark:bg-purple-900/30' :
                          'bg-orange-100 dark:bg-orange-900/30'
                        }`}>
                          {activity.type === 'task_completed' && <CheckCircle className="w-5 h-5 text-accent-green" />}
                          {activity.type === 'level_up' && <TrendingUp className="w-5 h-5 text-primary-cyan" />}
                          {activity.type === 'badge_earned' && <Award className="w-5 h-5 text-primary-purple" />}
                          {activity.type === 'streak' && <Zap className="w-5 h-5 text-orange-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white dark:text-white">
                            {activity.title}
                          </p>
                          {activity.xp && (
                            <p className="text-sm text-primary-cyan">+{activity.xp} XP</p>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">
                          {activity.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedProfile;
