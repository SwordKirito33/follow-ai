import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/toast';
import FollowButton from '@/components/ui/follow-button';
import { HireTask } from '@/types/progression';
import { trackEvent } from '@/lib/analytics';

const HireNew: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<HireTask>>({
    title: '',
    description: '',
    category: '',
    requiredSkills: [],
    requiredAiTools: [],
    minLevel: 2,
    rewardType: 'money',
    budgetMin: undefined,
    budgetMax: undefined,
    xpReward: undefined,
    deadline: undefined,
  });

  const categories = [
    'Prompt engineering',
    'Agent building',
    'Product landing page',
    'Automation',
    'Content creation',
    'Code generation',
  ];

  const handleSubmit = () => {
    // Validate
    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.rewardType === 'money' && (!formData.budgetMin || !formData.budgetMax)) {
      toast.error('Please set budget range for money tasks');
      return;
    }

    if (formData.rewardType === 'xp' && !formData.xpReward) {
      toast.error('Please set XP reward');
      return;
    }

    // Create task (mock for now)
    toast.success('Task created!', 'Your task is now live on the marketplace');
    trackEvent('hire_task_created', { category: formData.category, rewardType: formData.rewardType });
    navigate('/hire');
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <button
          onClick={() => navigate('/hire')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to marketplace</span>
        </button>

        <h1 className="text-4xl font-black text-white mb-2">Post a Hire Task</h1>
        <p className="text-gray-400 mb-8">Find the perfect AI talent for your project</p>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <React.Fragment key={s}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  s <= step
                    ? 'bg-gradient-to-r from-primary-cyan to-primary-blue text-white'
                    : 'bg-white/10 text-gray-400'
                }`}
              >
                {s < step ? <CheckCircle size={20} /> : s}
              </div>
              {s < 5 && (
                <div
                  className={`h-1 flex-1 ${
                    s < step ? 'bg-gradient-to-r from-primary-cyan to-primary-blue' : 'bg-white/10'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Steps */}
        <div className="glass-card rounded-xl p-8">
          {/* Step 1: Basics */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Task Basics</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Build AI-Powered Landing Page"
                  className="w-full px-4 py-3 rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Short Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of what you need..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 2: Scope */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Detailed Scope</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Detailed Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed requirements, deliverables, timeline expectations..."
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Deadline (optional)
                </label>
                <input
                  type="date"
                  value={formData.deadline ? formData.deadline.split('T')[0] : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deadline: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* Step 3: Requirements */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Requirements</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Required Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.requiredSkills?.join(', ') || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      requiredSkills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="e.g., React, TypeScript, AI Tools"
                  className="w-full px-4 py-3 rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Required AI Tools (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.requiredAiTools?.join(', ') || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      requiredAiTools: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="e.g., GPT-4, Midjourney, Cursor"
                  className="w-full px-4 py-3 rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Minimum Level Required
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.minLevel || 2}
                  onChange={(e) =>
                    setFormData({ ...formData, minLevel: Number(e.target.value) })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* Step 4: Rewards */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Rewards</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Reward Type *
                </label>
                <div className="space-y-3">
                  {(['xp', 'money', 'money_and_xp'] as const).map((type) => (
                    <label
                      key={type}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.rewardType === type
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <input
                        type="radio"
                        name="rewardType"
                        value={type}
                        checked={formData.rewardType === type}
                        onChange={() => setFormData({ ...formData, rewardType: type })}
                        className="w-4 h-4 text-primary-cyan"
                      />
                      <div>
                        <div className="font-semibold">
                          {type === 'xp' ? 'XP Only' : type === 'money' ? 'Money Only' : 'Money + XP'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {type === 'xp'
                            ? 'Perfect for learning challenges'
                            : type === 'money'
                            ? 'Paid work opportunity'
                            : 'Best of both worlds'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {formData.rewardType === 'money' || formData.rewardType === 'money_and_xp' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Min Budget ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.budgetMin || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, budgetMin: Number(e.target.value) })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Max Budget ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.budgetMax || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, budgetMax: Number(e.target.value) })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              ) : null}

              {formData.rewardType === 'xp' || formData.rewardType === 'money_and_xp' ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    XP Reward
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.xpReward || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, xpReward: Number(e.target.value) })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              ) : null}
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Review & Publish</h2>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-semibold text-gray-500">Title</span>
                  <p className="text-white font-medium">{formData.title}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-500">Category</span>
                  <p className="text-white font-medium">{formData.category}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-500">Reward</span>
                  <p className="text-white font-medium">
                    {formData.rewardType === 'money' && `$${formData.budgetMin} - $${formData.budgetMax}`}
                    {formData.rewardType === 'xp' && `+${formData.xpReward} XP`}
                    {formData.rewardType === 'money_and_xp' &&
                      `$${formData.budgetMin} - $${formData.budgetMax} + ${formData.xpReward} XP`}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-500">Required Level</span>
                  <p className="text-white font-medium">Level {formData.minLevel}+</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            {step > 1 ? (
              <FollowButton
                onClick={() => setStep(step - 1)}
                variant="secondary"
                size="md"
                icon={ArrowLeft}
              >
                Previous
              </FollowButton>
            ) : (
              <div />
            )}
            {step < 5 ? (
              <FollowButton
                onClick={() => setStep(step + 1)}
                variant="primary"
                size="md"
                icon={CheckCircle}
                iconPosition="right"
              >
                Next
              </FollowButton>
            ) : (
              <FollowButton
                onClick={handleSubmit}
                variant="primary"
                size="md"
                icon={CheckCircle}
                iconPosition="right"
              >
                Publish Task
              </FollowButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HireNew;

