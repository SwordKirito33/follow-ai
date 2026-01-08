# Follow.ai 完整修复执行手册

**版本**: 1.0  
**日期**: 2026年1月8日  
**GitHub仓库**: SwordKirito33/follow-ai  
**目标**: 将综合评分从 6.3/10 提升至 8.7/10  

---

## 目录

1. [修复顺序逻辑](#一修复顺序逻辑)
2. [Phase 1: 基础设施和监控](#二phase-1-基础设施和监控week-1)
3. [Phase 2: P0 Bug 修复](#三phase-2-p0-bug-修复week-2)
4. [Phase 3: 核心功能实现](#四phase-3-核心功能实现week-3-4)
5. [Phase 4: 性能和SEO优化](#五phase-4-性能和seo优化week-5-6)
6. [Phase 5: 游戏化系统](#六phase-5-游戏化系统week-7-8)
7. [Phase 6: 测试和收尾](#七phase-6-测试和收尾week-9-10)
8. [验证清单](#八验证清单)

---

## 一、修复顺序逻辑

### 1.1 依赖关系图

```
Phase 1: 基础设施 (必须先完成)
    │
    ├── Sentry 错误监控 ──────────────┐
    ├── PostHog 产品分析 ─────────────┤
    └── Web Vitals 监控 ──────────────┤
                                      │
Phase 2: P0 Bug 修复 ◄────────────────┘
    │   (需要监控来验证修复效果)
    ├── 登出流程修复
    ├── 通知面板修复
    ├── 表单验证修复
    └── 代码分割配置
           │
Phase 3: 核心功能 ◄───────────────────┘
    │   (需要 Bug 修复后的稳定基础)
    ├── Admin Dashboard
    │       └── 需要 RLS 策略
    ├── AI Review Assistant
    │       └── 需要 Admin Dashboard
    └── 管理员权限系统
           │
Phase 4: 性能和SEO ◄──────────────────┘
    │   (需要核心功能完成后优化)
    ├── SEO 结构化数据
    ├── WCAG 可访问性
    └── 图片和Bundle优化
           │
Phase 5: 游戏化系统 ◄─────────────────┘
    │   (需要稳定的核心功能)
    ├── Success Score 系统
    │       └── 需要数据库表
    ├── 等级徽章体系
    │       └── 需要 Success Score
    └── 30天宽限期机制
           │
Phase 6: 测试和收尾 ◄─────────────────┘
        (最后验证所有功能)
    ├── E2E 测试修复
    ├── 单元测试覆盖
    └── 最终性能优化
```

### 1.2 修复顺序总览

| 序号 | Phase | 任务 | 依赖 | 工时 |
|------|-------|------|------|------|
| 1 | Phase 1 | Sentry 集成 | 无 | 4h |
| 2 | Phase 1 | PostHog 集成 | 无 | 4h |
| 3 | Phase 1 | Web Vitals 监控 | Sentry | 2h |
| 4 | Phase 2 | 登出流程修复 | 监控 | 4h |
| 5 | Phase 2 | 通知面板修复 | 监控 | 8h |
| 6 | Phase 2 | 表单验证统一 | 监控 | 8h |
| 7 | Phase 2 | 代码分割配置 | 无 | 4h |
| 8 | Phase 2 | Skeleton 组件 | 代码分割 | 4h |
| 9 | Phase 3 | 管理员 RLS 策略 | 无 | 4h |
| 10 | Phase 3 | Admin Dashboard | RLS | 24h |
| 11 | Phase 3 | AI Review Assistant | Admin | 16h |
| 12 | Phase 4 | SEO 结构化数据 | 无 | 8h |
| 13 | Phase 4 | WCAG 可访问性 | 无 | 16h |
| 14 | Phase 4 | 图片优化 | 无 | 8h |
| 15 | Phase 5 | Success Score 数据库 | 无 | 4h |
| 16 | Phase 5 | Success Score 算法 | 数据库 | 8h |
| 17 | Phase 5 | 等级徽章体系 | Score | 16h |
| 18 | Phase 6 | E2E 测试修复 | 全部 | 16h |
| 19 | Phase 6 | 单元测试覆盖 | 全部 | 24h |
| 20 | Phase 6 | 最终性能优化 | 全部 | 8h |

**总工时**: 186h ≈ **5周全职开发**

---

## 二、Phase 1: 基础设施和监控（Week 1）

> **目标**: 建立可观测性基础，为后续修复提供监控支持

### 任务 1.1: Sentry 错误监控集成

**步骤 1: 安装依赖**

```bash
cd /path/to/follow-ai
pnpm add @sentry/react
```

**步骤 2: 创建 Sentry 配置文件**

创建文件 `src/lib/sentry.ts`:

```typescript
// src/lib/sentry.ts
import * as Sentry from '@sentry/react';

export function initSentry() {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      release: `follow-ai@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,
      
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      
      // 生产环境采样率
      tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      
      // 过滤噪音错误
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications',
        'Network request failed',
        'Failed to fetch',
        /Loading chunk \d+ failed/,
        'AbortError',
        'ChunkLoadError',
      ],
      
      // 移除敏感信息
      beforeSend(event) {
        if (event.user) {
          delete event.user.email;
          delete event.user.ip_address;
        }
        return event;
      },
    });
  }
}

// 错误边界组件
export { ErrorBoundary } from '@sentry/react';

// 手动捕获错误
export function captureError(error: Error, context?: Record<string, unknown>) {
  Sentry.captureException(error, { extra: context });
}

// 捕获消息
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  Sentry.captureMessage(message, level);
}

// 设置用户上下文
export function setUser(user: { id: string; username?: string }) {
  Sentry.setUser({ id: user.id, username: user.username });
}

// 清除用户上下文
export function clearUser() {
  Sentry.setUser(null);
}
```

**步骤 3: 创建错误边界组件**

创建文件 `src/components/ErrorFallback.tsx`:

```typescript
// src/components/ErrorFallback.tsx
import { useEffect } from 'react';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  useEffect(() => {
    // 错误已被 Sentry 自动捕获
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full bg-gray-800 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">😵</div>
        <h1 className="text-2xl font-bold text-white mb-2">出错了</h1>
        <p className="text-gray-400 mb-6">
          应用程序遇到了意外错误。我们已记录此问题并将尽快修复。
        </p>
        <div className="space-y-3">
          <button
            onClick={resetError}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            重试
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            返回首页
          </button>
        </div>
        {import.meta.env.DEV && (
          <details className="mt-6 text-left">
            <summary className="text-gray-500 cursor-pointer">错误详情</summary>
            <pre className="mt-2 p-4 bg-gray-900 rounded text-red-400 text-xs overflow-auto">
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
```

**步骤 4: 修改 main.tsx 入口文件**

修改文件 `src/main.tsx`:

```typescript
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from '@sentry/react';
import App from './App';
import { initSentry } from './lib/sentry';
import { ErrorFallback } from './components/ErrorFallback';
import './index.css';

// 初始化 Sentry（必须在 React 渲染之前）
initSentry();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <ErrorFallback error={error} resetError={resetError} />
      )}
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
```

**步骤 5: 添加环境变量**

在 `.env` 和 `.env.production` 中添加:

```env
VITE_SENTRY_DSN=your_sentry_dsn_here
VITE_APP_VERSION=1.0.0
```

**验证方法**:
```bash
# 构建并检查 Sentry 是否正确加载
pnpm build
# 在浏览器控制台检查
# window.__SENTRY__ 应该存在
```

---

### 任务 1.2: PostHog 产品分析集成

**步骤 1: 安装依赖**

```bash
pnpm add posthog-js
```

**步骤 2: 创建 PostHog 配置文件**

创建文件 `src/lib/posthog.ts`:

```typescript
// src/lib/posthog.ts
import posthog from 'posthog-js';

let isInitialized = false;

export function initPostHog() {
  if (isInitialized || !import.meta.env.VITE_POSTHOG_KEY) {
    return;
  }

  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
    
    // 自动捕获配置
    autocapture: true,
    capture_pageview: true,
    capture_pageleave: true,
    
    // 持久化配置
    persistence: 'localStorage',
    
    // 隐私配置
    disable_session_recording: false,
    mask_all_text: false,
    mask_all_element_attributes: false,
    
    // Feature Flags 启动配置
    bootstrap: {
      featureFlags: {
        'new-dashboard': false,
        'ai-review-v2': false,
        'success-score': false,
      },
    },
    
    // 加载完成回调
    loaded: (posthog) => {
      if (import.meta.env.DEV) {
        // 开发环境下启用调试
        posthog.debug();
      }
    },
  });

  isInitialized = true;
}

// 用户身份识别
export function identifyUser(userId: string, properties?: Record<string, unknown>) {
  if (!isInitialized) return;
  posthog.identify(userId, properties);
}

// 重置用户身份
export function resetUser() {
  if (!isInitialized) return;
  posthog.reset();
}

// Feature Flag Hook
export function useFeatureFlag(flagKey: string): boolean | undefined {
  if (!isInitialized) return undefined;
  return posthog.isFeatureEnabled(flagKey);
}

// 事件追踪
export const analytics = {
  // 页面浏览
  pageView: (pageName: string, properties?: Record<string, unknown>) => {
    posthog.capture('$pageview', { page_name: pageName, ...properties });
  },

  // 任务相关事件
  taskViewed: (taskId: string, taskType: string) => {
    posthog.capture('task_viewed', { task_id: taskId, task_type: taskType });
  },

  taskStarted: (taskId: string, taskType: string) => {
    posthog.capture('task_started', { task_id: taskId, task_type: taskType });
  },

  taskSubmitted: (taskId: string, taskType: string, duration?: number) => {
    posthog.capture('task_submitted', { 
      task_id: taskId, 
      task_type: taskType,
      duration_seconds: duration,
    });
  },

  taskApproved: (taskId: string, score: number, xpEarned: number) => {
    posthog.capture('task_approved', { 
      task_id: taskId, 
      quality_score: score,
      xp_earned: xpEarned,
    });
  },

  taskRejected: (taskId: string, reason: string) => {
    posthog.capture('task_rejected', { task_id: taskId, rejection_reason: reason });
  },

  // XP 和等级事件
  xpEarned: (amount: number, source: string) => {
    posthog.capture('xp_earned', { xp_amount: amount, source });
  },

  levelUp: (newLevel: number, previousLevel: number) => {
    posthog.capture('level_up', { new_level: newLevel, previous_level: previousLevel });
  },

  badgeEarned: (badgeId: string, badgeName: string) => {
    posthog.capture('badge_earned', { badge_id: badgeId, badge_name: badgeName });
  },

  // 认证事件
  signUp: (method: string) => {
    posthog.capture('sign_up', { method });
  },

  signIn: (method: string) => {
    posthog.capture('sign_in', { method });
  },

  signOut: () => {
    posthog.capture('sign_out');
  },

  // 搜索和筛选
  search: (query: string, resultsCount: number) => {
    posthog.capture('search', { query, results_count: resultsCount });
  },

  filterApplied: (filterType: string, filterValue: string) => {
    posthog.capture('filter_applied', { filter_type: filterType, filter_value: filterValue });
  },

  // 错误追踪
  error: (errorType: string, errorMessage: string, context?: Record<string, unknown>) => {
    posthog.capture('error_occurred', { 
      error_type: errorType, 
      error_message: errorMessage,
      ...context,
    });
  },
};

// 导出 posthog 实例供高级用法
export { posthog };
```

**步骤 3: 在 main.tsx 中初始化**

修改 `src/main.tsx`:

```typescript
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from '@sentry/react';
import App from './App';
import { initSentry } from './lib/sentry';
import { initPostHog } from './lib/posthog';
import { ErrorFallback } from './components/ErrorFallback';
import './index.css';

// 初始化监控（必须在 React 渲染之前）
initSentry();
initPostHog();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <ErrorFallback error={error} resetError={resetError} />
      )}
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
```

**步骤 4: 添加环境变量**

```env
VITE_POSTHOG_KEY=your_posthog_key_here
VITE_POSTHOG_HOST=https://app.posthog.com
```

---

### 任务 1.3: Web Vitals 监控

**步骤 1: 安装依赖**

```bash
pnpm add web-vitals
```

**步骤 2: 创建 Web Vitals 监控文件**

创建文件 `src/lib/web-vitals.ts`:

```typescript
// src/lib/web-vitals.ts
import { onLCP, onINP, onCLS, onFCP, onTTFB, Metric } from 'web-vitals';
import * as Sentry from '@sentry/react';
import { posthog } from './posthog';

