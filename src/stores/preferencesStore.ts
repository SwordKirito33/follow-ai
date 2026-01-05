/**
 * Preferences Store - Zustand
 * Manages user preferences and settings
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  privacy: {
    profilePublic: boolean;
    showXp: boolean;
    showLevel: boolean;
  };
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'normal' | 'large';
  };
  [key: string]: any;
}

export interface PreferencesStore {
  // State
  preferences: UserPreferences;

  // Actions
  setPreference: (key: keyof UserPreferences, value: any) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  getPreference: (key: keyof UserPreferences) => any;
}

const defaultPreferences: UserPreferences = {
  theme: 'dark',
  language: 'en',
  notifications: {
    email: true,
    push: true,
    inApp: true,
  },
  privacy: {
    profilePublic: true,
    showXp: true,
    showLevel: true,
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    fontSize: 'normal',
  },
};

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    immer((set, get) => ({
      preferences: defaultPreferences,

      setPreference: (key, value) => {
        set((state) => {
          state.preferences[key] = value;
        });
      },

      updatePreferences: (updates) => {
        set((state) => {
          state.preferences = { ...state.preferences, ...updates };
        });
      },

      resetPreferences: () => {
        set((state) => {
          state.preferences = defaultPreferences;
        });
      },

      getPreference: (key) => {
        return get().preferences[key];
      },
    })),
    {
      name: 'preferences-store',
      version: 1,
    }
  )
);

export default usePreferencesStore;
