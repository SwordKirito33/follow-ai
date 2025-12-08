import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: number;
  levelName: string;
  earnings: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 从localStorage加载用户信息
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // 保存用户信息到localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: 替换为真实的API调用
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟用户数据
      const mockUser: User = {
        id: 'user_' + Date.now(),
        name: email.split('@')[0],
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        level: 1,
        levelName: 'Novice',
        earnings: 0,
      };
      
      setUser(mockUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // TODO: 替换为真实的API调用
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟用户数据
      const mockUser: User = {
        id: 'user_' + Date.now(),
        name: name,
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        level: 1,
        levelName: 'Novice',
        earnings: 0,
      };
      
      setUser(mockUser);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
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

