import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, DollarSign, MessageCircle, Star, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Badge from './ui/Badge';

interface Notification {
  id: string;
  type: 'review_approved' | 'review_rejected' | 'bounty_available' | 'comment_reply' | 'payment_received' | 'achievement';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock notifications - replace with real data from Supabase
  useEffect(() => {
    if (isAuthenticated) {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'review_approved',
          title: 'Review Approved',
          message: 'Your review of Cursor has been approved. You earned $50!',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          read: false,
          actionUrl: '/profile',
        },
        {
          id: '2',
          type: 'comment_reply',
          title: 'New Reply',
          message: 'Alex replied to your comment on "Midjourney Review"',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          read: false,
          actionUrl: '/tool/midjourney',
        },
        {
          id: '3',
          type: 'bounty_available',
          title: 'New Bounty Available',
          message: 'A new $75 bounty is available for Claude 3.5 Sonnet',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
          read: true,
          actionUrl: '/tasks',
        },
      ];
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    }
  }, [isAuthenticated]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'review_approved':
      case 'payment_received':
        return <CheckCircle size={20} className="text-green-600 dark:text-green-400" />;
      case 'review_rejected':
        return <AlertCircle size={20} className="text-red-600 dark:text-red-400" />;
      case 'bounty_available':
        return <DollarSign size={20} className="text-blue-600 dark:text-blue-400" />;
      case 'comment_reply':
        return <MessageCircle size={20} className="text-purple-600 dark:text-purple-400" />;
      case 'achievement':
        return <Star size={20} className="text-amber-600 dark:text-amber-400" />;
      default:
        return <Bell size={20} className="text-gray-600 dark:text-gray-400" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    setUnreadCount(Math.max(0, unreadCount - 1));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-start justify-end p-4 pt-20 pointer-events-none">
      <div className="glass-card rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col pointer-events-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <Badge variant="danger" size="sm">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Bell size={48} className="mx-auto mb-3 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                  }`}
                  onClick={() => {
                    markAsRead(notification.id);
                    if (notification.actionUrl) {
                      window.location.href = `#${notification.actionUrl}`;
                    }
                  }}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;

