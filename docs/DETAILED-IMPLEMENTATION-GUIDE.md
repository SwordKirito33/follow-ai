# Follow.ai 详细代码实现指南

> **版本**: 1.0  
> **日期**: 2026年1月8日  
> **作者**: Manus AI

---

## 目录

1. [Phase 0: 基础设施准备](#phase-0-基础设施准备)
2. [Phase 1: P0 Bug 修复](#phase-1-p0-bug-修复)
3. [Phase 2: 监控体系](#phase-2-监控体系)
4. [Phase 3: 性能优化](#phase-3-性能优化)
5. [Phase 4: Admin Dashboard + AI Review](#phase-4-admin-dashboard--ai-review)
6. [Phase 5: 游戏化系统增强](#phase-5-游戏化系统增强)
7. [Phase 6: SEO + 可访问性](#phase-6-seo--可访问性)
8. [Phase 7: 测试完善](#phase-7-测试完善)

---

## Phase 0: 基础设施准备

**预计时间**: 0.5天 (4小时)  
**前置条件**: 无  
**产出物**: 配置好的开发环境

### 步骤 0.1: 创建功能分支

**目的**: 隔离开发工作，便于代码审查和回滚

**操作命令**:
```bash
# 1. 确保在项目根目录
cd /path/to/follow-ai

# 2. 拉取最新代码
git fetch origin
git checkout main
git pull origin main

# 3. 创建功能分支
git checkout -b feature/ultimate-upgrade

# 4. 验证分支创建成功
git branch --show-current
# 应输出: feature/ultimate-upgrade
```

**验证标准**:
- [ ] 当前分支为 `feature/ultimate-upgrade`
- [ ] 分支基于最新的 `main`

---

### 步骤 0.2: 安装监控依赖

**目的**: 添加 Sentry、PostHog、Web Vitals 等监控工具

**操作命令**:
```bash
# 安装监控相关依赖
pnpm add @sentry/react @sentry/vite-plugin posthog-js web-vitals

# 验证安装
pnpm list @sentry/react posthog-js web-vitals
```

**依赖说明**:

| 包名 | 版本 | 用途 |
|------|------|------|
| @sentry/react | ^8.x | React 错误监控 |
| @sentry/vite-plugin | ^2.x | Vite 构建集成 |
| posthog-js | ^1.x | 产品分析 |
| web-vitals | ^4.x | 性能指标监控 |

**验证标准**:
- [ ] 所有依赖安装成功
- [ ] `package.json` 中包含新依赖
- [ ] `pnpm-lock.yaml` 已更新

---

### 步骤 0.3: 安装性能优化依赖

**目的**: 添加图片优化插件

**操作命令**:
```bash
# 安装图片优化插件（开发依赖）
pnpm add -D vite-plugin-image-optimizer

# 验证安装
pnpm list vite-plugin-image-optimizer
```

**验证标准**:
- [ ] 插件安装成功
- [ ] `devDependencies` 中包含该插件

---

### 步骤 0.4: 安装测试依赖

**目的**: 添加 Vitest 单元测试框架

**操作命令**:
```bash
# 安装测试相关依赖
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom @testing-library/user-event

# 验证安装
pnpm list vitest @testing-library/react
```

**依赖说明**:

| 包名 | 用途 |
|------|------|
| vitest | 单元测试框架 |
| @testing-library/react | React 组件测试 |
| @testing-library/jest-dom | DOM 断言扩展 |
| jsdom | 浏览器环境模拟 |
| @testing-library/user-event | 用户交互模拟 |

**验证标准**:
- [ ] 所有测试依赖安装成功

---

### 步骤 0.5: 配置环境变量

**目的**: 添加监控服务所需的环境变量

**操作步骤**:

1. **复制环境变量模板**:
```bash
cp .env.example .env.local
```

2. **编辑 `.env.local` 文件**:
```env
# === 监控配置 ===
# Sentry DSN (从 Sentry 控制台获取)
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# PostHog (从 PostHog 控制台获取)
VITE_POSTHOG_KEY=phc_xxx
VITE_POSTHOG_HOST=https://app.posthog.com

# === AI Review 配置 ===
# OpenAI API Key (用于 AI 审核功能)
OPENAI_API_KEY=sk-xxx
```

3. **更新 `.env.example` 模板**:
```bash
# 添加新的环境变量说明
cat >> .env.example << 'EOF'

# === Monitoring ===
VITE_SENTRY_DSN=
VITE_POSTHOG_KEY=
VITE_POSTHOG_HOST=https://app.posthog.com

# === AI Review ===
OPENAI_API_KEY=
EOF
```

**验证标准**:
- [ ] `.env.local` 文件已创建
- [ ] 环境变量格式正确
- [ ] `.env.example` 已更新

---

### 步骤 0.6: 提交基础设施变更

**目的**: 保存依赖和配置变更

**操作命令**:
```bash
# 添加变更
git add package.json pnpm-lock.yaml .env.example

# 提交
git commit -m "chore: Add monitoring, testing, and optimization dependencies"

# 推送到远程
git push -u origin feature/ultimate-upgrade
```

**验证标准**:
- [ ] 提交成功
- [ ] 远程分支已创建

---

## Phase 1: P0 Bug 修复

**预计时间**: 2天 (16小时)  
**前置条件**: Phase 0 完成  
**产出物**: 修复后的登出流程、通知系统、表单验证

### 任务 1.1: 修复登出流程

**问题描述**: 
当前登出流程缺少 React Query 缓存清理和 Supabase Realtime 订阅清理，可能导致：
- 登出后仍显示旧数据
- 内存泄漏
- 安全隐患

**影响范围**: 
- `src/contexts/AuthContext.tsx`

---

#### 步骤 1.1.1: 分析现有代码

**操作**: 打开 `src/contexts/AuthContext.tsx`，找到 `logout` 函数

**现有代码位置**: 约第 80-100 行

```typescript
// 现有实现（需要修改）
const logout = async () => {
  try {
    setUser(null);
    // ... localStorage 清理
    await supabase.auth.signOut();
    window.location.href = '/';
  } catch (e) {
    console.error('Logout failed:', e);
    window.location.reload();
  }
};
```

---

#### 步骤 1.1.2: 修改 logout 函数

**文件**: `src/contexts/AuthContext.tsx`

**修改内容**:

```typescript
// 在文件顶部添加导入（如果尚未导入）
import { supabase } from '@/lib/supabase';

// 修改 logout 函数（约第 80 行）
const logout = async () => {
  try {
    // ========== 新增: 清理 Realtime 订阅 ==========
    // 这一步必须在清空状态之前执行，防止订阅回调访问已清空的状态
    console.log('[Auth] Cleaning up Realtime subscriptions...');
    supabase.removeAllChannels();
    
    // ========== 清空用户状态 ==========
    setUser(null);
    
    // 如果有 lastXpRef，也需要清空
    if (lastXpRef && lastXpRef.current !== undefined) {
      lastXpRef.current = null;
    }
    
    // ========== 清理 localStorage ==========
    console.log('[Auth] Cleaning up localStorage...');
    Object.keys(localStorage).forEach(key => {
      if (
        key.includes('supabase') || 
        key.includes('auth-token') || 
        key.includes('sb-') ||
        key.includes('follow-ai')
      ) {
        localStorage.removeItem(key);
      }
    });
    
    // ========== 清理 sessionStorage ==========
    console.log('[Auth] Cleaning up sessionStorage...');
    Object.keys(sessionStorage).forEach(key => {
      if (key.includes('supabase') || key.includes('auth')) {
        sessionStorage.removeItem(key);
      }
    });
    
    // ========== Supabase 登出 ==========
    console.log('[Auth] Signing out from Supabase...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn('[Auth] Supabase signOut warning:', error);
    }
    
    // ========== 跳转首页 ==========
    // 使用 replace 防止用户通过浏览器后退按钮返回
    console.log('[Auth] Redirecting to home...');
    window.location.replace('/');
    
  } catch (e) {
    console.error('[Auth] Logout failed:', e);
    // 即使失败也强制清理并跳转
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace('/');
  }
};
```

**代码说明**:

| 步骤 | 说明 | 重要性 |
|------|------|--------|
| 清理 Realtime | 移除所有实时订阅，防止内存泄漏 | 高 |
| 清空状态 | 重置 React 状态 | 高 |
| 清理 localStorage | 移除所有认证相关数据 | 高 |
| 清理 sessionStorage | 移除会话数据 | 中 |
| Supabase signOut | 服务端登出 | 高 |
| 跳转首页 | 使用 replace 防止返回 | 中 |

---

#### 步骤 1.1.3: 添加 data-testid

**目的**: 为 E2E 测试添加选择器

**修改位置**: 找到登出按钮的 JSX

```typescript
// 在 Navbar 或相关组件中，找到登出按钮
<button
  onClick={logout}
  data-testid="logout-button"  // 添加这一行
  className="..."
>
  Logout
</button>
```

---

#### 步骤 1.1.4: 验证修改

**手动测试步骤**:
1. 登录账户
2. 打开浏览器开发者工具 > Application > Local Storage
3. 点击登出
4. 验证:
   - [ ] Local Storage 中 supabase 相关项已清除
   - [ ] 页面跳转到首页
   - [ ] 刷新页面后仍为未登录状态

**自动化测试**:
```bash
# 运行登出相关 E2E 测试
PLAYWRIGHT_TEST_BASE_URL=https://www.follow-ai.com pnpm exec playwright test tests/e2e/auth.spec.ts --grep "logout"
```

---

### 任务 1.2: 修复通知系统

**问题描述**:
- `notifications` 表 RLS 未启用（安全隐患）
- 前端使用 Mock 数据，未连接真实数据库
- 缺少 Realtime 订阅

**影响范围**:
- Supabase 数据库
- `src/hooks/useNotifications.ts`（新建）
- `src/components/NotificationCenter.tsx`

---

#### 步骤 1.2.1: 启用 notifications 表 RLS

**操作方式**: 通过 Supabase Dashboard 或 MCP 执行 SQL

**SQL 脚本**:
```sql
-- =============================================
-- 通知表 RLS 策略
-- =============================================

-- 1. 启用 RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 2. 删除可能存在的旧策略
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON notifications;

-- 3. 创建新策略

-- 用户只能查看自己的通知
CREATE POLICY "Users can view own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

-- 用户只能更新自己的通知（标记已读）
CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 用户可以删除自己的通知
CREATE POLICY "Users can delete own notifications"
ON notifications FOR DELETE
USING (auth.uid() = user_id);

-- 系统可以插入通知（通过 service_role 或触发器）
CREATE POLICY "System can insert notifications"
ON notifications FOR INSERT
WITH CHECK (true);

-- 4. 验证 RLS 已启用
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'notifications';
-- 应返回 rowsecurity = true
```

**执行方式**:
```bash
# 使用 Supabase MCP 执行
manus-mcp-cli tool call execute_sql --server supabase --input '{
  "project_id": "nbvnnhojvkxfnididast",
  "query": "ALTER TABLE notifications ENABLE ROW LEVEL SECURITY; ..."
}'
```

**验证标准**:
- [ ] RLS 已启用
- [ ] 4 个策略已创建

---

#### 步骤 1.2.2: 创建 useNotifications Hook

**文件路径**: `src/hooks/useNotifications.ts`

**创建文件**:
```bash
touch src/hooks/useNotifications.ts
```

**完整代码**:
```typescript
/**
 * useNotifications Hook
 * 
 * 功能:
 * - 从 Supabase 获取用户通知
 * - 实时订阅新通知
 * - 标记通知为已读
 * - 乐观更新 UI
 * 
 * 使用方式:
 * const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { RealtimeChannel } from '@supabase/supabase-js';

// =============================================
// 类型定义
// =============================================

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

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: Error | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refetch: () => Promise<void>;
}

// =============================================
// Hook 实现
// =============================================

export function useNotifications(): UseNotificationsReturn {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // 使用 ref 存储 channel，便于清理
  const channelRef = useRef<RealtimeChannel | null>(null);

  // =============================================
  // 获取通知列表
  // =============================================
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;

      setNotifications(data || []);
    } catch (err) {
      console.error('[useNotifications] Fetch error:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // =============================================
  // 标记单个通知为已读
  // =============================================
  const markAsRead = useCallback(async (id: string) => {
    if (!user?.id) return;

    // 乐观更新
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );

    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('[useNotifications] Mark as read error:', err);
      // 回滚
      fetchNotifications();
    }
  }, [user?.id, fetchNotifications]);

  // =============================================
  // 标记所有通知为已读
  // =============================================
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;

    // 乐观更新
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('[useNotifications] Mark all as read error:', err);
      // 回滚
      fetchNotifications();
    }
  }, [user?.id, fetchNotifications]);

  // =============================================
  // 初始加载
  // =============================================
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id, fetchNotifications]);

  // =============================================
  // Realtime 订阅
  // =============================================
  useEffect(() => {
    if (!user?.id) return;

    // 创建订阅
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
          console.log('[useNotifications] Realtime event:', payload.eventType);

          switch (payload.eventType) {
            case 'INSERT':
              // 新通知添加到列表开头
              setNotifications(prev => [payload.new as Notification, ...prev]);
              break;

            case 'UPDATE':
              // 更新现有通知
              setNotifications(prev =>
                prev.map(n =>
                  n.id === (payload.new as Notification).id
                    ? (payload.new as Notification)
                    : n
                )
              );
              break;

            case 'DELETE':
              // 从列表中移除
              setNotifications(prev =>
                prev.filter(n => n.id !== (payload.old as Notification).id)
              );
              break;
          }
        }
      )
      .subscribe((status) => {
        console.log('[useNotifications] Subscription status:', status);
      });

    channelRef.current = channel;

    // 清理函数
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user?.id]);

  // =============================================
  // 计算未读数量
  // =============================================
  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
}
```

**验证标准**:
- [ ] 文件创建成功
- [ ] TypeScript 编译无错误
- [ ] 导出类型正确

---

#### 步骤 1.2.3: 更新 NotificationCenter 组件

**文件路径**: `src/components/NotificationCenter.tsx`

**修改说明**: 将 Mock 数据替换为真实数据

**关键修改点**:

```typescript
// 1. 导入 useNotifications Hook
import { useNotifications, type Notification } from '@/hooks/useNotifications';

// 2. 在组件内使用 Hook
const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  // 3. 移除所有 Mock 数据
  // 删除类似这样的代码:
  // const [notifications, setNotifications] = useState([
  //   { id: '1', title: 'Mock notification', ... }
  // ]);

  // 4. 使用真实数据渲染
  // ...
};
```

**完整组件代码**: 参见终极执行手册 Phase 1 任务 1.2 步骤 3

**验证标准**:
- [ ] 组件使用 useNotifications Hook
- [ ] 通知从数据库加载
- [ ] 标记已读功能正常
- [ ] Realtime 更新正常

---

#### 步骤 1.2.4: 添加 data-testid

**修改位置**: `NotificationCenter.tsx`

```typescript
// 通知面板容器
<div data-testid="notifications-panel" className="...">

// 关闭按钮
<button data-testid="close-notifications" onClick={onClose}>

// 标记全部已读按钮
<button data-testid="mark-all-read" onClick={markAllAsRead}>

// 单个通知项
<div data-testid={`notification-${notification.id}`} key={notification.id}>
```

---

#### 步骤 1.2.5: 验证通知系统

**手动测试步骤**:
1. 登录账户
2. 点击通知图标
3. 验证:
   - [ ] 通知面板打开
   - [ ] 显示真实通知（如果有）
   - [ ] 点击通知可标记为已读
   - [ ] "全部已读" 功能正常

**数据库测试**:
```sql
-- 插入测试通知
INSERT INTO notifications (user_id, type, title, message)
VALUES (
  'your-user-id',
  'test',
  'Test Notification',
  'This is a test notification'
);

-- 验证 RLS 生效（使用其他用户 ID 应该查不到）
```

---

### 任务 1.3: 表单验证优化（可选）

**说明**: 现有表单验证已经足够完善，此任务为可选优化。如需使用 Zod + React Hook Form，请参考终极执行手册。

---

### Phase 1 完成检查清单

- [ ] 登出流程修复完成
- [ ] notifications RLS 启用
- [ ] useNotifications Hook 创建
- [ ] NotificationCenter 组件更新
- [ ] 所有 data-testid 添加
- [ ] 手动测试通过
- [ ] 代码提交

**提交命令**:
```bash
git add -A
git commit -m "fix: P0 bugs - logout flow, notifications system"
git push origin feature/ultimate-upgrade
```

---

## Phase 2: 监控体系

**预计时间**: 1.5天 (12小时)  
**前置条件**: Phase 0 完成（依赖已安装）  
**产出物**: Sentry、PostHog、Web Vitals 集成

### 任务 2.1: Sentry 错误监控

---

#### 步骤 2.1.1: 创建 Sentry 配置文件

**文件路径**: `src/lib/sentry.ts`

**创建文件**:
```bash
touch src/lib/sentry.ts
```

**完整代码**:
```typescript
/**
 * Sentry 错误监控配置
 * 
 * 功能:
 * - 自动捕获 JavaScript 错误
 * - 性能监控
 * - 会话回放（生产环境）
 * - 用户上下文关联
 */

import * as Sentry from '@sentry/react';

// =============================================
// 初始化函数
// =============================================

export function initSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  
  if (!dsn) {
    console.warn('[Sentry] DSN not configured, skipping initialization');
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE, // 'development' | 'production'
    release: import.meta.env.VITE_APP_VERSION || '1.0.0',
    
    // ========== 采样率配置 ==========
    // 性能监控采样率
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    
    // 会话回放采样率（仅生产环境）
    replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 0,
    replaysOnErrorSampleRate: 1.0, // 错误时 100% 记录
    
    // ========== 集成配置 ==========
    integrations: [
      // 浏览器性能追踪
      Sentry.browserTracingIntegration({
        // 追踪路由变化
        enableInp: true,
      }),
      
      // 会话回放
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
        // 敏感元素遮罩
        mask: ['.sensitive', '[data-sensitive]'],
      }),
    ],
    
    // ========== 数据过滤 ==========
    beforeSend(event, hint) {
      // 移除敏感请求头
      if (event.request?.headers) {
        delete event.request.headers['Authorization'];
        delete event.request.headers['Cookie'];
        delete event.request.headers['X-Auth-Token'];
      }
      
      // 移除敏感用户数据
      if (event.user) {
        delete event.user.ip_address;
      }
      
      return event;
    },
    
    // ========== 忽略的错误 ==========
    ignoreErrors: [
      // 浏览器扩展错误
      'top.GLOBALS',
      'originalCreateNotification',
      'canvas.contentDocument',
      'MyApp_RemoveAllHighlights',
      'http://tt.teletrax.net',
      'jigsaw is not defined',
      'ComboSearch is not defined',
      'http://loading.retry.widdit.com/',
      'atomicFindClose',
      
      // Chrome 扩展
      /extensions\//i,
      /^chrome:\/\//i,
      
      // 常见的非关键错误
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Non-Error promise rejection captured',
      /^Network Error$/,
      /^Loading chunk \d+ failed/,
      /^ChunkLoadError/,
      
      // 第三方脚本错误
      /^Script error\.?$/,
      /^Javascript error: Script error\.? on line 0$/,
    ],
    
    // ========== 忽略的 URL ==========
    denyUrls: [
      // Chrome 扩展
      /extensions\//i,
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
      
      // 第三方脚本
      /graph\.facebook\.com/i,
      /connect\.facebook\.net\/en_US\/all\.js/i,
      /eatdifferent\.com\.woopra-hierarchical\.js/i,
      /static\.woopra\.com\/js\/woopra\.js/i,
      /extensions\//i,
      /^moz-extension:\/\//i,
    ],
  });

  console.log('[Sentry] Initialized successfully');
}

// =============================================
// 用户上下文
// =============================================

export function setSentryUser(user: {
  id: string;
  email?: string;
  username?: string;
} | null): void {
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

// =============================================
// 手动捕获
// =============================================

export function captureException(
  error: Error,
  context?: Record<string, any>
): string {
  return Sentry.captureException(error, {
    extra: context,
  });
}

export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info'
): string {
  return Sentry.captureMessage(message, level);
}

// =============================================
// 自定义标签
// =============================================

export function setTag(key: string, value: string): void {
  Sentry.setTag(key, value);
}

export function setTags(tags: Record<string, string>): void {
  Sentry.setTags(tags);
}

// =============================================
// 面包屑
// =============================================

export function addBreadcrumb(breadcrumb: Sentry.Breadcrumb): void {
  Sentry.addBreadcrumb(breadcrumb);
}
```

---

#### 步骤 2.1.2: 配置 Vite 插件（可选）

**文件路径**: `vite.config.ts`

**修改内容**:
```typescript
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    // Sentry Source Maps（仅生产构建）
    process.env.NODE_ENV === 'production' && sentryVitePlugin({
      org: 'your-org',
      project: 'follow-ai',
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ].filter(Boolean),
  
  build: {
    sourcemap: true, // 生成 source maps
  },
});
```

---

### 任务 2.2: PostHog 产品分析

---

#### 步骤 2.2.1: 创建 PostHog 配置文件

**文件路径**: `src/lib/posthog.ts`

**完整代码**:
```typescript
/**
 * PostHog 产品分析配置
 * 
 * 功能:
 * - 用户行为追踪
 * - 事件分析
 * - 用户身份识别
 * - 功能标志（Feature Flags）
 */

import posthog from 'posthog-js';

// =============================================
// 初始化函数
// =============================================

export function initPostHog(): void {
  const apiKey = import.meta.env.VITE_POSTHOG_KEY;
  
  if (!apiKey) {
    console.warn('[PostHog] API key not configured, skipping initialization');
    return;
  }

  posthog.init(apiKey, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
    
    // ========== 自动捕获配置 ==========
    autocapture: true,           // 自动捕获点击、表单提交等
    capture_pageview: true,      // 自动捕获页面浏览
    capture_pageleave: true,     // 自动捕获页面离开
    
    // ========== 隐私配置 ==========
    disable_session_recording: !import.meta.env.PROD,
    mask_all_text: false,
    mask_all_element_attributes: false,
    
    // ========== 性能配置 ==========
    persistence: 'localStorage',
    bootstrap: {},
    
    // ========== 调试配置 ==========
    loaded: (ph) => {
      if (import.meta.env.DEV) {
        ph.debug();
      }
      console.log('[PostHog] Initialized successfully');
    },
  });
}

// =============================================
// 用户身份
// =============================================

export function identifyUser(
  userId: string,
  properties?: Record<string, any>
): void {
  posthog.identify(userId, properties);
}

export function resetUser(): void {
  posthog.reset();
}

// =============================================
// 事件追踪
// =============================================

export function trackEvent(
  event: string,
  properties?: Record<string, any>
): void {
  posthog.capture(event, properties);
}

// =============================================
// 预定义事件常量
// =============================================

export const AnalyticsEvents = {
  // 认证事件
  SIGNUP_STARTED: 'signup_started',
  SIGNUP_COMPLETED: 'signup_completed',
  SIGNUP_FAILED: 'signup_failed',
  LOGIN_STARTED: 'login_started',
  LOGIN_COMPLETED: 'login_completed',
  LOGIN_FAILED: 'login_failed',
  LOGOUT_COMPLETED: 'logout_completed',
  
  // 任务事件
  TASK_VIEWED: 'task_viewed',
  TASK_STARTED: 'task_started',
  TASK_SUBMITTED: 'task_submitted',
  TASK_APPROVED: 'task_approved',
  TASK_REJECTED: 'task_rejected',
  
  // XP 事件
  XP_EARNED: 'xp_earned',
  LEVEL_UP: 'level_up',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  
  // 支付事件
  PAYMENT_INITIATED: 'payment_initiated',
  PAYMENT_COMPLETED: 'payment_completed',
  PAYMENT_FAILED: 'payment_failed',
  PAYOUT_REQUESTED: 'payout_requested',
  
  // 通知事件
  NOTIFICATION_CLICKED: 'notification_clicked',
  NOTIFICATIONS_OPENED: 'notifications_opened',
  
  // 搜索事件
  SEARCH_PERFORMED: 'search_performed',
  SEARCH_RESULT_CLICKED: 'search_result_clicked',
} as const;

// =============================================
// 用户属性
// =============================================

export function setUserProperties(properties: Record<string, any>): void {
  posthog.people.set(properties);
}

export function incrementUserProperty(property: string, value: number = 1): void {
  posthog.people.increment(property, value);
}

// =============================================
// 功能标志
// =============================================

export function isFeatureEnabled(flag: string): boolean {
  return posthog.isFeatureEnabled(flag) ?? false;
}

export function getFeatureFlag(flag: string): string | boolean | undefined {
  return posthog.getFeatureFlag(flag);
}
```

---

### 任务 2.3: Web Vitals 监控

---

#### 步骤 2.3.1: 创建 Web Vitals 配置文件

**文件路径**: `src/lib/web-vitals.ts`

**完整代码**:
```typescript
/**
 * Web Vitals 性能监控
 * 
 * 监控指标:
 * - CLS (Cumulative Layout Shift) - 累积布局偏移
 * - FCP (First Contentful Paint) - 首次内容绘制
 * - FID (First Input Delay) - 首次输入延迟
 * - INP (Interaction to Next Paint) - 交互到下一次绘制
 * - LCP (Largest Contentful Paint) - 最大内容绘制
 * - TTFB (Time to First Byte) - 首字节时间
 */

import { onCLS, onFCP, onFID, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';
import { captureMessage } from './sentry';
import { trackEvent } from './posthog';

// =============================================
// 阈值定义（基于 Google 2025 标准）
// =============================================

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

// =============================================
// 评级函数
// =============================================

type Rating = 'good' | 'needs-improvement' | 'poor';

function getRating(name: string, value: number): Rating {
  const threshold = thresholds[name];
  if (!threshold) return 'good';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
}

// =============================================
// 指标上报
// =============================================

function reportMetric(metric: Metric): void {
  const rating = getRating(metric.name, metric.value);

  // 构建上报数据
  const data = {
    name: metric.name,
    value: Math.round(metric.value * 100) / 100, // 保留两位小数
    rating,
    delta: Math.round(metric.delta * 100) / 100,
    id: metric.id,
    navigationType: metric.navigationType,
    url: window.location.href,
    timestamp: new Date().toISOString(),
  };

  // 发送到 PostHog
  trackEvent('web_vital', data);

  // 如果性能差，发送到 Sentry
  if (rating === 'poor') {
    captureMessage(
      `Poor Web Vital: ${metric.name} = ${data.value} (threshold: ${thresholds[metric.name]?.good})`,
      'warning'
    );
  }

  // 开发环境打印
  if (import.meta.env.DEV) {
    const color = rating === 'good' ? 'green' : rating === 'needs-improvement' ? 'orange' : 'red';
    console.log(
      `%c[Web Vitals] ${metric.name}: ${data.value} (${rating})`,
      `color: ${color}; font-weight: bold;`
    );
  }
}

// =============================================
// 初始化函数
// =============================================

export function initWebVitals(): void {
  // 注册所有 Web Vitals 监控
  onCLS(reportMetric);
  onFCP(reportMetric);
  onFID(reportMetric);
  onINP(reportMetric);
  onLCP(reportMetric);
  onTTFB(reportMetric);

  console.log('[Web Vitals] Monitoring initialized');
}

// =============================================
// 手动获取指标
// =============================================

export function getWebVitalsThresholds(): Record<string, VitalsThresholds> {
  return { ...thresholds };
}
```

---

### 任务 2.4: 集成到应用入口

---

#### 步骤 2.4.1: 修改 main.tsx

**文件路径**: `src/main.tsx`

**修改内容**:
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// ========== 监控初始化 ==========
import { initSentry } from './lib/sentry';
import { initPostHog } from './lib/posthog';
import { initWebVitals } from './lib/web-vitals';

// 在应用渲染前初始化监控
// 顺序很重要：Sentry 应该最先初始化以捕获所有错误
initSentry();
initPostHog();

// ========== 渲染应用 ==========
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ========== DOM 加载后初始化 Web Vitals ==========
// Web Vitals 需要在 DOM 加载后才能准确测量
if (typeof window !== 'undefined') {
  initWebVitals();
}
```

---

#### 步骤 2.4.2: 在 AuthContext 中设置用户上下文

**文件路径**: `src/contexts/AuthContext.tsx`

**添加导入**:
```typescript
import { setSentryUser } from '@/lib/sentry';
import { identifyUser, resetUser, trackEvent, AnalyticsEvents } from '@/lib/posthog';
```

**在登录成功后添加**:
```typescript
// 在 setUser(userData) 之后添加
setSentryUser({
  id: userData.id,
  email: userData.email,
  username: userData.username,
});
identifyUser(userData.id, {
  email: userData.email,
  username: userData.username,
  level: userData.level,
});
trackEvent(AnalyticsEvents.LOGIN_COMPLETED, {
  method: 'email', // 或 'oauth'
});
```

**在登出时添加**:
```typescript
// 在 logout 函数中添加
setSentryUser(null);
resetUser();
trackEvent(AnalyticsEvents.LOGOUT_COMPLETED);
```

---

### Phase 2 完成检查清单

- [ ] `src/lib/sentry.ts` 创建完成
- [ ] `src/lib/posthog.ts` 创建完成
- [ ] `src/lib/web-vitals.ts` 创建完成
- [ ] `main.tsx` 集成完成
- [ ] `AuthContext.tsx` 用户上下文集成
- [ ] 开发环境测试通过
- [ ] 控制台显示 Web Vitals 日志

**提交命令**:
```bash
git add -A
git commit -m "feat: Add monitoring system - Sentry, PostHog, Web Vitals"
git push origin feature/ultimate-upgrade
```

---

*（文档继续...Phase 3-7 详细实现步骤）*


## Phase 3: 性能优化

**预计时间**: 1.5天 (12小时)  
**前置条件**: Phase 0 完成  
**产出物**: 代码分割、懒加载、图片优化

### 任务 3.1: Vite 代码分割配置

---

#### 步骤 3.1.1: 修改 vite.config.ts

**文件路径**: `vite.config.ts`

**完整配置**:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    
    // 图片优化插件
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { lossless: true },
      avif: { lossless: true },
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    // ========== 代码分割配置 ==========
    rollupOptions: {
      output: {
        manualChunks: {
          // React 核心库
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          
          // Supabase 客户端
          'vendor-supabase': ['@supabase/supabase-js'],
          
          // UI 组件库
          'vendor-ui': ['lucide-react', 'framer-motion'],
          
          // 图表库（如果使用）
          'vendor-charts': ['recharts'],
          
          // 监控库
          'vendor-monitoring': ['@sentry/react', 'posthog-js', 'web-vitals'],
        },
      },
    },

    // 分块大小警告阈值（500KB）
    chunkSizeWarningLimit: 500,

    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // 生产环境移除 console
        drop_debugger: true, // 移除 debugger
      },
    },

    // 生成 source maps（用于错误追踪）
    sourcemap: true,
  },

  // ========== 依赖预构建 ==========
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'lucide-react',
    ],
  },

  // ========== 开发服务器配置 ==========
  server: {
    port: 5173,
    host: true,
  },
});
```

---

### 任务 3.2: 路由懒加载

---

#### 步骤 3.2.1: 创建页面加载组件

**文件路径**: `src/components/PageLoader.tsx`

```typescript
import React from 'react';
import LoadingSpinner from './ui/LoadingSpinner';

const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-400 text-sm">Loading...</p>
    </div>
  </div>
);

export default PageLoader;
```

---

#### 步骤 3.2.2: 修改 App.tsx 使用懒加载

**文件路径**: `src/App.tsx`

**修改内容**:
```typescript
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PageLoader from '@/components/PageLoader';
import ProtectedRoute from '@/components/ProtectedRoute';

// ========== 懒加载页面组件 ==========
// 使用 React.lazy 实现代码分割
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

// Admin 页面
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));

// 404 页面
const NotFound = lazy(() => import('@/pages/NotFound'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ========== 公开路由 ========== */}
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/tools/:id" element={<ToolDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile/:username" element={<Profile />} />

          {/* ========== 保护路由 ========== */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* ========== Admin 路由 ========== */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* ========== 404 ========== */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
```

---

### 任务 3.3: 验证性能优化

**构建并检查**:
```bash
# 构建项目
pnpm build

# 检查输出文件大小
ls -la dist/assets/

# 应该看到多个分割的 chunk 文件:
# - vendor-react-xxx.js
# - vendor-supabase-xxx.js
# - vendor-ui-xxx.js
# - index-xxx.js (主应用代码)
```

**验证标准**:
- [ ] 构建成功
- [ ] 生成多个 chunk 文件
- [ ] 主 chunk 小于 200KB
- [ ] 总 bundle 大小小于 500KB

---

## Phase 4: Admin Dashboard + AI Review

**预计时间**: 3天 (24小时)  
**前置条件**: Phase 1 完成  
**产出物**: Admin Dashboard 页面、AI Review 功能

### 任务 4.1: 数据库准备

---

#### 步骤 4.1.1: 执行 SQL 迁移

**SQL 脚本**:
```sql
-- =============================================
-- Admin 系统增强
-- =============================================

-- 1. 添加角色字段到 app_admins 表
ALTER TABLE app_admins 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'admin' 
CHECK (role IN ('super_admin', 'admin', 'moderator', 'reviewer'));

ALTER TABLE app_admins 
ADD COLUMN IF NOT EXISTS permissions jsonb DEFAULT '[]'::jsonb;

-- 2. 创建管理员检查函数
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

-- 3. 创建获取管理员角色函数
CREATE OR REPLACE FUNCTION get_admin_role(user_uuid uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM app_admins WHERE user_id = user_uuid;
$$;

-- 4. 为当前用户添加 super_admin 权限（替换 your-user-id）
-- INSERT INTO app_admins (user_id, role) 
-- VALUES ('your-user-id', 'super_admin')
-- ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
```

---

### 任务 4.2: 创建 useAdmin Hook

**文件路径**: `src/hooks/useAdmin.ts`

**完整代码**: 参见终极执行手册 Phase 4 任务 4.2

---

### 任务 4.3: 创建 Admin Dashboard 页面

**文件路径**: `src/pages/admin/Dashboard.tsx`

**创建目录**:
```bash
mkdir -p src/pages/admin
touch src/pages/admin/Dashboard.tsx
```

**完整代码**: 参见终极执行手册 Phase 4 任务 4.3

---

### 任务 4.4: 创建 AI Review Edge Function

**文件路径**: `supabase/functions/ai-review/index.ts`

**创建目录**:
```bash
mkdir -p supabase/functions/ai-review
touch supabase/functions/ai-review/index.ts
```

**完整代码**: 参见终极执行手册 Phase 4 任务 4.4

**部署 Edge Function**:
```bash
# 使用 Supabase CLI 部署
supabase functions deploy ai-review --project-ref nbvnnhojvkxfnididast
```

---

## Phase 5: 游戏化系统增强

**预计时间**: 2天 (16小时)  
**前置条件**: Phase 1 完成  
**产出物**: Success Score 系统、徽章系统

### 任务 5.1: 创建 Success Score 视图

**SQL 脚本**:
```sql
-- =============================================
-- Success Score 游戏化系统
-- =============================================

-- 1. 创建 Success Score 视图
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
  -- Success Score 计算公式 (0-100)
  ROUND(
    (
      -- XP 贡献 (40%)
      LEAST(p.total_xp::numeric / 10000, 1) * 40 +
      -- 通过率贡献 (30%)
      CASE 
        WHEN COUNT(DISTINCT ts.id) > 0 
        THEN (COUNT(DISTINCT ts.id) FILTER (WHERE ts.status = 'approved')::numeric / 
              NULLIF(COUNT(DISTINCT ts.id)::numeric, 0)) * 30
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

-- 2. 创建获取 Success Score 的函数
CREATE OR REPLACE FUNCTION get_user_success_score(user_uuid uuid)
RETURNS numeric
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT success_score FROM user_success_scores WHERE user_id = user_uuid;
$$;
```

---

### 任务 5.2: 创建 useSuccessScore Hook

**文件路径**: `src/hooks/useSuccessScore.ts`

**完整代码**: 参见终极执行手册 Phase 5 任务 5.2

---

### 任务 5.3: 创建 SuccessScoreCard 组件

**文件路径**: `src/components/SuccessScoreCard.tsx`

**完整代码**: 参见终极执行手册 Phase 5 任务 5.3

---

## Phase 6: SEO + 可访问性

**预计时间**: 2天 (16小时)  
**前置条件**: 无  
**产出物**: SEO 组件、可访问性工具库

### 任务 6.1: 安装 react-helmet-async

```bash
pnpm add react-helmet-async
```

---

### 任务 6.2: 创建 SEO 组件

**文件路径**: `src/components/SEO.tsx`

**完整代码**: 参见终极执行手册 Phase 6 任务 6.1

---

### 任务 6.3: 创建可访问性工具库

**文件路径**: `src/lib/a11y.ts`

**完整代码**: 参见终极执行手册 Phase 6 任务 6.2

---

### 任务 6.4: 在 App.tsx 中添加 HelmetProvider

```typescript
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        {/* ... */}
      </BrowserRouter>
    </HelmetProvider>
  );
}
```

---

## Phase 7: 测试完善

**预计时间**: 1.5天 (12小时)  
**前置条件**: Phase 0 完成  
**产出物**: Vitest 配置、单元测试、E2E 测试修复

### 任务 7.1: 配置 Vitest

---

#### 步骤 7.1.1: 创建 vitest.config.ts

**文件路径**: `vitest.config.ts`

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
    exclude: ['node_modules', 'dist', 'tests/e2e'],
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

---

#### 步骤 7.1.2: 创建测试设置文件

**文件路径**: `tests/setup.ts`

```typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// ========== Mock Supabase ==========
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
    })),
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
    })),
    removeChannel: vi.fn(),
    removeAllChannels: vi.fn(),
  },
}));

// ========== Mock window.location ==========
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    replace: vi.fn(),
    reload: vi.fn(),
  },
  writable: true,
});

// ========== Mock localStorage ==========
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
```

---

#### 步骤 7.1.3: 添加测试脚本到 package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test"
  }
}
```

---

### 任务 7.2: 编写单元测试示例

**文件路径**: `src/hooks/useNotifications.test.ts`

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
  });

  it('should return empty notifications initially', () => {
    const { result } = renderHook(() => useNotifications());
    expect(result.current.notifications).toEqual([]);
  });

  it('should have markAsRead function', () => {
    const { result } = renderHook(() => useNotifications());
    expect(typeof result.current.markAsRead).toBe('function');
  });

  it('should have markAllAsRead function', () => {
    const { result } = renderHook(() => useNotifications());
    expect(typeof result.current.markAllAsRead).toBe('function');
  });
});
```

---

### Phase 7 完成检查清单

- [ ] `vitest.config.ts` 创建完成
- [ ] `tests/setup.ts` 创建完成
- [ ] `package.json` 测试脚本添加
- [ ] 单元测试示例通过
- [ ] E2E 测试修复完成
- [ ] 测试覆盖率 > 70%

**运行测试**:
```bash
# 运行单元测试
pnpm test

# 运行 E2E 测试
pnpm test:e2e

# 查看覆盖率
pnpm test:coverage
```

---

## 总结

本详细实现指南涵盖了 Follow.ai 项目升级的所有 7 个阶段，包括：

| Phase | 内容 | 文件数 | 预计时间 |
|-------|------|--------|----------|
| Phase 0 | 基础设施准备 | 2 | 4h |
| Phase 1 | P0 Bug 修复 | 3 | 16h |
| Phase 2 | 监控体系 | 4 | 12h |
| Phase 3 | 性能优化 | 3 | 12h |
| Phase 4 | Admin + AI Review | 4 | 24h |
| Phase 5 | 游戏化系统 | 3 | 16h |
| Phase 6 | SEO + 可访问性 | 3 | 16h |
| Phase 7 | 测试完善 | 4 | 12h |
| **总计** | | **26** | **112h** |

---

**文档版本**: 1.0  
**最后更新**: 2026年1月8日  
**作者**: Manus AI