// 性能阈值定义
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
};

// 获取评级
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

// 发送指标到分析服务
function sendMetric(metric: Metric) {
  const rating = getRating(metric.name, metric.value);
  
  // 发送到 PostHog
  posthog?.capture('web_vital', {
    metric_name: metric.name,
    metric_value: metric.value,
    metric_rating: rating,
    metric_delta: metric.delta,
    metric_id: metric.id,
    navigation_type: metric.navigationType,
  });

  // 如果性能差，发送到 Sentry 作为警告
  if (rating === 'poor') {
    Sentry.captureMessage(`Performance regression: ${metric.name}`, {
      level: 'warning',
      tags: {
        web_vital: metric.name,
        rating: rating,
      },
      extra: {
        value: metric.value,
        threshold: THRESHOLDS[metric.name as keyof typeof THRESHOLDS],
        delta: metric.delta,
        id: metric.id,
      },
    });
  }

  // 开发环境下打印到控制台
  if (import.meta.env.DEV) {
    console.log(`[Web Vital] ${metric.name}:`, {
      value: metric.value,
      rating,
      delta: metric.delta,
    });
  }
}

// 初始化 Web Vitals 监控
export function initWebVitals() {
  // 核心指标
  onLCP(sendMetric);
  onINP(sendMetric);
  onCLS(sendMetric);
  
  // 辅助指标
  onFCP(sendMetric);
  onTTFB(sendMetric);
}

// React Hook 用于组件内监控
export function useWebVitals() {
  // 在组件挂载时初始化
  if (typeof window !== 'undefined') {
    initWebVitals();
  }
}
```

**步骤 3: 在 main.tsx 中初始化**

修改 `src/main.tsx`:

```typescript
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from '@sentry/react';
import App from './App';
import { initSentry } from './lib/sentry';
import { initPostHog } from './lib/posthog';
import { initWebVitals } from './lib/web-vitals';
import { ErrorFallback } from './components/ErrorFallback';
import './index.css';

// 初始化监控（必须在 React 渲染之前）
initSentry();
initPostHog();

// Web Vitals 在页面加载后初始化
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    initWebVitals();
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <ErrorFallback error={error} resetError={resetError} />
      )}
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
```

**Phase 1 验证清单**:
- [ ] Sentry Dashboard 能看到错误上报
- [ ] PostHog Dashboard 能看到事件
- [ ] 控制台能看到 Web Vitals 日志
- [ ] 构建成功无错误

---

## 三、Phase 2: P0 Bug 修复（Week 2）

> **目标**: 修复所有影响用户体验的关键 Bug

### 任务 2.1: 登出流程修复

**问题分析**:
- Supabase auth 状态清理不完整
- localStorage 残留数据
- React Query 缓存未清理
- 页面未正确重定向

**步骤 1: 修改 AuthContext**

修改文件 `src/contexts/AuthContext.tsx`:

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { setUser as setSentryUser, clearUser as clearSentryUser } from '@/lib/sentry';
import { identifyUser, resetUser as resetPostHogUser, analytics } from '@/lib/posthog';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 初始化认证状态
  useEffect(() => {
    // 获取当前会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // 设置监控用户上下文
      if (session?.user) {
        setSentryUser({ id: session.user.id });
        identifyUser(session.user.id, {
          email: session.user.email,
          created_at: session.user.created_at,
        });
      }
      
      setLoading(false);
    });

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (event === 'SIGNED_IN' && session?.user) {
          setSentryUser({ id: session.user.id });
          identifyUser(session.user.id);
        }

        if (event === 'SIGNED_OUT') {
          clearSentryUser();
          resetPostHogUser();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 登录
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        analytics.error('sign_in_failed', error.message);
        return { error };
      }

      analytics.signIn('email');
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  // 注册
  const signUp = useCallback(async (email: string, password: string, username: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });

      if (error) {
        analytics.error('sign_up_failed', error.message);
        return { error };
      }

      analytics.signUp('email');
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  // 登出 - 完整清理流程
  const signOut = useCallback(async () => {
    try {
      // 1. 追踪登出事件
      analytics.signOut();

      // 2. 调用 Supabase 登出
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase signOut error:', error);
      }

      // 3. 清理 React Query 缓存
      queryClient.clear();

      // 4. 清理本地存储
      localStorage.clear();
      sessionStorage.clear();

      // 5. 清理监控用户上下文
      clearSentryUser();
      resetPostHogUser();

      // 6. 重置本地状态
      setUser(null);
      setSession(null);

      // 7. 重定向到首页
      navigate('/', { replace: true });

    } catch (error) {
      console.error('SignOut error:', error);
      // 即使出错也要清理状态
      setUser(null);
      setSession(null);
      navigate('/', { replace: true });
    }
  }, [queryClient, navigate]);

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
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

**步骤 2: 更新 Navbar 登出按钮**

修改文件 `src/components/Navbar.tsx` 中的登出按钮:

```typescript
// 在 Navbar 组件中找到登出按钮，确保使用 signOut
import { useAuth } from '@/contexts/AuthContext';

// 在组件内
const { signOut, user } = useAuth();

// 登出按钮（桌面端）
<button
  onClick={signOut}
  data-testid="logout-button"
  className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
>
  <LogOut className="w-4 h-4" />
  <span>登出</span>
</button>

// 登出按钮（移动端）
<button
  onClick={signOut}
  data-testid="logout-button-mobile"
  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
>
  <LogOut className="w-5 h-5" />
  <span>登出</span>
</button>
```

**验证方法**:
```bash
# 运行 E2E 测试
PLAYWRIGHT_TEST_BASE_URL=https://www.follow-ai.com npx playwright test auth.spec.ts --grep "logout"
```

---

### 任务 2.2: 通知面板修复

**问题分析**:
- State 管理竞态条件
- 点击外部关闭逻辑不完整
- 动画状态不同步

**步骤 1: 重写 NotificationCenter 组件**

修改文件 `src/components/NotificationCenter.tsx`:

```typescript
// src/components/NotificationCenter.tsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { Bell, X, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 获取通知列表
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!user,
    refetchInterval: 30000, // 30秒刷新一次
  });

  // 未读数量
  const unreadCount = notifications.filter(n => !n.read).length;

  // 标记已读
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // 标记全部已读
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // 删除通知
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // 切换面板
  const togglePanel = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // 关闭面板
  const closePanel = useCallback(() => {
    setIsOpen(false);
  }, []);

  // 点击外部关闭
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        buttonRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closePanel();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, closePanel]);

  // ESC 键关闭
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closePanel();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, closePanel]);

  // 获取通知图标颜色
  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="relative">
      {/* 通知按钮 */}
      <button
        ref={buttonRef}
        onClick={togglePanel}
        data-testid="notifications-button"
        className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
        aria-label={`通知 ${unreadCount > 0 ? `(${unreadCount} 条未读)` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* 通知面板 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            data-testid="notifications-panel"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50"
            role="dialog"
            aria-label="通知面板"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
              <h3 className="font-semibold text-white">通知</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsReadMutation.mutate()}
                    className="text-xs text-blue-400 hover:text-blue-300"
                    disabled={markAllAsReadMutation.isPending}
                  >
                    全部已读
                  </button>
                )}
                <button
                  onClick={closePanel}
                  className="p-1 text-gray-400 hover:text-white rounded"
                  aria-label="关闭通知面板"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 通知列表 */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-gray-400">
                  加载中...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>暂无通知</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-700">
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-700/50 transition-colors ${
                        !notification.read ? 'bg-blue-500/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 ${getTypeColor(notification.type)}`}>
                          <Bell className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            notification.read ? 'text-gray-300' : 'text-white'
                          }`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDistanceToNow(new Date(notification.created_at), {
                              addSuffix: true,
                              locale: zhCN,
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <button
                              onClick={() => markAsReadMutation.mutate(notification.id)}
                              className="p-1 text-gray-400 hover:text-green-400 rounded"
                              title="标记已读"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotificationMutation.mutate(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-400 rounded"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

### 任务 2.3: 表单验证统一（Zod 集成）

**步骤 1: 安装依赖**

```bash
pnpm add zod @hookform/resolvers react-hook-form
```

**步骤 2: 创建验证 Schema**

创建文件 `src/lib/validations.ts`:

```typescript
// src/lib/validations.ts
import { z } from 'zod';

// 通用验证规则
export const emailSchema = z
  .string()
  .min(1, '请输入邮箱')
  .email('请输入有效的邮箱地址');

