import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, CheckCheck, Settings, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'xp' | 'level' | 'follow' | 'task';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  icon?: React.ReactNode;
}

interface RealtimeNotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onNotificationClick?: (notification: Notification) => void;
}

const RealtimeNotifications: React.FC<RealtimeNotificationsProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
  onNotificationClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const getTypeStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-accent-green/20 dark:bg-green-900/30 text-accent-green';
      case 'warning':
        return 'bg-accent-gold/20 dark:bg-yellow-900/30 text-accent-gold';
      case 'error':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600';
      case 'xp':
        return 'bg-primary-purple/20 dark:bg-purple-900/30 text-primary-purple';
      case 'level':
        return 'bg-primary-blue/20 dark:bg-blue-900/30 text-primary-cyan';
      case 'follow':
        return 'bg-pink-100 dark:bg-pink-900/30 text-pink-600';
      case 'task':
        return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600';
      default:
        return 'bg-white/10 dark:bg-gray-800 text-gray-400';
    }
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✕';
      case 'xp':
        return '⚡';
      case 'level':
        return '🎖';
      case 'follow':
        return '👤';
      case 'task':
        return '📋';
      default:
        return 'ℹ';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-white/10 dark:hover:bg-gray-800 rounded-xl transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-400 dark:text-gray-400" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-96 max-h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-white/10 dark:border-gray-700 overflow-hidden z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 dark:border-gray-700">
                <h3 className="font-bold text-white dark:text-white">
                  Notifications
                </h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllAsRead}
                      className="p-2 hover:bg-white/10 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-gray-300"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={onClearAll}
                      className="p-2 hover:bg-white/10 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-red-500"
                      title="Clear all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Notifications list */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`
                        p-4 border-b border-white/10 dark:border-gray-800 cursor-pointer
                        hover:bg-white/5 dark:hover:bg-gray-800/50 transition-colors
                        ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}
                      `}
                      onClick={() => {
                        onMarkAsRead(notification.id);
                        onNotificationClick?.(notification);
                      }}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div
                          className={`
                            w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                            ${getTypeStyles(notification.type)}
                          `}
                        >
                          {notification.icon || getTypeIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-white dark:text-white text-sm">
                              {notification.title}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(notification.id);
                              }}
                              className="p-1 hover:bg-white/10 dark:hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3 text-gray-400" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-400 dark:text-gray-400 mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">
                              {formatTime(notification.timestamp)}
                            </span>
                            {notification.actionUrl && (
                              <a
                                href={notification.actionUrl}
                                className="text-xs text-primary-cyan hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {notification.actionLabel || 'View'}
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Unread indicator */}
                        {!notification.read && (
                          <div className="w-2 h-2 bg-gradient-to-r from-primary-cyan to-primary-blue rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-white/10 dark:border-gray-700 bg-white/5 dark:bg-gray-800/50">
                  <button className="w-full py-2 text-sm text-primary-cyan hover:text-primary-blue font-medium">
                    View All Notifications
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Toast notification for real-time updates
export const NotificationToast: React.FC<{
  notification: Notification;
  onClose: () => void;
  duration?: number;
}> = ({ notification, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className="fixed top-4 right-4 z-[9999] max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-white/10 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-4 flex gap-3">
        <div className="flex-1">
          <p className="font-semibold text-white dark:text-white text-sm">
            {notification.title}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-400 mt-0.5">
            {notification.message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 dark:hover:bg-gray-800 rounded"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        className="h-1 bg-gradient-to-r from-primary-cyan to-primary-blue"
      />
    </motion.div>
  );
};

export default RealtimeNotifications;
