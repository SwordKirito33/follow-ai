/**
 * Notification Store - Zustand
 * Manages in-app notifications and alerts
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface NotificationStore {
  // State
  notifications: Notification[];
  unreadCount: number;

  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => string;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationStore>()(
  immer((set, get) => ({
    notifications: [],
    unreadCount: 0,

    addNotification: (notification) => {
      const id = `notification-${Date.now()}-${Math.random()}`;
      const newNotification: Notification = {
        ...notification,
        id,
        timestamp: Date.now(),
        read: false,
      };

      set((state) => {
        state.notifications.unshift(newNotification);
        state.unreadCount += 1;
      });

      // Auto-remove notification after 5 seconds (for info/success)
      if (notification.type === 'info' || notification.type === 'success') {
        setTimeout(() => {
          get().removeNotification(id);
        }, 5000);
      }

      return id;
    },

    removeNotification: (id) => {
      set((state) => {
        const notification = state.notifications.find((n) => n.id === id);
        if (notification && !notification.read) {
          state.unreadCount -= 1;
        }
        state.notifications = state.notifications.filter((n) => n.id !== id);
      });
    },

    markAsRead: (id) => {
      set((state) => {
        const notification = state.notifications.find((n) => n.id === id);
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount -= 1;
        }
      });
    },

    markAllAsRead: () => {
      set((state) => {
        state.notifications.forEach((n) => {
          n.read = true;
        });
        state.unreadCount = 0;
      });
    },

    clearNotifications: () => {
      set((state) => {
        state.notifications = [];
        state.unreadCount = 0;
      });
    },

    getUnreadCount: () => {
      return get().unreadCount;
    },
  }))
);

export default useNotificationStore;