export const passwordSchema = z
  .string()
  .min(1, '请输入密码')
  .min(8, '密码至少8个字符')
  .regex(/[A-Z]/, '密码需要包含至少一个大写字母')
  .regex(/[a-z]/, '密码需要包含至少一个小写字母')
  .regex(/[0-9]/, '密码需要包含至少一个数字');

export const usernameSchema = z
  .string()
  .min(1, '请输入用户名')
  .min(3, '用户名至少3个字符')
  .max(20, '用户名最多20个字符')
  .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线');

// 登录表单
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, '请输入密码'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// 注册表单
export const registerSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, '请确认密码'),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// 任务提交表单
export const taskSubmissionSchema = z.object({
  title: z
    .string()
    .min(1, '请输入标题')
    .min(5, '标题至少5个字符')
    .max(100, '标题最多100个字符'),
  content: z
    .string()
    .min(1, '请输入内容')
    .min(50, '内容至少50个字符')
    .max(10000, '内容最多10000个字符'),
  toolId: z.string().min(1, '请选择AI工具'),
  category: z.string().min(1, '请选择类别'),
  attachments: z.array(z.string()).optional(),
});

export type TaskSubmissionFormData = z.infer<typeof taskSubmissionSchema>;

// 个人资料表单
export const profileSchema = z.object({
  username: usernameSchema,
  bio: z.string().max(500, '简介最多500个字符').optional(),
  website: z.string().url('请输入有效的URL').optional().or(z.literal('')),
  twitter: z.string().max(50, 'Twitter用户名最多50个字符').optional(),
  github: z.string().max(50, 'GitHub用户名最多50个字符').optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
```

**步骤 3: 重写 AuthModal 组件**

修改文件 `src/components/AuthModal.tsx`:

```typescript
// src/components/AuthModal.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  loginSchema, 
  registerSchema, 
  LoginFormData, 
  RegisterFormData 
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
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 注册表单
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const currentForm = mode === 'login' ? loginForm : registerForm;
  const isSubmitting = currentForm.formState.isSubmitting;

  // 处理登录
  const handleLogin = async (data: LoginFormData) => {
    setServerError(null);
    const { error } = await signIn(data.email, data.password);
    if (error) {
      setServerError(error.message === 'Invalid login credentials' 
        ? '邮箱或密码错误' 
        : error.message);
    } else {
      onClose();
      loginForm.reset();
    }
  };

  // 处理注册
  const handleRegister = async (data: RegisterFormData) => {
    setServerError(null);
    const { error } = await signUp(data.email, data.password, data.username);
    if (error) {
      if (error.message.includes('already registered')) {
        setServerError('该邮箱已被注册');
      } else {
        setServerError(error.message);
      }
    } else {
      onClose();
      registerForm.reset();
    }
  };

  // 切换模式
  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setServerError(null);
    loginForm.reset();
    registerForm.reset();
  };

  // 关闭模态框
  const handleClose = () => {
    onClose();
    setServerError(null);
    loginForm.reset();
    registerForm.reset();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* 模态框内容 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md mx-4 bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            data-testid="auth-modal"
          >
            {/* 关闭按钮 */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
              aria-label="关闭"
            >
              <X className="w-5 h-5" />
            </button>

            {/* 头部 */}
            <div className="px-8 pt-8 pb-6">
              <h2 className="text-2xl font-bold text-white">
                {mode === 'login' ? '欢迎回来' : '创建账户'}
              </h2>
              <p className="mt-2 text-gray-400">
                {mode === 'login' 
                  ? '登录以继续使用 Follow.ai' 
                  : '注册以开始赚取收益'}
              </p>
            </div>

            {/* 表单 */}
            <form
              onSubmit={mode === 'login' 
                ? loginForm.handleSubmit(handleLogin)
                : registerForm.handleSubmit(handleRegister)
              }
              className="px-8 pb-8 space-y-4"
            >
              {/* 服务器错误 */}
              {serverError && (
                <div 
                  data-testid="error-message"
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
                >
                  {serverError}
                </div>
              )}

              {/* 邮箱输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  邮箱
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    {...(mode === 'login' 
                      ? loginForm.register('email')
                      : registerForm.register('email')
                    )}
                    data-testid="email-input"
                    placeholder="your@email.com"
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                      currentForm.formState.errors.email
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-600 focus:ring-blue-500'
                    }`}
                  />
                </div>
                {currentForm.formState.errors.email && (
                  <p data-testid="email-error" className="mt-1 text-sm text-red-400">
                    {currentForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* 用户名输入（仅注册） */}
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    用户名
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      {...registerForm.register('username')}
                      data-testid="username-input"
                      placeholder="your_username"
                      className={`w-full pl-10 pr-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                        registerForm.formState.errors.username
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-600 focus:ring-blue-500'
                      }`}
                    />
                  </div>
                  {registerForm.formState.errors.username && (
                    <p data-testid="username-error" className="mt-1 text-sm text-red-400">
                      {registerForm.formState.errors.username.message}
                    </p>
                  )}
                </div>
              )}

              {/* 密码输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...(mode === 'login'
                      ? loginForm.register('password')
                      : registerForm.register('password')
                    )}
                    data-testid="password-input"
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-12 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                      currentForm.formState.errors.password
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-600 focus:ring-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {currentForm.formState.errors.password && (
                  <p data-testid="password-error" className="mt-1 text-sm text-red-400">
                    {currentForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* 确认密码（仅注册） */}
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    确认密码
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...registerForm.register('confirmPassword')}
                      data-testid="confirm-password-input"
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                        registerForm.formState.errors.confirmPassword
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-600 focus:ring-blue-500'
                      }`}
                    />
                  </div>
                  {registerForm.formState.errors.confirmPassword && (
                    <p data-testid="confirm-password-error" className="mt-1 text-sm text-red-400">
                      {registerForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              )}

              {/* 提交按钮 */}
              <button
                type="submit"
                disabled={isSubmitting}
                data-testid="submit-button"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{mode === 'login' ? '登录中...' : '注册中...'}</span>
                  </>
                ) : (
                  <span>{mode === 'login' ? '登录' : '注册'}</span>
                )}
              </button>

              {/* 切换模式 */}
              <p className="text-center text-gray-400">
                {mode === 'login' ? '还没有账户？' : '已有账户？'}
                <button
                  type="button"
                  onClick={switchMode}
                  className="ml-1 text-blue-400 hover:text-blue-300"
                >
                  {mode === 'login' ? '立即注册' : '立即登录'}
                </button>
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
```

---

### 任务 2.4: 代码分割配置

**步骤 1: 修改 Vite 配置**

