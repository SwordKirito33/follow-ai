import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, Users, DollarSign, ArrowRight, Zap, Briefcase, Filter, AlertCircle, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/toast';
import FollowButton from '../components/ui/follow-button';
import Badge from '../components/ui/Badge';
import { TaskType, XpChallenge, Bounty, HireTask } from '../types/progression';
import { getLevelFromXp, canAccessFeature } from '../lib/xp-system';
import { trackEvent } from '../lib/analytics';

// Mock data - replace with real data from Supabase
const MOCK_XP_CHALLENGES: XpChallenge[] = [
  {
    id: 'xp1',
    title: 'Submit Your First Output',
    description: 'Get started by submitting your first AI tool output. Perfect for beginners!',
    type: 'xp_challenge',
    category: 'Getting Started',
    status: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    xpReward: 50,
    minLevel: 1,
  },
  {
    id: 'xp2',
    title: 'Complete Profile Setup',
    description: 'Add your skills, AI tools, and a portfolio item to unlock paid tasks.',
    type: 'xp_challenge',
    category: 'Profile',
    status: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    xpReward: 75,
    minLevel: 1,
  },
  {
    id: 'xp3',
    title: 'High-Quality Output Challenge',
    description: 'Submit an output that scores 8+ on quality. Show your skills!',
    type: 'xp_challenge',
    category: 'Quality',
    status: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    xpReward: 100,
    minLevel: 1,
  },
];

const MOCK_BOUNTIES: Bounty[] = [
  {
    id: 'b1',
    title: 'Test Cursor AI Code Assistant',
    description: 'Use Cursor to build a React component and submit the output. Must include prompt and code.',
    type: 'bounty',
    category: 'Coding',
    status: 'open',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    rewardAmount: 50,
    totalSlots: 10,
    filledSlots: 3,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    minLevel: 2,
    requiredProfileCompletion: 60,
  },
  {
    id: 'b2',
    title: 'Create AI-Generated Landing Page',
    description: 'Use Midjourney + GPT-4 to design and code a landing page. Submit screenshots and code.',
    type: 'bounty',
    category: 'Design',
    status: 'open',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    rewardAmount: 100,
    totalSlots: 5,
    filledSlots: 1,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    minLevel: 2,
    requiredProfileCompletion: 60,
  },
];

