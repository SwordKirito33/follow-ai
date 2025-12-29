import React, { useState } from 'react';
import { User, Briefcase, FileText, Award, Zap, Plus, X, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from './ui/toast';
import FollowButton from './ui/follow-button';
import Badge from './ui/Badge';
import { PortfolioItem } from '@/types/progression';
import { getLevelFromXp, calculateProfileCompletion } from '@/lib/xp-system';
import { trackEvent } from '@/lib/analytics';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileTabsProps {
  user: {
    id: string;
    skills?: string[];
    aiTools?: string[];
    portfolioItems?: PortfolioItem[];
    profile?: {
      total_xp?: number;
      [key: string]: any;
    };
    progression?: {
      xp: number;
      level: number;
      profileCompletion: number;
      badges: string[];
    };
  };
  onUpdate: (updates: { skills?: string[]; aiTools?: string[]; portfolioItems?: PortfolioItem[] }) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ user, onUpdate }) => {
  const { t } = useLanguage();
  const toast = useToast();
  const { updateUser: updateUserContext } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'portfolio'>('overview');
  const [newSkill, setNewSkill] = useState('');
  const [newAiTool, setNewAiTool] = useState('');
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [portfolioForm, setPortfolioForm] = useState({
    title: '',
    description: '',
    link: '',
    relatedTools: [] as string[],
  });

  const levelInfo = user.profile 
    ? getLevelFromXp(user.profile.total_xp ?? 0) 
    : { level: 1, progress: 0, xpToNext: 100, xpInCurrentLevel: 0 };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    const updated = [...(user.skills || []), newSkill.trim()];
    
    // Update via context to trigger profile completion recalculation
    await updateUserContext({ skills: updated });
    onUpdate({ skills: updated });
    
    setNewSkill('');
    toast.success('Skill added');
    trackEvent('skill_added', { skill: newSkill.trim() });
  };

  const handleRemoveSkill = async (skill: string) => {
    const updated = (user.skills || []).filter((s) => s !== skill);
    await updateUserContext({ skills: updated });
    onUpdate({ skills: updated });
    toast.info('Skill removed');
  };

  const handleAddAiTool = async () => {
    if (!newAiTool.trim()) return;
    const updated = [...(user.aiTools || []), newAiTool.trim()];
    await updateUserContext({ aiTools: updated });
    onUpdate({ aiTools: updated });
    setNewAiTool('');
    toast.success('AI tool added');
    trackEvent('ai_tool_added', { tool: newAiTool.trim() });
  };

  const handleRemoveAiTool = async (tool: string) => {
    const updated = (user.aiTools || []).filter((t) => t !== tool);
    await updateUserContext({ aiTools: updated });
    onUpdate({ aiTools: updated });
    toast.info('AI tool removed');
  };

  const handleAddPortfolioItem = async () => {
    if (!portfolioForm.title.trim() || !portfolioForm.description.trim()) {
      toast.error('Please fill in title and description');
      return;
    }

    const newItem: PortfolioItem = {
      id: Math.random().toString(36).substring(7),
      userId: user.id,
      title: portfolioForm.title,
      description: portfolioForm.description,
      link: portfolioForm.link || undefined,
      relatedTools: portfolioForm.relatedTools,
      createdAt: new Date().toISOString(),
    };

    const updated = [...(user.portfolioItems || []), newItem];
    await updateUserContext({ portfolioItems: updated });
    onUpdate({ portfolioItems: updated });
    setPortfolioForm({ title: '', description: '', link: '', relatedTools: [] });
    setShowPortfolioForm(false);
    toast.success('Portfolio item added', '+20 XP');
    trackEvent('portfolio_item_added', { itemId: newItem.id });
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 mb-6">
        {[
          { id: 'overview', label: 'Overview', icon: User },
          { id: 'skills', label: 'Skills & Tools', icon: Briefcase },
          { id: 'portfolio', label: 'Portfolio', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* XP & Level */}
          {user.progression && (
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Level & XP</h3>
                <Badge variant="primary" size="md">
                  Level {levelInfo.level}
                </Badge>
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>{levelInfo.xpInCurrentLevel} / {levelInfo.xpToNext + levelInfo.xpInCurrentLevel} XP</span>
                  <span>{levelInfo.xpToNext} XP to next level</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-700 ease-out"
                    style={{ width: `${levelInfo.progress * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Total XP: <span className="font-bold text-gray-900">{user.profile?.total_xp ?? user.progression?.xp ?? 0}</span>
              </div>
            </div>
          )}

          {/* Profile Completion */}
          {user.progression && (
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Profile Completion</h3>
                <span className="text-2xl font-bold text-blue-600">
                  {user.progression.profileCompletion}%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-700 ease-out"
                  style={{ width: `${user.progression.profileCompletion}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                Complete your profile to unlock paid tasks
              </p>
            </div>
          )}

          {/* Badges */}
          {user.progression && user.progression.badges.length > 0 && (
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award size={20} />
                Badges
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.progression.badges.map((badge) => (
                  <Badge key={badge} variant="info" size="md">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="space-y-6">
          {/* Skills */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {user.skills && user.skills.length > 0 ? (
                user.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="info"
                    size="md"
                    className="flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No skills added yet</p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="Add a skill..."
                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <FollowButton
                onClick={handleAddSkill}
                variant="primary"
                size="sm"
                icon={Plus}
              >
                Add
              </FollowButton>
            </div>
          </div>

          {/* AI Tools */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Zap size={20} />
                AI Tools
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {user.aiTools && user.aiTools.length > 0 ? (
                user.aiTools.map((tool) => (
                  <Badge
                    key={tool}
                    variant="secondary"
                    size="md"
                    className="flex items-center gap-2"
                  >
                    {tool}
                    <button
                      onClick={() => handleRemoveAiTool(tool)}
                      className="hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No AI tools added yet</p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAiTool}
                onChange={(e) => setNewAiTool(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddAiTool()}
                placeholder="Add an AI tool..."
                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <FollowButton
                onClick={handleAddAiTool}
                variant="primary"
                size="sm"
                icon={Plus}
              >
                Add
              </FollowButton>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Portfolio</h3>
            <FollowButton
              onClick={() => setShowPortfolioForm(!showPortfolioForm)}
              variant="primary"
              size="sm"
              icon={showPortfolioForm ? X : Plus}
            >
              {showPortfolioForm ? 'Cancel' : 'Add Item'}
            </FollowButton>
          </div>

          {/* Portfolio Form */}
          {showPortfolioForm && (
            <div className="glass-card rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={portfolioForm.title}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                  placeholder="e.g., AI-Generated Landing Page"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={portfolioForm.description}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
                  placeholder="Describe your work..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link (optional)
                </label>
                <input
                  type="url"
                  value={portfolioForm.link}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, link: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <FollowButton
                onClick={handleAddPortfolioItem}
                variant="primary"
                size="md"
                icon={Plus}
                iconPosition="right"
              >
                Add to Portfolio
              </FollowButton>
            </div>
          )}

          {/* Portfolio Items */}
          <div className="grid gap-4">
            {user.portfolioItems && user.portfolioItems.length > 0 ? (
              user.portfolioItems.map((item) => (
                <div key={item.id} className="glass-card rounded-xl p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-lg font-bold text-gray-900">{item.title}</h4>
                    {item.isVerified && (
                      <Badge variant="success" size="sm">Verified</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{item.description}</p>
                  {item.relatedTools && item.relatedTools.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.relatedTools.map((tool, idx) => (
                        <Badge key={idx} variant="secondary" size="sm">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                    >
                      View project
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              ))
            ) : (
              <div className="glass-card rounded-xl p-12 text-center">
                <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">No portfolio items yet</p>
                <p className="text-sm text-gray-500">Add your best work to showcase your skills</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTabs;

