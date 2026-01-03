import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';

import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';
import { getGamificationConfig, getLevelFromXpWithConfig, type XpSource } from '@/lib/gamification';
import { getLevelFromXp } from '@/lib/xp-system';

type Profile = Database['public']['Tables']['profiles']['Row'];

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  level: number;
  levelName: string;
  profile: Profile;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  notifyXpAction: (source: XpSource, gained: number, refType?: string, refId?: string, note?: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// Cache for gamification config
let cachedConfig: any = null;

async function getLevelFromXpLegacy(xp: number) {
  if (!cachedConfig) {
    try {
      cachedConfig = await Promise.race([
        getGamificationConfig(),
        new Promise<any>((_, reject) => 
          setTimeout(() => reject(new Error('Config load timeout')), 3000)
        )
      ]);
    } catch (error) {
      console.warn('[Auth] Failed to load gamification config, using defaults');
      cachedConfig = {
        levels: [
          { level: 1, min_xp: 0, name: 'Novice', badge: '🌱' },
          { level: 2, min_xp: 200, name: 'Beginner', badge: '⭐' },
          { level: 3, min_xp: 500, name: 'Intermediate', badge: '🔥' },
          { level: 4, min_xp: 1000, name: 'Advanced', badge: '💎' },
          { level: 5, min_xp: 2000, name: 'Expert', badge: '👑' }
        ],
        xp_sources: {
          task: { label: 'Task', emoji: '🧠' },
          bonus: { label: 'Bonus', emoji: '🎁' },
          admin: { label: 'Admin', emoji: '🛠️' }
        }
      };
    }
  }
  
  const levels = cachedConfig?.levels || [];
  const levelInfo = getLevelFromXpWithConfig(xp, levels);
  return {
    level: levelInfo.current.level,
    name: levelInfo.current.name,
    badge: levelInfo.current.badge,
  };
}

async function fetchProfile(userId: string, retries = 3): Promise<Profile | null> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const timeoutPromise = new Promise<{ error: Error }>((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 15000)
      );
      
      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      const result = await Promise.race([fetchPromise, timeoutPromise]) as any;
      
      if (result.error) {
        console.error('[Auth] Profile fetch error:', {
          error: result.error.message,
          userId,
          attempt: attempt + 1
        });
        throw result.error;
      }
      
      if (!result.data) {
        console.warn('[Auth] Profile not found for user:', userId);
        return null;
      }
      
      const data = result.data as Profile;
      console.log('[Auth] Profile fetched successfully:', {
        userId,
        total_xp: data.total_xp,
        level: data.level,
        attempt: attempt + 1
      });
      
      return data;
    } catch (error) {
      console.warn(`[Auth] fetchProfile attempt ${attempt + 1}/${retries} failed:`, {
        error: error instanceof Error ? error.message : String(error),
        userId
      });
      
      if (attempt === retries - 1) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  
  throw new Error('fetchProfile: Unexpected end of retry loop');
}

