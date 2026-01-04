import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, Zap, Clock, Users, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import FollowButton from '@/components/ui/follow-button';
import Badge from '@/components/ui/Badge';
import { HireTask } from '@/types/progression';
import { canAccessFeature } from '@/lib/xp-system';
import { trackEvent } from '@/lib/analytics';

// Mock data - replace with real data
const MOCK_TASK: HireTask = {
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
};

const HireDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const toast = useToast();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [proposal, setProposal] = useState('');
  const [estimatedTimeline, setEstimatedTimeline] = useState('');

  const task = MOCK_TASK; // In real app, fetch by id

  const userLevel = user?.progression?.level || 1;
  const profileCompletion = user?.progression?.profileCompletion || 0;
  const canApply = userLevel >= (task.minLevel || 1) && profileCompletion >= 60;

  const daysLeft = task.deadline
    ? Math.ceil((new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const handleApply = () => {
    if (!canApply) {
      toast.error(
        'Requirements not met',
        userLevel < (task.minLevel || 1)
          ? `You need to reach Level ${task.minLevel} to apply`
          : 'Complete your profile (60%+) to apply'
      );
      return;
    }

    if (!proposal.trim()) {
      toast.error('Please write a proposal');
      return;
    }

    // Submit application (mock)
    toast.success('Application submitted!', 'The task creator will review your proposal');
    trackEvent('hire_application_submitted', { taskId: task.id });
    setShowApplicationForm(false);
    setProposal('');
    setEstimatedTimeline('');
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <button
          onClick={() => navigate('/hire')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to marketplace</span>
        </button>

        <div className="glass-card rounded-xl p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-black text-white">{task.title}</h1>
                {task.status === 'open' && <Badge variant="success" size="md">Open</Badge>}
                {daysLeft !== null && daysLeft <= 3 && (
                  <Badge variant="warning" size="md">Closing soon</Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <Briefcase size={16} />
                  {task.category}
                </span>
                {task.minLevel && (
                  <span className="flex items-center gap-1">
                    <Users size={16} />
                    Level {task.minLevel}+
                  </span>
                )}
                {daysLeft !== null && (
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {daysLeft} days left
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Rewards */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <div className="flex items-center gap-6">
              {task.rewardType === 'money' && (
                <div className="flex items-center gap-2 text-accent-green font-bold text-lg">
                  <DollarSign size={24} />
                  <span>${task.budgetMin} - ${task.budgetMax}</span>
                </div>
              )}
              {task.rewardType === 'xp' && (
                <div className="flex items-center gap-2 text-primary-cyan font-bold text-lg">
                  <Zap size={24} />
                  <span>+{task.xpReward} XP</span>
                </div>
              )}
              {task.rewardType === 'money_and_xp' && (
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-accent-green font-bold text-lg">
                    <DollarSign size={24} />
                    <span>${task.budgetMin} - ${task.budgetMax}</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary-cyan font-bold text-lg">
                    <Zap size={24} />
                    <span>+{task.xpReward} XP</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-3">Description</h2>
            <p className="text-gray-300 leading-relaxed">{task.description}</p>
          </div>

          {/* Requirements */}
          <div className="mb-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {task.requiredSkills.map((skill, idx) => (
                  <Badge key={idx} variant="info" size="md">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Required AI Tools</h3>
              <div className="flex flex-wrap gap-2">
                {task.requiredAiTools.map((tool, idx) => (
                  <Badge key={idx} variant="secondary" size="md">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Application Form or CTA */}
          {!showApplicationForm ? (
            <div className="pt-6 border-t border-white/10">
              {canApply ? (
                <FollowButton
                  onClick={() => setShowApplicationForm(true)}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  Apply for this task
                </FollowButton>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-semibold text-amber-900 mb-1">Requirements not met</p>
                      <ul className="text-sm text-amber-800 space-y-1">
                        {userLevel < (task.minLevel || 1) && (
                          <li>• Reach Level {task.minLevel} (you're Level {userLevel})</li>
                        )}
                        {profileCompletion < 60 && (
                          <li>• Complete your profile ({profileCompletion}% complete, need 60%)</li>
                        )}
                      </ul>
                      <div className="mt-3 flex gap-2">
                        <FollowButton
                          to="/onboarding"
                          as="link"
                          variant="secondary"
                          size="sm"
                        >
                          Complete profile
                        </FollowButton>
                        <FollowButton
                          to="/tasks"
                          as="link"
                          variant="secondary"
                          size="sm"
                        >
                          Find XP challenges
                        </FollowButton>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="pt-6 border-t border-white/10 space-y-4">
              <h3 className="text-xl font-bold text-white">Your Proposal</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Why are you the right fit? *
                </label>
                <textarea
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  placeholder="Describe your experience, approach, and why you're perfect for this task..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Estimated Timeline (optional)
                </label>
                <input
                  type="text"
                  value={estimatedTimeline}
                  onChange={(e) => setEstimatedTimeline(e.target.value)}
                  placeholder="e.g., 3-5 days"
                  className="w-full px-4 py-3 rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex gap-3">
                <FollowButton
                  onClick={() => setShowApplicationForm(false)}
                  variant="secondary"
                  size="md"
                >
                  Cancel
                </FollowButton>
                <FollowButton
                  onClick={handleApply}
                  variant="primary"
                  size="md"
                  icon={CheckCircle}
                  iconPosition="right"
                >
                  Submit Application
                </FollowButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HireDetail;

