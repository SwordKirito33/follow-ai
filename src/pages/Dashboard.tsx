import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, DollarSign, FileText, Briefcase, Zap, Award, ArrowRight, CheckCircle, RefreshCw, ListTodo, CheckSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import FollowButton from '@/components/ui/follow-button';
import Badge from '@/components/ui/Badge';
import { getLevelInfo } from '@/lib/level-calculation';
import { canAccessFeature } from '@/lib/xp-system';
import { useUserStats } from '@/hooks/useApiQuery';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user, isLoading } = useAuth();

  // React Query hooks
  const { data: stats, isLoading: statsLoading } = useUserStats(user?.id || '', !!user?.id);

  // 🔥 CRITICAL: Wait for loading first
  if (isLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">{t('dashboardPage.loading')}</p>
        </div>
      </div>
    );
  }

  // ✅ Only check user after loading is complete
  if (!user) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">{t('dashboardPage.pleaseLogin')}</p>
          <FollowButton to="/" as="link" variant="primary">
            {t('dashboardPage.goHome')}
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
        title: t('dashboardPage.reachLevel2'),
        description: t('dashboardPage.reachLevel2Desc').replace('{xp}', String(levelInfo.xpToNext)),
        action: t('dashboardPage.completeXpChallenges'),
        route: '/tasks?type=xp_challenge',
        icon: TrendingUp,
      };
    }
    if (profileCompletion < 60) {
      return {
        title: t('dashboardPage.completeProfile'),
        description: t('dashboardPage.completeProfileDesc').replace('{percent}', String(profileCompletion)),
        action: t('tasks.completeProfile'),
        route: '/profile',
        icon: CheckCircle,
      };
    }
    if ((user.earnings ?? 0) === 0) {
      return {
        title: t('dashboardPage.startEarning'),
        description: t('dashboardPage.startEarningDesc'),
        action: t('dashboardPage.browseBounties'),
        route: '/tasks?type=bounty',
        icon: DollarSign,
      };
    }
    return {
      title: t('dashboardPage.keepGoing'),
      description: t('dashboardPage.keepGoingDesc'),
      action: t('dashboardPage.submitOutput'),
      route: '/submit',
      icon: FileText,
    };
  };

  const nextAction = getNextBestAction();
  const NextActionIcon = nextAction.icon;

  return (
    <div className="min-h-screen py-12 px-4 relative" data-testid="dashboard-container">
      <div className="absolute inset-0 bg-transparent"></div>
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="mb-8 animate-slideDown">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black gradient-text mb-2 tracking-tight" data-testid="dashboard-title">
                {t('dashboardPage.title')}
              </h1>
              <p className="text-xl text-gray-300 font-medium" data-testid="welcome-message">{t('dashboardPage.welcomeBack')}, {user.displayName || user.name}!</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-gray-300 hover:text-white transition-colors"
              data-testid="refresh-dashboard"
            >
              <RefreshCw size={18} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="bg-primary-cyan/20 p-2 rounded-lg text-primary-cyan w-fit mx-auto mb-2">
              <ListTodo size={20} />
            </div>
            <div className="text-2xl font-bold text-white" data-testid="active-tasks-count">
              {stats?.activeTasks ?? 0}
            </div>
            <div className="text-xs text-gray-400">Active Tasks</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="bg-accent-green/20 p-2 rounded-lg text-accent-green w-fit mx-auto mb-2">
              <CheckSquare size={20} />
            </div>
            <div className="text-2xl font-bold text-white" data-testid="completed-tasks-count">
              {stats?.completedTasks ?? 0}
            </div>
            <div className="text-xs text-gray-400">Completed</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="bg-primary-purple/20 p-2 rounded-lg text-primary-purple w-fit mx-auto mb-2">
              <TrendingUp size={20} />
            </div>
            <div className="text-2xl font-bold text-white" data-testid="pending-tasks-count">
              {stats?.pendingTasks ?? 0}
            </div>
            <div className="text-xs text-gray-400">Pending</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="bg-accent-gold/20 p-2 rounded-lg text-accent-gold w-fit mx-auto mb-2">
              <Award size={20} />
            </div>
            <div className="text-2xl font-bold text-white" data-testid="total-tasks-count">
              {(stats?.activeTasks ?? 0) + (stats?.completedTasks ?? 0) + (stats?.pendingTasks ?? 0)}
            </div>
            <div className="text-xs text-gray-400">Total Tasks</div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-testid="user-stats">
          {/* Level & XP */}
          <div className="glass-card rounded-xl p-6 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-primary-purple/20 p-3 rounded-lg text-primary-purple">
                <Award size={24} />
              </div>
              <Badge variant="primary" size="md" data-testid="user-level">
                {t('xp.level')} {levelInfo.level}
              </Badge>
            </div>
            <div className="mb-2">
              <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
                <span>{t('dashboardPage.xpProgress')}</span>
                <span>{levelInfo.xpToNext} {t('dashboardPage.toNext')}</span>
              </div>
              <div className="w-full h-3 bg-gray-800/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-purple to-primary-blue transition-all duration-700 ease-out"
                  style={{ width: `${levelInfo.progress * 100}%` }}
                />
              </div>
            </div>
            <div className="text-2xl font-bold text-white" data-testid="user-xp">{userXp.toLocaleString()} XP</div>
          </div>

          {/* Total Earnings */}
          <div className="glass-card rounded-xl p-6 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-accent-green/20 p-3 rounded-lg text-accent-green">
                <DollarSign size={24} />
              </div>
            </div>
            <div className="text-sm text-gray-400 mb-1">{t('dashboardPage.totalEarnings')}</div>
            <div className="text-2xl font-bold gradient-text" data-testid="user-balance">${(user.earnings ?? 0).toLocaleString()}</div>
          </div>

          {/* Profile Completion */}
          <div className="glass-card rounded-xl p-6 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-primary-blue/20 p-3 rounded-lg text-primary-blue">
                <CheckCircle size={24} />
              </div>
            </div>
            <div className="text-sm text-gray-400 mb-1">{t('dashboardPage.profileCompletion')}</div>
            <div className="text-2xl font-bold text-white" data-testid="profile-completion">{profileCompletion}%</div>
            <div className="mt-2 w-full h-2 bg-gray-800/10 rounded-full overflow-hidden">
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
            <div className="text-sm text-gray-400 mb-1">{t('dashboardPage.unlockedFeatures')}</div>
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
            data-testid="create-task-button"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-primary-blue/20 p-3 rounded-lg text-primary-cyan group-hover:scale-110 transition-transform">
                <FileText size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">{t('dashboardPage.submitOutputCard')}</h3>
            </div>
            <p className="text-gray-400 text-sm">{t('dashboardPage.submitOutputDesc')}</p>
          </Link>

          <Link
            to="/tasks"
            className="glass-card rounded-xl p-6 hover:shadow-xl transition-all group"
            data-testid="view-all-tasks"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-accent-green/20 p-3 rounded-lg text-accent-green group-hover:scale-110 transition-transform">
                <DollarSign size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">{t('dashboardPage.browseTasks')}</h3>
            </div>
            <p className="text-gray-400 text-sm">
              {canAccessMoneyBounties ? t('dashboardPage.browseTasksDescUnlocked') : t('dashboardPage.browseTasksDescLocked')}
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
              <h3 className="text-lg font-bold text-white">{t('dashboardPage.hireMarketplace')}</h3>
            </div>
            <p className="text-gray-400 text-sm">
              {canAccessHire ? t('dashboardPage.hireDescUnlocked') : t('dashboardPage.hireDescLocked')}
            </p>
          </Link>
        </div>

        {/* Recent Activity (Placeholder) */}
        <div className="glass-card rounded-xl p-6" data-testid="recent-activity">
          <h2 className="text-xl font-bold text-white mb-4">{t('dashboardPage.recentActivity')}</h2>
          <div className="text-center py-8 text-gray-400">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p>{t('dashboardPage.noActivity')}</p>
            <p className="text-sm mt-2">{t('dashboardPage.startSubmitting')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