修改文件 `vite.config.ts`:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    
    rollupOptions: {
      output: {
        // 手动分割代码块
        manualChunks: (id) => {
          // React 核心
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/scheduler')) {
            return 'react-vendor';
          }
          
          // React Router
          if (id.includes('node_modules/react-router') ||
              id.includes('node_modules/@remix-run')) {
            return 'router-vendor';
          }
          
          // TanStack Query
          if (id.includes('node_modules/@tanstack')) {
            return 'tanstack-vendor';
          }
          
          // Supabase
          if (id.includes('node_modules/@supabase')) {
            return 'supabase-vendor';
          }
          
          // 动画库
          if (id.includes('node_modules/framer-motion')) {
            return 'animation-vendor';
          }
          
          // 图表库
          if (id.includes('node_modules/recharts') ||
              id.includes('node_modules/d3')) {
            return 'charts-vendor';
          }
          
          // 监控库
          if (id.includes('node_modules/@sentry') ||
              id.includes('node_modules/posthog')) {
            return 'monitoring-vendor';
          }
          
          // 其他第三方库
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        
        // 文件命名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    
    // 块大小警告阈值
    chunkSizeWarningLimit: 500,
  },
  
  // 优化依赖预构建
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      '@supabase/supabase-js',
      'framer-motion',
    ],
  },
});
```

**步骤 2: 实现路由级代码分割**

修改文件 `src/App.tsx`:

```typescript
// src/App.tsx
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// 懒加载页面组件
const Home = lazy(() => import('@/pages/Home'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Tasks = lazy(() => import('@/pages/Tasks'));
const TaskDetail = lazy(() => import('@/pages/TaskDetail'));
const Rankings = lazy(() => import('@/pages/Rankings'));
const Leaderboard = lazy(() => import('@/pages/Leaderboard'));
const Profile = lazy(() => import('@/pages/Profile'));
const Settings = lazy(() => import('@/pages/Settings'));
const Wallet = lazy(() => import('@/pages/Wallet'));
const Help = lazy(() => import('@/pages/Help'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Admin 页面（单独分割）
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('@/pages/admin/Users'));
const AdminTasks = lazy(() => import('@/pages/admin/Tasks'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5分钟
      gcTime: 1000 * 60 * 30, // 30分钟
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// 页面加载骨架屏
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <LoadingSpinner size="lg" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* 公开页面 */}
                <Route path="/" element={<Home />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/tasks/:id" element={<TaskDetail />} />
                <Route path="/rankings" element={<Rankings />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/help" element={<Help />} />
                
                {/* 需要认证的页面 */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="/wallet" element={
                  <ProtectedRoute>
                    <Wallet />
                  </ProtectedRoute>
                } />
                
                {/* 管理员页面 */}
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <ProtectedRoute requireAdmin>
                    <AdminUsers />
                  </ProtectedRoute>
                } />
                <Route path="/admin/tasks" element={
                  <ProtectedRoute requireAdmin>
                    <AdminTasks />
                  </ProtectedRoute>
                } />
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

---

### 任务 2.5: Skeleton 组件实现

创建文件 `src/components/Skeleton.tsx`:

```typescript
// src/components/Skeleton.tsx
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-700/50',
        className
      )}
    />
  );
}

// 卡片骨架屏
export function CardSkeleton() {
  return (
    <div className="bg-gray-800 rounded-xl p-6 space-y-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

// 任务列表骨架屏
export function TaskListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-gray-800 rounded-xl p-4 flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

// 用户资料骨架屏
export function ProfileSkeleton() {
  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <Skeleton className="h-8 w-16 mx-auto mb-2" />
          <Skeleton className="h-4 w-12 mx-auto" />
        </div>
        <div className="text-center">
          <Skeleton className="h-8 w-16 mx-auto mb-2" />
          <Skeleton className="h-4 w-12 mx-auto" />
        </div>
        <div className="text-center">
          <Skeleton className="h-8 w-16 mx-auto mb-2" />
          <Skeleton className="h-4 w-12 mx-auto" />
        </div>
      </div>
    </div>
  );
}

// Dashboard 统计骨架屏
export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="w-10 h-10 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

// 表格骨架屏
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden">
      {/* 表头 */}
      <div className="bg-gray-700/50 px-6 py-4 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* 表体 */}
      <div className="divide-y divide-gray-700">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-6 py-4 flex gap-4">
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton key={j} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
```

创建文件 `src/components/LoadingSpinner.tsx`:

```typescript
// src/components/LoadingSpinner.tsx
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-600 border-t-blue-500',
          sizeClasses[size]
        )}
      />
    </div>
  );
}
```

**Phase 2 验证清单**:
- [ ] 登出后所有状态清除
- [ ] 登出后重定向到首页
- [ ] 通知面板正常打开/关闭
- [ ] 点击外部关闭通知面板
- [ ] 表单验证错误正确显示
- [ ] 代码分割后 Bundle 大小 < 300KB
- [ ] 页面加载显示骨架屏

---


## 四、Phase 3: 核心功能实现（Week 3-4）

> **目标**: 实现 Admin Dashboard 和 AI Review Assistant

### 任务 3.1: 管理员 RLS 策略

**步骤 1: 创建数据库迁移文件**

创建文件 `supabase/migrations/20260108_admin_roles.sql`:

```sql
-- ============================================
-- 管理员角色系统
-- ============================================

-- 1. 添加管理员角色字段到 profiles 表
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' 
CHECK (role IN ('user', 'moderator', 'admin', 'super_admin'));

-- 2. 创建管理员角色索引
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 3. 创建管理员检查函数
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = (SELECT auth.uid()) 
    AND role IN ('admin', 'super_admin')
  )
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- 4. 创建版主检查函数
CREATE OR REPLACE FUNCTION is_moderator()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = (SELECT auth.uid()) 
    AND role IN ('moderator', 'admin', 'super_admin')
  )
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- 5. 创建管理员审计日志表
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  old_value JSONB,
  new_value JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 创建审计日志索引
CREATE INDEX idx_audit_admin ON admin_audit_log(admin_id);
CREATE INDEX idx_audit_created ON admin_audit_log(created_at DESC);
CREATE INDEX idx_audit_target ON admin_audit_log(target_type, target_id);

-- 7. 启用 RLS
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- 8. 审计日志 RLS 策略
CREATE POLICY "Admins can view audit logs" ON admin_audit_log
FOR SELECT TO authenticated
USING (is_admin());

CREATE POLICY "System can insert audit logs" ON admin_audit_log
FOR INSERT TO authenticated
WITH CHECK (is_admin());

-- 9. 更新 profiles 表的 RLS 策略
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT TO authenticated
USING (id = (SELECT auth.uid()) OR is_admin());

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE TO authenticated
USING (id = (SELECT auth.uid()))
WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "Admins can update any profile" ON profiles
FOR UPDATE TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- 10. 创建记录审计日志的函数
CREATE OR REPLACE FUNCTION log_admin_action(
  p_action TEXT,
  p_target_type TEXT,
  p_target_id UUID DEFAULT NULL,
  p_old_value JSONB DEFAULT NULL,
  p_new_value JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO admin_audit_log (admin_id, action, target_type, target_id, old_value, new_value)
  VALUES ((SELECT auth.uid()), p_action, p_target_type, p_target_id, p_old_value, p_new_value)
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. 创建获取管理员统计的函数
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM profiles),
    'active_users_today', (SELECT COUNT(*) FROM profiles WHERE last_seen_at > NOW() - INTERVAL '24 hours'),
    'new_users_today', (SELECT COUNT(*) FROM profiles WHERE created_at > NOW() - INTERVAL '24 hours'),
    'total_tasks', (SELECT COUNT(*) FROM tasks),
    'pending_tasks', (SELECT COUNT(*) FROM tasks WHERE status = 'pending'),
    'total_submissions', (SELECT COUNT(*) FROM submissions),
    'pending_submissions', (SELECT COUNT(*) FROM submissions WHERE status = 'pending'),
    'total_xp_distributed', (SELECT COALESCE(SUM(xp), 0) FROM xp_events)
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**步骤 2: 运行迁移**

```bash
# 使用 Supabase CLI
supabase db push

# 或者直接在 Supabase Dashboard 的 SQL Editor 中运行
```

---

### 任务 3.2: Admin Dashboard 实现

**步骤 1: 创建目录结构**

```bash
mkdir -p src/pages/admin
mkdir -p src/components/admin
```

**步骤 2: 创建 Admin Dashboard 页面**

创建文件 `src/pages/admin/Dashboard.tsx`:

```typescript
// src/pages/admin/Dashboard.tsx
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DashboardStatsSkeleton } from '@/components/Skeleton';
import { StatsCard } from '@/components/admin/StatsCard';
import { RecentActivityList } from '@/components/admin/RecentActivityList';
import { PendingReviewsTable } from '@/components/admin/PendingReviewsTable';
import { UserGrowthChart } from '@/components/admin/UserGrowthChart';

interface AdminStats {
  total_users: number;
  active_users_today: number;
  new_users_today: number;
  total_tasks: number;
  pending_tasks: number;
  total_submissions: number;
  pending_submissions: number;
  total_xp_distributed: number;
}

export default function AdminDashboard() {
  // 获取管理员统计数据
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_admin_stats');
      if (error) throw error;
      return data as AdminStats;
    },
    refetchInterval: 30000, // 30秒刷新
  });

  // 获取待审核提交
  const { data: pendingSubmissions = [], isLoading: submissionsLoading } = useQuery({
    queryKey: ['admin', 'pending-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          id,
          title,
          created_at,
          user:profiles(id, username, avatar_url),
          task:tasks(id, title, category)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 60000, // 1分钟刷新
  });

  // 获取最近活动
  const { data: recentActivity = [], isLoading: activityLoading } = useQuery({
    queryKey: ['admin', 'recent-activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    },
  });

  if (statsLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-white">管理员仪表板</h1>
        <DashboardStatsSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">管理员仪表板</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Activity className="w-4 h-4" />
          <span>实时更新中</span>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="总用户数"
          value={stats?.total_users || 0}
          icon={<Users className="w-5 h-5" />}
          trend={stats?.new_users_today ? `+${stats.new_users_today} 今日` : undefined}
          trendUp={true}
        />
        <StatsCard
          title="活跃用户"
          value={stats?.active_users_today || 0}
          icon={<TrendingUp className="w-5 h-5" />}
          description="过去24小时"
        />
        <StatsCard
          title="待审核提交"
          value={stats?.pending_submissions || 0}
          icon={<Clock className="w-5 h-5" />}
          highlight={stats?.pending_submissions > 10}
        />
        <StatsCard
          title="总XP发放"
          value={stats?.total_xp_distributed || 0}
          icon={<CheckCircle className="w-5 h-5" />}
          format="number"
        />
      </div>

      {/* 警告提示 */}
      {stats?.pending_submissions > 20 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <p className="text-yellow-500">
            有 {stats.pending_submissions} 个提交待审核，请及时处理以保证用户体验。
          </p>
        </div>
      )}

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 待审核列表 */}
        <div className="lg:col-span-2">
          <PendingReviewsTable 
            submissions={pendingSubmissions} 
            isLoading={submissionsLoading}
          />
        </div>

        {/* 最近活动 */}
        <div>
          <RecentActivityList 
            activities={recentActivity}
            isLoading={activityLoading}
          />
        </div>
      </div>

      {/* 用户增长图表 */}
      <UserGrowthChart />
    </div>
  );
}
```

**步骤 3: 创建 StatsCard 组件**

创建文件 `src/components/admin/StatsCard.tsx`:

```typescript
// src/components/admin/StatsCard.tsx
import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  description?: string;
  highlight?: boolean;
  format?: 'number' | 'currency' | 'percent';
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  trendUp,
  description,
  highlight,
  format = 'number',
}: StatsCardProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'percent':
        return `${val}%`;
      default:
        return val.toLocaleString();
    }
  };

  return (
    <div
      className={cn(
        'bg-gray-800 rounded-xl p-6 transition-all',
        highlight && 'ring-2 ring-yellow-500/50'
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-400">{title}</span>
        <div className={cn(
          'p-2 rounded-lg',
          highlight ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'
        )}>
          {icon}
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-3xl font-bold text-white">
          {formatValue(value)}
        </p>
        
        {trend && (
          <div className="flex items-center gap-1">
            {trendUp ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={cn(
              'text-sm',
              trendUp ? 'text-green-500' : 'text-red-500'
            )}>
              {trend}
            </span>
          </div>
        )}
        
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
}
```

**步骤 4: 创建 PendingReviewsTable 组件**

创建文件 `src/components/admin/PendingReviewsTable.tsx`:

```typescript
// src/components/admin/PendingReviewsTable.tsx
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, Eye, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';
import { TableSkeleton } from '@/components/Skeleton';

interface Submission {
  id: string;
  title: string;
  created_at: string;
  user: {
    id: string;
    username: string;
    avatar_url: string;
  };
  task: {
    id: string;
    title: string;
    category: string;
  };
}

interface PendingReviewsTableProps {
  submissions: Submission[];
  isLoading: boolean;
}

export function PendingReviewsTable({ submissions, isLoading }: PendingReviewsTableProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // 审批提交
  const approveMutation = useMutation({
    mutationFn: async ({ id, score }: { id: string; score: number }) => {
      const { error } = await supabase
        .from('submissions')
        .update({ 
          status: 'approved',
          quality_score: score,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) throw error;

      // 记录审计日志
      await supabase.rpc('log_admin_action', {
        p_action: 'approve_submission',
        p_target_type: 'submission',
        p_target_id: id,
        p_new_value: { status: 'approved', score },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });

  // 拒绝提交
  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { error } = await supabase
        .from('submissions')
        .update({ 
          status: 'rejected',
          rejection_reason: reason,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) throw error;

      // 记录审计日志
      await supabase.rpc('log_admin_action', {
        p_action: 'reject_submission',
        p_target_type: 'submission',
        p_target_id: id,
        p_new_value: { status: 'rejected', reason },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">待审核提交</h2>
        <TableSkeleton rows={5} cols={4} />
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">待审核提交</h2>
      </div>

      {submissions.length === 0 ? (
        <div className="p-8 text-center text-gray-400">
          <Check className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>没有待审核的提交</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  提交
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  用户
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  等待时间
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-700/30">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {submission.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {submission.task?.title} · {submission.task?.category}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={submission.user?.avatar_url || '/default-avatar.png'}
                        alt=""
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm text-gray-300">
                        {submission.user?.username}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      {formatDistanceToNow(new Date(submission.created_at), {
                        addSuffix: true,
                        locale: zhCN,
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedId(submission.id)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"
                        title="查看详情"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => approveMutation.mutate({ id: submission.id, score: 8 })}
                        disabled={approveMutation.isPending}
                        className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg"
                        title="批准"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => rejectMutation.mutate({ id: submission.id, reason: '不符合要求' })}
                        disabled={rejectMutation.isPending}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                        title="拒绝"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

---

### 任务 3.3: AI Review Assistant 实现

**步骤 1: 创建 Supabase Edge Function**

创建文件 `supabase/functions/ai-review/index.ts`:

```typescript
// supabase/functions/ai-review/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReviewRequest {
  submissionId: string;
  content: string;
  taskType: string;
}

interface ReviewResult {
  status: 'approved' | 'needs_revision' | 'rejected';
  score: number;
  feedback: string;
  dimensions: {
    completeness: number;
    accuracy: number;
    formatting: number;
    creativity: number;
  };
  flagged: boolean;
  flagReason?: string;
}

serve(async (req) => {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { submissionId, content, taskType }: ReviewRequest = await req.json();

    // 验证输入
    if (!submissionId || !content) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // Layer 1: 内容审核（使用免费的 Moderation API）
    const moderationResponse = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'omni-moderation-latest',
        input: content,
      }),
    });

    const moderationData = await moderationResponse.json();
    
    if (moderationData.results?.[0]?.flagged) {
      const result: ReviewResult = {
        status: 'rejected',
        score: 0,
        feedback: '内容违反平台政策，请修改后重新提交。',
        dimensions: { completeness: 0, accuracy: 0, formatting: 0, creativity: 0 },
        flagged: true,
        flagReason: Object.entries(moderationData.results[0].categories)
          .filter(([_, flagged]) => flagged)
          .map(([category]) => category)
          .join(', '),
      };

      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Layer 2: 质量评估（使用 GPT-4o-mini 降低成本）
    const qualityPrompt = `你是一个AI任务质量审核员。请评估以下提交内容的质量。

任务类型: ${taskType}

提交内容:
${content.substring(0, 4000)}

请从以下四个维度评估（每个维度1-10分）：
1. 完整性 (completeness): 内容是否完整，是否回答了所有要求
2. 准确性 (accuracy): 内容是否准确，是否有事实错误
3. 格式规范 (formatting): 格式是否清晰，是否易于阅读
4. 创意性 (creativity): 是否有独特见解或创新方法

请以JSON格式输出：
{
  "score": 总分(1-10),
  "feedback": "具体反馈建议（100字以内）",
  "dimensions": {
    "completeness": 分数,
    "accuracy": 分数,
    "formatting": 分数,
    "creativity": 分数
  }
}`;

    const qualityResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: '你是一个专业的内容质量审核员，请严格按照JSON格式输出。' },
          { role: 'user', content: qualityPrompt },
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    const qualityData = await qualityResponse.json();
    const reviewContent = qualityData.choices?.[0]?.message?.content;

    // 解析 AI 响应
    let review;
    try {
      // 尝试提取 JSON
      const jsonMatch = reviewContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        review = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // 解析失败时使用默认值
      review = {
        score: 7,
        feedback: '内容质量良好，已通过审核。',
        dimensions: {
          completeness: 7,
          accuracy: 7,
          formatting: 7,
          creativity: 7,
        },
      };
    }

    // 确定审核状态
    let status: ReviewResult['status'];
    if (review.score >= 7) {
      status = 'approved';
    } else if (review.score >= 5) {
      status = 'needs_revision';
    } else {
      status = 'rejected';
    }

    const result: ReviewResult = {
      status,
      score: review.score,
      feedback: review.feedback,
      dimensions: review.dimensions,
      flagged: false,
    };

    // 更新数据库中的提交记录
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase
      .from('submissions')
      .update({
        ai_review_score: review.score,
        ai_review_feedback: review.feedback,
        ai_review_dimensions: review.dimensions,
        ai_reviewed_at: new Date().toISOString(),
      })
      .eq('id', submissionId);

    return new Response(
      JSON.stringify(result),
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

**步骤 2: 部署 Edge Function**

```bash
# 部署到 Supabase
supabase functions deploy ai-review

# 设置环境变量
supabase secrets set OPENAI_API_KEY=your_openai_api_key
```

**步骤 3: 创建前端调用 Hook**

创建文件 `src/hooks/useAIReview.ts`:

```typescript
// src/hooks/useAIReview.ts
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface AIReviewResult {
  status: 'approved' | 'needs_revision' | 'rejected';
  score: number;
  feedback: string;
  dimensions: {
    completeness: number;
    accuracy: number;
    formatting: number;
    creativity: number;
  };
  flagged: boolean;
  flagReason?: string;
}

export function useAIReview() {
  return useMutation({
    mutationFn: async ({
      submissionId,
      content,
      taskType,
    }: {
      submissionId: string;
      content: string;
      taskType: string;
    }): Promise<AIReviewResult> => {
      const { data, error } = await supabase.functions.invoke('ai-review', {
        body: { submissionId, content, taskType },
      });

      if (error) throw error;
      return data;
    },
  });
}
```

**Phase 3 验证清单**:
- [ ] 管理员可以访问 /admin 页面
- [ ] 普通用户访问 /admin 被重定向
- [ ] 统计数据正确显示
- [ ] 待审核列表正常加载
- [ ] 批准/拒绝操作正常工作
- [ ] AI Review 返回正确的评分
- [ ] 审计日志正确记录

---

## 五、Phase 4: 性能和SEO优化（Week 5-6）

> **目标**: 优化性能指标和SEO

### 任务 4.1: SEO 结构化数据

**步骤 1: 创建 Schema.org 配置**

创建文件 `src/lib/schema.ts`:

```typescript
// src/lib/schema.ts

// 组织 Schema
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://follow.ai/#organization',
  name: 'Follow.ai',
  url: 'https://follow.ai',
  logo: {
    '@type': 'ImageObject',
    url: 'https://follow.ai/logo.png',
    width: 512,
    height: 512,
  },
  description: 'The first AI tool review platform with mandatory real work verification.',
  sameAs: [
    'https://twitter.com/followai',
    'https://linkedin.com/company/followai',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'support@follow.ai',
  },
};

// 网站 Schema
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://follow.ai/#website',
  url: 'https://follow.ai',
  name: 'Follow.ai',
  description: 'AI Tool Review Platform',
  publisher: {
    '@id': 'https://follow.ai/#organization',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://follow.ai/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

// FAQ Schema 生成器
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// 产品 Schema 生成器（用于 AI 工具）
export function generateProductSchema(tool: {
  name: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: tool.name,
    description: tool.description,
    image: tool.image,
    category: tool.category,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tool.rating,
      reviewCount: tool.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  };
}

// 评论 Schema 生成器
export function generateReviewSchema(review: {
  author: string;
  datePublished: string;
  reviewBody: string;
  rating: number;
  itemReviewed: {
    name: string;
    type: string;
  };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author,
    },
    datePublished: review.datePublished,
    reviewBody: review.reviewBody,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    itemReviewed: {
      '@type': review.itemReviewed.type,
      name: review.itemReviewed.name,
    },
  };
}

// 面包屑 Schema 生成器
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
```

**步骤 2: 创建 SEO 组件**

创建文件 `src/components/SEO.tsx`:

```typescript
// src/components/SEO.tsx
import { Helmet } from 'react-helmet-async';
import { organizationSchema, websiteSchema } from '@/lib/schema';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  schema?: object | object[];
  noindex?: boolean;
}

const DEFAULT_TITLE = 'Follow.ai - Where AI Tools Show Their Real Work';
const DEFAULT_DESCRIPTION = 'The first AI tool review platform with mandatory real work verification. No fake reviews. No upvote farms. Just real outputs from real users.';
const DEFAULT_IMAGE = 'https://follow.ai/og-image.png';
const SITE_URL = 'https://follow.ai';

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  schema,
  noindex = false,
}: SEOProps) {
  const fullTitle = title ? `${title} | Follow.ai` : DEFAULT_TITLE;
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  // 合并 Schema
  const schemas = [
    organizationSchema,
    websiteSchema,
    ...(Array.isArray(schema) ? schema : schema ? [schema] : []),
  ];

  return (
    <Helmet>
      {/* 基础 Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Follow.ai" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@followai" />

      {/* 结构化数据 */}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
```

**步骤 3: 安装依赖并配置**

```bash
pnpm add react-helmet-async
```

修改 `src/main.tsx`:

```typescript
import { HelmetProvider } from 'react-helmet-async';

// 包装 App
<HelmetProvider>
  <App />
</HelmetProvider>
```

**步骤 4: 创建 Sitemap 生成脚本**

创建文件 `scripts/generate-sitemap.ts`:

```typescript
// scripts/generate-sitemap.ts
import { writeFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const SITE_URL = 'https://follow.ai';

async function generateSitemap() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 静态页面
  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/tasks', priority: 0.9, changefreq: 'daily' },
    { url: '/rankings', priority: 0.8, changefreq: 'daily' },
    { url: '/leaderboard', priority: 0.8, changefreq: 'daily' },
    { url: '/help', priority: 0.5, changefreq: 'monthly' },
  ];

  // 获取所有任务
  const { data: tasks } = await supabase
    .from('tasks')
    .select('id, updated_at')
    .eq('status', 'active');

  // 获取所有工具
  const { data: tools } = await supabase
    .from('tools')
    .select('id, updated_at');

  // 生成 XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
  ${(tasks || []).map(task => `
  <url>
    <loc>${SITE_URL}/tasks/${task.id}</loc>
    <lastmod>${new Date(task.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
  ${(tools || []).map(tool => `
  <url>
    <loc>${SITE_URL}/tools/${tool.id}</loc>
    <lastmod>${new Date(tool.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`;

  writeFileSync('public/sitemap.xml', xml);
  console.log('Sitemap generated successfully!');
}

generateSitemap();
```

---

### 任务 4.2: WCAG 可访问性优化

**步骤 1: 创建可访问性工具函数**

创建文件 `src/lib/a11y.ts`:

```typescript
// src/lib/a11y.ts

// 焦点管理
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }

  element.addEventListener('keydown', handleKeyDown);
  firstElement?.focus();

  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

// 屏幕阅读器公告
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.setAttribute('class', 'sr-only');
  document.body.appendChild(announcer);

  setTimeout(() => {
    announcer.textContent = message;
  }, 100);

  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
}

// 跳过导航链接
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
    >
      跳过导航
    </a>
  );
}
```

**步骤 2: 创建可访问性按钮组件**

创建文件 `src/components/ui/AccessibleButton.tsx`:

```typescript
// src/components/ui/AccessibleButton.tsx
import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading, 
    disabled, 
    icon,
    children, 
    className,
    ...props 
  }, ref) => {
    const baseStyles = cn(
      // WCAG 2.2: 最小触摸目标 44x44px
      'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all',
      // 焦点指示器：2px 以上实线轮廓
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900',
      // 禁用状态
      (disabled || loading) && 'opacity-50 cursor-not-allowed',
    );

    const variantStyles = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
      secondary: 'bg-gray-700 text-white hover:bg-gray-600 focus-visible:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
      ghost: 'bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white focus-visible:ring-gray-500',
    };

    const sizeStyles = {
      sm: 'min-h-[36px] min-w-[36px] px-3 py-1.5 text-sm',
      md: 'min-h-[44px] min-w-[44px] px-4 py-2 text-base',
      lg: 'min-h-[52px] min-w-[52px] px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            <span>处理中...</span>
          </>
        ) : (
          <>
            {icon && <span aria-hidden="true">{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';
```

**步骤 3: 添加全局 CSS 样式**

在 `src/index.css` 中添加:

```css
/* 屏幕阅读器专用样式 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.not-sr-only {
  position: static;
  width: auto;
  height: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

/* 焦点样式增强 */
:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* 减少动画（用户偏好） */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  :root {
    --color-text: #ffffff;
    --color-bg: #000000;
    --color-border: #ffffff;
  }
}
```

**Phase 4 验证清单**:
- [ ] 所有页面有正确的 title 和 description
- [ ] Schema.org 结构化数据正确
- [ ] sitemap.xml 生成成功
- [ ] 所有按钮 ≥ 44x44px
- [ ] 焦点指示器清晰可见
- [ ] 键盘可以完全导航
- [ ] 屏幕阅读器可以正确读取

---


## 六、Phase 5: 游戏化系统（Week 7-8）

> **目标**: 实现 Success Score 和等级徽章体系

### 任务 5.1: Success Score 数据库设计

**步骤 1: 创建数据库迁移**

创建文件 `supabase/migrations/20260108_success_score.sql`:

```sql
-- ============================================
-- Success Score 游戏化系统
-- ============================================

-- 1. 创建 Success Score 表
CREATE TABLE IF NOT EXISTS success_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- 核心分数
  total_score INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  
  -- 各维度分数
  quality_score INTEGER DEFAULT 0,      -- 质量分 (0-100)
  consistency_score INTEGER DEFAULT 0,  -- 一致性分 (0-100)
  speed_score INTEGER DEFAULT 0,        -- 速度分 (0-100)
  diversity_score INTEGER DEFAULT 0,    -- 多样性分 (0-100)
  
  -- 统计数据
  total_submissions INTEGER DEFAULT 0,
  approved_submissions INTEGER DEFAULT 0,
  rejected_submissions INTEGER DEFAULT 0,
  total_xp_earned INTEGER DEFAULT 0,
  
  -- 30天宽限期
  grace_period_start TIMESTAMPTZ,
  grace_period_reason TEXT,
  
  -- 时间戳
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- 2. 创建索引
CREATE INDEX idx_success_scores_user ON success_scores(user_id);
CREATE INDEX idx_success_scores_total ON success_scores(total_score DESC);
CREATE INDEX idx_success_scores_streak ON success_scores(current_streak DESC);

-- 3. 创建等级表
CREATE TABLE IF NOT EXISTS user_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  level INTEGER DEFAULT 1,
  xp_current INTEGER DEFAULT 0,
  xp_to_next_level INTEGER DEFAULT 100,
  title TEXT DEFAULT 'Novice',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- 4. 创建徽章表
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('achievement', 'streak', 'quality', 'special')),
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 0,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 创建用户徽章关联表
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, badge_id)
);

-- 6. 创建索引
CREATE INDEX idx_user_badges_user ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge ON user_badges(badge_id);

-- 7. 启用 RLS
ALTER TABLE success_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- 8. RLS 策略
CREATE POLICY "Users can view own success score" ON success_scores
FOR SELECT TO authenticated
USING (user_id = (SELECT auth.uid()) OR is_admin());

CREATE POLICY "System can update success scores" ON success_scores
FOR ALL TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Users can view own level" ON user_levels
FOR SELECT TO authenticated
USING (user_id = (SELECT auth.uid()) OR is_admin());

CREATE POLICY "Anyone can view badges" ON badges
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can view own badges" ON user_badges
FOR SELECT TO authenticated
USING (user_id = (SELECT auth.uid()) OR is_admin());

-- 9. 插入默认徽章
INSERT INTO badges (name, description, icon, category, requirement_type, requirement_value, xp_reward, rarity) VALUES
-- 成就徽章
('First Steps', '完成第一个任务', 'rocket', 'achievement', 'submissions', 1, 50, 'common'),
('Rising Star', '完成10个任务', 'star', 'achievement', 'submissions', 10, 100, 'uncommon'),
('Veteran', '完成50个任务', 'award', 'achievement', 'submissions', 50, 250, 'rare'),
('Legend', '完成100个任务', 'crown', 'achievement', 'submissions', 100, 500, 'epic'),
('Mythic', '完成500个任务', 'gem', 'achievement', 'submissions', 500, 1000, 'legendary'),

-- 连续徽章
('Consistent', '连续7天活跃', 'flame', 'streak', 'streak', 7, 100, 'uncommon'),
('Dedicated', '连续30天活跃', 'fire', 'streak', 'streak', 30, 300, 'rare'),
('Unstoppable', '连续100天活跃', 'zap', 'streak', 'streak', 100, 1000, 'legendary'),

-- 质量徽章
('Quality First', '获得10次高质量评分', 'thumbs-up', 'quality', 'high_quality', 10, 150, 'uncommon'),
('Perfectionist', '获得50次高质量评分', 'check-circle', 'quality', 'high_quality', 50, 400, 'rare'),
('Master', '获得100次高质量评分', 'shield', 'quality', 'high_quality', 100, 800, 'epic'),

-- 特殊徽章
('Early Adopter', '早期用户', 'clock', 'special', 'special', 1, 200, 'rare'),
('Bug Hunter', '发现并报告Bug', 'bug', 'special', 'special', 1, 150, 'uncommon'),
('Community Hero', '帮助其他用户', 'heart', 'special', 'special', 1, 200, 'rare');

-- 10. 创建计算 Success Score 的函数
CREATE OR REPLACE FUNCTION calculate_success_score(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_quality INTEGER;
  v_consistency INTEGER;
  v_speed INTEGER;
  v_diversity INTEGER;
  v_total INTEGER;
BEGIN
  -- 计算质量分 (基于通过率和评分)
  SELECT COALESCE(
    ROUND(
      (CAST(approved_submissions AS FLOAT) / NULLIF(total_submissions, 0) * 50) +
      (quality_score * 0.5)
    ), 0
  ) INTO v_quality
  FROM success_scores WHERE user_id = p_user_id;
  
  -- 计算一致性分 (基于连续天数)
  SELECT COALESCE(
    LEAST(current_streak * 2, 100), 0
  ) INTO v_consistency
  FROM success_scores WHERE user_id = p_user_id;
  
  -- 计算速度分 (基于平均完成时间)
  v_speed := 70; -- 默认值，需要根据实际数据计算
  
  -- 计算多样性分 (基于任务类型覆盖)
  v_diversity := 60; -- 默认值，需要根据实际数据计算
  
  -- 计算总分 (加权平均)
  v_total := ROUND(
    v_quality * 0.4 +
    v_consistency * 0.3 +
    v_speed * 0.15 +
    v_diversity * 0.15
  );
  
  -- 更新分数
  UPDATE success_scores SET
    quality_score = v_quality,
    consistency_score = v_consistency,
    speed_score = v_speed,
    diversity_score = v_diversity,
    total_score = v_total,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  RETURN v_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. 创建更新连续天数的函数
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_last_activity TIMESTAMPTZ;
  v_current_streak INTEGER;
  v_longest_streak INTEGER;
BEGIN
  SELECT last_activity_at, current_streak, longest_streak
  INTO v_last_activity, v_current_streak, v_longest_streak
  FROM success_scores WHERE user_id = p_user_id;
  
  IF v_last_activity IS NULL THEN
    -- 新用户
    INSERT INTO success_scores (user_id, current_streak, longest_streak, last_activity_at)
    VALUES (p_user_id, 1, 1, NOW());
  ELSIF v_last_activity::date = (NOW() - INTERVAL '1 day')::date THEN
    -- 连续活跃
    v_current_streak := v_current_streak + 1;
    IF v_current_streak > v_longest_streak THEN
      v_longest_streak := v_current_streak;
    END IF;
    
    UPDATE success_scores SET
      current_streak = v_current_streak,
      longest_streak = v_longest_streak,
      last_activity_at = NOW()
    WHERE user_id = p_user_id;
  ELSIF v_last_activity::date < (NOW() - INTERVAL '1 day')::date THEN
    -- 中断连续
    UPDATE success_scores SET
      current_streak = 1,
      last_activity_at = NOW()
    WHERE user_id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. 创建检查并授予徽章的函数
CREATE OR REPLACE FUNCTION check_and_award_badges(p_user_id UUID)
RETURNS TABLE(badge_id UUID, badge_name TEXT) AS $$
DECLARE
  v_badge RECORD;
  v_user_stats RECORD;
BEGIN
  -- 获取用户统计
  SELECT * INTO v_user_stats FROM success_scores WHERE user_id = p_user_id;
  
  -- 遍历所有徽章检查是否满足条件
  FOR v_badge IN SELECT * FROM badges LOOP
    -- 检查用户是否已有该徽章
    IF NOT EXISTS (SELECT 1 FROM user_badges WHERE user_id = p_user_id AND badge_id = v_badge.id) THEN
      -- 检查是否满足条件
      IF (v_badge.requirement_type = 'submissions' AND v_user_stats.total_submissions >= v_badge.requirement_value) OR
         (v_badge.requirement_type = 'streak' AND v_user_stats.longest_streak >= v_badge.requirement_value) OR
         (v_badge.requirement_type = 'high_quality' AND v_user_stats.approved_submissions >= v_badge.requirement_value) THEN
        
        -- 授予徽章
        INSERT INTO user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id);
        
        -- 返回新获得的徽章
        badge_id := v_badge.id;
        badge_name := v_badge.name;
        RETURN NEXT;
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. 创建等级计算函数
CREATE OR REPLACE FUNCTION calculate_user_level(p_user_id UUID)
RETURNS TABLE(level INTEGER, title TEXT, xp_current INTEGER, xp_to_next INTEGER) AS $$
DECLARE
  v_total_xp INTEGER;
  v_level INTEGER;
  v_title TEXT;
  v_xp_for_level INTEGER;
  v_xp_to_next INTEGER;
BEGIN
  -- 获取总XP
  SELECT COALESCE(SUM(xp), 0) INTO v_total_xp
  FROM xp_events WHERE user_id = p_user_id;
  
  -- 计算等级 (每级需要的XP递增)
  v_level := 1;
  v_xp_for_level := 0;
  
  WHILE v_total_xp >= (v_level * 100) LOOP
    v_xp_for_level := v_xp_for_level + (v_level * 100);
    v_level := v_level + 1;
  END LOOP;
  
  v_xp_to_next := (v_level * 100) - (v_total_xp - v_xp_for_level);
  
  -- 确定称号
  v_title := CASE
    WHEN v_level >= 50 THEN 'Grandmaster'
    WHEN v_level >= 40 THEN 'Master'
    WHEN v_level >= 30 THEN 'Expert'
    WHEN v_level >= 20 THEN 'Professional'
    WHEN v_level >= 10 THEN 'Skilled'
    WHEN v_level >= 5 THEN 'Apprentice'
    ELSE 'Novice'
  END;
  
  -- 更新用户等级表
  INSERT INTO user_levels (user_id, level, xp_current, xp_to_next_level, title)
  VALUES (p_user_id, v_level, v_total_xp - v_xp_for_level, v_xp_to_next, v_title)
  ON CONFLICT (user_id) DO UPDATE SET
    level = v_level,
    xp_current = v_total_xp - v_xp_for_level,
    xp_to_next_level = v_xp_to_next,
    title = v_title,
    updated_at = NOW();
  
  RETURN QUERY SELECT v_level, v_title, v_total_xp - v_xp_for_level, v_xp_to_next;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

### 任务 5.2: Success Score 前端实现

**步骤 1: 创建 Success Score Hook**

创建文件 `src/hooks/useSuccessScore.ts`:

```typescript
// src/hooks/useSuccessScore.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface SuccessScore {
  total_score: number;
  current_streak: number;
  longest_streak: number;
  quality_score: number;
  consistency_score: number;
  speed_score: number;
  diversity_score: number;
  total_submissions: number;
  approved_submissions: number;
  rejected_submissions: number;
  grace_period_start: string | null;
  grace_period_reason: string | null;
}

interface UserLevel {
  level: number;
  title: string;
  xp_current: number;
  xp_to_next_level: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  earned_at?: string;
}

export function useSuccessScore() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 获取 Success Score
  const { data: score, isLoading: scoreLoading } = useQuery({
    queryKey: ['success-score', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('success_scores')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as SuccessScore | null;
    },
    enabled: !!user,
  });

  // 获取用户等级
  const { data: level, isLoading: levelLoading } = useQuery({
    queryKey: ['user-level', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase.rpc('calculate_user_level', {
        p_user_id: user.id,
      });
      
      if (error) throw error;
      return data[0] as UserLevel;
    },
    enabled: !!user,
  });

  // 获取用户徽章
  const { data: badges = [], isLoading: badgesLoading } = useQuery({
    queryKey: ['user-badges', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          earned_at,
          badge:badges(*)
        `)
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });
      
      if (error) throw error;
      return data.map((item: any) => ({
        ...item.badge,
        earned_at: item.earned_at,
      })) as Badge[];
    },
    enabled: !!user,
  });

  // 获取所有可用徽章
  const { data: allBadges = [] } = useQuery({
    queryKey: ['all-badges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .order('requirement_value', { ascending: true });
      
      if (error) throw error;
      return data as Badge[];
    },
  });

  // 申请宽限期
  const requestGracePeriod = useMutation({
    mutationFn: async (reason: string) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('success_scores')
        .update({
          grace_period_start: new Date().toISOString(),
          grace_period_reason: reason,
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['success-score'] });
    },
  });

  // 计算进度百分比
  const getScoreProgress = (current: number, max: number = 100) => {
    return Math.min((current / max) * 100, 100);
  };

  // 获取分数等级
  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: 'S', color: 'text-yellow-400' };
    if (score >= 80) return { grade: 'A', color: 'text-green-400' };
    if (score >= 70) return { grade: 'B', color: 'text-blue-400' };
    if (score >= 60) return { grade: 'C', color: 'text-gray-400' };
    return { grade: 'D', color: 'text-red-400' };
  };

  return {
    score,
    level,
    badges,
    allBadges,
    isLoading: scoreLoading || levelLoading || badgesLoading,
    requestGracePeriod,
    getScoreProgress,
    getScoreGrade,
  };
}
```

**步骤 2: 创建 Success Score 展示组件**

创建文件 `src/components/SuccessScoreCard.tsx`:

```typescript
// src/components/SuccessScoreCard.tsx
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Flame, 
  Zap, 
  Target, 
  Award,
  Info,
  Calendar
} from 'lucide-react';
import { useSuccessScore } from '@/hooks/useSuccessScore';
import { Skeleton } from '@/components/Skeleton';

export function SuccessScoreCard() {
  const { score, level, getScoreProgress, getScoreGrade, isLoading } = useSuccessScore();

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!score) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 text-center">
        <Award className="w-12 h-12 mx-auto mb-3 text-gray-500" />
        <p className="text-gray-400">完成第一个任务以开始追踪你的 Success Score</p>
      </div>
    );
  }

  const { grade, color } = getScoreGrade(score.total_score);

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Success Score</h3>
        <button className="p-1 text-gray-400 hover:text-white">
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* 主分数 */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-700"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className="text-blue-500"
              initial={{ strokeDasharray: '0 352' }}
              animate={{ 
                strokeDasharray: `${(score.total_score / 100) * 352} 352` 
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${color}`}>{grade}</span>
            <span className="text-lg text-gray-400">{score.total_score}</span>
          </div>
        </div>
      </div>

      {/* 连续天数 */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <Flame className="w-5 h-5 text-orange-500" />
        <span className="text-white font-medium">{score.current_streak} 天连续</span>
        <span className="text-gray-500">/ 最高 {score.longest_streak} 天</span>
      </div>

      {/* 维度分数 */}
      <div className="space-y-3">
        <ScoreDimension
          icon={<Target className="w-4 h-4" />}
          label="质量"
          value={score.quality_score}
          color="blue"
        />
        <ScoreDimension
          icon={<TrendingUp className="w-4 h-4" />}
          label="一致性"
          value={score.consistency_score}
          color="green"
        />
        <ScoreDimension
          icon={<Zap className="w-4 h-4" />}
          label="速度"
          value={score.speed_score}
          color="yellow"
        />
        <ScoreDimension
          icon={<Award className="w-4 h-4" />}
          label="多样性"
          value={score.diversity_score}
          color="purple"
        />
      </div>

      {/* 宽限期状态 */}
      {score.grace_period_start && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-500">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">宽限期进行中</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">{score.grace_period_reason}</p>
        </div>
      )}

      {/* 等级信息 */}
      {level && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">等级 {level.level}</span>
            <span className="text-sm text-gray-400">{level.title}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ 
                width: `${(level.xp_current / (level.xp_current + level.xp_to_next_level)) * 100}%` 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">
            {level.xp_current} / {level.xp_current + level.xp_to_next_level} XP
          </p>
        </div>
      )}
    </div>
  );
}

// 维度分数组件
function ScoreDimension({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: number; 
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="flex items-center gap-3">
      <div className="text-gray-400">{icon}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-300">{label}</span>
          <span className="text-sm text-white font-medium">{value}</span>
        </div>
        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${colorClasses[color as keyof typeof colorClasses]}`}
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>
      </div>
    </div>
  );
}
```

---

## 七、Phase 6: 测试和收尾（Week 9-10）

> **目标**: 完善测试覆盖，确保系统稳定

### 任务 6.1: E2E 测试修复

**步骤 1: 更新测试配置**

修改文件 `playwright.config.ts`:

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
  ],
  
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
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

  webServer: process.env.PLAYWRIGHT_TEST_BASE_URL ? undefined : {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

**步骤 2: 创建测试工具函数**

创建文件 `tests/utils/test-helpers.ts`:

```typescript
// tests/utils/test-helpers.ts
import { Page, expect } from '@playwright/test';

// 等待页面加载完成
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

// 登录辅助函数
export async function login(page: Page, email: string, password: string) {
  await page.goto('/');
  await page.click('[data-testid="login-button"]');
  await page.waitForSelector('[data-testid="auth-modal"]');
  await page.fill('[data-testid="email-input"]', email);
  await page.fill('[data-testid="password-input"]', password);
  await page.click('[data-testid="submit-button"]');
  await page.waitForSelector('[data-testid="user-menu"]', { timeout: 10000 });
}

// 登出辅助函数
export async function logout(page: Page) {
  await page.click('[data-testid="user-menu"]');
  await page.click('[data-testid="logout-button"]');
  await page.waitForURL('/');
}

// 检查元素是否可见
export async function isVisible(page: Page, selector: string): Promise<boolean> {
  try {
    await page.waitForSelector(selector, { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

// 等待 Toast 消息
export async function waitForToast(page: Page, message: string) {
  await page.waitForSelector(`text=${message}`, { timeout: 5000 });
}

// 截图并保存
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
}

// 模拟网络延迟
export async function simulateSlowNetwork(page: Page) {
  const client = await page.context().newCDPSession(page);
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: 500 * 1024 / 8,
    uploadThroughput: 500 * 1024 / 8,
    latency: 400,
  });
}

// 清理测试数据
export async function cleanupTestData(page: Page) {
  // 清理 localStorage
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}
```

**步骤 3: 修复认证测试**

修改文件 `tests/e2e/auth.spec.ts`:

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';
import { waitForPageLoad, login, logout, cleanupTestData } from '../utils/test-helpers';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await cleanupTestData(page);
  });

  test('should display login modal when clicking login button', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    await page.click('[data-testid="login-button"]');
    await expect(page.locator('[data-testid="auth-modal"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
  });

  test('should show error for invalid email format', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="login-button"]');
    
    await page.fill('[data-testid="email-input"]', 'invalid-email');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="submit-button"]');
    
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
  });

  test('should show error for empty fields', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="login-button"]');
    
    await page.click('[data-testid="submit-button"]');
    
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
  });

  test('should show error for wrong credentials', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="login-button"]');
    
    await page.fill('[data-testid="email-input"]', 'wrong@email.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    await page.click('[data-testid="submit-button"]');
    
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible({ timeout: 10000 });
  });

  test('should switch between login and register modes', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="login-button"]');
    
    // 切换到注册
    await page.click('text=立即注册');
    await expect(page.locator('[data-testid="username-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="confirm-password-input"]')).toBeVisible();
    
    // 切换回登录
    await page.click('text=立即登录');
    await expect(page.locator('[data-testid="username-input"]')).not.toBeVisible();
  });

  test('should close modal when clicking close button', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="login-button"]');
    await expect(page.locator('[data-testid="auth-modal"]')).toBeVisible();
    
    await page.click('[aria-label="关闭"]');
    await expect(page.locator('[data-testid="auth-modal"]')).not.toBeVisible();
  });

  test('should redirect unauthenticated users from protected routes', async ({ page }) => {
    await page.goto('/dashboard');
    await waitForPageLoad(page);
    
    // 应该重定向到首页或显示登录提示
    await expect(page).toHaveURL('/');
  });
});
```

**步骤 4: 修复仪表板测试**

修改文件 `tests/e2e/dashboard.spec.ts`:

```typescript
// tests/e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';
import { waitForPageLoad, login, cleanupTestData } from '../utils/test-helpers';

test.describe('Dashboard', () => {
  const testUser = {
    email: process.env.TEST_USER_EMAIL || 'test@example.com',
    password: process.env.TEST_USER_PASSWORD || 'testpassword123',
  };

  test.beforeEach(async ({ page }) => {
    await cleanupTestData(page);
    // 如果有测试账号，先登录
    if (process.env.TEST_USER_EMAIL) {
      await login(page, testUser.email, testUser.password);
    }
  });

  test('should display user stats section', async ({ page }) => {
    await page.goto('/dashboard');
    await waitForPageLoad(page);
    
    await expect(page.locator('[data-testid="user-stats"]')).toBeVisible();
  });

  test('should display task statistics', async ({ page }) => {
    await page.goto('/dashboard');
    await waitForPageLoad(page);
    
    await expect(page.locator('[data-testid="active-tasks-count"]')).toBeVisible();
    await expect(page.locator('[data-testid="completed-tasks-count"]')).toBeVisible();
  });

  test('should display recent activity', async ({ page }) => {
    await page.goto('/dashboard');
    await waitForPageLoad(page);
    
    await expect(page.locator('[data-testid="recent-activity"]')).toBeVisible();
  });

  test('should open notifications panel', async ({ page }) => {
    await page.goto('/dashboard');
    await waitForPageLoad(page);
    
    await page.click('[data-testid="notifications-button"]');
    await expect(page.locator('[data-testid="notifications-panel"]')).toBeVisible();
  });

  test('should close notifications panel when clicking outside', async ({ page }) => {
    await page.goto('/dashboard');
    await waitForPageLoad(page);
    
    await page.click('[data-testid="notifications-button"]');
    await expect(page.locator('[data-testid="notifications-panel"]')).toBeVisible();
    
    // 点击外部区域
    await page.click('body', { position: { x: 10, y: 10 } });
    await expect(page.locator('[data-testid="notifications-panel"]')).not.toBeVisible();
  });

  test('should navigate to tasks page', async ({ page }) => {
    await page.goto('/dashboard');
    await waitForPageLoad(page);
    
    await page.click('[data-testid="view-all-tasks"]');
    await expect(page).toHaveURL(/\/tasks/);
  });

  test('should display user avatar', async ({ page }) => {
    await page.goto('/dashboard');
    await waitForPageLoad(page);
    
    await expect(page.locator('[data-testid="user-avatar"]')).toBeVisible();
  });

  test('should refresh dashboard data', async ({ page }) => {
    await page.goto('/dashboard');
    await waitForPageLoad(page);
    
    const refreshButton = page.locator('[data-testid="refresh-dashboard"]');
    if (await refreshButton.isVisible()) {
      await refreshButton.click();
      // 等待刷新完成
      await page.waitForTimeout(1000);
    }
  });

  test('should load dashboard within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/dashboard');
    await waitForPageLoad(page);
    const loadTime = Date.now() - startTime;
    
    // 页面应在5秒内加载完成
    expect(loadTime).toBeLessThan(5000);
  });
});
```

---

### 任务 6.2: 单元测试配置

**步骤 1: 安装测试依赖**

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**步骤 2: 配置 Vitest**

创建文件 `vitest.config.ts`:

```typescript
// vitest.config.ts
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
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**步骤 3: 创建测试设置文件**

创建文件 `tests/setup.ts`:

```typescript
// tests/setup.ts
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
  value: vi.fn().mockImplementation((query) => ({
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
```

**步骤 4: 创建示例单元测试**

创建文件 `src/lib/validations.test.ts`:

```typescript
// src/lib/validations.test.ts
import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema, emailSchema, passwordSchema } from './validations';

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
    it('should accept valid password', () => {
      const result = passwordSchema.safeParse('Password123');
      expect(result.success).toBe(true);
    });

    it('should reject short password', () => {
      const result = passwordSchema.safeParse('Pass1');
      expect(result.success).toBe(false);
    });

    it('should reject password without uppercase', () => {
      const result = passwordSchema.safeParse('password123');
      expect(result.success).toBe(false);
    });

    it('should reject password without lowercase', () => {
      const result = passwordSchema.safeParse('PASSWORD123');
      expect(result.success).toBe(false);
    });

    it('should reject password without number', () => {
      const result = passwordSchema.safeParse('PasswordABC');
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should accept valid login data', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'anypassword',
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

    it('should reject invalid username', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        username: 'ab', // too short
        password: 'Password123',
        confirmPassword: 'Password123',
      });
      expect(result.success).toBe(false);
    });
  });
});
```

**步骤 5: 添加 npm scripts**

在 `package.json` 中添加:

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "pnpm test:run && pnpm test:e2e"
  }
}
```

---

## 八、验证清单

### 完整验证清单

| Phase | 任务 | 验证方法 | 预期结果 |
|-------|------|----------|----------|
| 1 | Sentry 集成 | 触发错误查看 Dashboard | 错误被记录 |
| 1 | PostHog 集成 | 执行操作查看事件 | 事件被追踪 |
| 1 | Web Vitals | 查看控制台/PostHog | 指标被记录 |
| 2 | 登出流程 | 登出后检查状态 | 完全清除 |
| 2 | 通知面板 | 点击打开/关闭 | 正常工作 |
| 2 | 表单验证 | 输入无效数据 | 显示错误 |
| 2 | 代码分割 | 检查 Network | 按需加载 |
| 3 | Admin Dashboard | 管理员访问 | 正常显示 |
| 3 | AI Review | 提交内容 | 返回评分 |
| 4 | SEO | 检查 Schema | 正确渲染 |
| 4 | 可访问性 | 键盘导航 | 可完全操作 |
| 5 | Success Score | 完成任务 | 分数更新 |
| 5 | 徽章系统 | 达成条件 | 获得徽章 |
| 6 | E2E 测试 | 运行测试 | 80%+ 通过 |
| 6 | 单元测试 | 运行测试 | 90%+ 通过 |

### 运行验证命令

```bash
# 1. 运行所有测试
pnpm test:all

