/**
 * Auth Store - Zustand
 * Manages authentication state and session
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

export interface AuthSession {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  user_id: string;
}

export interface AuthStore {
  // State
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setSession: (session: AuthSession | null) => void;
  updateSession: (updates: Partial<AuthSession>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSession: () => void;
  reset: () => void;
}

const initialState = {
  session: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    immer((set) => ({
      ...initialState,

      setSession: (session) => {
        set((state) => {
          state.session = session;
          state.isAuthenticated = !!session;
          state.error = null;
        });
      },

      updateSession: (updates) => {
        set((state) => {
          if (state.session) {
            state.session = { ...state.session, ...updates };
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

      clearSession: () => {
        set((state) => {
          state.session = null;
          state.isAuthenticated = false;
          state.error = null;
        });
      },

      reset: () => {
        set(initialState);
      },
    })),
    {
      name: 'auth-store',
      version: 1,
      // Only persist session and isAuthenticated
      partialize: (state) => ({
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
