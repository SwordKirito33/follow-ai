import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <span className="text-[150px] font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-blue to-primary-purple leading-none">
              404
            </span>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4"
            >
              <span className="text-6xl">🤖</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-white dark:text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-400 dark:text-gray-400 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-white/10 dark:border-gray-700 text-gray-300 dark:text-gray-300 font-semibold rounded-xl hover:bg-white/5 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-blue to-primary-purple text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-white/10 dark:border-gray-700"
        >
          <p className="text-sm text-gray-400 dark:text-gray-300 mb-4">
            Here are some helpful links:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/tasks"
              className="flex items-center gap-2 text-primary-cyan dark:text-blue-400 hover:underline"
            >
              <Search size={16} />
              Browse Tasks
            </Link>
            <Link
              to="/help"
              className="flex items-center gap-2 text-primary-cyan dark:text-blue-400 hover:underline"
            >
              <HelpCircle size={16} />
              Help Center
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
