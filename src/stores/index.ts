/**
 * Zustand Stores
 * Central export for all state management stores
 */

export { useUserStore, type UserProfile, type UserStore } from './userStore';
export { useAuthStore, type AuthSession, type AuthStore } from './authStore';
export { useNotificationStore, type Notification, type NotificationStore } from './notificationStore';
export { usePreferencesStore, type UserPreferences, type PreferencesStore } from './preferencesStore';

// Combined hook for accessing all stores
import { useUserStore } from './userStore';
import { useAuthStore } from './authStore';
import { useNotificationStore } from './notificationStore';
import { usePreferencesStore } from './preferencesStore';

export function useStores() {
  return {
    user: useUserStore(),
    auth: useAuthStore(),
    notifications: useNotificationStore(),
    preferences: usePreferencesStore(),
  };
}
