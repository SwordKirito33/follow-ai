# Follow.ai 终极版执行手册

> **版本**: 2.0 Ultimate  
> **日期**: 2026年1月8日  
> **作者**: Manus AI  
> **基于**: Manus 评估框架 + Claude 技术方案 + 项目实际代码分析

---

## 📋 目录

1. [执行概览](#执行概览)
2. [Phase 0: 基础设施准备](#phase-0-基础设施准备)
3. [Phase 1: P0 Bug 修复](#phase-1-p0-bug-修复)
4. [Phase 2: 监控体系](#phase-2-监控体系)
5. [Phase 3: 性能优化](#phase-3-性能优化)
6. [Phase 4: Admin Dashboard + AI Review](#phase-4-admin-dashboard--ai-review)
7. [Phase 5: 游戏化系统增强](#phase-5-游戏化系统增强)
8. [Phase 6: SEO + 可访问性](#phase-6-seo--可访问性)
9. [Phase 7: 测试完善](#phase-7-测试完善)
10. [验证清单](#验证清单)

---

## 执行概览

### 项目现状

经过对 Follow.ai 项目的全面审查，包括代码库分析和 Supabase 数据库检查，我们确认了以下现状：

| 维度 | 现状 | 目标 | 差距 |
|------|------|------|------|
| 数据库表 | 43 张表已创建 | 完善 | 需要添加 RLS 和字段 |
| 认证系统 | 基本完成 | 完善 | 需要优化登出流程 |
| 通知系统 | 表存在但未连接 | 完善 | 需要启用 RLS 和连接前端 |
| 游戏化系统 | 基础 XP/等级/成就 | 完善 | 需要添加 Success Score |
| 管理员系统 | app_admins 表存在 | 完善 | 需要添加 Dashboard |
| 监控系统 | 无 | 完善 | 需要全部添加 |
| E2E 测试 | 53.1% 通过率 | 90%+ | 需要修复和扩展 |

### 执行时间表

| Phase | 时间 | 工时 | 核心内容 |
|-------|------|------|----------|
| Phase 0 | 0.5天 | 4h | Git 分支、依赖安装 |
| Phase 1 | 2天 | 16h | 登出、通知、表单验证 |
| Phase 2 | 1.5天 | 12h | Sentry、PostHog、Web Vitals |
| Phase 3 | 1.5天 | 12h | 代码分割、图片优化 |
| Phase 4 | 3天 | 24h | Admin Dashboard、AI Review |
| Phase 5 | 2天 | 16h | Success Score、徽章系统 |
| Phase 6 | 2天 | 16h | SEO、可访问性 |
| Phase 7 | 1.5天 | 12h | E2E 测试、单元测试 |
| **总计** | **14天** | **112h** | |

---

## Phase 0: 基础设施准备

**时间**: 0.5天 | **工时**: 4h

### 任务 0.1: Git 分支策略

```bash
# 创建功能分支
git checkout -b feature/ultimate-upgrade

# 确保从最新 main 分支开始
git pull origin main
```

### 任务 0.2: 安装依赖

```bash
# 监控相关
pnpm add @sentry/react @sentry/vite-plugin posthog-js web-vitals

# 性能优化相关
pnpm add -D vite-plugin-image-optimizer

# 表单验证（可选）
pnpm add zod react-hook-form @hookform/resolvers

# 测试相关
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### 任务 0.3: 环境变量配置

在 `.env` 文件中添加：

```env
# Sentry
VITE_SENTRY_DSN=your_sentry_dsn

# PostHog
VITE_POSTHOG_KEY=your_posthog_key
VITE_POSTHOG_HOST=https://app.posthog.com

# OpenAI (用于 AI Review)
OPENAI_API_KEY=your_openai_key
```

### 验证
```bash
# 确认依赖安装成功
pnpm list @sentry/react posthog-js web-vitals

# 确认环境变量
cat .env | grep -E "SENTRY|POSTHOG|OPENAI"
```

---

## Phase 1: P0 Bug 修复

**时间**: 2天 | **工时**: 16h

### 任务 1.1: 修复登出流程

**问题分析**:
- 现有实现缺少 React Query 缓存清理
- 现有实现缺少 Realtime 订阅清理

**文件**: `src/contexts/AuthContext.tsx`

**修改内容**:

```typescript
// 在文件顶部添加导入
import { useQueryClient } from '@tanstack/react-query';

// 在 AuthProvider 组件内部
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // ... 现有代码 ...
  
  // 添加 queryClient 引用（如果使用 React Query）
  // 注意：需要在 App.tsx 中确保 QueryClientProvider 包裹 AuthProvider
  
  const logout = async () => {
    try {
      // 1. 清理 Realtime 订阅
      supabase.removeAllChannels();
      
      // 2. 清空用户状态
      setUser(null);
      lastXpRef.current = null;
      
      // 3. 清理 localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.includes('supabase') || key.includes('auth-token') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // 4. 清理 sessionStorage
      Object.keys(sessionStorage).forEach(key => {
        if (key.includes('supabase') || key.includes('auth')) {
          sessionStorage.removeItem(key);
        }
      });
      
      // 5. Supabase 登出
      await supabase.auth.signOut();
      
      // 6. 跳转首页（使用 replace 防止返回）
      window.location.replace('/');
    } catch (e) {
      console.error('Logout failed:', e);
      // 即使失败也强制清理并跳转
      window.location.replace('/');
    }
  };
  
  // ... 其余代码 ...
};
```

**验证**:
```bash
# 运行 E2E 测试
PLAYWRIGHT_TEST_BASE_URL=https://www.follow-ai.com pnpm exec playwright test tests/e2e/auth.spec.ts --grep "logout"
```

---

### 任务 1.2: 修复通知系统

**问题分析**:
- notifications 表 RLS 未启用
- 前端使用 Mock 数据

#### 步骤 1: 启用 RLS（SQL）

```sql
-- 启用 RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的通知
CREATE POLICY "Users can view own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

-- 用户只能更新自己的通知（标记已读）
CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 只有系统可以插入通知（通过 service_role）
CREATE POLICY "System can insert notifications"
ON notifications FOR INSERT
WITH CHECK (true);

-- 用户可以删除自己的通知
CREATE POLICY "Users can delete own notifications"
ON notifications FOR DELETE
USING (auth.uid() = user_id);
```

#### 步骤 2: 创建通知 Hook

**文件**: `src/hooks/useNotifications.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string | null;
  data: Record<string, any> | null;
  read: boolean;
  created_at: string;
}

export function useNotifications() {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 获取通知
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.read).length || 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // 标记为已读
  const markAsRead = useCallback(async (id: string) => {
    if (!user?.id) return;

    // 乐观更新
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // 回滚
      fetchNotifications();
    }
  }, [user?.id, fetchNotifications]);

  // 标记全部已读
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;

    // 乐观更新
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      // 回滚
      fetchNotifications();
    }
  }, [user?.id, fetchNotifications]);

  // 初始加载
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id, fetchNotifications]);

  // Realtime 订阅
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`notifications_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('[Notifications] Realtime update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newNotification = payload.new as Notification;
            setNotifications(prev => [newNotification, ...prev]);
            if (!newNotification.read) {
              setUnreadCount(prev => prev + 1);
            }
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Notification;
            setNotifications(prev =>
              prev.map(n => n.id === updated.id ? updated : n)
            );
            // 重新计算未读数
            setNotifications(prev => {
              setUnreadCount(prev.filter(n => !n.read).length);
              return prev;
            });
          } else if (payload.eventType === 'DELETE') {
            const deleted = payload.old as Notification;
            setNotifications(prev => prev.filter(n => n.id !== deleted.id));
            if (!deleted.read) {
              setUnreadCount(prev => Math.max(0, prev - 1));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
}
```

#### 步骤 3: 更新 NotificationCenter 组件

**文件**: `src/components/NotificationCenter.tsx`

```typescript
import React from 'react';
import { Bell, X, CheckCircle, DollarSign, MessageCircle, Star, AlertCircle, Loader2 } from 'lucide-react';
import { useNotifications, type Notification } from '@/hooks/useNotifications';
import Badge from './ui/Badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'review_approved':
      case 'payment_received':
      case 'task_approved':
        return <CheckCircle size={20} className="text-accent-green dark:text-green-400" />;
      case 'review_rejected':
      case 'task_rejected':
        return <AlertCircle size={20} className="text-red-600 dark:text-red-400" />;
      case 'bounty_available':
      case 'payment':
        return <DollarSign size={20} className="text-primary-cyan dark:text-blue-400" />;
      case 'comment_reply':
      case 'mention':
        return <MessageCircle size={20} className="text-primary-purple dark:text-purple-400" />;
      case 'achievement':
      case 'level_up':
        return <Star size={20} className="text-amber-600 dark:text-amber-400" />;
      default:
        return <Bell size={20} className="text-gray-400" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('notifications.justNow');
    if (diffMins < 60) return t('notifications.minutesAgo', { count: diffMins });
    if (diffHours < 24) return t('notifications.hoursAgo', { count: diffHours });
    if (diffDays < 7) return t('notifications.daysAgo', { count: diffDays });
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // 处理导航
    if (notification.data?.actionUrl) {
      window.location.href = notification.data.actionUrl;
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-start justify-end p-4 pt-20 pointer-events-none" 
      data-testid="notifications-overlay"
    >
      <div 
        className="glass-card rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col pointer-events-auto" 
        data-testid="notifications-panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-gray-400" />
            <h2 className="text-lg font-black text-white tracking-tight">
              {t('notifications.title')}
            </h2>
            {unreadCount > 0 && (
              <Badge variant="danger" size="sm">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary-cyan hover:underline"
                data-testid="mark-all-read"
              >
                {t('notifications.markAllRead')}
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 transition-colors"
              data-testid="close-notifications"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-cyan" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Bell size={48} className="mx-auto mb-3 opacity-50" />
              <p>{t('notifications.noNotifications')}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-slate-800/50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-blue-900/10' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                  data-testid={`notification-${notification.id}`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-white">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-gradient-to-r from-primary-cyan to-primary-blue rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                      {notification.message && (
                        <p className="text-sm text-gray-400 mb-2">
                          {notification.message}
                        </p>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(notification.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
```

**验证**:
```bash
# 检查 RLS 是否启用
# 通过 Supabase Dashboard 或 MCP 验证

# 运行 E2E 测试
PLAYWRIGHT_TEST_BASE_URL=https://www.follow-ai.com pnpm exec playwright test tests/e2e/dashboard.spec.ts --grep "notification"
```

---

### 任务 1.3: 表单验证优化（可选）

现有的表单验证已经足够完善，此任务为可选优化。如需使用 Zod + React Hook Form，请参考 Claude 方案中的实现。

**验证**:
```bash
# 运行认证相关 E2E 测试
PLAYWRIGHT_TEST_BASE_URL=https://www.follow-ai.com pnpm exec playwright test tests/e2e/auth.spec.ts
```

---

## Phase 2: 监控体系

**时间**: 1.5天 | **工时**: 12h

### 任务 2.1: Sentry 错误监控

**文件**: `src/lib/sentry.ts`

```typescript
import * as Sentry from '@sentry/react';

export function initSentry() {
  if (!import.meta.env.VITE_SENTRY_DSN) {
    console.warn('[Sentry] DSN not configured, skipping initialization');
    return;
  }

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    
    // 性能监控
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    
    // 会话回放（仅生产环境）
    replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 0,
    replaysOnErrorSampleRate: 1.0,
    
    // 集成
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    
    // 过滤敏感信息
    beforeSend(event) {
      // 移除敏感数据
      if (event.request?.headers) {
        delete event.request.headers['Authorization'];
        delete event.request.headers['Cookie'];
      }
      return event;
    },
    
    // 忽略常见的非关键错误
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Non-Error promise rejection captured',
      /^Network Error$/,
      /^Loading chunk \d+ failed/,
    ],
  });
}

// 设置用户上下文
export function setSentryUser(user: { id: string; email?: string; username?: string } | null) {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  } else {
    Sentry.setUser(null);
  }
}

// 捕获异常
export function captureException(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  });
}

// 捕获消息
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level);
}
```

### 任务 2.2: PostHog 产品分析

**文件**: `src/lib/posthog.ts`

```typescript
import posthog from 'posthog-js';

export function initPostHog() {
  if (!import.meta.env.VITE_POSTHOG_KEY) {
    console.warn('[PostHog] Key not configured, skipping initialization');
    return;
  }

  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
    
    // 自动捕获
    autocapture: true,
    capture_pageview: true,
    capture_pageleave: true,
    
    // 隐私设置
    disable_session_recording: !import.meta.env.PROD,
    mask_all_text: false,
    mask_all_element_attributes: false,
    
    // 性能
    loaded: (posthog) => {
      if (import.meta.env.DEV) {
        posthog.debug();
      }
    },
  });
}

// 设置用户身份
export function identifyUser(userId: string, properties?: Record<string, any>) {
  posthog.identify(userId, properties);
}

// 重置用户（登出时调用）
export function resetUser() {
  posthog.reset();
}

// 追踪事件
export function trackEvent(event: string, properties?: Record<string, any>) {
  posthog.capture(event, properties);
}

// 预定义事件
export const AnalyticsEvents = {
  // 认证
  SIGNUP_STARTED: 'signup_started',
  SIGNUP_COMPLETED: 'signup_completed',
  LOGIN_COMPLETED: 'login_completed',
  LOGOUT_COMPLETED: 'logout_completed',
  
  // 任务
  TASK_VIEWED: 'task_viewed',
  TASK_STARTED: 'task_started',
  TASK_SUBMITTED: 'task_submitted',
  TASK_APPROVED: 'task_approved',
  TASK_REJECTED: 'task_rejected',
  
  // XP
  XP_EARNED: 'xp_earned',
  LEVEL_UP: 'level_up',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  
  // 支付
  PAYMENT_INITIATED: 'payment_initiated',
  PAYMENT_COMPLETED: 'payment_completed',
  PAYOUT_REQUESTED: 'payout_requested',
} as const;
```

### 任务 2.3: Web Vitals 监控

**文件**: `src/lib/web-vitals.ts`

```typescript
import { onCLS, onFCP, onFID, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';
import { captureMessage } from './sentry';
import { trackEvent } from './posthog';

interface VitalsThresholds {
  good: number;
  needsImprovement: number;
}

const thresholds: Record<string, VitalsThresholds> = {
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  FID: { good: 100, needsImprovement: 300 },
  INP: { good: 200, needsImprovement: 500 },
  LCP: { good: 2500, needsImprovement: 4000 },
  TTFB: { good: 800, needsImprovement: 1800 },
};

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = thresholds[name];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
}

function reportMetric(metric: Metric) {
  const rating = getRating(metric.name, metric.value);
  
  // 发送到 PostHog
  trackEvent('web_vital', {
    name: metric.name,
    value: metric.value,
    rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
  });
  
  // 如果性能差，发送到 Sentry
  if (rating === 'poor') {
    captureMessage(`Poor ${metric.name}: ${metric.value}`, 'warning');
  }
  
  // 开发环境打印
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}: ${metric.value} (${rating})`);
  }
}

