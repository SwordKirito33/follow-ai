import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Inbox, 
  ShoppingBag, 
  Users, 
  Bell,
  Wallet,
  Trophy,
  Zap
} from 'lucide-react';

type EmptyStateVariant = 
  | 'default'
  | 'search'
  | 'inbox'
  | 'cart'
  | 'users'
  | 'notifications'
  | 'wallet'
  | 'leaderboard'
  | 'tasks';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const defaultContent: Record<EmptyStateVariant, { icon: ReactNode; title: string; description: string }> = {
  default: {
    icon: <FileText className="w-12 h-12" />,
    title: 'No data found',
    description: 'There\'s nothing here yet.',
  },
  search: {
    icon: <Search className="w-12 h-12" />,
    title: 'No results found',
    description: 'Try adjusting your search or filters to find what you\'re looking for.',
  },
  inbox: {
    icon: <Inbox className="w-12 h-12" />,
    title: 'Your inbox is empty',
    description: 'Messages and notifications will appear here.',
  },
  cart: {
    icon: <ShoppingBag className="w-12 h-12" />,
    title: 'Your cart is empty',
    description: 'Add items to your cart to see them here.',
  },
  users: {
    icon: <Users className="w-12 h-12" />,
    title: 'No users found',
    description: 'There are no users matching your criteria.',
  },
  notifications: {
    icon: <Bell className="w-12 h-12" />,
    title: 'No notifications',
    description: 'You\'re all caught up! Check back later for updates.',
  },
  wallet: {
    icon: <Wallet className="w-12 h-12" />,
    title: 'No transactions yet',
    description: 'Your transaction history will appear here.',
  },
  leaderboard: {
    icon: <Trophy className="w-12 h-12" />,
    title: 'No rankings yet',
    description: 'Complete tasks to appear on the leaderboard.',
  },
  tasks: {
    icon: <Zap className="w-12 h-12" />,
    title: 'No tasks available',
    description: 'Check back later for new tasks to complete.',
  },
};

const EmptyState: React.FC<EmptyStateProps> = ({
  variant = 'default',
  title,
  description,
  icon,
  action,
  className = '',
}) => {
  const content = defaultContent[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-24 h-24 bg-white/10 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 text-gray-400 dark:text-gray-500"
      >
        {icon || content.icon}
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-bold text-white dark:text-white mb-2"
      >
        {title || content.title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-500 dark:text-gray-400 max-w-sm mb-6"
      >
        {description || content.description}
      </motion.p>

      {action && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={action.onClick}
          className="px-6 py-3 bg-gradient-to-r from-primary-cyan to-primary-blue text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;