const Tasks: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [selectedType, setSelectedType] = useState<TaskType | 'all'>('all');

  // Calculate user stats
  const userLevel = user?.progression?.level || getLevelFromXp(user?.progression?.xp || 0).level || 1;
  const userXp = user?.progression?.xp || 0;
  const profileCompletion = user?.progression?.profileCompletion || 0;
  const levelInfo = getLevelFromXp(userXp);
  const xpToNext = levelInfo.xpToNext;

  // Filter tasks by type
  const filteredTasks = useMemo(() => {
    if (selectedType === 'all') {
      return [...MOCK_XP_CHALLENGES, ...MOCK_BOUNTIES];
    }
    if (selectedType === 'xp_challenge') {
      return MOCK_XP_CHALLENGES;
    }
    if (selectedType === 'bounty') {
      return MOCK_BOUNTIES;
    }
    return [];
  }, [selectedType]);

  const canAccessBounty = (bounty: Bounty) => {
    return userLevel >= (bounty.minLevel || 2) && profileCompletion >= (bounty.requiredProfileCompletion || 60);
  };

  const handleStartTask = (task: XpChallenge | Bounty | HireTask) => {
    if (task.type === 'xp_challenge') {
      navigate('/submit?challenge=' + task.id);
      trackEvent('bounty_viewed', { taskId: task.id, type: 'xp_challenge' });
    } else if (task.type === 'bounty') {
      if (!canAccessBounty(task as Bounty)) {
        toast.error(
          'Requirements not met',
          userLevel < (task.minLevel || 2)
            ? `Reach Level ${task.minLevel} to access paid bounties`
            : 'Complete your profile (60%+) to access paid bounties'
        );
        return;
      }
      navigate('/submit?bounty=' + task.id);
      trackEvent('bounty_viewed', { taskId: task.id, type: 'bounty' });
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/20 to-purple-50/20"></div>
      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-slideDown">
          <h1 className="text-4xl sm:text-5xl font-black gradient-text mb-4 tracking-tight">
            {t('tasks.title')}
          </h1>
          <p className="text-xl text-gray-600 font-medium mb-4">{t('tasks.subtitle')}</p>
          
          {/* User Progress Banner */}
          {user && (
            <div className="glass-card rounded-xl p-4 mb-4 inline-block">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Level {userLevel}</div>
                  <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
                      style={{ width: `${levelInfo.progress * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{xpToNext} XP to next level</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Profile</div>
                  <div className="text-lg font-bold text-blue-600">{profileCompletion}%</div>
                </div>
              </div>
            </div>
          )}

          {/* Unlock Message for Level 1 users */}
          {userLevel < 2 && (
            <div className="glass-card rounded-xl p-4 border-l-4 border-amber-500 mb-4 max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                  <p className="font-semibold text-amber-900 mb-1">
                    {t('tasks.unlockMessage').replace('{xp}', xpToNext.toString())}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <FollowButton
                      to="/onboarding"
                      as="link"
                      variant="secondary"
                      size="sm"
                    >
                      {t('tasks.completeProfile')}
                    </FollowButton>
                    <FollowButton
                      onClick={() => setSelectedType('xp_challenge')}
                      variant="primary"
                      size="sm"
                    >
                      {t('tasks.findXpChallenges')}
                    </FollowButton>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto">
          {[
            { id: 'all', label: 'All Tasks', icon: Filter },
            { id: 'xp_challenge', label: t('tasks.xpChallenge'), icon: Zap },
            { id: 'bounty', label: t('tasks.bounty'), icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  selectedType === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white/50 text-gray-700 hover:bg-white/80'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tasks Grid */}
        <div className="grid gap-6">
          {filteredTasks.length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center">
              <Briefcase size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg text-gray-600 mb-2">No tasks found</p>
              <p className="text-sm text-gray-500">Try selecting a different filter</p>
            </div>
          ) : (
            filteredTasks.map((task, idx) => {
              const isBounty = task.type === 'bounty';
              const isXpChallenge = task.type === 'xp_challenge';
              const canAccess = isBounty ? canAccessBounty(task as Bounty) : true;
              const daysLeft = task.deadline
                ? Math.ceil((new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                : null;

              return (
                <div
                  key={task.id}
                  className={`glass-card rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 card-3d hover:shadow-2xl transition-all duration-300 animate-slideUp ${
                    !canAccess && isBounty ? 'opacity-60' : ''
                  }`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {isXpChallenge && (
                        <Badge variant="info" size="sm">
                          <Zap size={12} className="mr-1" />
                          {t('tasks.xpChallenge')}
                        </Badge>
                      )}
                      {isBounty && (
                        <Badge variant="success" size="sm">
                          <DollarSign size={12} className="mr-1" />
                          {t('tasks.bounty')}
                        </Badge>
                      )}
                      {task.minLevel && task.minLevel > 1 && (
                        <Badge variant="secondary" size="sm">
                          <TrendingUp size={12} className="mr-1" />
                          {t('tasks.levelRequired').replace('{level}', task.minLevel.toString())}
                        </Badge>
                      )}
                      {daysLeft !== null && daysLeft <= 3 && (
                        <Badge variant="warning" size="sm">
                          <Clock size={12} className="mr-1" />
                          {daysLeft} days left
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{task.title}</h3>
                    <p className="text-gray-600 mb-3">{task.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {isBounty && (
                        <>
                          <span className="flex items-center gap-1">
                            <Users size={16} />
                            {(task as Bounty).filledSlots} / {(task as Bounty).totalSlots} slots
                          </span>
                          <span className="flex items-center gap-1 text-emerald-600">
                            AI check + human review
                          </span>
                        </>
                      )}
                      {isXpChallenge && (
                        <span className="flex items-center gap-1 text-blue-600 font-semibold">
                          <Zap size={16} />
                          +{(task as XpChallenge).xpReward} XP reward
                        </span>
                      )}
                    </div>
                    {isBounty && !canAccess && (
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-800">
                          {userLevel < (task.minLevel || 2) && (
                            <>Reach Level {task.minLevel} to unlock</>
                          )}
                          {userLevel >= (task.minLevel || 2) && profileCompletion < 60 && (
                            <>Complete your profile (60%+) to unlock</>
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    {isBounty && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{t('tasks.reward')}</p>
                        <p className="text-2xl font-bold text-green-600 flex items-center">
                          <DollarSign size={20} strokeWidth={3} />${(task as Bounty).rewardAmount}
                        </p>
                      </div>
                    )}
                    <FollowButton
                      onClick={() => handleStartTask(task)}
                      variant={canAccess ? 'primary' : 'secondary'}
                      size="md"
                      icon={ArrowRight}
                      iconPosition="right"
                      disabled={!canAccess && isBounty}
                    >
                      {isXpChallenge ? 'Start challenge' : 'Start task'}
                    </FollowButton>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Hire Marketplace CTA */}
        <div className="mt-12 glass-card rounded-xl p-8 text-center">
          <Briefcase size={48} className="mx-auto mb-4 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Looking for more opportunities?</h2>
          <p className="text-gray-600 mb-6">
            Check out the Hire marketplace for custom projects and long-term work
          </p>
          <FollowButton
            to="/hire"
            as="link"
            variant="primary"
            size="lg"
            icon={Briefcase}
            iconPosition="right"
          >
            Browse Hire Marketplace
          </FollowButton>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