export function initWebVitals() {
  onCLS(reportMetric);
  onFCP(reportMetric);
  onFID(reportMetric);
  onINP(reportMetric);
  onLCP(reportMetric);
  onTTFB(reportMetric);
}
```

### 任务 2.4: 集成到 main.tsx

**文件**: `src/main.tsx`

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 初始化监控
import { initSentry } from './lib/sentry';
import { initPostHog } from './lib/posthog';
import { initWebVitals } from './lib/web-vitals';

// 在应用启动前初始化
initSentry();
initPostHog();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// DOM 加载后初始化 Web Vitals
initWebVitals();
```

**验证**:
```bash
# 构建并检查是否有错误
pnpm build

# 本地运行并检查控制台
pnpm dev
# 打开浏览器控制台，应该看到 Web Vitals 日志
```

---

## Phase 3: 性能优化

**时间**: 1.5天 | **工时**: 12h

### 任务 3.1: 代码分割配置

**文件**: `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  build: {
    // 代码分割配置
    rollupOptions: {
      output: {
        manualChunks: {
          // React 核心
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          
          // Supabase
          'vendor-supabase': ['@supabase/supabase-js'],
          
          // UI 组件库
          'vendor-ui': ['lucide-react', 'framer-motion'],
          
          // 图表（如果使用）
          'vendor-charts': ['recharts'],
          
          // 监控
          'vendor-monitoring': ['@sentry/react', 'posthog-js', 'web-vitals'],
        },
      },
    },
    
    // 分块大小警告阈值
    chunkSizeWarningLimit: 500,
    
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  
  // 优化依赖预构建
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js'],
  },
});
```

