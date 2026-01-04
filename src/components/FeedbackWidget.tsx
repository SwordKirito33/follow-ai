import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Bug,
  Lightbulb,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Send,
  Camera,
  Check,
} from 'lucide-react';

type FeedbackType = 'bug' | 'feature' | 'question' | 'other';

interface FeedbackWidgetProps {
  onSubmit: (feedback: {
    type: FeedbackType;
    message: string;
    rating?: number;
    screenshot?: string;
    email?: string;
  }) => Promise<void>;
  className?: string;
}

const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  onSubmit,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'type' | 'form' | 'success'>('type');
  const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTypes = [
    {
      type: 'bug' as FeedbackType,
      icon: <Bug className="w-6 h-6" />,
      label: 'Report a Bug',
      description: 'Something is broken or not working',
      color: 'bg-red-100 dark:bg-red-900/30 text-red-600',
    },
    {
      type: 'feature' as FeedbackType,
      icon: <Lightbulb className="w-6 h-6" />,
      label: 'Feature Request',
      description: 'Suggest a new feature or improvement',
      color: 'bg-accent-gold/20 dark:bg-yellow-900/30 text-accent-gold',
    },
    {
      type: 'question' as FeedbackType,
      icon: <HelpCircle className="w-6 h-6" />,
      label: 'Ask a Question',
      description: 'Need help with something',
      color: 'bg-primary-blue/20 dark:bg-blue-900/30 text-primary-cyan',
    },
    {
      type: 'other' as FeedbackType,
      icon: <MessageSquare className="w-6 h-6" />,
      label: 'General Feedback',
      description: 'Share your thoughts with us',
      color: 'bg-primary-purple/20 dark:bg-purple-900/30 text-primary-purple',
    },
  ];

  const handleTypeSelect = (type: FeedbackType) => {
    setFeedbackType(type);
    setStep('form');
  };

  const handleScreenshot = async () => {
    try {
      // Using html2canvas would be ideal here
      // For now, we'll just note that screenshot was requested
      setScreenshot('screenshot-placeholder');
    } catch (error) {
      console.error('Screenshot failed:', error);
    }
  };

  const handleSubmit = async () => {
    if (!feedbackType || !message.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        type: feedbackType,
        message: message.trim(),
        rating: rating ?? undefined,
        screenshot: screenshot ?? undefined,
        email: email.trim() || undefined,
      });
      setStep('success');
    } catch (error) {
      console.error('Feedback submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset after animation
    setTimeout(() => {
      setStep('type');
      setFeedbackType(null);
      setMessage('');
      setRating(null);
      setEmail('');
      setScreenshot(null);
    }, 300);
  };

  return (
    <>
      {/* Trigger button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-full shadow-lg hover:shadow-xl transition-shadow ${className}`}
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Widget */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="relative w-full max-w-md bg-gray-900/90 backdrop-blur-sm rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-blue to-primary-purple p-4 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    {step === 'type' && 'Send Feedback'}
                    {step === 'form' && feedbackTypes.find((t) => t.type === feedbackType)?.label}
                    {step === 'success' && 'Thank You!'}
                  </h2>
                  <button
                    onClick={handleClose}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {/* Step 1: Select type */}
                  {step === 'type' && (
                    <motion.div
                      key="type"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-3"
                    >
                      <p className="text-gray-400 dark:text-gray-400 mb-4">
                        What would you like to share with us?
                      </p>
                      {feedbackTypes.map((type) => (
                        <button
                          key={type.type}
                          onClick={() => handleTypeSelect(type.type)}
                          className="w-full p-4 rounded-xl border-2 border-white/10 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors flex items-center gap-4 text-left"
                        >
                          <div className={`p-3 rounded-xl ${type.color}`}>
                            {type.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-white dark:text-white">
                              {type.label}
                            </p>
                            <p className="text-sm text-gray-400 dark:text-gray-300">
                              {type.description}
                            </p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}

                  {/* Step 2: Form */}
                  {step === 'form' && (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      {/* Rating (for general feedback) */}
                      {feedbackType === 'other' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                            How's your experience?
                          </label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setRating(1)}
                              className={`flex-1 p-3 rounded-xl border-2 transition-colors flex items-center justify-center gap-2 ${
                                rating === 1
                                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600'
                                  : 'border-white/10 dark:border-gray-700 hover:border-red-300'
                              }`}
                            >
                              <ThumbsDown className="w-5 h-5" />
                              Bad
                            </button>
                            <button
                              onClick={() => setRating(5)}
                              className={`flex-1 p-3 rounded-xl border-2 transition-colors flex items-center justify-center gap-2 ${
                                rating === 5
                                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-accent-green'
                                  : 'border-white/10 dark:border-gray-700 hover:border-green-300'
                              }`}
                            >
                              <ThumbsUp className="w-5 h-5" />
                              Good
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                          {feedbackType === 'bug'
                            ? 'Describe the bug'
                            : feedbackType === 'feature'
                            ? 'Describe your idea'
                            : feedbackType === 'question'
                            ? 'Your question'
                            : 'Your feedback'}
                        </label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder={
                            feedbackType === 'bug'
                              ? 'What happened? What did you expect to happen?'
                              : feedbackType === 'feature'
                              ? 'What feature would you like to see?'
                              : 'Type your message here...'
                          }
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl border-2 border-white/10 dark:border-gray-700 bg-gray-800/90 backdrop-blur-sm text-white dark:text-white focus:border-blue-500 focus:outline-none resize-none"
                        />
                      </div>

                      {/* Screenshot button (for bugs) */}
                      {feedbackType === 'bug' && (
                        <button
                          onClick={handleScreenshot}
                          className={`w-full p-3 rounded-xl border-2 transition-colors flex items-center justify-center gap-2 ${
                            screenshot
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-accent-green'
                              : 'border-white/10 dark:border-gray-700 hover:border-blue-300 text-gray-400 dark:text-gray-400'
                          }`}
                        >
                          {screenshot ? (
                            <>
                              <Check className="w-5 h-5" />
                              Screenshot attached
                            </>
                          ) : (
                            <>
                              <Camera className="w-5 h-5" />
                              Attach screenshot
                            </>
                          )}
                        </button>
                      )}

                      {/* Email (optional) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                          Email (optional)
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 rounded-xl border-2 border-white/10 dark:border-gray-700 bg-gray-800/90 backdrop-blur-sm text-white dark:text-white focus:border-blue-500 focus:outline-none"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          We'll only use this to follow up on your feedback
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => setStep('type')}
                          className="px-4 py-3 text-gray-400 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-gray-800 rounded-xl font-medium transition-colors"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={!message.trim() || isSubmitting}
                          className="flex-1 py-3 bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Send Feedback
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Success */}
                  {step === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="w-20 h-20 mx-auto mb-4 bg-accent-green/20 dark:bg-green-900/30 rounded-full flex items-center justify-center"
                      >
                        <Check className="w-10 h-10 text-accent-green" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-white dark:text-white mb-2">
                        Feedback Sent!
                      </h3>
                      <p className="text-gray-400 dark:text-gray-400 mb-6">
                        Thank you for helping us improve Follow-ai. We really appreciate it!
                      </p>
                      <button
                        onClick={handleClose}
                        className="px-8 py-3 bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-xl font-medium hover:shadow-lg transition-all"
                      >
                        Done
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackWidget;
