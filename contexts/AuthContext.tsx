import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../src/lib/supabase';
import * as authService from '../src/services/authService';
import type { Database } from '../src/types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

// 扩展User接口以兼容现有组件，同时包含Profile数据
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: number;
  levelName: string;
  earnings: number;
  // 添加Profile的完整数据
  profile?: Profile;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// 将Profile转换为User格式（保持向后兼容）
const profileToUser = (profile: Profile | null, email: string): User | null => {
  if (!profile) return null;

  // 计算level和levelName（基于reputation_score）
  let level = 1;
  let levelName = 'Novice';
  if (profile.reputation_score >= 1000) {
    level = 5;
    levelName = 'Expert';
  } else if (profile.reputation_score >= 500) {
    level = 4;
    levelName = 'Advanced';
  } else if (profile.reputation_score >= 200) {
    level = 3;
    levelName = 'Intermediate';
  } else if (profile.reputation_score >= 50) {
    level = 2;
    levelName = 'Beginner';
  }

  return {
    id: profile.id,
    name: profile.full_name || profile.username,
    email: email,
    avatar: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`,
    level: level,
    levelName: levelName,
    earnings: profile.total_earnings || 0,
    profile: profile,
  };
};

// 获取用户Profile
const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - user doesn't have a profile yet
        console.log('No profile found for user:', userId);
        return null;
      }
      console.error('Error fetching profile:', error);
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化 - 检查现有session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // 检查现有session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          console.log('Found existing session for user:', session.user.id);
          
          // 获取用户profile
          const profile = await fetchUserProfile(session.user.id);
          
          if (profile) {
            const userData = profileToUser(profile, session.user.email || '');
            setUser(userData);
            console.log('User initialized:', userData);
          } else {
            console.log('No profile found, user not fully set up');
          }
        } else {
          console.log('No existing session found');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Auth state listener - 监听认证状态变化
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);

        if (event === 'SIGNED_IN' && session?.user) {
          try {
            // 获取用户profile
            const profile = await fetchUserProfile(session.user.id);
            
            if (profile) {
              const userData = profileToUser(profile, session.user.email || '');
              setUser(userData);
              console.log('User signed in:', userData);
            } else {
              console.log('Profile not found after sign in');
            }
          } catch (error) {
            console.error('Error handling SIGNED_IN event:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          console.log('User signed out');
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Token刷新时，确保用户状态是最新的
          try {
            const profile = await fetchUserProfile(session.user.id);
            if (profile) {
              const userData = profileToUser(profile, session.user.email || '');
              setUser(userData);
            }
          } catch (error) {
            console.error('Error refreshing user data:', error);
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 登录函数
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting login for:', email);
      
      const result = await authService.signIn({ email, password });

      if (result.error) {
        // 转换错误消息为用户友好的提示
        let errorMessage = result.error.message;
        
        if (errorMessage.includes('Invalid login credentials') || 
            errorMessage.includes('Email not confirmed')) {
          errorMessage = 'Invalid email or password';
        } else if (errorMessage.includes('Failed to fetch') || 
                   errorMessage.includes('Network')) {
          errorMessage = 'Connection failed. Please try again';
        }
        
        throw new Error(errorMessage);
      }

      if (!result.data) {
        throw new Error('Login failed: No data returned');
      }

      // 获取用户profile
      const profile = await fetchUserProfile(result.data.user.id);
      
      if (profile) {
        const userData = profileToUser(profile, email);
        setUser(userData);
        console.log('Login successful:', userData);
      } else {
        throw new Error('User profile not found');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 注册函数
  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting signup for:', email, name);
      
      // 从name中提取username（使用email前缀或name）
      const username = name.toLowerCase().replace(/\s+/g, '_').substring(0, 20) || 
                      email.split('@')[0].substring(0, 20);
      
      const result = await authService.signUp({
        email,
        password,
        username,
        fullName: name,
      });

      if (result.error) {
        // 转换错误消息为用户友好的提示
        let errorMessage = result.error.message;
        
        if (errorMessage.includes('User already registered') || 
            errorMessage.includes('already exists')) {
          errorMessage = 'This email is already registered';
        } else if (errorMessage.includes('Password')) {
          errorMessage = 'Password must be at least 6 characters';
        } else if (errorMessage.includes('Username')) {
          errorMessage = 'Username already exists or is invalid';
        }
        
        throw new Error(errorMessage);
      }

      if (!result.data || !result.data.profile) {
        throw new Error('Signup failed: Profile not created');
      }

      // Profile已由authService自动创建
      const userData = profileToUser(result.data.profile, email);
      setUser(userData);
      console.log('Signup successful:', userData);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 登出函数
  const logout = async () => {
    setIsLoading(true);
    try {
      console.log('Logging out...');
      
      const result = await authService.signOut();
      
      if (result.error) {
        console.error('Logout error:', result.error);
        // 即使API调用失败，也清除本地状态
      }
      
      setUser(null);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      // 即使出错也清除本地状态
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 更新用户资料
  const updateUser = async (userData: Partial<User>) => {
    if (!user || !user.id) {
      throw new Error('No user logged in');
    }

    setIsLoading(true);
    try {
      console.log('Updating user profile:', userData);
      
      // 构建更新参数
      const updateParams: authService.UpdateProfileParams = {};
      
      if (userData.name) {
        updateParams.fullName = userData.name;
      }
      if (userData.avatar) {
        updateParams.avatarUrl = userData.avatar;
      }
      // bio等字段可以通过profile访问
      
      const result = await authService.updateProfile(user.id, updateParams);

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.data) {
        // 获取最新的用户数据（包括email）
        const { data: { user: authUser } } = await supabase.auth.getUser();
        const updatedUser = profileToUser(result.data, authUser?.email || user.email);
        setUser(updatedUser);
        console.log('User updated:', updatedUser);
      }
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    } finally {
      setIsLoading(false);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