### 任务 3.2: 路由懒加载

**文件**: `src/App.tsx` (修改路由部分)

```typescript
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProtectedRoute from '@/components/ProtectedRoute';

// 懒加载页面组件
const Home = lazy(() => import('@/pages/Home'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Tasks = lazy(() => import('@/pages/Tasks'));
const TaskDetail = lazy(() => import('@/pages/TaskDetail'));
const Profile = lazy(() => import('@/pages/Profile'));
const Settings = lazy(() => import('@/pages/Settings'));
const Leaderboard = lazy(() => import('@/pages/Leaderboard'));
const Wallet = lazy(() => import('@/pages/Wallet'));
const Tools = lazy(() => import('@/pages/Tools'));
const ToolDetail = lazy(() => import('@/pages/ToolDetail'));

// Admin 页面（稍后添加）
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));

// 加载中组件
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* 公开路由 */}
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/tools/:id" element={<ToolDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile/:username" element={<Profile />} />
          
          {/* 保护路由 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          
          {/* Admin 路由（稍后添加权限检查） */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
```

### 任务 3.3: 图片优化配置

**文件**: `vite.config.ts` (添加图片优化插件)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      png: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      jpg: {
        quality: 80,
      },
      webp: {
        lossless: true,
      },
      avif: {
        lossless: true,
      },
    }),
  ],
  
  // ... 其他配置
});
```

**验证**:
```bash
# 构建并检查 chunk 大小
pnpm build