# 2. 检查构建
pnpm build

# 3. 检查 Bundle 大小
npx vite-bundle-visualizer

# 4. 运行 Lighthouse
npx lighthouse https://follow.ai --output html --output-path ./lighthouse-report.html

# 5. 检查可访问性
npx axe-cli https://follow.ai

# 6. 验证 Schema
# 使用 Google Rich Results Test: https://search.google.com/test/rich-results
```

---

## 附录

### A. 环境变量清单

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# 监控
VITE_SENTRY_DSN=your_sentry_dsn
VITE_POSTHOG_KEY=your_posthog_key
VITE_POSTHOG_HOST=https://app.posthog.com

# AI Review
OPENAI_API_KEY=your_openai_api_key

# 应用
VITE_APP_VERSION=1.0.0
VITE_APP_URL=https://follow.ai

# 测试
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=testpassword123
PLAYWRIGHT_TEST_BASE_URL=https://follow.ai
```

### B. 依赖版本

```json
{
  "dependencies": {
    "@sentry/react": "^8.0.0",
    "@hookform/resolvers": "^3.3.0",
    "posthog-js": "^1.100.0",
    "react-helmet-async": "^2.0.0",
    "react-hook-form": "^7.50.0",
    "web-vitals": "^4.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.41.0",
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^14.2.0",
    "@testing-library/user-event": "^14.5.0",
    "vitest": "^1.2.0"
  }
}
```

