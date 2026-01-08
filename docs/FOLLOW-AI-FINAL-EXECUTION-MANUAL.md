# Follow.ai 最终执行手册（融合版）

**版本**: 2.0  
**日期**: 2026年1月8日  
**来源**: Manus + Claude 方案融合  
**执行模式**: 逐步递增，每步可验证

---

## 📋 目录

1. [执行概览](#一执行概览)
2. [Phase 0: 基础设施准备](#二phase-0-基础设施准备)
3. [Phase 1: P0 Bug 修复](#三phase-1-p0-bug-修复)
4. [Phase 2: 监控体系](#四phase-2-监控体系)
5. [Phase 3: 性能优化](#五phase-3-性能优化)
6. [Phase 4: Admin + AI Review](#六phase-4-admin--ai-review)
7. [Phase 5: 游戏化系统](#七phase-5-游戏化系统)
8. [Phase 6: SEO + 可访问性](#八phase-6-seo--可访问性)
9. [Phase 7: 测试完善](#九phase-7-测试完善)
10. [验证清单](#十验证清单)
11. [附录](#十一附录)

---

## 一、执行概览

### 1.1 修复逻辑依赖图

```
Phase 0: 基础设施准备 (必须最先)
    │
    ├── Git 分支策略
    ├── 依赖安装
    └── TypeScript 配置
    │
    ↓
Phase 1: P0 Bug 修复 (阻塞性问题)
    │
    ├── 登出流程 (含 React Query 清理)
    ├── 通知面板 (useOptimistic)
    └── 表单验证 (Zod + RHF)
    │
    ↓
Phase 2: 监控体系 (可观测性基础)
    │
    ├── Sentry 错误监控
    ├── PostHog 产品分析
    └── Web Vitals 性能监控
    │
    ↓
Phase 3: 性能优化 (用户体验提升)
    │
    ├── 代码分割
    ├── 路由懒加载
    └── 图片优化
    │
    ↓
Phase 4: Admin + AI Review (运营能力)
    │
    ├── 管理员角色系统
    ├── Admin Dashboard
    └── AI Review Edge Function
    │
    ↓
Phase 5: 游戏化系统 (增长引擎)
    │
    ├── Success Score (GENERATED ALWAYS)
    ├── 等级系统 (触发器自动升级)
    └── 徽章系统 (完整实现)
    │
    ↓
Phase 6: SEO + 可访问性 (合规要求)
    │
    ├── 结构化数据 (Schema.org)
    ├── WCAG 2.2 合规
    └── 可访问性工具库
    │
    ↓
Phase 7: 测试完善 (质量保证)
    │
    ├── E2E 测试 (80%+)
    ├── 单元测试 (70%+)
    └── CI/CD 配置
```

### 1.2 时间和工时估算

| Phase | 时间 | 工时 | 核心任务 |
|-------|------|------|----------|
| Phase 0 | 1天 | 4h | 基础设施准备 |
| Phase 1 | 3天 | 24h | P0 Bug 修复 |
| Phase 2 | 2天 | 16h | 监控体系 |
| Phase 3 | 2天 | 16h | 性能优化 |
| Phase 4 | 4天 | 32h | Admin + AI Review |
| Phase 5 | 3天 | 24h | 游戏化系统 |
| Phase 6 | 3天 | 24h | SEO + 可访问性 |
| Phase 7 | 2天 | 16h | 测试完善 |
| **总计** | **20天** | **156h** | |

### 1.3 预期成果

| 指标 | 当前 | 目标 | 提升 |
|------|------|------|------|
| 综合评分 | 6.3/10 | 8.7/10 | +2.4 |
| E2E 测试通过率 | 53.1% | 90%+ | +37% |
| 单元测试覆盖 | 0% | 70%+ | +70% |
| Lighthouse Performance | ~70 | 95+ | +25 |
| 首屏加载时间 | ~3s | <1.5s | -50% |
| Bundle 大小 | ~500KB | <250KB | -50% |

---

## 二、Phase 0: 基础设施准备

> **来源**: Claude 方案  
> **时间**: 1天  
> **目标**: 建立专业的开发环境和分支策略

### 2.1 创建开发分支

```bash
# 1. 克隆仓库
git clone https://github.com/SwordKirito33/follow-ai.git
cd follow-ai

# 2. 创建主功能分支
git checkout -b feat/comprehensive-fixes

# 3. 创建子分支（按 Phase 划分）
git checkout -b feat/phase0-infrastructure
```

### 2.2 安装必要依赖

```bash
# 核心依赖
pnpm add @sentry/react posthog-js zod react-hook-form @hookform/resolvers
pnpm add react-helmet-async framer-motion

# 开发依赖
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
pnpm add -D vite-plugin-compression rollup-plugin-visualizer
pnpm add -D sharp vite-plugin-image-optimizer
pnpm add -D @playwright/test
```

### 2.3 更新 package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "pnpm test:run && pnpm test:e2e",
    "analyze": "vite build && npx vite-bundle-visualizer"
  }
}
```

### 2.4 TypeScript 配置优化

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 2.5 环境变量配置

创建 `.env.local`:

```bash
# Supabase
VITE_SUPABASE_URL=https://nbvnnhojvkxfnididast.supabase.co
VITE_SUPABASE_ANON_KEY=你的anon_key

# 监控
VITE_SENTRY_DSN=待配置
VITE_POSTHOG_KEY=待配置
VITE_POSTHOG_HOST=https://app.posthog.com

# 应用
VITE_APP_VERSION=1.0.0
VITE_APP_URL=https://follow.ai

# 测试
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=testpassword123
PLAYWRIGHT_TEST_BASE_URL=https://follow.ai
```

### 2.6 验证步骤

```bash
# 1. 验证依赖安装
pnpm install
pnpm type-check

# 2. 验证开发服务器
pnpm dev
# 访问 http://localhost:5173 确认正常运行

# 3. 验证构建
pnpm build
# 确认无错误

# 4. 提交 Phase 0
git add -A
git commit -m "chore: Phase 0 - Infrastructure setup"
git push origin feat/phase0-infrastructure
```

---

## 三、Phase 1: P0 Bug 修复

> **来源**: Claude 方案（代码更完整）  
> **时间**: 3天  
> **目标**: 修复所有阻塞性问题

### 3.1 登出流程修复

**问题诊断**:
- localStorage 残留
- Supabase session 未完全清理
- React Query 缓存污染
- 实时订阅未清理

#### Step 3.1.1: 创建 React Query 客户端

```typescript
// src/lib/react-query.ts (新建)
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5分钟
      gcTime: 1000 * 60 * 30, // 30分钟
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

#### Step 3.1.2: 创建统一登出工具函数

```typescript
// src/lib/auth-utils.ts (新建)
import { supabase } from './supabase';
import { queryClient } from './react-query';

/**
 * 完整登出流程
 * 清理所有会话、存储和缓存
 */
export async function performSignOut(): Promise<void> {
  try {
    // 1. Supabase 登出
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Supabase signOut error:', error);
      // 继续执行清理，即使 Supabase 调用失败
    }

    // 2. 清理所有存储
    localStorage.clear();
    sessionStorage.clear();

    // 3. 清理 React Query 缓存
    queryClient.clear();

    // 4. 清理 Supabase 实时订阅
    await supabase.removeAllChannels();

    // 5. 清理 IndexedDB（如果使用）
    if ('indexedDB' in window) {
      const databases = await indexedDB.databases();
      databases.forEach(db => {
        if (db.name) indexedDB.deleteDatabase(db.name);
      });
    }

    console.log('Sign out completed successfully');
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

/**
 * 检查用户是否已认证
 */
export async function checkAuthStatus(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}
```

#### Step 3.1.3: 更新 AuthContext

```typescript
// src/contexts/AuthContext.tsx (修改)
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { performSignOut } from '@/lib/auth-utils';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  xp: number;
  level: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // 获取用户资料
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  }, []);

  // 刷新用户资料
  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  // 初始化认证状态
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // 登录
  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // 注册
  const signUp = useCallback(async (email: string, password: string, username: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });
      if (error) throw error;
      
      // 创建用户资料
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          username,
          xp: 0,
          level: 1,
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // 登出 - 使用完整清理流程
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await performSignOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      // 强制重定向到首页
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out failed:', error);
      // 即使失败也清理本地状态
      setUser(null);
      setSession(null);
      setProfile(null);
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

#### Step 3.1.4: 添加登出按钮 data-testid

```tsx
// src/components/Navbar.tsx (修改相关部分)
// 桌面端登出按钮
<button
  onClick={handleSignOut}
  data-testid="logout-button"
  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
>
  <LogOut className="w-4 h-4" />
  <span>登出</span>
</button>

// 移动端登出按钮
<button
  onClick={handleSignOut}
  data-testid="logout-button-mobile"
  className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
>
  <LogOut className="w-4 h-4" />
  <span>登出</span>
</button>
```

#### Step 3.1.5: 验证登出流程

```bash
# 手动测试
1. 登录账户
2. 打开开发者工具 > Application > Local Storage
3. 点击登出按钮
4. 检查 Local Storage (应该为空)
5. 检查 Network 标签 (Supabase auth 请求成功)
6. 确认重定向到首页
7. 尝试访问 /dashboard (应该重定向到首页)

# E2E 测试
npx playwright test tests/e2e/auth.spec.ts -g "logout"
```

---

### 3.2 通知面板修复

**问题诊断**:
- State 竞态条件
- 缺少乐观更新
- 面板打开/关闭状态管理混乱

#### Step 3.2.1: 重构通知中心组件

```typescript
// src/components/NotificationCenter.tsx (重构)
import { useState, useEffect, useTransition, useOptimistic, useCallback, useRef } from 'react';
import { Bell, Check, X, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

export function NotificationCenter() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const panelRef = useRef<HTMLDivElement>(null);

  // 乐观更新
  const [optimisticNotifications, setOptimisticNotifications] = useOptimistic(
    notifications,
    (state, action: { type: 'markRead' | 'delete'; id: string }) => {
      switch (action.type) {
        case 'markRead':
          return state.map(n => n.id === action.id ? { ...n, read: true } : n);
        case 'delete':
          return state.filter(n => n.id !== action.id);
        default:
          return state;
      }
    }
  );

  // 获取通知
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 初始化和实时订阅
  useEffect(() => {
    fetchNotifications();

    if (!user) return;

    // 实时订阅新通知
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications(prev => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchNotifications]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // 标记为已读
  const markAsRead = async (id: string) => {
    startTransition(() => {
      setOptimisticNotifications({ type: 'markRead', id });
    });

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (error) {
      console.error('Mark as read failed:', error);
      // 回滚：重新获取数据
      fetchNotifications();
    } else {
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    }
  };

  // 删除通知
  const deleteNotification = async (id: string) => {
    startTransition(() => {
      setOptimisticNotifications({ type: 'delete', id });
    });

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete notification failed:', error);
      fetchNotifications();
    } else {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  // 全部标记为已读
  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    
    startTransition(() => {
      unreadIds.forEach(id => {
        setOptimisticNotifications({ type: 'markRead', id });
      });
    });

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user?.id)
      .eq('read', false);

    if (error) {
      console.error('Mark all as read failed:', error);
      fetchNotifications();
    } else {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const unreadCount = optimisticNotifications.filter(n => !n.read).length;

  const getTypeStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* 通知按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        data-testid="notifications-button"
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="通知中心"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* 通知面板 */}
      {isOpen && (
        <div
          data-testid="notifications-panel"
          className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
          role="dialog"
          aria-label="通知列表"
        >
          {/* 头部 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">通知</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={isPending}
                  className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  全部已读
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
                aria-label="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 通知列表 */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
              </div>
            ) : optimisticNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">暂无通知</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {optimisticNotifications.map(notification => (
                  <li
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                        notification.read ? 'bg-gray-300' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-gray-900 truncate">
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                disabled={isPending}
                                className="p-1 text-gray-400 hover:text-green-600"
                                title="标记已读"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              disabled={isPending}
                              className="p-1 text-gray-400 hover:text-red-600"
                              title="删除"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDistanceToNow(new Date(notification.created_at), {
                            addSuffix: true,
                            locale: zhCN,
                          })}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

#### Step 3.2.2: 验证通知面板

```bash
# 手动测试
1. 点击通知按钮 → 面板应打开
2. 点击面板外部 → 面板应关闭
3. 点击"标记已读" → 应立即更新 UI（乐观更新）
4. 点击"删除" → 应立即从列表移除
5. 点击"全部已读" → 所有通知应标记为已读

# E2E 测试
npx playwright test tests/e2e/dashboard.spec.ts -g "notifications"
```

---

### 3.3 表单验证统一

#### Step 3.3.1: 创建 Zod Schema

```typescript
// src/lib/validations.ts (新建)
import { z } from 'zod';

// 邮箱验证
export const emailSchema = z
  .string()
  .min(1, '请输入邮箱')
  .email('邮箱格式不正确');

// 密码验证（登录用，宽松）
export const passwordSchema = z
  .string()
  .min(1, '请输入密码');

// 强密码验证（注册用，严格）
export const strongPasswordSchema = z
  .string()
  .min(8, '密码至少8个字符')
  .max(100, '密码不能超过100个字符')
  .regex(/[A-Z]/, '密码必须包含大写字母')
  .regex(/[a-z]/, '密码必须包含小写字母')
  .regex(/[0-9]/, '密码必须包含数字');

// 用户名验证
export const usernameSchema = z
  .string()
  .min(3, '用户名至少3个字符')
  .max(20, '用户名不能超过20个字符')
  .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线');

// 登录表单
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// 注册表单
export const registerSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: strongPasswordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次密码输入不一致',
  path: ['confirmPassword'],
});

// 类型导出
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
```

#### Step 3.3.2: 重构 AuthModal

```tsx
// src/components/AuthModal.tsx (重构)
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Eye, EyeOff, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  loginSchema, 
  registerSchema, 
  type LoginFormData, 
  type RegisterFormData 
} from '@/lib/validations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();

  // 登录表单
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 注册表单
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const currentForm = mode === 'login' ? loginForm : registerForm;
  const { formState: { errors, isSubmitting } } = currentForm;

  // 切换模式时重置表单
  useEffect(() => {
    setServerError(null);
    loginForm.reset();
    registerForm.reset();
  }, [mode]);

  // 关闭时重置
  useEffect(() => {
    if (!isOpen) {
      setServerError(null);
      setMode(initialMode);
      loginForm.reset();
      registerForm.reset();
    }
  }, [isOpen, initialMode]);

  // 登录提交
  const handleLogin = async (data: LoginFormData) => {
    try {
      setServerError(null);
      await signIn(data.email, data.password);
      onClose();
    } catch (error: any) {
      setServerError(error.message || '登录失败，请检查邮箱和密码');
    }
  };

  // 注册提交
  const handleRegister = async (data: RegisterFormData) => {
    try {
      setServerError(null);
      await signUp(data.email, data.password, data.username);
      onClose();
    } catch (error: any) {
      setServerError(error.message || '注册失败，请稍后重试');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        data-testid="auth-modal"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 m-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          aria-label="关闭"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 标题 */}
        <h2 id="auth-modal-title" className="text-2xl font-bold text-gray-900 mb-6">
          {mode === 'login' ? '欢迎回来' : '创建账户'}
        </h2>

        {/* 服务器错误 */}
        {serverError && (
          <div 
            data-testid="error-message"
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{serverError}</span>
          </div>
        )}

        {/* 登录表单 */}
        {mode === 'login' && (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
            {/* 邮箱 */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                邮箱
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...loginForm.register('email')}
                  type="email"
                  id="login-email"
                  data-testid="email-input"
                  placeholder="your@email.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" data-testid="email-error" className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* 密码 */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...loginForm.register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  data-testid="password-input"
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? '隐藏密码' : '显示密码'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p data-testid="password-error" className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={isSubmitting}
              data-testid="submit-button"
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>登录中...</span>
                </>
              ) : (
                '登录'
              )}
            </button>
          </form>
        )}

        {/* 注册表单 */}
        {mode === 'register' && (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
            {/* 邮箱 */}
            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
                邮箱
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...registerForm.register('email')}
                  type="email"
                  id="register-email"
                  data-testid="email-input"
                  placeholder="your@email.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    registerForm.formState.errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {registerForm.formState.errors.email && (
                <p data-testid="email-error" className="mt-1 text-sm text-red-600">
                  {registerForm.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* 用户名 */}
            <div>
              <label htmlFor="register-username" className="block text-sm font-medium text-gray-700 mb-1">
                用户名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...registerForm.register('username')}
                  type="text"
                  id="register-username"
                  data-testid="username-input"
                  placeholder="your_username"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    registerForm.formState.errors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {registerForm.formState.errors.username && (
                <p data-testid="username-error" className="mt-1 text-sm text-red-600">
                  {registerForm.formState.errors.username.message}
                </p>
              )}
            </div>

            {/* 密码 */}
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...registerForm.register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="register-password"
                  data-testid="password-input"
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    registerForm.formState.errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {registerForm.formState.errors.password && (
                <p data-testid="password-error" className="mt-1 text-sm text-red-600">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* 确认密码 */}
            <div>
              <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                确认密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...registerForm.register('confirmPassword')}
                  type={showPassword ? 'text' : 'password'}
                  id="register-confirm-password"
                  data-testid="confirm-password-input"
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    registerForm.formState.errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {registerForm.formState.errors.confirmPassword && (
                <p data-testid="confirm-password-error" className="mt-1 text-sm text-red-600">
                  {registerForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={isSubmitting}
              data-testid="submit-button"
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>注册中...</span>
                </>
              ) : (
                '注册'
              )}
            </button>
          </form>
        )}

        {/* 切换模式 */}
        <p className="mt-6 text-center text-sm text-gray-600">
          {mode === 'login' ? (
            <>
              还没有账户？{' '}
              <button
                onClick={() => setMode('register')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                立即注册
              </button>
            </>
          ) : (
            <>
              已有账户？{' '}
              <button
                onClick={() => setMode('login')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                立即登录
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
```

#### Step 3.3.3: 验证表单验证

```bash
# 手动测试
1. 输入无效邮箱 → 应显示"邮箱格式不正确"
2. 输入短密码 → 应显示"密码至少8个字符"
3. 密码不匹配 → 应显示"两次密码输入不一致"
4. 空字段提交 → 应显示对应错误消息

# E2E 测试
npx playwright test tests/e2e/auth.spec.ts -g "form validation"
```

---

### 3.4 Phase 1 提交

```bash
# 提交 Phase 1
git add -A
git commit -m "fix: Phase 1 - P0 bug fixes (logout, notifications, form validation)"
git push origin feat/phase1-p0-fixes

# 合并到主功能分支
git checkout feat/comprehensive-fixes
git merge feat/phase1-p0-fixes
git push origin feat/comprehensive-fixes

# 创建 Phase 2 分支
git checkout -b feat/phase2-monitoring
```



---

## 四、Phase 2: 监控体系

> **来源**: 融合（两者相似，Claude 集成更紧密）  
> **时间**: 2天  
> **目标**: 建立完整的可观测性基础

### 4.1 Sentry 错误监控

#### Step 4.1.1: 创建 Sentry 项目

1. 访问 https://sentry.io/signup/
2. 创建新项目，选择 React
3. 获取 DSN

#### Step 4.1.2: 配置 Sentry

```typescript
// src/lib/sentry.ts (新建)
import * as Sentry from '@sentry/react';

export function initSentry() {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      release: `follow-ai@${import.meta.env.VITE_APP_VERSION}`,
      
      integrations: [
        // 浏览器追踪
        Sentry.browserTracingIntegration(),
        // Session Replay
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
        // 用户反馈
        Sentry.feedbackIntegration({
          buttonLabel: '反馈问题',
          submitButtonLabel: '提交',
          formTitle: '报告问题',
          messagePlaceholder: '请描述您遇到的问题...',
        }),
      ],

      // 性能监控采样率
      tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,
      
      // Session Replay 采样率
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,

      // 过滤噪音错误
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications',
        'Network request failed',
        'Failed to fetch',
        /Loading chunk \d+ failed/,
        /ChunkLoadError/,
      ],

      // 发送前处理
      beforeSend(event, hint) {
        // 移除 PII
        if (event.user) {
          delete event.user.email;
          delete event.user.ip_address;
        }
        
        // 过滤第三方脚本错误
        const frames = event.exception?.values?.[0]?.stacktrace?.frames;
        if (frames?.some(frame => frame.filename?.includes('chrome-extension'))) {
          return null;
        }
        
        return event;
      },

      // 发送前处理 breadcrumbs
      beforeBreadcrumb(breadcrumb) {
        // 过滤敏感 URL
        if (breadcrumb.category === 'navigation') {
          if (breadcrumb.data?.to?.includes('password')) {
            return null;
          }
        }
        return breadcrumb;
      },
    });
  }
}

// 设置用户上下文
export function setSentryUser(user: { id: string; username: string } | null) {
  if (user) {
    Sentry.setUser({
      id: user.id,
      username: user.username,
    });
  } else {
    Sentry.setUser(null);
  }
}

// 手动捕获错误
export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  });
}

// 手动捕获消息
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level);
}
```

#### Step 4.1.3: 创建错误边界组件

```tsx
// src/components/ErrorFallback.tsx (新建)
import { useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  useEffect(() => {
    // 错误已由 Sentry ErrorBoundary 自动捕获
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          出错了
        </h1>
        
        <p className="text-gray-600 mb-6">
          我们已记录此错误，团队将尽快修复。
        </p>
        
        {import.meta.env.DEV && (
          <pre className="text-left text-sm bg-gray-100 p-4 rounded-lg mb-6 overflow-auto max-h-40">
            <code className="text-red-600">{error.message}</code>
          </pre>
        )}
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={resetError}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            重试
          </button>
          
          <a
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Home className="w-4 h-4" />
            返回首页
          </a>
        </div>
        
        <button
          onClick={() => Sentry.showReportDialog()}
          className="mt-6 text-sm text-gray-500 hover:text-gray-700"
        >
          报告此问题
        </button>
      </div>
    </div>
  );
}
```

#### Step 4.1.4: 初始化 Sentry

```typescript
// src/main.tsx (修改)
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { initSentry } from './lib/sentry';
import { queryClient } from './lib/react-query';
import { router } from './router';
import { ErrorFallback } from './components/ErrorFallback';
import './index.css';

// 初始化 Sentry（最先执行）
initSentry();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => (
        <ErrorFallback error={error} resetError={resetError} />
      )}
      showDialog
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);
```

---

### 4.2 PostHog 产品分析

#### Step 4.2.1: 创建 PostHog 项目

1. 访问 https://posthog.com/signup
2. 创建新项目
3. 获取 API Key

#### Step 4.2.2: 配置 PostHog

```typescript
// src/lib/posthog.ts (新建)
import posthog from 'posthog-js';

export function initPostHog() {
  if (import.meta.env.PROD && import.meta.env.VITE_POSTHOG_KEY) {
    posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
      api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
      
      // 自动捕获
      autocapture: true,
      capture_pageview: true,
      capture_pageleave: true,
      
      // 持久化
      persistence: 'localStorage',
      
      // 隐私设置
      mask_all_text: false,
      mask_all_element_attributes: false,
      
      // Session Recording
      disable_session_recording: false,
      session_recording: {
        maskAllInputs: true,
        maskInputOptions: {
          password: true,
        },
      },
      
      // Feature Flags
      bootstrap: {
        featureFlags: {
          'new-dashboard': false,
          'ai-review-v2': false,
          'success-score': true,
        },
      },
      
      // 加载完成回调
      loaded: (posthog) => {
        if (import.meta.env.DEV) {
          posthog.debug();
        }
      },
    });
  }
}

// 设置用户身份
export function identifyUser(userId: string, properties?: Record<string, any>) {
  posthog.identify(userId, properties);
}

// 重置用户身份（登出时调用）
export function resetUser() {
  posthog.reset();
}

// 事件追踪封装
export const analytics = {
  // 任务相关
  taskViewed: (taskId: string, taskType: string) => {
    posthog.capture('task_viewed', { task_id: taskId, task_type: taskType });
  },
  
  taskStarted: (taskId: string, taskType: string) => {
    posthog.capture('task_started', { task_id: taskId, task_type: taskType });
  },
  
  taskSubmitted: (taskId: string, taskType: string) => {
    posthog.capture('task_submitted', { task_id: taskId, task_type: taskType });
  },
  
  taskApproved: (taskId: string, score: number) => {
    posthog.capture('task_approved', { task_id: taskId, quality_score: score });
  },
  
  taskRejected: (taskId: string, reason: string) => {
    posthog.capture('task_rejected', { task_id: taskId, reason });
  },
  
  // XP 和等级
  xpEarned: (amount: number, source: string) => {
    posthog.capture('xp_earned', { amount, source });
  },
  
  levelUp: (newLevel: number, newTitle: string) => {
    posthog.capture('level_up', { new_level: newLevel, new_title: newTitle });
  },
  
  // 徽章
  badgeEarned: (badgeId: string, badgeName: string) => {
    posthog.capture('badge_earned', { badge_id: badgeId, badge_name: badgeName });
  },
  
  // 认证
  signUpStarted: () => {
    posthog.capture('signup_started');
  },
  
  signUpCompleted: () => {
    posthog.capture('signup_completed');
  },
  
  loginCompleted: () => {
    posthog.capture('login_completed');
  },
  
  logoutCompleted: () => {
    posthog.capture('logout_completed');
  },
  
  // 页面交互
  featureUsed: (featureName: string, metadata?: Record<string, any>) => {
    posthog.capture('feature_used', { feature: featureName, ...metadata });
  },
  
  // 错误
  errorOccurred: (errorType: string, errorMessage: string) => {
    posthog.capture('error_occurred', { error_type: errorType, error_message: errorMessage });
  },
};

// Feature Flag Hook
export function useFeatureFlag(flagKey: string): boolean {
  return posthog.isFeatureEnabled(flagKey) ?? false;
}

// A/B 测试 Hook
export function useExperiment(experimentKey: string): string | undefined {
  return posthog.getFeatureFlag(experimentKey) as string | undefined;
}
```

#### Step 4.2.3: 初始化 PostHog

```typescript
// src/main.tsx (添加)
import { initPostHog } from './lib/posthog';

// 初始化顺序：Sentry -> PostHog
initSentry();
initPostHog();
```

---

### 4.3 Core Web Vitals 监控

```typescript
// src/lib/web-vitals.ts (新建)
import { onLCP, onINP, onCLS, onFCP, onTTFB, type Metric } from 'web-vitals/attribution';
import * as Sentry from '@sentry/react';
import posthog from 'posthog-js';

// 2025 年 Core Web Vitals 阈值
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },   // Largest Contentful Paint
  INP: { good: 200, poor: 500 },     // Interaction to Next Paint
  CLS: { good: 0.1, poor: 0.25 },    // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 },   // First Contentful Paint
  TTFB: { good: 800, poor: 1800 },   // Time to First Byte
};

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'needs-improvement';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

function sendMetric(metric: Metric) {
  const rating = getRating(metric.name, metric.value);
  
  // 发送到 PostHog
  if (import.meta.env.PROD) {
    posthog.capture('web_vitals', {
      name: metric.name,
      value: Math.round(metric.value),
      rating,
      navigationType: metric.navigationType,
      // Attribution 数据（用于调试）
      ...(metric.attribution && {
        attribution: JSON.stringify(metric.attribution),
      }),
    });
  }

  // 性能问题告警到 Sentry
  if (rating === 'poor') {
    Sentry.captureMessage(`Performance regression: ${metric.name}`, {
      level: 'warning',
      tags: {
        metric: metric.name,
        rating,
      },
      extra: {
        value: metric.value,
        threshold: THRESHOLDS[metric.name as keyof typeof THRESHOLDS],
        attribution: metric.attribution,
        navigationType: metric.navigationType,
      },
    });
  }

  // 开发环境日志
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: Math.round(metric.value),
      rating,
      threshold: THRESHOLDS[metric.name as keyof typeof THRESHOLDS],
    });
  }
}

export function initWebVitals() {
  // 核心指标
  onLCP(sendMetric);
  onINP(sendMetric);
  onCLS(sendMetric);
  
  // 辅助指标
  onFCP(sendMetric);
  onTTFB(sendMetric);
}
```

#### Step 4.3.1: 初始化 Web Vitals

```typescript
// src/main.tsx (添加)
import { initWebVitals } from './lib/web-vitals';

// 初始化顺序：Sentry -> PostHog -> Web Vitals
initSentry();
initPostHog();
initWebVitals();
```

---

### 4.4 Phase 2 验证和提交

```bash
# 验证 Sentry
1. 添加 DSN 到 .env.local
2. pnpm build && pnpm preview
3. 在控制台执行: throw new Error('Test Sentry')
4. 检查 Sentry Dashboard

# 验证 PostHog
1. 添加 Key 到 .env.local
2. pnpm dev
3. 执行操作（登录、查看任务等）
4. 检查 PostHog Events

# 验证 Web Vitals
1. 打开开发者工具 Console
2. 刷新页面
3. 查看 [Web Vitals] 日志

# 提交
git add -A
git commit -m "feat: Phase 2 - Monitoring system (Sentry, PostHog, Web Vitals)"
git push origin feat/phase2-monitoring
```

---

## 五、Phase 3: 性能优化

> **来源**: Claude 方案（含图片优化）  
> **时间**: 2天  
> **目标**: 提升用户体验，优化加载速度

### 5.1 Vite 配置优化

```typescript
// vite.config.ts (重构)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { compression } from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    
    // Brotli 压缩
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    
    // Gzip 压缩（兼容性）
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    
    // 图片优化
    ViteImageOptimizer({
      test: /\.(jpe?g|png|gif|webp|svg)$/i,
      includePublic: true,
      logStats: true,
      png: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      webp: {
        quality: 80,
      },
    }),
    
    // Bundle 分析（仅构建时）
    visualizer({
      open: false,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true,
    
    rollupOptions: {
      output: {
        // 手动分割 chunks
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // React 核心
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // Supabase
            if (id.includes('@supabase')) {
              return 'supabase-vendor';
            }
            // UI 库
            if (id.includes('framer-motion') || id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            // 监控
            if (id.includes('@sentry') || id.includes('posthog')) {
              return 'monitoring-vendor';
            }
            // 表单
            if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
              return 'form-vendor';
            }
            // 工具库
            if (id.includes('date-fns') || id.includes('lodash')) {
              return 'utils-vendor';
            }
            // 其他第三方库
            return 'vendor';
          }
        },
      },
    },
    
    // Chunk 大小警告阈值
    chunkSizeWarningLimit: 300,
  },
  
  // 开发服务器优化
  server: {
    hmr: {
      overlay: true,
    },
  },
  
  // 预构建优化
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'framer-motion',
      'lucide-react',
    ],
  },
});
```

---

### 5.2 路由懒加载

```typescript
// src/router.tsx (重构)
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PageLoader } from './components/PageLoader';

// 首页不懒加载（首屏）
import Home from './pages/Home';

// 懒加载其他页面
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tasks = lazy(() => import('./pages/Tasks'));
const TaskDetail = lazy(() => import('./pages/TaskDetail'));
const TaskSubmit = lazy(() => import('./pages/TaskSubmit'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Wallet = lazy(() => import('./pages/Wallet'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin 页面（独立 chunk）
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminTasks = lazy(() => import('./pages/admin/Tasks'));
const AdminSubmissions = lazy(() => import('./pages/admin/Submissions'));

// 懒加载包装器
function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // 公开页面
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'tasks',
        element: (
          <LazyPage>
            <Tasks />
          </LazyPage>
        ),
      },
      {
        path: 'tasks/:id',
        element: (
          <LazyPage>
            <TaskDetail />
          </LazyPage>
        ),
      },
      {
        path: 'leaderboard',
        element: (
          <LazyPage>
            <Leaderboard />
          </LazyPage>
        ),
      },
      
      // 需要认证的页面
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <LazyPage>
              <Dashboard />
            </LazyPage>
          </ProtectedRoute>
        ),
      },
      {
        path: 'tasks/:id/submit',
        element: (
          <ProtectedRoute>
            <LazyPage>
              <TaskSubmit />
            </LazyPage>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <LazyPage>
              <Profile />
            </LazyPage>
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <LazyPage>
              <Settings />
            </LazyPage>
          </ProtectedRoute>
        ),
      },
      {
        path: 'wallet',
        element: (
          <ProtectedRoute>
            <LazyPage>
              <Wallet />
            </LazyPage>
          </ProtectedRoute>
        ),
      },
      
      // Admin 路由
      {
        path: 'admin',
        element: (
          <ProtectedRoute requireAdmin>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <LazyPage>
                <AdminDashboard />
              </LazyPage>
            ),
          },
          {
            path: 'users',
            element: (
              <LazyPage>
                <AdminUsers />
              </LazyPage>
            ),
          },
          {
            path: 'tasks',
            element: (
              <LazyPage>
                <AdminTasks />
              </LazyPage>
            ),
          },
          {
            path: 'submissions',
            element: (
              <LazyPage>
                <AdminSubmissions />
              </LazyPage>
            ),
          },
        ],
      },
      
      // 404
      {
        path: '*',
        element: (
          <LazyPage>
            <NotFound />
          </LazyPage>
        ),
      },
    ],
  },
]);
```

---

### 5.3 页面加载组件

```tsx
// src/components/PageLoader.tsx (新建)
import { motion } from 'framer-motion';

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative w-16 h-16">
          <motion.div
            className="absolute inset-0 border-4 border-blue-200 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <p className="text-gray-500 text-sm">加载中...</p>
      </motion.div>
    </div>
  );
}
```

---

### 5.4 骨架屏组件

```tsx
// src/components/Skeleton.tsx (新建)
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseStyles = 'bg-gray-200';
  
  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };
  
  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]',
    none: '',
  };

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        animationStyles[animation],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
}

// 预设骨架屏
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <Skeleton className="h-6 w-1/3 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1">
          <Skeleton className="h-5 w-2/3 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-9 w-28" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm">
      <div className="flex items-center gap-6 mb-6">
        <Skeleton variant="circular" width={96} height={96} />
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    </div>
  );
}
```

---

### 5.5 优化图片组件

```tsx
// src/components/OptimizedImage.tsx (新建)
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority && imgRef.current) {
      imgRef.current.loading = 'eager';
    }
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {/* 占位符 */}
      {placeholder === 'blur' && blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-lg scale-110"
          aria-hidden="true"
        />
      )}
      
      {/* 空占位符 */}
      {placeholder === 'empty' && !isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {/* 实际图片 */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          hasError && 'hidden'
        )}
      />
      
      {/* 错误状态 */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">图片加载失败</span>
        </div>
      )}
    </div>
  );
}
```

---

### 5.6 Phase 3 验证和提交

```bash
# 构建并分析
pnpm build

# 查看 Bundle 分析
open dist/stats.html

# 验证 Chunk 分割
ls -la dist/assets/
# 应该看到多个 vendor chunk 文件

# 验证懒加载
pnpm preview
# 打开 Network 标签，导航到不同页面
# 应该看到按需加载的 JS 文件

# Lighthouse 测试
npx lighthouse http://localhost:4173 --output html --output-path ./lighthouse-report.html
# 目标：Performance ≥ 90

# 提交
git add -A
git commit -m "perf: Phase 3 - Performance optimization (code splitting, lazy loading, image optimization)"
git push origin feat/phase3-performance
```



---

## 六、Phase 4: Admin + AI Review

> **来源**: Claude 方案（SQL 更完整）  
> **时间**: 4天  
> **目标**: 建立运营管理能力

### 6.1 数据库迁移 - 管理员角色系统

```sql
-- migrations/20260108_admin_roles.sql

-- 1. 添加管理员角色到 profiles 表
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'reviewer', 'admin', 'super_admin'));

-- 2. 创建审计日志表
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  target_type VARCHAR(50) NOT NULL,
  target_id UUID,
  old_value JSONB,
  new_value JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 创建索引
CREATE INDEX idx_audit_logs_admin_id ON admin_audit_logs(admin_id);
CREATE INDEX idx_audit_logs_action ON admin_audit_logs(action);
CREATE INDEX idx_audit_logs_target ON admin_audit_logs(target_type, target_id);
CREATE INDEX idx_audit_logs_created_at ON admin_audit_logs(created_at DESC);
CREATE INDEX idx_profiles_role ON profiles(role);

-- 4. RLS 策略
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 只有管理员可以查看审计日志
CREATE POLICY "Admins can view audit logs"
  ON admin_audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- 只有系统可以插入审计日志
CREATE POLICY "System can insert audit logs"
  ON admin_audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (admin_id = auth.uid());

-- 5. 审计日志触发器函数
CREATE OR REPLACE FUNCTION log_admin_action()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_audit_logs (
    admin_id,
    action,
    target_type,
    target_id,
    old_value,
    new_value
  ) VALUES (
    auth.uid(),
    TG_ARGV[0],
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. 为关键表添加审计触发器
CREATE TRIGGER audit_task_submissions
  AFTER UPDATE ON task_submissions
  FOR EACH ROW
  EXECUTE FUNCTION log_admin_action('review_submission');

-- 7. 管理员统计视图
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM profiles WHERE created_at > NOW() - INTERVAL '24 hours') AS new_users_24h,
  (SELECT COUNT(*) FROM profiles WHERE created_at > NOW() - INTERVAL '7 days') AS new_users_7d,
  (SELECT COUNT(*) FROM task_submissions WHERE status = 'pending') AS pending_reviews,
  (SELECT COUNT(*) FROM task_submissions WHERE reviewed_at > NOW() - INTERVAL '24 hours') AS reviews_24h,
  (SELECT COUNT(*) FROM tasks WHERE is_active = true) AS active_tasks,
  (SELECT COALESCE(SUM(xp), 0) FROM xp_events WHERE created_at > NOW() - INTERVAL '24 hours') AS xp_distributed_24h,
  (SELECT COUNT(*) FROM profiles WHERE role IN ('reviewer', 'admin', 'super_admin')) AS admin_count;

-- 8. 设置初始超级管理员（替换为实际用户 ID）
-- UPDATE profiles SET role = 'super_admin' WHERE id = 'YOUR_USER_ID';
```

#### Step 6.1.1: 执行迁移

```bash
# 在 Supabase SQL Editor 中执行上述 SQL
# 或使用 Supabase CLI
supabase db push
```

---

### 6.2 Admin Dashboard 页面

```tsx
// src/pages/admin/Dashboard.tsx (新建)
import { useState, useEffect } from 'react';
import { 
  Users, 
  FileCheck, 
  Clock, 
  TrendingUp, 
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/Skeleton';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface DashboardStats {
  new_users_24h: number;
  new_users_7d: number;
  pending_reviews: number;
  reviews_24h: number;
  active_tasks: number;
  xp_distributed_24h: number;
  admin_count: number;
}

interface PendingSubmission {
  id: string;
  task_title: string;
  user_name: string;
  submitted_at: string;
  priority: 'low' | 'medium' | 'high';
}

interface RecentActivity {
  id: string;
  action: string;
  admin_name: string;
  target_type: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      // 获取统计数据
      const { data: statsData } = await supabase
        .from('admin_dashboard_stats')
        .select('*')
        .single();
      
      if (statsData) setStats(statsData);

      // 获取待审核提交
      const { data: submissions } = await supabase
        .from('task_submissions')
        .select(`
          id,
          submitted_at,
          tasks(title),
          profiles(username)
        `)
        .eq('status', 'pending')
        .order('submitted_at', { ascending: true })
        .limit(10);

      if (submissions) {
        setPendingSubmissions(submissions.map(s => ({
          id: s.id,
          task_title: s.tasks?.title || 'Unknown',
          user_name: s.profiles?.username || 'Unknown',
          submitted_at: s.submitted_at,
          priority: getPriority(s.submitted_at),
        })));
      }

      // 获取最近活动
      const { data: activity } = await supabase
        .from('admin_audit_logs')
        .select(`
          id,
          action,
          target_type,
          created_at,
          profiles(username)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (activity) {
        setRecentActivity(activity.map(a => ({
          id: a.id,
          action: a.action,
          admin_name: a.profiles?.username || 'System',
          target_type: a.target_type,
          created_at: a.created_at,
        })));
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // 每分钟自动刷新
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const getPriority = (submittedAt: string): 'low' | 'medium' | 'high' => {
    const hours = (Date.now() - new Date(submittedAt).getTime()) / (1000 * 60 * 60);
    if (hours > 48) return 'high';
    if (hours > 24) return 'medium';
    return 'low';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">管理控制台</h1>
          <p className="text-gray-500 mt-1">实时监控平台运营状态</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          刷新
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="待审核"
          value={stats?.pending_reviews || 0}
          icon={<Clock className="w-6 h-6" />}
          color="yellow"
          trend={stats?.pending_reviews > 10 ? 'up' : 'stable'}
        />
        <StatCard
          title="今日审核"
          value={stats?.reviews_24h || 0}
          icon={<FileCheck className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          title="新用户 (7天)"
          value={stats?.new_users_7d || 0}
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="今日 XP 发放"
          value={stats?.xp_distributed_24h || 0}
          icon={<TrendingUp className="w-6 h-6" />}
          color="purple"
          format="xp"
        />
      </div>

      {/* 主要内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 待审核队列 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              待审核队列
            </h2>
            <span className="text-sm text-gray-500">
              {pendingSubmissions.length} 项待处理
            </span>
          </div>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {pendingSubmissions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                <p>所有提交已审核完毕</p>
              </div>
            ) : (
              pendingSubmissions.map(submission => (
                <div key={submission.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{submission.task_title}</p>
                      <p className="text-sm text-gray-500">
                        {submission.user_name} · {formatDistanceToNow(new Date(submission.submitted_at), { addSuffix: true, locale: zhCN })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(submission.priority)}`}>
                        {submission.priority === 'high' ? '紧急' : submission.priority === 'medium' ? '中等' : '正常'}
                      </span>
                      <a
                        href={`/admin/submissions/${submission.id}`}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        审核
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 最近活动 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              最近活动
            </h2>
          </div>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {recentActivity.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>暂无活动记录</p>
              </div>
            ) : (
              recentActivity.map(activity => (
                <div key={activity.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.action.includes('approve') ? 'bg-green-100' :
                      activity.action.includes('reject') ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      {activity.action.includes('approve') ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : activity.action.includes('reject') ? (
                        <XCircle className="w-4 h-4 text-red-600" />
                      ) : (
                        <Activity className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.admin_name}</span>
                        {' '}{getActionText(activity.action)}{' '}
                        <span className="text-gray-500">{activity.target_type}</span>
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true, locale: zhCN })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 统计卡片组件
function StatCard({ 
  title, 
  value, 
  icon, 
  color, 
  trend,
  format 
}: { 
  title: string; 
  value: number; 
  icon: React.ReactNode; 
  color: 'blue' | 'green' | 'yellow' | 'purple';
  trend?: 'up' | 'down' | 'stable';
  format?: 'xp';
}) {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  const formatValue = (v: number) => {
    if (format === 'xp') {
      return v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v.toString();
    }
    return v.toLocaleString();
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-medium ${
            trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-500' : 'text-gray-400'
          }`}>
            {trend === 'up' ? '↑ 需关注' : trend === 'down' ? '↓ 下降' : '— 稳定'}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
  );
}

function getActionText(action: string): string {
  const actionMap: Record<string, string> = {
    'review_submission': '审核了',
    'approve_submission': '批准了',
    'reject_submission': '拒绝了',
    'update_user': '更新了',
    'ban_user': '封禁了',
  };
  return actionMap[action] || action;
}
```

---

### 6.3 AI Review Edge Function

```typescript
// supabase/functions/ai-review/index.ts (新建)
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReviewRequest {
  submission_id: string;
  task_type: string;
  content: string;
  attachments?: string[];
}

interface ReviewResult {
  score: number;
  feedback: string;
  suggestions: string[];
  flags: string[];
  confidence: number;
}

serve(async (req) => {
  // CORS 预检
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { submission_id, task_type, content, attachments }: ReviewRequest = await req.json();

    // 验证请求
    if (!submission_id || !task_type || !content) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 调用 OpenAI API 进行评审
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `你是一个专业的 AI 工具评测审核员。你需要评估用户提交的评测内容是否符合以下标准：

1. 真实性：内容是否基于真实使用经验
2. 完整性：是否包含必要的工作成果证据
3. 专业性：评测是否客观、有深度
4. 原创性：内容是否为原创，非抄袭

请以 JSON 格式返回评审结果：
{
  "score": 0-100,
  "feedback": "详细反馈",
  "suggestions": ["改进建议1", "改进建议2"],
  "flags": ["可疑点1", "可疑点2"],
  "confidence": 0-1
}`
          },
          {
            role: 'user',
            content: `任务类型: ${task_type}\n\n提交内容:\n${content}\n\n附件数量: ${attachments?.length || 0}`
          }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error('OpenAI API call failed');
    }

    const aiResult = await openaiResponse.json();
    const review: ReviewResult = JSON.parse(aiResult.choices[0].message.content);

    // 保存 AI 评审结果
    const { error: updateError } = await supabase
      .from('task_submissions')
      .update({
        ai_review_score: review.score,
        ai_review_feedback: review.feedback,
        ai_review_suggestions: review.suggestions,
        ai_review_flags: review.flags,
        ai_review_confidence: review.confidence,
        ai_reviewed_at: new Date().toISOString(),
      })
      .eq('id', submission_id);

    if (updateError) {
      throw updateError;
    }

    // 自动处理高置信度结果
    if (review.confidence >= 0.9) {
      if (review.score >= 80 && review.flags.length === 0) {
        // 自动批准
        await supabase
          .from('task_submissions')
          .update({
            status: 'auto_approved',
            reviewed_at: new Date().toISOString(),
            reviewer_id: null, // 标记为 AI 审核
          })
          .eq('id', submission_id);
      } else if (review.score < 30 || review.flags.length >= 3) {
        // 标记为需要人工审核
        await supabase
          .from('task_submissions')
          .update({
            status: 'flagged',
            review_priority: 'high',
          })
          .eq('id', submission_id);
      }
    }

    return new Response(
      JSON.stringify({ success: true, review }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI Review error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

#### Step 6.3.1: 部署 Edge Function

```bash
# 部署 Edge Function
supabase functions deploy ai-review --no-verify-jwt

# 设置环境变量
supabase secrets set OPENAI_API_KEY=your_openai_api_key
```

---

### 6.4 Phase 4 验证和提交

```bash
# 验证数据库迁移
1. 检查 profiles 表是否有 role 列
2. 检查 admin_audit_logs 表是否创建
3. 检查 admin_dashboard_stats 视图

# 验证 Admin Dashboard
1. 登录管理员账户
2. 访问 /admin
3. 检查统计数据是否正确

# 验证 AI Review
curl -X POST https://your-project.supabase.co/functions/v1/ai-review \
  -H "Content-Type: application/json" \
  -d '{"submission_id": "test", "task_type": "review", "content": "test content"}'

# 提交
git add -A
git commit -m "feat: Phase 4 - Admin Dashboard and AI Review system"
git push origin feat/phase4-admin
```

---

## 七、Phase 5: 游戏化系统

> **来源**: 融合（Claude 等级 + Manus 徽章）  
> **时间**: 3天  
> **目标**: 建立完整的游戏化增长引擎

### 7.1 数据库迁移 - Success Score 系统

```sql
-- migrations/20260108_success_score.sql

-- 1. Success Score 表（使用 GENERATED ALWAYS AS）
CREATE TABLE IF NOT EXISTS user_success_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- 核心指标（0-100）
  quality_score NUMERIC(5,2) DEFAULT 0,        -- 平均评测质量
  response_rate NUMERIC(5,2) DEFAULT 100,      -- 响应率
  completion_rate NUMERIC(5,2) DEFAULT 100,    -- 完成率
  consistency_score NUMERIC(5,2) DEFAULT 0,    -- 一致性
  expertise_score NUMERIC(5,2) DEFAULT 0,      -- 专业度
  
  -- 统计数据
  total_submissions INTEGER DEFAULT 0,
  approved_submissions INTEGER DEFAULT 0,
  rejected_submissions INTEGER DEFAULT 0,
  total_xp_earned INTEGER DEFAULT 0,
  
  -- 自动计算的综合分数
  overall_score NUMERIC(5,2) GENERATED ALWAYS AS (
    GREATEST(0, LEAST(100,
      (COALESCE(quality_score, 0) * 0.30) +
      (COALESCE(response_rate, 100) * 0.15) +
      (COALESCE(completion_rate, 100) * 0.20) +
      (COALESCE(consistency_score, 0) * 0.15) +
      (COALESCE(expertise_score, 0) * 0.20)
    ))
  ) STORED,
  
  -- 等级（自动计算）
  tier VARCHAR(20) GENERATED ALWAYS AS (
    CASE
      WHEN (COALESCE(quality_score, 0) * 0.30 + COALESCE(response_rate, 100) * 0.15 + 
            COALESCE(completion_rate, 100) * 0.20 + COALESCE(consistency_score, 0) * 0.15 + 
            COALESCE(expertise_score, 0) * 0.20) >= 90 THEN 'elite'
      WHEN (COALESCE(quality_score, 0) * 0.30 + COALESCE(response_rate, 100) * 0.15 + 
            COALESCE(completion_rate, 100) * 0.20 + COALESCE(consistency_score, 0) * 0.15 + 
            COALESCE(expertise_score, 0) * 0.20) >= 75 THEN 'expert'
      WHEN (COALESCE(quality_score, 0) * 0.30 + COALESCE(response_rate, 100) * 0.15 + 
            COALESCE(completion_rate, 100) * 0.20 + COALESCE(consistency_score, 0) * 0.15 + 
            COALESCE(expertise_score, 0) * 0.20) >= 50 THEN 'intermediate'
      ELSE 'beginner'
    END
  ) STORED,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- 2. 等级系统表
CREATE TABLE IF NOT EXISTS user_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  level INTEGER DEFAULT 1,
  title VARCHAR(50) DEFAULT '新手评测员',
  current_xp INTEGER DEFAULT 0,
  xp_to_next_level INTEGER DEFAULT 100,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- 3. 等级配置表
CREATE TABLE IF NOT EXISTS level_configs (
  level INTEGER PRIMARY KEY,
  title VARCHAR(50) NOT NULL,
  min_xp INTEGER NOT NULL,
  max_xp INTEGER NOT NULL,
  perks JSONB DEFAULT '[]'::jsonb,
  badge_url VARCHAR(255)
);

-- 插入等级配置
INSERT INTO level_configs (level, title, min_xp, max_xp, perks) VALUES
(1, '新手评测员', 0, 99, '[]'),
(2, '初级评测员', 100, 299, '["early_access"]'),
(3, '中级评测员', 300, 599, '["early_access", "priority_tasks"]'),
(4, '高级评测员', 600, 999, '["early_access", "priority_tasks", "bonus_xp_5"]'),
(5, '资深评测员', 1000, 1999, '["early_access", "priority_tasks", "bonus_xp_10"]'),
(6, '专家评测员', 2000, 3999, '["early_access", "priority_tasks", "bonus_xp_15", "exclusive_tasks"]'),
(7, '大师评测员', 4000, 7999, '["early_access", "priority_tasks", "bonus_xp_20", "exclusive_tasks"]'),
(8, '传奇评测员', 8000, 14999, '["all_perks", "bonus_xp_25"]'),
(9, '神话评测员', 15000, 29999, '["all_perks", "bonus_xp_30"]'),
(10, '至尊评测员', 30000, 999999999, '["all_perks", "bonus_xp_50", "custom_badge"]')
ON CONFLICT (level) DO UPDATE SET
  title = EXCLUDED.title,
  min_xp = EXCLUDED.min_xp,
  max_xp = EXCLUDED.max_xp,
  perks = EXCLUDED.perks;

-- 4. 徽章系统表
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url VARCHAR(255),
  category VARCHAR(50) NOT NULL, -- achievement, milestone, special
  rarity VARCHAR(20) DEFAULT 'common', -- common, rare, epic, legendary
  criteria JSONB NOT NULL, -- 获取条件
  xp_reward INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 用户徽章关联表
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, badge_id)
);

-- 插入默认徽章
INSERT INTO badges (name, description, category, rarity, criteria, xp_reward) VALUES
('首次提交', '完成第一次任务提交', 'milestone', 'common', '{"type": "submission_count", "value": 1}', 10),
('评测新星', '完成10次任务提交', 'milestone', 'common', '{"type": "submission_count", "value": 10}', 50),
('评测达人', '完成50次任务提交', 'milestone', 'rare', '{"type": "submission_count", "value": 50}', 200),
('评测大师', '完成100次任务提交', 'milestone', 'epic', '{"type": "submission_count", "value": 100}', 500),
('完美评测', '获得100分的评测', 'achievement', 'rare', '{"type": "perfect_score", "value": 1}', 100),
('连续7天', '连续7天提交任务', 'achievement', 'rare', '{"type": "streak", "value": 7}', 150),
('连续30天', '连续30天提交任务', 'achievement', 'epic', '{"type": "streak", "value": 30}', 500),
('AI专家', '完成10个AI工具评测', 'achievement', 'rare', '{"type": "category_count", "category": "ai", "value": 10}', 200),
('早期用户', '平台前1000名注册用户', 'special', 'legendary', '{"type": "early_user", "value": 1000}', 300)
ON CONFLICT DO NOTHING;

-- 6. 创建索引
CREATE INDEX idx_success_scores_user_id ON user_success_scores(user_id);
CREATE INDEX idx_success_scores_tier ON user_success_scores(tier);
CREATE INDEX idx_success_scores_overall ON user_success_scores(overall_score DESC);
CREATE INDEX idx_user_levels_user_id ON user_levels(user_id);
CREATE INDEX idx_user_levels_level ON user_levels(level DESC);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_badges_category ON badges(category);

-- 7. RLS 策略
ALTER TABLE user_success_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- 用户可以查看自己的 Success Score
CREATE POLICY "Users can view own success score"
  ON user_success_scores FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 用户可以查看自己的等级
CREATE POLICY "Users can view own level"
  ON user_levels FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 用户可以查看自己的徽章
CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 所有人可以查看徽章定义
CREATE POLICY "Anyone can view badges"
  ON badges FOR SELECT
  TO authenticated
  USING (true);

-- 8. 自动更新 Success Score 的触发器
CREATE OR REPLACE FUNCTION update_success_score()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_quality NUMERIC;
  v_completion NUMERIC;
  v_total INTEGER;
  v_approved INTEGER;
  v_rejected INTEGER;
BEGIN
  v_user_id := COALESCE(NEW.user_id, OLD.user_id);
  
  -- 计算统计数据
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'approved'),
    COUNT(*) FILTER (WHERE status = 'rejected'),
    COALESCE(AVG(quality_score) FILTER (WHERE status = 'approved'), 0)
  INTO v_total, v_approved, v_rejected, v_quality
  FROM task_submissions
  WHERE user_id = v_user_id;
  
  -- 计算完成率
  v_completion := CASE WHEN v_total > 0 
    THEN (v_approved::NUMERIC / v_total * 100) 
    ELSE 100 END;
  
  -- 更新或插入 Success Score
  INSERT INTO user_success_scores (
    user_id,
    quality_score,
    completion_rate,
    total_submissions,
    approved_submissions,
    rejected_submissions,
    updated_at
  ) VALUES (
    v_user_id,
    v_quality,
    v_completion,
    v_total,
    v_approved,
    v_rejected,
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    quality_score = EXCLUDED.quality_score,
    completion_rate = EXCLUDED.completion_rate,
    total_submissions = EXCLUDED.total_submissions,
    approved_submissions = EXCLUDED.approved_submissions,
    rejected_submissions = EXCLUDED.rejected_submissions,
    updated_at = NOW();
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器
DROP TRIGGER IF EXISTS trigger_update_success_score ON task_submissions;
CREATE TRIGGER trigger_update_success_score
  AFTER INSERT OR UPDATE OR DELETE ON task_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_success_score();

-- 9. 自动升级等级的触发器
CREATE OR REPLACE FUNCTION check_level_up()
RETURNS TRIGGER AS $$
DECLARE
  v_new_level INTEGER;
  v_new_title VARCHAR(50);
  v_current_xp INTEGER;
BEGIN
  -- 获取当前 XP
  SELECT COALESCE(SUM(xp), 0) INTO v_current_xp
  FROM xp_events
  WHERE user_id = NEW.user_id;
  
  -- 查找新等级
  SELECT level, title INTO v_new_level, v_new_title
  FROM level_configs
  WHERE min_xp <= v_current_xp AND max_xp >= v_current_xp
  LIMIT 1;
  
  -- 更新用户等级
  INSERT INTO user_levels (user_id, level, title, current_xp)
  VALUES (NEW.user_id, v_new_level, v_new_title, v_current_xp)
  ON CONFLICT (user_id) DO UPDATE SET
    level = v_new_level,
    title = v_new_title,
    current_xp = v_current_xp,
    xp_to_next_level = (
      SELECT min_xp FROM level_configs WHERE level = v_new_level + 1
    ) - v_current_xp,
    updated_at = NOW();
  
  -- 同时更新 profiles 表
  UPDATE profiles SET
    level = v_new_level,
    xp = v_current_xp
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器
DROP TRIGGER IF EXISTS trigger_check_level_up ON xp_events;
CREATE TRIGGER trigger_check_level_up
  AFTER INSERT ON xp_events
  FOR EACH ROW
  EXECUTE FUNCTION check_level_up();
```

---

### 7.2 Success Score 展示组件

```tsx
// src/components/SuccessScoreCard.tsx (新建)
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Star, 
  Target, 
  Zap, 
  Award,
  ChevronRight,
  Info
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface SuccessScore {
  overall_score: number;
  tier: 'beginner' | 'intermediate' | 'expert' | 'elite';
  quality_score: number;
  response_rate: number;
  completion_rate: number;
  consistency_score: number;
  expertise_score: number;
  total_submissions: number;
  approved_submissions: number;
}

const tierConfig = {
  beginner: { label: '初学者', color: 'gray', icon: '🌱' },
  intermediate: { label: '进阶者', color: 'blue', icon: '🌟' },
  expert: { label: '专家', color: 'purple', icon: '💎' },
  elite: { label: '精英', color: 'gold', icon: '👑' },
};

export function SuccessScoreCard() {
  const { user } = useAuth();
  const [score, setScore] = useState<SuccessScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchScore = async () => {
      const { data, error } = await supabase
        .from('user_success_scores')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setScore(data);
      }
      setLoading(false);
    };

    fetchScore();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
        <div className="h-24 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!score) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-2">Success Score</h3>
        <p className="text-gray-500 text-sm">完成第一个任务后解锁</p>
      </div>
    );
  }

  const tier = tierConfig[score.tier];

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* 头部 */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Success Score
          </h3>
          <span className="text-2xl">{tier.icon}</span>
        </div>
        
        <div className="flex items-end gap-4">
          <div className="text-5xl font-bold">
            {Math.round(score.overall_score)}
          </div>
          <div className="pb-1">
            <span className="text-white/80 text-sm">/ 100</span>
            <div className="text-sm font-medium mt-1 px-2 py-0.5 bg-white/20 rounded-full">
              {tier.label}
            </div>
          </div>
        </div>
        
        {/* 进度条 */}
        <div className="mt-4">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${score.overall_score}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* 详情 */}
      <div className="p-6">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-gray-900"
        >
          <span>查看详细指标</span>
          <ChevronRight className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
        </button>

        {showDetails && (
          <motion.div
            className="mt-4 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <ScoreMetric
              icon={<Star className="w-4 h-4" />}
              label="质量评分"
              value={score.quality_score}
              weight={30}
            />
            <ScoreMetric
              icon={<Zap className="w-4 h-4" />}
              label="响应率"
              value={score.response_rate}
              weight={15}
            />
            <ScoreMetric
              icon={<Target className="w-4 h-4" />}
              label="完成率"
              value={score.completion_rate}
              weight={20}
            />
            <ScoreMetric
              icon={<Award className="w-4 h-4" />}
              label="一致性"
              value={score.consistency_score}
              weight={15}
            />
            <ScoreMetric
              icon={<TrendingUp className="w-4 h-4" />}
              label="专业度"
              value={score.expertise_score}
              weight={20}
            />

            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Info className="w-3 h-3" />
                <span>基于 {score.total_submissions} 次提交计算</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function ScoreMetric({ 
  icon, 
  label, 
  value, 
  weight 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: number; 
  weight: number;
}) {
  const getColor = (v: number) => {
    if (v >= 80) return 'text-green-600 bg-green-50';
    if (v >= 60) return 'text-blue-600 bg-blue-50';
    if (v >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-gray-600">
        {icon}
        <span className="text-sm">{label}</span>
        <span className="text-xs text-gray-400">({weight}%)</span>
      </div>
      <div className={`px-2 py-1 rounded-full text-sm font-medium ${getColor(value)}`}>
        {Math.round(value)}
      </div>
    </div>
  );
}
```

---

### 7.3 Phase 5 验证和提交

```bash
# 验证数据库
1. 检查 user_success_scores 表
2. 检查 user_levels 表
3. 检查 badges 表
4. 检查触发器是否正常工作

# 验证组件
1. 登录用户账户
2. 访问 Dashboard
3. 检查 Success Score 卡片是否显示

# 提交
git add -A
git commit -m "feat: Phase 5 - Gamification system (Success Score, Levels, Badges)"
git push origin feat/phase5-gamification
```



---

## 八、Phase 6: SEO + 可访问性

> **来源**: Manus 方案（Claude 缺失）  
> **时间**: 3天  
> **目标**: 符合 2025 年 Web 标准

### 8.1 SEO 结构化数据

```tsx
// src/components/SEO.tsx (新建)
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  schema?: object;
  noindex?: boolean;
}

const defaultMeta = {
  title: 'Follow.ai - AI 工具真实评测平台',
  description: '全球首个要求提交真实工作成果的 AI 工具评测平台。完成评测任务，获得 $20-200 报酬。',
  image: 'https://follow.ai/og-image.png',
  url: 'https://follow.ai',
};

export function SEO({
  title,
  description = defaultMeta.description,
  keywords = ['AI工具', '评测', '众包', '赚钱'],
  image = defaultMeta.image,
  url = defaultMeta.url,
  type = 'website',
  schema,
  noindex = false,
}: SEOProps) {
  const fullTitle = title ? `${title} | Follow.ai` : defaultMeta.title;

  // 默认 Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Follow.ai',
    url: 'https://follow.ai',
    logo: 'https://follow.ai/logo.png',
    sameAs: [
      'https://twitter.com/followai',
      'https://github.com/follow-ai',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@follow.ai',
      contactType: 'customer service',
    },
  };

  // 默认 WebSite Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Follow.ai',
    url: 'https://follow.ai',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://follow.ai/tasks?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Helmet>
      {/* 基础 Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={url} />
      
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Follow.ai" />
      <meta property="og:locale" content="zh_CN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@followai" />

      {/* 结构化数据 */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

// 任务页面专用 Schema
export function TaskSEO({ 
  task 
}: { 
  task: { 
    id: string; 
    title: string; 
    description: string; 
    reward: number;
    deadline?: string;
  } 
}) {
  const taskSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: task.title,
    description: task.description,
    datePosted: new Date().toISOString(),
    validThrough: task.deadline,
    employmentType: 'CONTRACTOR',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Follow.ai',
      sameAs: 'https://follow.ai',
    },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: {
        '@type': 'QuantitativeValue',
        value: task.reward,
        unitText: 'TASK',
      },
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'Remote',
      },
    },
  };

  return (
    <SEO
      title={task.title}
      description={task.description}
      url={`https://follow.ai/tasks/${task.id}`}
      type="article"
      schema={taskSchema}
    />
  );
}

// 用户资料页面专用 Schema
export function ProfileSEO({ 
  user 
}: { 
  user: { 
    username: string; 
    bio?: string; 
    avatar_url?: string;
    level: number;
  } 
}) {
  const profileSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: user.username,
    description: user.bio,
    image: user.avatar_url,
    url: `https://follow.ai/users/${user.username}`,
  };

  return (
    <SEO
      title={`${user.username} 的个人主页`}
      description={user.bio || `${user.username} 是 Follow.ai 的 Lv.${user.level} 评测员`}
      image={user.avatar_url}
      url={`https://follow.ai/users/${user.username}`}
      type="profile"
      schema={profileSchema}
    />
  );
}
```

---

### 8.2 XML Sitemap 生成

```typescript
// scripts/generate-sitemap.ts (新建)
import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

async function generateSitemap() {
  const baseUrl = 'https://follow.ai';
  const urls: SitemapURL[] = [];

  // 静态页面
  const staticPages = [
    { path: '/', priority: 1.0, changefreq: 'daily' as const },
    { path: '/tasks', priority: 0.9, changefreq: 'hourly' as const },
    { path: '/leaderboard', priority: 0.7, changefreq: 'daily' as const },
    { path: '/about', priority: 0.5, changefreq: 'monthly' as const },
    { path: '/faq', priority: 0.5, changefreq: 'monthly' as const },
    { path: '/terms', priority: 0.3, changefreq: 'yearly' as const },
    { path: '/privacy', priority: 0.3, changefreq: 'yearly' as const },
  ];

  staticPages.forEach(page => {
    urls.push({
      loc: `${baseUrl}${page.path}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: page.changefreq,
      priority: page.priority,
    });
  });

  // 动态任务页面
  const { data: tasks } = await supabase
    .from('tasks')
    .select('id, updated_at')
    .eq('is_active', true)
    .order('updated_at', { ascending: false });

  tasks?.forEach(task => {
    urls.push({
      loc: `${baseUrl}/tasks/${task.id}`,
      lastmod: new Date(task.updated_at).toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.8,
    });
  });

  // 生成 XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  writeFileSync('public/sitemap.xml', xml);
  console.log(`Generated sitemap with ${urls.length} URLs`);
}

generateSitemap().catch(console.error);
```

#### Step 8.2.1: 添加 Sitemap 生成脚本

```json
// package.json (添加脚本)
{
  "scripts": {
    "generate:sitemap": "tsx scripts/generate-sitemap.ts"
  }
}
```

---

### 8.3 可访问性工具库

```typescript
// src/lib/a11y.ts (新建)
import { useEffect, useRef, useCallback } from 'react';

/**
 * 键盘导航 Hook
 * 支持方向键、Tab、Enter、Escape 导航
 */
export function useKeyboardNavigation<T extends HTMLElement>(
  items: T[],
  options: {
    orientation?: 'horizontal' | 'vertical' | 'both';
    loop?: boolean;
    onSelect?: (index: number) => void;
    onEscape?: () => void;
  } = {}
) {
  const { 
    orientation = 'vertical', 
    loop = true, 
    onSelect, 
    onEscape 
  } = options;
  
  const currentIndex = useRef(0);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key } = event;
    let newIndex = currentIndex.current;
    const maxIndex = items.length - 1;

    switch (key) {
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault();
          newIndex = loop 
            ? (currentIndex.current + 1) % items.length
            : Math.min(currentIndex.current + 1, maxIndex);
        }
        break;
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault();
          newIndex = loop
            ? (currentIndex.current - 1 + items.length) % items.length
            : Math.max(currentIndex.current - 1, 0);
        }
        break;
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault();
          newIndex = loop
            ? (currentIndex.current + 1) % items.length
            : Math.min(currentIndex.current + 1, maxIndex);
        }
        break;
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault();
          newIndex = loop
            ? (currentIndex.current - 1 + items.length) % items.length
            : Math.max(currentIndex.current - 1, 0);
        }
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = maxIndex;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        onSelect?.(currentIndex.current);
        return;
      case 'Escape':
        event.preventDefault();
        onEscape?.();
        return;
      default:
        return;
    }

    if (newIndex !== currentIndex.current) {
      currentIndex.current = newIndex;
      items[newIndex]?.focus();
    }
  }, [items, orientation, loop, onSelect, onEscape]);

  return { handleKeyDown, currentIndex };
}

/**
 * Focus Trap Hook
 * 将焦点限制在容器内（用于模态框）
 */
export function useFocusTrap(isActive: boolean = true) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // 保存当前焦点元素
    previousActiveElement.current = document.activeElement as HTMLElement;

    // 获取所有可聚焦元素
    const getFocusableElements = () => {
      if (!containerRef.current) return [];
      return Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
    };

    // 聚焦第一个元素
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // 处理 Tab 键
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // 恢复之前的焦点
      previousActiveElement.current?.focus();
    };
  }, [isActive]);

  return containerRef;
}

/**
 * 屏幕阅读器公告 Hook
 */
export function useAnnounce() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // 延迟移除，确保屏幕阅读器能读取
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  return announce;
}

/**
 * 跳过链接组件
 */
export function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="absolute top-0 left-0 z-50 p-4 bg-blue-600 text-white focus:outline-none"
      >
        跳转到主要内容
      </a>
      <a
        href="#main-navigation"
        className="absolute top-0 left-32 z-50 p-4 bg-blue-600 text-white focus:outline-none"
      >
        跳转到导航
      </a>
    </div>
  );
}

/**
 * 可访问性按钮组件
 */
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
}

export function AccessibleButton({
  children,
  loading,
  loadingText = '加载中...',
  disabled,
  ...props
}: AccessibleButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-disabled={disabled || loading}
    >
      {loading ? (
        <>
          <span className="sr-only">{loadingText}</span>
          <span aria-hidden="true">{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

/**
 * 颜色对比度检查
 */
export function checkContrast(foreground: string, background: string): {
  ratio: number;
  passes: { AA: boolean; AAA: boolean; AALarge: boolean; AAALarge: boolean };
} {
  const getLuminance = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return {
    ratio,
    passes: {
      AA: ratio >= 4.5,
      AAA: ratio >= 7,
      AALarge: ratio >= 3,
      AAALarge: ratio >= 4.5,
    },
  };
}
```

---

### 8.4 在 Layout 中添加可访问性支持

```tsx
// src/components/Layout.tsx (修改)
import { Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { SkipLinks } from '@/lib/a11y';

export function Layout() {
  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col">
        {/* 跳过链接 */}
        <SkipLinks />
        
        {/* 导航 */}
        <header>
          <nav id="main-navigation" aria-label="主导航">
            <Navbar />
          </nav>
        </header>
        
        {/* 主要内容 */}
        <main id="main-content" className="flex-1" role="main">
          <Outlet />
        </main>
        
        {/* 页脚 */}
        <Footer />
      </div>
    </HelmetProvider>
  );
}
```

---

### 8.5 Phase 6 验证和提交

```bash
# SEO 验证
1. 检查页面 <head> 中的 meta 标签
2. 检查结构化数据：https://search.google.com/test/rich-results
3. 生成 sitemap: pnpm generate:sitemap
4. 验证 sitemap: https://www.xml-sitemaps.com/validate-xml-sitemap.html

# 可访问性验证
1. 使用 axe DevTools 扫描
2. 使用键盘导航测试
3. 使用屏幕阅读器测试
4. 检查颜色对比度

# Lighthouse 审计
npx lighthouse https://follow.ai --output html --output-path ./lighthouse-a11y.html

# 提交
git add -A
git commit -m "feat: Phase 6 - SEO and Accessibility (Schema.org, WCAG 2.2)"
git push origin feat/phase6-seo-a11y
```

---

## 九、Phase 7: 测试完善

> **来源**: 融合  
> **时间**: 2天  
> **目标**: 达到 80%+ 测试覆盖率

### 9.1 Vitest 配置

```typescript
// vitest.config.ts (新建)
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/*',
      ],
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 9.2 测试设置文件

```typescript
// tests/setup.ts (新建)
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// 每个测试后清理
afterEach(() => {
  cleanup();
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver,
});

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
    removeAllChannels: vi.fn(),
  },
}));
```

### 9.3 单元测试示例

```typescript
// src/lib/validations.test.ts (新建)
import { describe, it, expect } from 'vitest';
import { 
  emailSchema, 
  passwordSchema, 
  strongPasswordSchema,
  usernameSchema,
  loginSchema,
  registerSchema 
} from './validations';

describe('Validation Schemas', () => {
  describe('emailSchema', () => {
    it('should accept valid email', () => {
      const result = emailSchema.safeParse('test@example.com');
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = emailSchema.safeParse('invalid-email');
      expect(result.success).toBe(false);
    });

    it('should reject empty email', () => {
      const result = emailSchema.safeParse('');
      expect(result.success).toBe(false);
    });
  });

  describe('passwordSchema', () => {
    it('should accept any non-empty password', () => {
      const result = passwordSchema.safeParse('123');
      expect(result.success).toBe(true);
    });

    it('should reject empty password', () => {
      const result = passwordSchema.safeParse('');
      expect(result.success).toBe(false);
    });
  });

  describe('strongPasswordSchema', () => {
    it('should accept strong password', () => {
      const result = strongPasswordSchema.safeParse('Password123');
      expect(result.success).toBe(true);
    });

    it('should reject password without uppercase', () => {
      const result = strongPasswordSchema.safeParse('password123');
      expect(result.success).toBe(false);
    });

    it('should reject password without lowercase', () => {
      const result = strongPasswordSchema.safeParse('PASSWORD123');
      expect(result.success).toBe(false);
    });

    it('should reject password without number', () => {
      const result = strongPasswordSchema.safeParse('PasswordABC');
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const result = strongPasswordSchema.safeParse('Pass1');
      expect(result.success).toBe(false);
    });
  });

  describe('usernameSchema', () => {
    it('should accept valid username', () => {
      const result = usernameSchema.safeParse('user_123');
      expect(result.success).toBe(true);
    });

    it('should reject username with special characters', () => {
      const result = usernameSchema.safeParse('user@123');
      expect(result.success).toBe(false);
    });

    it('should reject short username', () => {
      const result = usernameSchema.safeParse('ab');
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should accept valid login data', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid login data', () => {
      const result = loginSchema.safeParse({
        email: 'invalid',
        password: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('should accept valid registration data', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123',
        confirmPassword: 'Password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject mismatched passwords', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123',
        confirmPassword: 'Password456',
      });
      expect(result.success).toBe(false);
    });
  });
});
```

### 9.4 组件测试示例

```typescript
// src/components/AuthModal.test.tsx (新建)
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthModal } from './AuthModal';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock AuthContext
const mockSignIn = vi.fn();
const mockSignUp = vi.fn();

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    signUp: mockSignUp,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('AuthModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form by default', () => {
    render(<AuthModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('欢迎回来')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toHaveTextContent('登录');
  });

  it('should switch to register mode', async () => {
    render(<AuthModal isOpen={true} onClose={mockOnClose} />);
    
    const switchButton = screen.getByText('立即注册');
    await userEvent.click(switchButton);
    
    expect(screen.getByText('创建账户')).toBeInTheDocument();
    expect(screen.getByTestId('username-input')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();
  });

  it('should show validation errors for invalid email', async () => {
    render(<AuthModal isOpen={true} onClose={mockOnClose} />);
    
    const emailInput = screen.getByTestId('email-input');
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.tab(); // Trigger blur
    
    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toBeInTheDocument();
    });
  });

  it('should call signIn on valid login submission', async () => {
    mockSignIn.mockResolvedValueOnce(undefined);
    
    render(<AuthModal isOpen={true} onClose={mockOnClose} />);
    
    await userEvent.type(screen.getByTestId('email-input'), 'test@example.com');
    await userEvent.type(screen.getByTestId('password-input'), 'password123');
    await userEvent.click(screen.getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should show server error on login failure', async () => {
    mockSignIn.mockRejectedValueOnce(new Error('Invalid credentials'));
    
    render(<AuthModal isOpen={true} onClose={mockOnClose} />);
    
    await userEvent.type(screen.getByTestId('email-input'), 'test@example.com');
    await userEvent.type(screen.getByTestId('password-input'), 'wrongpassword');
    await userEvent.click(screen.getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
  });

  it('should close modal on close button click', async () => {
    render(<AuthModal isOpen={true} onClose={mockOnClose} />);
    
    const closeButton = screen.getByLabelText('关闭');
    await userEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should not render when isOpen is false', () => {
    render(<AuthModal isOpen={false} onClose={mockOnClose} />);
    
    expect(screen.queryByTestId('auth-modal')).not.toBeInTheDocument();
  });
});
```

### 9.5 E2E 测试修复

```typescript
// tests/e2e/auth.spec.ts (更新)
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login modal when clicking login button', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    await expect(page.locator('[data-testid="auth-modal"]')).toBeVisible();
    await expect(page.locator('text=欢迎回来')).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    await page.fill('[data-testid="email-input"]', 'invalid-email');
    await page.click('[data-testid="password-input"]'); // Trigger blur
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
  });

  test('should show error message for wrong credentials', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    await page.fill('[data-testid="email-input"]', 'wrong@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    await page.click('[data-testid="submit-button"]');
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible({ timeout: 10000 });
  });

  test('should switch between login and register modes', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    await page.click('text=立即注册');
    await expect(page.locator('text=创建账户')).toBeVisible();
    await expect(page.locator('[data-testid="username-input"]')).toBeVisible();
  });

  test('should close modal when clicking close button', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    await page.click('[aria-label="关闭"]');
    await expect(page.locator('[data-testid="auth-modal"]')).not.toBeVisible();
  });

  test('should close modal when clicking outside', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    await page.click('.fixed.inset-0', { position: { x: 10, y: 10 } });
    await expect(page.locator('[data-testid="auth-modal"]')).not.toBeVisible();
  });
});

test.describe('Authenticated User', () => {
  test.beforeEach(async ({ page }) => {
    // 登录
    await page.goto('/');
    await page.click('[data-testid="login-button"]');
    await page.fill('[data-testid="email-input"]', process.env.TEST_USER_EMAIL!);
    await page.fill('[data-testid="password-input"]', process.env.TEST_USER_PASSWORD!);
    await page.click('[data-testid="submit-button"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
  });

  test('should display user menu after login', async ({ page }) => {
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should navigate to dashboard', async ({ page }) => {
    await expect(page.locator('[data-testid="dashboard-link"]')).toBeVisible();
    await page.click('[data-testid="dashboard-link"]');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should display notifications button', async ({ page }) => {
    await expect(page.locator('[data-testid="notifications-button"]')).toBeVisible();
  });

  test('should open notifications panel', async ({ page }) => {
    await page.click('[data-testid="notifications-button"]');
    await expect(page.locator('[data-testid="notifications-panel"]')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    await page.click('[data-testid="logout-button"]');
    await page.waitForURL('/');
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
    // 验证 localStorage 已清空
    const storage = await page.evaluate(() => localStorage.length);
    expect(storage).toBe(0);
  });
});
```

### 9.6 Playwright 配置

```typescript
// playwright.config.ts (更新)
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

### 9.7 Phase 7 验证和提交

```bash
# 运行单元测试
pnpm test:run

# 运行测试覆盖率
pnpm test:coverage
# 目标：70%+ 覆盖率

# 运行 E2E 测试
pnpm test:e2e
# 目标：80%+ 通过率

# 查看测试报告
open playwright-report/index.html

# 提交
git add -A
git commit -m "test: Phase 7 - Test coverage improvement (Vitest, Playwright)"
git push origin feat/phase7-testing
```

---

## 十、验证清单

### 10.1 功能验证

| 功能 | 验证方法 | 预期结果 |
|------|----------|----------|
| 登出流程 | 手动测试 + E2E | localStorage 清空，重定向到首页 |
| 通知面板 | 手动测试 + E2E | 打开/关闭正常，乐观更新生效 |
| 表单验证 | 单元测试 + E2E | 错误消息正确显示 |
| 代码分割 | Bundle 分析 | 多个 vendor chunk |
| 懒加载 | Network 标签 | 按需加载 JS |
| Admin Dashboard | 手动测试 | 统计数据正确 |
| AI Review | API 测试 | 返回评审结果 |
| Success Score | 数据库查询 | 自动计算正确 |
| SEO | 结构化数据测试 | 通过验证 |
| 可访问性 | axe DevTools | 无严重问题 |

### 10.2 性能验证

| 指标 | 工具 | 目标 |
|------|------|------|
| LCP | Lighthouse | < 2.5s |
| INP | Lighthouse | < 200ms |
| CLS | Lighthouse | < 0.1 |
| Performance Score | Lighthouse | ≥ 90 |
| Bundle Size | vite-bundle-visualizer | < 250KB |

### 10.3 测试覆盖验证

| 类型 | 工具 | 目标 |
|------|------|------|
| 单元测试 | Vitest | 70%+ |
| E2E 测试 | Playwright | 80%+ |
| 认证测试 | Playwright | 90%+ |
| Dashboard 测试 | Playwright | 80%+ |

---

## 十一、附录

### A. 完整文件清单

```
src/
├── lib/
│   ├── auth-utils.ts          # 登出工具函数
│   ├── react-query.ts         # React Query 客户端
│   ├── sentry.ts              # Sentry 配置
│   ├── posthog.ts             # PostHog 配置
│   ├── web-vitals.ts          # Web Vitals 监控
│   ├── validations.ts         # Zod 验证 Schema
│   ├── a11y.ts                # 可访问性工具
│   └── validations.test.ts    # 验证测试
├── components/
│   ├── AuthModal.tsx          # 重构的认证模态框
│   ├── AuthModal.test.tsx     # 认证模态框测试
│   ├── NotificationCenter.tsx # 重构的通知中心
│   ├── ErrorFallback.tsx      # 错误边界组件
│   ├── PageLoader.tsx         # 页面加载组件
│   ├── Skeleton.tsx           # 骨架屏组件
│   ├── OptimizedImage.tsx     # 优化图片组件
│   ├── SEO.tsx                # SEO 组件
│   └── SuccessScoreCard.tsx   # Success Score 展示
├── pages/
│   └── admin/
│       └── Dashboard.tsx      # Admin Dashboard
├── contexts/
│   └── AuthContext.tsx        # 更新的认证上下文
├── router.tsx                 # 懒加载路由
└── main.tsx                   # 入口文件（含监控初始化）

supabase/
└── functions/
    └── ai-review/
        └── index.ts           # AI Review Edge Function

scripts/
└── generate-sitemap.ts        # Sitemap 生成脚本

tests/
├── setup.ts                   # 测试设置
└── e2e/
    ├── auth.spec.ts           # 认证 E2E 测试
    └── dashboard.spec.ts      # Dashboard E2E 测试

migrations/
├── 20260108_admin_roles.sql   # 管理员角色迁移
└── 20260108_success_score.sql # Success Score 迁移

配置文件:
├── vite.config.ts             # Vite 配置（含代码分割）
├── vitest.config.ts           # Vitest 配置
├── playwright.config.ts       # Playwright 配置
└── .env.local                 # 环境变量
```

### B. Git 提交历史

```bash
# Phase 0
chore: Phase 0 - Infrastructure setup

# Phase 1
fix: Phase 1 - P0 bug fixes (logout, notifications, form validation)

# Phase 2
feat: Phase 2 - Monitoring system (Sentry, PostHog, Web Vitals)

# Phase 3
perf: Phase 3 - Performance optimization (code splitting, lazy loading, image optimization)

# Phase 4
feat: Phase 4 - Admin Dashboard and AI Review system

# Phase 5
feat: Phase 5 - Gamification system (Success Score, Levels, Badges)

# Phase 6
feat: Phase 6 - SEO and Accessibility (Schema.org, WCAG 2.2)

# Phase 7
test: Phase 7 - Test coverage improvement (Vitest, Playwright)

# 最终合并
git checkout main
git merge feat/comprehensive-fixes
git push origin main
```

### C. 依赖版本

```json
{
  "dependencies": {
    "@hookform/resolvers": "^3.3.4",
    "@sentry/react": "^7.100.0",
    "@supabase/supabase-js": "^2.87.1",
    "@tanstack/react-query": "^5.17.0",
    "date-fns": "^3.3.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.312.0",
    "posthog-js": "^1.100.0",
    "react": "^19.2.1",
    "react-dom": "^19.2.1",
    "react-helmet-async": "^2.0.4",
    "react-hook-form": "^7.50.0",
    "react-router-dom": "^6.22.0",
    "web-vitals": "^3.5.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@playwright/test": "^1.41.0",
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^14.2.0",
    "@testing-library/user-event": "^14.5.0",
    "rollup-plugin-visualizer": "^5.12.0",
    "sharp": "^0.33.2",
    "vite-plugin-compression": "^0.5.1",
    "vite-plugin-image-optimizer": "^1.1.7",
    "vitest": "^1.2.0"
  }
}
```

---

**文档版本**: 2.0  
**作者**: Manus AI  
**最后更新**: 2026年1月8日