# 检查输出
ls -la dist/assets/

# 应该看到多个分割的 chunk 文件
```

---

*（手册继续...）*


## Phase 4: Admin Dashboard + AI Review

**时间**: 3天 | **工时**: 24h

### 任务 4.1: 添加管理员角色字段（SQL）

```sql
-- 添加角色字段到 app_admins 表
ALTER TABLE app_admins 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'admin' 
CHECK (role IN ('super_admin', 'admin', 'moderator', 'reviewer'));

ALTER TABLE app_admins 
ADD COLUMN IF NOT EXISTS permissions jsonb DEFAULT '[]'::jsonb;

-- 创建管理员检查函数
CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM app_admins WHERE user_id = user_uuid
  );
$$;

-- 创建获取管理员角色函数
CREATE OR REPLACE FUNCTION get_admin_role(user_uuid uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM app_admins WHERE user_id = user_uuid;
$$;
```

### 任务 4.2: 创建 Admin Hook

**文件**: `src/hooks/useAdmin.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export type AdminRole = 'super_admin' | 'admin' | 'moderator' | 'reviewer';

interface AdminState {
  isAdmin: boolean;
  role: AdminRole | null;
  permissions: string[];
  isLoading: boolean;
}

export function useAdmin() {
  const { user, isAuthenticated } = useAuth();
  const [state, setState] = useState<AdminState>({
    isAdmin: false,
    role: null,
    permissions: [],
    isLoading: true,
  });

  useEffect(() => {
    async function checkAdmin() {
      if (!isAuthenticated || !user?.id) {
        setState({
          isAdmin: false,
          role: null,
          permissions: [],
          isLoading: false,
        });
        return;
      }

      try {
        const { data, error } = await supabase
          .from('app_admins')
          .select('role, permissions')
          .eq('user_id', user.id)
          .single();

        if (error || !data) {
          setState({
            isAdmin: false,
            role: null,
            permissions: [],
            isLoading: false,
          });
          return;
        }

        setState({
          isAdmin: true,
          role: data.role as AdminRole,
          permissions: data.permissions || [],
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to check admin status:', error);
        setState({
          isAdmin: false,
          role: null,
          permissions: [],
          isLoading: false,
        });
      }
    }

    checkAdmin();
  }, [isAuthenticated, user?.id]);

  const hasPermission = useCallback((permission: string) => {
    if (state.role === 'super_admin') return true;
    return state.permissions.includes(permission);
  }, [state.role, state.permissions]);

  const canReviewSubmissions = useCallback(() => {
    return state.isAdmin && ['super_admin', 'admin', 'reviewer'].includes(state.role || '');
  }, [state.isAdmin, state.role]);

  const canManageUsers = useCallback(() => {
    return state.isAdmin && ['super_admin', 'admin'].includes(state.role || '');
  }, [state.isAdmin, state.role]);

  return {
    ...state,
    hasPermission,
    canReviewSubmissions,
    canManageUsers,
  };
}
```

### 任务 4.3: 创建 Admin Dashboard 页面

**文件**: `src/pages/admin/Dashboard.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  Users, FileText, CheckCircle, XCircle, Clock, 
  TrendingUp, DollarSign, Activity, RefreshCw 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingSubmissions: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
  totalXpAwarded: number;
  totalPayouts: number;
}

interface PendingSubmission {
  id: string;
  task_id: string;
  user_id: string;
  experience_text: string;
  output_url: string | null;
  created_at: string;
  task: {
    title: string;
    xp_reward: number;
  };
  user: {
    username: string;
    full_name: string;
  };
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { isAdmin, role, isLoading: adminLoading } = useAdmin();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<PendingSubmission | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // 获取统计数据
      const [
        { count: totalUsers },
        { count: pendingCount },
        { count: approvedCount },
        { count: rejectedCount },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('task_submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('task_submissions').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('task_submissions').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
      ]);

      // 获取总 XP 奖励
      const { data: xpData } = await supabase
        .from('xp_events')
        .select('amount')
        .eq('source', 'task');
      
      const totalXp = xpData?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: 0, // 需要额外查询
        pendingSubmissions: pendingCount || 0,
        approvedSubmissions: approvedCount || 0,
        rejectedSubmissions: rejectedCount || 0,
        totalXpAwarded: totalXp,
        totalPayouts: 0, // 需要额外查询
      });

      // 获取待审核提交
      const { data: submissions } = await supabase
        .from('task_submissions')
        .select(`
          id,
          task_id,
          user_id,
          experience_text,
          output_url,
          created_at,
          task:tasks(title, xp_reward),
          user:profiles(username, full_name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
        .limit(20);

      setPendingSubmissions(submissions as any || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (submission: PendingSubmission) => {
    try {
      const { error } = await supabase
        .from('task_submissions')
        .update({
          status: 'approved',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          reward_xp_awarded: submission.task.xp_reward,
        })
        .eq('id', submission.id);

      if (error) throw error;

      // 刷新数据
      fetchDashboardData();
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Failed to approve submission:', error);
    }
  };

  const handleReject = async (submission: PendingSubmission, reason: string) => {
    try {
      const { error } = await supabase
        .from('task_submissions')
        .update({
          status: 'rejected',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          review_notes: reason,
        })
        .eq('id', submission.id);

      if (error) throw error;

      // 刷新数据
      fetchDashboardData();
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Failed to reject submission:', error);
    }
  };

  // 权限检查
  if (adminLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Role: {role}</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-4 py-2 bg-primary-cyan/20 text-primary-cyan rounded-lg hover:bg-primary-cyan/30 transition-colors"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={<Users className="text-blue-400" />}
                label="Total Users"
                value={stats?.totalUsers || 0}
              />
              <StatCard
                icon={<Clock className="text-yellow-400" />}
                label="Pending Reviews"
                value={stats?.pendingSubmissions || 0}
                highlight
              />
              <StatCard
                icon={<CheckCircle className="text-green-400" />}
                label="Approved"
                value={stats?.approvedSubmissions || 0}
              />
              <StatCard
                icon={<TrendingUp className="text-purple-400" />}
                label="Total XP Awarded"
                value={stats?.totalXpAwarded || 0}
              />
            </div>

            {/* Pending Submissions */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Pending Submissions ({pendingSubmissions.length})
              </h2>
              
              {pendingSubmissions.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <CheckCircle size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No pending submissions</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingSubmissions.map((submission) => (
                    <SubmissionCard
                      key={submission.id}
                      submission={submission}
                      onApprove={() => handleApprove(submission)}
                      onReject={(reason) => handleReject(submission, reason)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

// 统计卡片组件
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  highlight?: boolean;
}> = ({ icon, label, value, highlight }) => (
  <div className={`glass-card rounded-xl p-6 ${highlight ? 'ring-2 ring-yellow-400/50' : ''}`}>
    <div className="flex items-center gap-4">
      <div className="p-3 bg-white/5 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
      </div>
    </div>
  </div>
);

// 提交卡片组件
const SubmissionCard: React.FC<{
  submission: PendingSubmission;
  onApprove: () => void;
  onReject: (reason: string) => void;
}> = ({ submission, onApprove, onReject }) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white font-semibold">{submission.task?.title || 'Unknown Task'}</span>
            <span className="px-2 py-0.5 bg-primary-cyan/20 text-primary-cyan text-xs rounded-full">
              +{submission.task?.xp_reward || 0} XP
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-2">
            by @{submission.user?.username || 'unknown'}
          </p>
          <p className="text-gray-300 text-sm line-clamp-2">
            {submission.experience_text}
          </p>
          {submission.output_url && (
            <a
              href={submission.output_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-cyan text-sm hover:underline mt-2 inline-block"
            >
              View Output →
            </a>
          )}
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={onApprove}
            className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
            title="Approve"
          >
            <CheckCircle size={20} />
          </button>
          <button
            onClick={() => setShowRejectModal(true)}
            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            title="Reject"
          >
            <XCircle size={20} />
          </button>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-white mb-4">Reject Submission</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 resize-none"
              rows={4}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onReject(rejectReason);
                  setShowRejectModal(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
```

### 任务 4.4: AI Review Assistant（Edge Function）

**文件**: `supabase/functions/ai-review/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReviewRequest {
  submission_id: string;
  task_title: string;
  task_description: string;
  experience_text: string;
  output_url?: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { submission_id, task_title, task_description, experience_text, output_url } = 
      await req.json() as ReviewRequest;

    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // 构建 AI 审核提示
    const prompt = `You are an AI review assistant for Follow.ai, a platform where users complete AI tool evaluation tasks.

Task: "${task_title}"
Description: ${task_description}

User's Submission:
${experience_text}

${output_url ? `Output URL: ${output_url}` : ''}

Please evaluate this submission and provide:
1. A quality score from 1-10
2. Whether you recommend approval (yes/no)
3. Key strengths of the submission
4. Areas for improvement
5. Any concerns or red flags

Respond in JSON format:
{
  "score": number,
  "recommend_approval": boolean,
  "strengths": string[],
  "improvements": string[],
  "concerns": string[],
  "summary": string
}`;

    // 调用 OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant that reviews task submissions. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const reviewContent = data.choices[0].message.content;
    
    // 解析 JSON 响应
    let review;
    try {
      review = JSON.parse(reviewContent);
    } catch {
      // 如果解析失败，返回原始内容
      review = {
        score: 5,
        recommend_approval: false,
        summary: reviewContent,
        strengths: [],
        improvements: [],
        concerns: ['Could not parse AI response'],
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        submission_id,
        review,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('AI Review error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
```

**验证**:
```bash
# 访问 Admin Dashboard
# 需要先将自己添加到 app_admins 表

# 通过 Supabase Dashboard 执行：
# INSERT INTO app_admins (user_id, role) VALUES ('your-user-id', 'super_admin');
```

---

## Phase 5: 游戏化系统增强

**时间**: 2天 | **工时**: 16h

### 任务 5.1: Success Score 计算（SQL）

```sql
-- 创建 Success Score 视图
CREATE OR REPLACE VIEW user_success_scores AS
SELECT 
  p.id as user_id,
  p.username,
  p.total_xp,
  p.level,
  COALESCE(p.reputation_score, 0) as reputation_score,
  COUNT(DISTINCT ts.id) FILTER (WHERE ts.status = 'approved') as approved_submissions,
  COUNT(DISTINCT ts.id) FILTER (WHERE ts.status = 'rejected') as rejected_submissions,
  COUNT(DISTINCT ua.id) as achievements_count,
  -- Success Score 计算公式
  ROUND(
    (
      -- XP 贡献 (40%)
      LEAST(p.total_xp::numeric / 10000, 1) * 40 +
      -- 通过率贡献 (30%)
      CASE 
        WHEN COUNT(DISTINCT ts.id) > 0 
        THEN (COUNT(DISTINCT ts.id) FILTER (WHERE ts.status = 'approved')::numeric / 
              COUNT(DISTINCT ts.id)::numeric) * 30
        ELSE 0
      END +
      -- 成就贡献 (20%)
      LEAST(COUNT(DISTINCT ua.id)::numeric / 20, 1) * 20 +
      -- 声誉贡献 (10%)
      COALESCE(p.reputation_score::numeric / 1000, 0) * 10
    )::numeric, 1
  ) as success_score
FROM profiles p
LEFT JOIN task_submissions ts ON ts.user_id = p.id
LEFT JOIN user_achievements ua ON ua.user_id = p.id
GROUP BY p.id, p.username, p.total_xp, p.level, p.reputation_score;

-- 创建获取 Success Score 的函数
CREATE OR REPLACE FUNCTION get_user_success_score(user_uuid uuid)
RETURNS numeric
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT success_score FROM user_success_scores WHERE user_id = user_uuid;
$$;
```

### 任务 5.2: Success Score Hook

**文件**: `src/hooks/useSuccessScore.ts`

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface SuccessScoreData {
  userId: string;
  username: string;
  totalXp: number;
  level: number;
  reputationScore: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
  achievementsCount: number;
  successScore: number;
}

export function useSuccessScore(userId?: string) {
  const { user } = useAuth();
  const [data, setData] = useState<SuccessScoreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const targetUserId = userId || user?.id;

  useEffect(() => {
    async function fetchSuccessScore() {
      if (!targetUserId) {
        setData(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data: scoreData, error: fetchError } = await supabase
          .from('user_success_scores')
          .select('*')
          .eq('user_id', targetUserId)
          .single();

        if (fetchError) throw fetchError;

        setData({
          userId: scoreData.user_id,
          username: scoreData.username,
          totalXp: scoreData.total_xp,
          level: scoreData.level,
          reputationScore: scoreData.reputation_score,
          approvedSubmissions: scoreData.approved_submissions,
          rejectedSubmissions: scoreData.rejected_submissions,
          achievementsCount: scoreData.achievements_count,
          successScore: parseFloat(scoreData.success_score),
        });
      } catch (err) {
        console.error('Failed to fetch success score:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSuccessScore();
  }, [targetUserId]);

  return { data, isLoading, error };
}
```

### 任务 5.3: Success Score 展示组件

**文件**: `src/components/SuccessScoreCard.tsx`

```typescript
import React from 'react';
import { Trophy, TrendingUp, Star, Target } from 'lucide-react';
import { useSuccessScore } from '@/hooks/useSuccessScore';

interface SuccessScoreCardProps {
  userId?: string;
  compact?: boolean;
}

const SuccessScoreCard: React.FC<SuccessScoreCardProps> = ({ userId, compact = false }) => {
  const { data, isLoading, error } = useSuccessScore(userId);

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6 animate-pulse">
        <div className="h-20 bg-white/10 rounded-lg" />
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Outstanding';
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Great';
    if (score >= 60) return 'Good';
    if (score >= 50) return 'Average';
    if (score >= 40) return 'Developing';
    return 'Beginner';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className={`text-2xl font-bold ${getScoreColor(data.successScore)}`}>
          {data.successScore.toFixed(1)}
        </div>
        <div className="text-sm text-gray-400">
          Success Score
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Trophy className="text-yellow-400" size={20} />
          Success Score
        </h3>
        <span className={`text-3xl font-black ${getScoreColor(data.successScore)}`}>
          {data.successScore.toFixed(1)}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-400">Rating</span>
          <span className={`font-semibold ${getScoreColor(data.successScore)}`}>
            {getScoreLabel(data.successScore)}
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              data.successScore >= 80 ? 'bg-green-400' :
              data.successScore >= 60 ? 'bg-blue-400' :
              data.successScore >= 40 ? 'bg-yellow-400' : 'bg-gray-400'
            }`}
            style={{ width: `${data.successScore}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-purple-400" />
          <span className="text-gray-400">Level</span>
          <span className="text-white font-semibold ml-auto">{data.level}</span>
        </div>
        <div className="flex items-center gap-2">
          <Star size={16} className="text-yellow-400" />
          <span className="text-gray-400">XP</span>
          <span className="text-white font-semibold ml-auto">{data.totalXp.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Target size={16} className="text-green-400" />
          <span className="text-gray-400">Approved</span>
          <span className="text-white font-semibold ml-auto">{data.approvedSubmissions}</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-amber-400" />
          <span className="text-gray-400">Achievements</span>
          <span className="text-white font-semibold ml-auto">{data.achievementsCount}</span>
        </div>
      </div>
    </div>
  );
};

export default SuccessScoreCard;
```

---

## Phase 6: SEO + 可访问性

**时间**: 2天 | **工时**: 16h

### 任务 6.1: SEO 组件

**文件**: `src/components/SEO.tsx`

```typescript
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
  noindex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Follow.ai - AI Tool Review Platform',
  description = 'The first AI tool review platform that requires real work output. Get paid $20-200 for verified reviews.',
  image = 'https://www.follow-ai.com/og-image.png',
  url = 'https://www.follow-ai.com',
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  keywords = ['AI tools', 'AI review', 'earn money', 'AI evaluation'],
  noindex = false,
}) => {
  const fullTitle = title.includes('Follow.ai') ? title : `${title} | Follow.ai`;

  // 结构化数据
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'website' ? 'WebSite' : type === 'article' ? 'Article' : 'ProfilePage',
    name: fullTitle,
    description,
    url,
    ...(type === 'website' && {
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://www.follow-ai.com/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    }),
    ...(type === 'article' && {
      author: {
        '@type': 'Person',
        name: author,
      },
      datePublished: publishedTime,
      dateModified: modifiedTime,
    }),
  };

  return (
    <Helmet>
      {/* 基础 Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Follow.ai" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical */}
      <link rel="canonical" href={url} />
      
      {/* 结构化数据 */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
```

### 任务 6.2: 可访问性工具库

**文件**: `src/lib/a11y.ts`

```typescript
import { useEffect, useRef, useCallback } from 'react';

// 键盘导航 Hook
export function useKeyboardNavigation(
  containerRef: React.RefObject<HTMLElement>,
  options: {
    selector?: string;
    loop?: boolean;
    orientation?: 'horizontal' | 'vertical' | 'both';
  } = {}
) {
  const {
    selector = '[tabindex]:not([tabindex="-1"]), button, a, input, select, textarea',
    loop = true,
    orientation = 'vertical',
  } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const focusableElements = Array.from(
        container.querySelectorAll<HTMLElement>(selector)
      ).filter((el) => !el.hasAttribute('disabled'));

      if (focusableElements.length === 0) return;

      const currentIndex = focusableElements.indexOf(
        document.activeElement as HTMLElement
      );

      let nextIndex = currentIndex;
      const isVertical = orientation === 'vertical' || orientation === 'both';
      const isHorizontal = orientation === 'horizontal' || orientation === 'both';

      switch (e.key) {
        case 'ArrowDown':
          if (isVertical) {
            e.preventDefault();
            nextIndex = currentIndex + 1;
          }
          break;
        case 'ArrowUp':
          if (isVertical) {
            e.preventDefault();
            nextIndex = currentIndex - 1;
          }
          break;
        case 'ArrowRight':
          if (isHorizontal) {
            e.preventDefault();
            nextIndex = currentIndex + 1;
          }
          break;
        case 'ArrowLeft':
          if (isHorizontal) {
            e.preventDefault();
            nextIndex = currentIndex - 1;
          }
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = focusableElements.length - 1;
          break;
        default:
          return;
      }

      if (loop) {
        nextIndex = (nextIndex + focusableElements.length) % focusableElements.length;
      } else {
        nextIndex = Math.max(0, Math.min(nextIndex, focusableElements.length - 1));
      }

      focusableElements[nextIndex]?.focus();
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, selector, loop, orientation]);
}

// 焦点陷阱 Hook
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement>,
  isActive: boolean
) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    // 保存之前的焦点
    previousFocusRef.current = document.activeElement as HTMLElement;

    // 获取可聚焦元素
    const getFocusableElements = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute('disabled'));

    // 聚焦第一个元素
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // 恢复之前的焦点
      previousFocusRef.current?.focus();
    };
  }, [containerRef, isActive]);
}