async function mapToUser(profile: Profile, email: string): Promise<User> {
  const totalXp = profile.total_xp ?? 0;
  
  // 🔥 调用统一算法
  const levelInfo = getLevelFromXp(totalXp);

  return {
    id: profile.id,
    email,
    name: profile.full_name || profile.username || email.split('@')[0],
    avatar: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`,
    
    // 使用统一算法返回的值
    level: levelInfo.level,
    levelName: levelInfo.name,
    
    // 将计算好的进度注入 profile
    profile: {
      ...profile,
      level: levelInfo.level,
      xp: levelInfo.xpInCurrentLevel, 
      total_xp: totalXp
    }
  };
}

function emitXpEvent(detail: {
  prevXp: number;
  newXp: number;
  gained: number;
  source?: XpSource;
  refType?: string;
  refId?: string;
}) {
  window.dispatchEvent(
    new CustomEvent('xp:earned', {
      detail: {
        ...detail,
        source: detail.source || 'task',
      }
    })
  );
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const lastXpRef = useRef<number | null>(null);

  useEffect(() => {
    let active = true;

    const init = async () => {
      const timeoutId = setTimeout(() => {
        if (active) {
          console.warn('[Auth] Initialization timeout - continuing with cached state');
          setIsLoading(false);
        }
      }, 10000);

      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!active) {
          clearTimeout(timeoutId);
          return;
        }

        if (!session?.user) {
          setUser(null);
          setIsLoading(false);
          clearTimeout(timeoutId);
          return;
        }

        try {
          const profile = await fetchProfile(session.user.id);
          
          if (!profile) {
            console.log('[Auth] No profile found, user might be new');
            setIsLoading(false);
            clearTimeout(timeoutId);
            return;
          }

          const newXp = profile.total_xp ?? 0;
          const prevXp = lastXpRef.current;
          
          if (prevXp !== null && newXp > prevXp) {
            emitXpEvent({
              prevXp,
              newXp,
              gained: newXp - prevXp,
            });
          }
          
          lastXpRef.current = newXp;
          
          if (active) {
            const userData = await mapToUser(profile, session.user.email ?? '');
            setUser(userData);
          }
        } catch (e) {
          console.error('[Auth] init failed to load profile:', e);
        } finally {
          if (active) {
            setIsLoading(false);
          }
          clearTimeout(timeoutId);
        }
      } catch (e) {
        console.error('[Auth] getSession failed:', e);
        if (active) {
          setUser(null);
          setIsLoading(false);
        }
        clearTimeout(timeoutId);
      }
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return;

      if (!session?.user) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const profile = await fetchProfile(session.user.id);
        
        if (!profile) {
          console.warn('[Auth] No profile found after auth change');
          setIsLoading(false);
          return;
        }

        const newXp = profile.total_xp ?? 0;
        const prevXp = lastXpRef.current;
        
        if (prevXp !== null && newXp > prevXp) {
          emitXpEvent({
            prevXp,
            newXp,
            gained: newXp - prevXp,
          });
        }
        
        lastXpRef.current = newXp;
        
        if (active) {
          const userData = await mapToUser(profile, session.user.email ?? '');
          setUser(userData);
          setIsLoading(false);
        }
      } catch (e) {
        console.error('[Auth] authStateChange failed:', e);
        if (active) {
          setIsLoading(false);
        }
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const userId = user.id;
    const userEmail = user.email;

    console.log('[Auth] Setting up Realtime subscription for user:', userId);

    const channel = supabase
      .channel(`profile_changes_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          console.log('[Auth] Profile updated via Realtime:', payload);
          
          const newProfile = payload.new as Profile;
          const newXp = newProfile.total_xp ?? 0;
          const prevXp = lastXpRef.current;
          
          if (prevXp !== null && newXp > prevXp) {
            emitXpEvent({
              prevXp,
              newXp,
              gained: newXp - prevXp,
            });
          }
          
          lastXpRef.current = newXp;
          
          mapToUser(newProfile, userEmail).then(userData => {
            setUser(prevUser => {
              if (!prevUser || prevUser.id !== userId) {
                return prevUser;
              }
              return userData;
            });
          });
        }
      )
      .subscribe((status) => {
        console.log('[Auth] Realtime subscription status:', status);
      });

    return () => {
      console.log('[Auth] Cleaning up Realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signup = async (email: string, password: string, name: string, username: string) => {
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          username: username.toLowerCase(),
        },
      },
    });

    if (authError) {
      let errorMessage = authError.message;
      if (errorMessage.includes('User already registered')) {
        errorMessage = 'This email is already registered';
      } else if (errorMessage.includes('Password')) {
        errorMessage = 'Password must be at least 6 characters';
      }
      throw new Error(errorMessage);
    }

    if (!data.user) {
      throw new Error('Signup failed: No user data returned');
    }

    try {
      const profileData = {
        id: data.user.id,
        username: username.toLowerCase(),
        full_name: name,
        xp: 0,
        level: 1,
        total_xp: 0,
        profile_completion: 0,
        skills: [],
        ai_tools: [],
        reputation_score: 0,
      };
      
      await (supabase.from('profiles').insert(profileData as any) as any);
    } catch (e) {
      console.error('[Auth] Profile creation exception:', e);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) throw new Error('No user logged in');

    try {
      const updateData: Record<string, any> = {};
      if (userData.name) updateData.full_name = userData.name;
      if (userData.avatar) updateData.avatar_url = userData.avatar;
      if (userData.profile?.bio !== undefined) updateData.bio = userData.profile.bio;

      const profilesTable = supabase.from('profiles') as any;
      const { error } = await profilesTable.update(updateData).eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
    } catch (e) {
      console.error('[Auth] updateUser failed:', e);
      throw e;
    }
  };

  const refreshProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    try {
      const profile = await fetchProfile(session.user.id);
      
      if (!profile) {
        console.warn('[Auth] No profile found during refresh');
        return;
      }

      const newXp = profile.total_xp ?? 0;
      const prevXp = lastXpRef.current;
      
      if (prevXp !== null && newXp > prevXp) {
        emitXpEvent({
          prevXp,
          newXp,
          gained: newXp - prevXp,
        });
      }
      
      lastXpRef.current = newXp;
      
      const userData = await mapToUser(profile, session.user.email ?? '');
      setUser(userData);
    } catch (e) {
      console.error('[Auth] refreshProfile failed:', e);
    }
  };

  const notifyXpAction = (source: XpSource, gained: number, refType?: string, refId?: string, note?: string) => {
    const currentXp = lastXpRef.current ?? 0;
    const newXp = currentXp + gained;
    
    emitXpEvent({
      prevXp: currentXp,
      newXp,
      gained,
      source,
      refType,
      refId,
    });
    
    lastXpRef.current = newXp;
    
    refreshProfile();
  };

  const logout = async () => {
    try {
      // 1. 先清空状态
      setUser(null);
      
      // 2. 清理 localStorage 中的 token
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes('supabase') || key.includes('auth-token')) {
          localStorage.removeItem(key);
        }
      });
      
      // 3. Supabase 登出
      await supabase.auth.signOut();
      
      // 4. 强制刷新并跳回首页
      window.location.href = '/'; 
    } catch (e) {
      console.error('Logout failed:', e);
      // 如果失败，强制刷新页面
      window.location.reload();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateUser,
        refreshProfile,
        notifyXpAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
