import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  ArrowLeft,
  Clock,
  Zap,
  Users,
  Star,
  ExternalLink,
  Share2,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface TaskDetail {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  toolName: string;
  toolLogo: string;
  toolUrl: string;
  xpReward: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  completions: number;
  rating: number;
  requirements: string[];
  steps: {
    title: string;
    description: string;
  }[];
  tips: string[];
  warnings: string[];
  relatedTasks: {
    id: string;
    title: string;
    xpReward: number;
  }[];
}

interface TaskDetailPageProps {
  task: TaskDetail;
  isBookmarked: boolean;
  hasCompleted: boolean;
  onBack: () => void;
  onStartTask: () => void;
  onBookmark: () => void;
  onShare: () => void;
}

const TaskDetailPage: React.FC<TaskDetailPageProps> = ({
  task,
  isBookmarked,
  hasCompleted,
  onBack,
  onStartTask,
  onBookmark,
  onShare,
}) => {
  const { t } = useLanguage();
  const [expandedSection, setExpandedSection] = useState<string | null>('steps');

  const difficultyColors = {
    beginner: 'bg-accent-green/20 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-accent-gold/20 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gray-800/5 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-blue to-primary-purple text-white">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Tasks
          </button>

          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Tool logo */}
            <div className="w-20 h-20 bg-slate-800/50 rounded-2xl p-3 flex-shrink-0">
              <img
                src={task.toolLogo}
                alt={task.toolName}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Task info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{task.title}</h1>
                  <p className="text-blue-100 mt-1">{task.toolName}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={onBookmark}
                    className="p-2 bg-gray-800/20 hover:bg-gray-800/30 rounded-lg transition-colors"
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-5 h-5" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={onShare}
                    className="p-2 bg-gray-800/20 hover:bg-gray-800/30 rounded-lg transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">{task.xpReward} XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-200" />
                  <span>{task.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-200" />
                  <span>{task.completions.toLocaleString()} completions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span>{task.rating.toFixed(1)}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[task.difficulty]}`}>
                  {task.difficulty.charAt(0).toUpperCase() + task.difficulty.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-white dark:text-white mb-4">
                About This Task
              </h2>
              <p className="text-gray-400 dark:text-gray-400 leading-relaxed">
                {task.longDescription}
              </p>
              <a
                href={task.toolUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-primary-cyan hover:text-primary-blue font-medium"
              >
                Visit {task.toolName}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Requirements */}
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
              <button
                onClick={() => toggleSection('requirements')}
                className="w-full p-6 flex items-center justify-between text-left"
              >
                <h2 className="text-xl font-bold text-white dark:text-white">
                  Requirements
                </h2>
                {expandedSection === 'requirements' ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {expandedSection === 'requirements' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="px-6 pb-6"
                >
                  <ul className="space-y-3">
                    {task.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-400 dark:text-gray-400">{req}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>

            {/* Steps */}
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
              <button
                onClick={() => toggleSection('steps')}
                className="w-full p-6 flex items-center justify-between text-left"
              >
                <h2 className="text-xl font-bold text-white dark:text-white">
                  Steps to Complete
                </h2>
                {expandedSection === 'steps' ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {expandedSection === 'steps' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="px-6 pb-6"
                >
                  <div className="space-y-4">
                    {task.steps.map((step, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-8 h-8 bg-primary-blue/20 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 text-primary-cyan font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white dark:text-white">
                            {step.title}
                          </h4>
                          <p className="text-gray-400 dark:text-gray-400 mt-1">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Tips */}
            {task.tips.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
                <h3 className="font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5" />
                  Pro Tips
                </h3>
                <ul className="space-y-2">
                  {task.tips.map((tip, index) => (
                    <li key={index} className="text-blue-800 dark:text-blue-200 flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings */}
            {task.warnings.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6">
                <h3 className="font-bold text-yellow-900 dark:text-yellow-100 flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5" />
                  Important Notes
                </h3>
                <ul className="space-y-2">
                  {task.warnings.map((warning, index) => (
                    <li key={index} className="text-yellow-800 dark:text-yellow-200 flex items-start gap-2">
                      <span className="text-yellow-500">•</span>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Start task card */}
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg sticky top-6">
              {hasCompleted ? (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-accent-green/20 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-accent-green" />
                  </div>
                  <h3 className="text-xl font-bold text-white dark:text-white mb-2">
                    Task Completed!
                  </h3>
                  <p className="text-gray-400 dark:text-gray-400 mb-4">
                    You've already earned {task.xpReward} XP from this task.
                  </p>
                  <button className="w-full py-3 border-2 border-white/20 dark:border-gray-600 text-gray-300 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-800/5 dark:hover:bg-gray-800 transition-colors">
                    View Submission
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-primary-cyan mb-1">
                      {task.xpReward} XP
                    </div>
                    <p className="text-gray-400">Reward for completion</p>
                  </div>
                  <button
                    onClick={onStartTask}
                    className="w-full py-4 bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all"
                  >
                    Start Task
                  </button>
                  <p className="text-center text-sm text-gray-400 mt-3">
                    Estimated time: {task.estimatedTime}
                  </p>
                </>
              )}
            </div>

            {/* Related tasks */}
            {task.relatedTasks.length > 0 && (
              <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="font-bold text-white dark:text-white mb-4">
                  Related Tasks
                </h3>
                <div className="space-y-3">
                  {task.relatedTasks.map((related) => (
                    <button
                      key={related.id}
                      className="w-full p-3 bg-gray-800/5 dark:bg-gray-800 rounded-xl text-left hover:bg-gray-800/10 dark:hover:bg-gray-700 transition-colors"
                    >
                      <p className="font-medium text-white dark:text-white line-clamp-1">
                        {related.title}
                      </p>
                      <p className="text-sm text-primary-cyan mt-1">
                        +{related.xpReward} XP
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