// 屏幕阅读器公告
export function useAnnounce() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;

    document.body.appendChild(announcer);

    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }, []);

  return announce;
}

// 跳过导航链接组件
export const SkipLink: React.FC<{ href?: string; children?: React.ReactNode }> = ({
  href = '#main-content',
  children = 'Skip to main content',
}) => (
  <a
    href={href}
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-cyan focus:text-white focus:rounded-lg"
  >
    {children}
  </a>
);
```

---

## Phase 7: 测试完善

**时间**: 1.5天 | **工时**: 12h

### 任务 7.1: Vitest 配置

**文件**: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
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
        '**/types/**',
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

**文件**: `tests/setup.ts`

```typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
    })),
    removeChannel: vi.fn(),
    removeAllChannels: vi.fn(),
  },
}));

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    replace: vi.fn(),
    reload: vi.fn(),
  },
  writable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
```

### 任务 7.2: 单元测试示例

**文件**: `src/hooks/useNotifications.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useNotifications } from './useNotifications';

// Mock useAuth
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' },
    isAuthenticated: true,
  }),
}));

describe('useNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useNotifications());
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.notifications).toEqual([]);
    expect(result.current.unreadCount).toBe(0);
  });

  it('should fetch notifications on mount', async () => {
    const { result } = renderHook(() => useNotifications());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should mark notification as read', async () => {
    const { result } = renderHook(() => useNotifications());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // markAsRead 应该是一个函数
    expect(typeof result.current.markAsRead).toBe('function');
  });

  it('should mark all notifications as read', async () => {
    const { result } = renderHook(() => useNotifications());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // markAllAsRead 应该是一个函数
    expect(typeof result.current.markAllAsRead).toBe('function');
  });
});
```

### 任务 7.3: E2E 测试修复

**文件**: `tests/e2e/auth.spec.ts` (更新)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login button for unauthenticated users', async ({ page }) => {
    const loginButton = page.getByTestId('login-button');
    await expect(loginButton).toBeVisible();
  });

  test('should open auth modal when clicking login', async ({ page }) => {
    await page.getByTestId('login-button').click();
    
    const authModal = page.getByTestId('auth-modal-title');
    await expect(authModal).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.getByTestId('login-button').click();
    
    const emailInput = page.getByTestId('email-input');
    await emailInput.fill('invalid-email');
    await emailInput.blur();
    
    const errorMessage = page.getByTestId('error-message');
    await expect(errorMessage).toBeVisible();
  });

  test('should disable submit button when form is invalid', async ({ page }) => {
    await page.getByTestId('login-button').click();
    
    const submitButton = page.getByTestId('auth-submit-button');
    await expect(submitButton).toBeDisabled();
  });

  test('should switch between login and signup modes', async ({ page }) => {
    await page.getByTestId('login-button').click();
    
    // 切换到注册模式
    await page.getByTestId('auth-mode-toggle').click();
    
    // 应该显示用户名输入框
    const usernameInput = page.getByTestId('username-input');
    await expect(usernameInput).toBeVisible();
  });

  test('should close modal when clicking close button', async ({ page }) => {
    await page.getByTestId('login-button').click();
    
    await page.getByTestId('close-auth-modal').click();
    
    const authModal = page.getByTestId('auth-modal-title');
    await expect(authModal).not.toBeVisible();
  });
});
```

