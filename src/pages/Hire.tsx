import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Filter, Search, DollarSign, Zap, Clock, Users, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { HireTask } from '@/types/progression';
import FollowButton from '@/components/ui/follow-button';
import Badge from '@/components/ui/Badge';
import { getLevelFromXp, canAccessFeature } from '@/lib/xp-system';

// Mock data - replace with real data from Supabase
const MOCK_HIRE_TASKS: HireTask[] = [
  {
    id: 'h1',
    title: 'Build AI-Powered Landing Page',
    description: 'Create a modern landing page using AI tools (GPT-4, Midjourney) for a SaaS product. Must be responsive and conversion-optimized.',
    type: 'hire',
    category: 'Product landing page',
    status: 'open',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    creatorId: 'c1',
    requiredSkills: ['Web Design', 'AI Tools', 'Conversion Optimization'],
    requiredAiTools: ['GPT-4', 'Midjourney', 'Figma'],
    minLevel: 3,
    rewardType: 'money_and_xp',
    budgetMin: 500,
    budgetMax: 1000,
    xpReward: 100,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    applications: [],
  },
  {
    id: 'h2',
    title: 'Prompt Engineering for Code Generation',
    description: 'Help optimize prompts for generating React components with Cursor. Need someone with deep experience in prompt engineering.',
    type: 'hire',
    category: 'Prompt engineering',
    status: 'open',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    creatorId: 'c2',
    requiredSkills: ['Prompt Engineering', 'React', 'TypeScript'],
    requiredAiTools: ['Cursor', 'GPT-4'],
    minLevel: 2,
    rewardType: 'money',
    budgetMin: 300,
    budgetMax: 500,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    applications: [],
  },
  {
    id: 'h3',
    title: 'AI Agent Development Challenge',
    description: 'Build a simple AI agent using LangChain that can answer questions about our product. XP-only challenge for learning.',
    type: 'hire',
    category: 'Agent building',
    status: 'open',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    creatorId: 'c3',
    requiredSkills: ['Python', 'LangChain', 'AI Agents'],
    requiredAiTools: ['GPT-4', 'LangChain'],
    minLevel: 1,
    rewardType: 'xp',
    xpReward: 150,
    applications: [],
  },
];

const Hire: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRewardType, setSelectedRewardType] = useState<string>('all');
  const [selectedMinLevel, setSelectedMinLevel] = useState<number>(0);

  // Calculate user level from XP (mock for now)
  const userLevel = user?.progression?.level || 1;
  const userXp = user?.progression?.xp || 0;
  const profileCompletion = user?.progression?.profileCompletion || 0;

  const categories = ['all', 'Prompt engineering', 'Agent building', 'Product landing page', 'Automation'];
  const rewardTypes = ['all', 'money', 'xp', 'money_and_xp'];

  const filteredTasks = useMemo(() => {
    return MOCK_HIRE_TASKS.filter((task) => {
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !task.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (selectedCategory !== 'all' && task.category !== selectedCategory) {
        return false;
      }
      if (selectedRewardType !== 'all' && task.rewardType !== selectedRewardType) {
        return false;
      }
      if (selectedMinLevel > 0 && (task.minLevel || 1) < selectedMinLevel) {
        return false;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedRewardType, selectedMinLevel]);

  const canApply = (task: HireTask) => {
    const userLevel = user?.progression?.level || 1;
    const profileCompletion = user?.progression?.profileCompletion || 0;
    return userLevel >= (task.minLevel || 1) && profileCompletion >= 60;
  };

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/20 to-purple-50/20"></div>
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-8 animate-slideDown">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black gradient-text mb-2 tracking-tight">
                Hire Marketplace
              </h1>
              <p className="text-xl text-gray-600 font-medium">
                Find AI talent or post your tasks
              </p>
            </div>
            <FollowButton
              to="/hire/new"
              as="link"
              variant="primary"
              size="lg"
              icon={Briefcase}
            >
              Post a task
            </FollowButton>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-xl p-6 space-y-6 sticky top-4">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Filters</h3>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reward Type Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reward Type</label>
                <select
                  value={selectedRewardType}
                  onChange={(e) => setSelectedRewardType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {rewardTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type === 'money' ? 'Money' : type === 'xp' ? 'XP Only' : 'Money + XP'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Level Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Min Level: {selectedMinLevel === 0 ? 'Any' : selectedMinLevel}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={selectedMinLevel}
                  onChange={(e) => setSelectedMinLevel(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="lg:col-span-3">
            {filteredTasks.length === 0 ? (
              <div className="glass-card rounded-xl p-12 text-center">
                <Briefcase size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-lg text-gray-600 mb-2">No tasks found</p>
                <p className="text-sm text-gray-500">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredTasks.map((task) => {
                  const canUserApply = canApply(task);
                  const daysLeft = task.deadline
                    ? Math.ceil((new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                    : null;

                  return (
                    <div
                      key={task.id}
                      className="glass-card rounded-xl p-6 hover:shadow-xl transition-all card-3d"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
                            {task.status === 'open' && (
                              <Badge variant="success" size="sm">Open</Badge>
                            )}
                            {daysLeft !== null && daysLeft <= 3 && (
                              <Badge variant="warning" size="sm">Closing soon</Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{task.description}</p>
                        </div>
                      </div>

                      {/* Task Meta */}
                      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Briefcase size={16} />
                          <span>{task.category}</span>
                        </div>
                        {task.minLevel && (
                          <div className="flex items-center gap-1">
                            <TrendingUp size={16} />
                            <span>Level {task.minLevel}+</span>
                          </div>
                        )}
                        {daysLeft !== null && (
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{daysLeft} days left</span>
                          </div>
                        )}
                      </div>

                      {/* Rewards */}
                      <div className="flex items-center gap-4 mb-4">
                        {task.rewardType === 'money' && (
                          <div className="flex items-center gap-2 text-green-600 font-bold">
                            <DollarSign size={20} />
                            <span>${task.budgetMin} - ${task.budgetMax}</span>
                          </div>
                        )}
                        {task.rewardType === 'xp' && (
                          <div className="flex items-center gap-2 text-blue-600 font-bold">
                            <Zap size={20} />
                            <span>+{task.xpReward} XP</span>
                          </div>
                        )}
                        {task.rewardType === 'money_and_xp' && (
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-green-600 font-bold">
                              <DollarSign size={20} />
                              <span>${task.budgetMin} - ${task.budgetMax}</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-600 font-bold">
                              <Zap size={20} />
                              <span>+{task.xpReward} XP</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Required Skills & Tools */}
                      <div className="mb-4 space-y-2">
                        <div>
                          <span className="text-xs font-semibold text-gray-500">Required Skills:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {task.requiredSkills.map((skill, idx) => (
                              <Badge key={idx} variant="info" size="sm">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-gray-500">AI Tools:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {task.requiredAiTools.map((tool, idx) => (
                              <Badge key={idx} variant="secondary" size="sm">{tool}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <Link
                          to={`/hire/${task.id}`}
                          className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                        >
                          View details →
                        </Link>
                        {canUserApply ? (
                          <FollowButton
                            to={`/hire/${task.id}`}
                            as="link"
                            variant="primary"
                            size="sm"
                          >
                            Apply
                          </FollowButton>
                        ) : (
                          <div className="text-xs text-gray-500">
                            {userLevel < (task.minLevel || 1) && (
                              <span>Requires Level {task.minLevel}</span>
                            )}
                            {profileCompletion < 60 && userLevel >= (task.minLevel || 1) && (
                              <span>Complete profile to apply</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hire;