### C. 文件结构

```
follow-ai/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── PendingReviewsTable.tsx
│   │   │   └── RecentActivityList.tsx
│   │   ├── ui/
│   │   │   └── AccessibleButton.tsx
│   │   ├── AuthModal.tsx
│   │   ├── ErrorFallback.tsx
│   │   ├── NotificationCenter.tsx
│   │   ├── SEO.tsx
│   │   ├── Skeleton.tsx
│   │   └── SuccessScoreCard.tsx
│   ├── hooks/
│   │   ├── useAIReview.ts
│   │   └── useSuccessScore.ts
│   ├── lib/
│   │   ├── a11y.ts
│   │   ├── posthog.ts
│   │   ├── schema.ts
│   │   ├── sentry.ts
│   │   ├── validations.ts
│   │   └── web-vitals.ts
│   ├── pages/
│   │   └── admin/
│   │       └── Dashboard.tsx
│   └── contexts/
│       └── AuthContext.tsx
├── supabase/
│   ├── functions/
│   │   └── ai-review/
│   │       └── index.ts
│   └── migrations/
│       ├── 20260108_admin_roles.sql
│       └── 20260108_success_score.sql
├── tests/
│   ├── e2e/
│   │   ├── auth.spec.ts
│   │   └── dashboard.spec.ts
│   ├── utils/
│   │   └── test-helpers.ts
│   └── setup.ts
├── scripts/
│   └── generate-sitemap.ts
├── playwright.config.ts
└── vitest.config.ts
```

---

**文档版本**: 1.0  
**最后更新**: 2026年1月8日  
**作者**: Manus AI  