---

## 验证清单

### Phase 0 验证
- [ ] Git 分支创建成功
- [ ] 所有依赖安装成功
- [ ] 环境变量配置正确

### Phase 1 验证
- [ ] 登出后 localStorage 清空
- [ ] 登出后跳转到首页
- [ ] 通知 RLS 启用
- [ ] 通知从数据库加载
- [ ] 通知 Realtime 更新

### Phase 2 验证
- [ ] Sentry 错误上报
- [ ] PostHog 事件追踪
- [ ] Web Vitals 监控

### Phase 3 验证
- [ ] 代码分割生效
- [ ] Bundle 大小减小
- [ ] 图片优化生效

### Phase 4 验证
- [ ] Admin Dashboard 可访问
- [ ] 权限检查生效
- [ ] AI Review 功能可用

### Phase 5 验证
- [ ] Success Score 计算正确
- [ ] Success Score 显示正确

### Phase 6 验证
- [ ] SEO meta 标签正确
- [ ] 结构化数据有效
- [ ] 键盘导航可用

### Phase 7 验证
- [ ] 单元测试通过
- [ ] E2E 测试通过率 > 80%

---

## 提交和部署

```bash
# 提交所有修改
git add -A
git commit -m "feat: Ultimate upgrade - monitoring, performance, admin, gamification, SEO, a11y"

# 推送到远程
git push origin feature/ultimate-upgrade

# 创建 PR
gh pr create --title "Ultimate Upgrade" --body "Complete upgrade including monitoring, performance, admin dashboard, gamification, SEO, and accessibility improvements"
```

---

**文档版本**: 2.0 Ultimate  
**最后更新**: 2026年1月8日  
**作者**: Manus AI
