import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, DollarSign, FileText, Briefcase, Zap, Award, ArrowRight, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import FollowButton from '@/components/ui/follow-button';
import Badge from '@/components/ui/Badge';
import { getLevelInfo } from '@/lib/level-calculation';
import { canAccessFeature } from '@/lib/xp-system';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user, isLoading } = useAuth();

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
  if (!user) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Please log in to view your dashboard</p>
          <FollowButton to="/" as="link" variant="primary">
            Go to Home
          </FollowButton>
        </div>
      </div>
    );
  }

  const userXp = user.profile?.total_xp ?? 0;
  const profileCompletion = user.progression?.profileCompletion || 0;
  const levelInfo = getLevelInfo(userXp);
  const canAccessMoneyBounties = canAccessFeature('money_bounties', levelInfo.level, profileCompletion);
  const canAccessHire = canAccessFeature('hire_applications', levelInfo.level, profileCompletion);

  // Calculate next best action
  const getNextBestAction = () => {
    if (levelInfo.level < 2) {
      return {
        title: 'Reach Level 2',
        description: `You're ${levelInfo.xpToNext} XP away from unlocking paid bounties`,
        action: 'Complete XP challenges',
        route: '/tasks?type=xp_challenge',
        icon: TrendingUp,
      };
    }
    if (profileCompletion < 60) {
      return {
        title: 'Complete Your Profile',
        description: `Your profile is ${profileCompletion}% complete. Reach 60% to unlock paid tasks.`,
        action: 'Complete profile',
        route: '/profile',
        icon: CheckCircle,
      };
    }
    if ((user.earnings ?? 0) === 0) {
      return {
        title: 'Start Earning',
        description: 'You can now access paid bounties. Submit your first output!',
        action: 'Browse bounties',
        route: '/tasks?type=bounty',
        icon: DollarSign,
      };
    }
    return {
      title: 'Keep Going!',
      description: 'You\'re doing great. Continue submitting high-quality outputs.',
      action: 'Submit output',
      route: '/submit',
      icon: FileText,
    };
  };

  const nextAction = getNextBestAction();
  const NextActionIcon = nextAction.icon;

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-transparent"></div>
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="mb-8 animate-slideDown">
          <h1 className="text-4xl sm:text-5xl font-black gradient-text mb-2 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xl text-gray-300 font-medium">Welcome back, {user.displayName || user.name}!</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Level & XP */}
          <div className="glass-card rounded-xl p-6 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-primary-purple/20 p-3 rounded-lg text-primary-purple">
                <Award size={24} />
              </div>
              <Badge variant="primary" size="md">
                Level {levelInfo.level}
              </Badge>
            </div>
            <div className="mb-2">
              <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
                <span>XP Progress</span>
                <span>{levelInfo.xpToNext} to next</span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-purple to-primary-blue transition-all duration-700 ease-out"
                  style={{ width: `${levelInfo.progress * 100}%` }}
                />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{userXp.toLocaleString()} XP</div>
          </div>

          {/* Total Earnings */}
          <div className="glass-card rounded-xl p-6 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-accent-green/20 p-3 rounded-lg text-accent-green">
                <DollarSign size={24} />
              </div>
            </div>
            <div className="text-sm text-gray-400 mb-1">Total Earnings</div>
            <div className="text-2xl font-bold gradient-text">${(user.earnings ?? 0).toLocaleString()}</div>
          </div>

          {/* Profile Completion */}
          <div className="glass-card rounded-xl p-6 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-primary-blue/20 p-3 rounded-lg text-primary-blue">
                <CheckCircle size={24} />
              </div>
            </div>
            <div className="text-sm text-gray-400 mb-1">Profile Completion</div>
            <div className="text-2xl font-bold text-white">{profileCompletion}%</div>
            <div className="mt-2 w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-blue to-accent-green transition-all duration-700 ease-out"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>

          {/* Unlocked Features */}
          <div className="glass-card rounded-xl p-6 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-accent-gold/20 p-3 rounded-lg text-accent-gold">
                <Zap size={24} />
              </div>
            </div>
            <div className="text-sm text-gray-400 mb-1">Unlocked Features</div>
            <div className="text-2xl font-bold text-white">
              {user.progression?.unlockedFeatures?.length || 2}
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {user.progression?.unlockedFeatures?.map((feature) => (
                <Badge key={feature} variant="info" size="sm">
                  {feature.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Next Best Action */}
        <div className="glass-card rounded-xl p-6 mb-8 border-l-4 border-primary-cyan">
          <div className="flex items-start gap-4">
            <div className="bg-primary-cyan/20 p-3 rounded-lg text-primary-cyan flex-shrink-0">
              <NextActionIcon size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">{nextAction.title}</h3>
              <p className="text-gray-400 mb-4">{nextAction.description}</p>
              <FollowButton
                to={nextAction.route}
                as="link"
                variant="primary"
                size="md"
                icon={ArrowRight}
                iconPosition="right"
              >
                {nextAction.action}
              </FollowButton>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/submit"
            className="glass-card rounded-xl p-6 hover:shadow-xl transition-all group"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-primary-blue/20 p-3 rounded-lg text-primary-cyan group-hover:scale-110 transition-transform">
                <FileText size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Submit Output</h3>
            </div>
            <p className="text-gray-400 text-sm">Submit a new AI tool output for verification</p>
          </Link>

          <Link
            to="/tasks"
            className="glass-card rounded-xl p-6 hover:shadow-xl transition-all group"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-accent-green/20 p-3 rounded-lg text-accent-green group-hover:scale-110 transition-transform">
                <DollarSign size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Browse Tasks</h3>
            </div>
            <p className="text-gray-400 text-sm">
              {canAccessMoneyBounties ? 'View XP challenges and paid bounties' : 'Complete XP challenges to unlock paid tasks'}
            </p>
          </Link>

          <Link
            to="/hire"
            className="glass-card rounded-xl p-6 hover:shadow-xl transition-all group"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-primary-purple/20 p-3 rounded-lg text-primary-purple group-hover:scale-110 transition-transform">
                <Briefcase size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Hire Marketplace</h3>
            </div>
            <p className="text-gray-400 text-sm">
              {canAccessHire ? 'Find custom projects and long-term work' : 'Reach Level 3 to access'}
            </p>
          </Link>
        </div>

        {/* Recent Activity (Placeholder) */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-gray-500">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p>No recent activity</p>
            <p className="text-sm mt-2">Start by submitting your first output!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

