/**
 * User Store - Zustand
 * Manages user profile and account information
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  total_xp: number;
  level: number;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export interface UserStore {
  // State
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: UserProfile | null) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearUser: () => void;
  reset: () => void;
}

const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

export const useUserStore = create<UserStore>()(
  immer((set) => ({
    ...initialState,

    setUser: (user) => {
      set((state) => {
        state.user = user;
        state.error = null;
      });
    },

    updateUser: (updates) => {
      set((state) => {
        if (state.user) {
          state.user = { ...state.user, ...updates };
        }
      });
    },

    setLoading: (loading) => {
      set((state) => {
        state.isLoading = loading;
      });
    },

    setError: (error) => {
      set((state) => {
        state.error = error;
      });
    },

    clearUser: () => {
      set((state) => {
        state.user = null;
        state.error = null;
      });
    },

    reset: () => {
      set(initialState);
    },
  }))
);

export default useUserStore;
