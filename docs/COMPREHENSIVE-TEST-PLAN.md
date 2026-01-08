# Follow.ai 完整测试计划

> **版本**: 1.0  
> **日期**: 2026年1月8日  
> **作者**: Manus AI

---

## 目录

1. [测试策略概述](#测试策略概述)
2. [测试环境](#测试环境)
3. [单元测试计划](#单元测试计划)
4. [集成测试计划](#集成测试计划)
5. [E2E 测试计划](#e2e-测试计划)
6. [性能测试计划](#性能测试计划)
7. [安全测试计划](#安全测试计划)
8. [可访问性测试计划](#可访问性测试计划)
9. [测试执行时间表](#测试执行时间表)
10. [测试报告模板](#测试报告模板)

---

## 测试策略概述

### 测试金字塔

```
                    ┌─────────────┐
                    │   E2E 测试   │  10%
                    │  (Playwright)│
                   ┌┴─────────────┴┐
                   │  集成测试      │  20%
                   │  (API + DB)   │
                  ┌┴───────────────┴┐
                  │    单元测试      │  70%
                  │    (Vitest)     │
                  └─────────────────┘
```

### 测试覆盖目标

| 测试类型 | 当前覆盖率 | 目标覆盖率 | 优先级 |
|----------|------------|------------|--------|
| 单元测试 | 0% | 70% | P0 |
| 集成测试 | 0% | 50% | P1 |
| E2E 测试 | 53.1% | 90% | P0 |
| 性能测试 | 0% | 基准建立 | P2 |
| 安全测试 | 0% | 100% RLS | P1 |
| 可访问性测试 | 0% | WCAG 2.2 AA | P2 |

---

## 测试环境

### 本地开发环境

| 组件 | 版本 | 用途 |
|------|------|------|
| Node.js | 22.x | 运行时 |
| pnpm | 9.x | 包管理 |
| Vitest | 2.x | 单元测试 |
| Playwright | 1.x | E2E 测试 |
| PostgreSQL | 17.x | 数据库 |

### 测试数据库

```bash
# 使用 Supabase 本地开发
supabase start

# 或使用测试项目
SUPABASE_URL=https://test-project.supabase.co
SUPABASE_ANON_KEY=test-anon-key
```

### CI/CD 环境

```yaml
# GitHub Actions 配置
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: pnpm install
      - run: pnpm test
      - run: pnpm test:e2e
```

---

## 单元测试计划

### 测试范围

#### 1. Hooks 测试

| Hook | 测试文件 | 测试用例数 | 优先级 |
|------|----------|------------|--------|
| useNotifications | `useNotifications.test.ts` | 8 | P0 |
| useAdmin | `useAdmin.test.ts` | 6 | P0 |
| useSuccessScore | `useSuccessScore.test.ts` | 5 | P1 |
| useAuth | `useAuth.test.ts` | 10 | P0 |

#### 2. 工具函数测试

| 模块 | 测试文件 | 测试用例数 | 优先级 |
|------|----------|------------|--------|
| sentry | `sentry.test.ts` | 5 | P1 |
| posthog | `posthog.test.ts` | 5 | P1 |
| web-vitals | `web-vitals.test.ts` | 4 | P2 |
| a11y | `a11y.test.ts` | 6 | P1 |
| validations | `validations.test.ts` | 10 | P0 |

#### 3. 组件测试

| 组件 | 测试文件 | 测试用例数 | 优先级 |
|------|----------|------------|--------|
| AuthModal | `AuthModal.test.tsx` | 12 | P0 |
| NotificationCenter | `NotificationCenter.test.tsx` | 8 | P0 |
| SuccessScoreCard | `SuccessScoreCard.test.tsx` | 5 | P1 |
| SEO | `SEO.test.tsx` | 4 | P2 |

---

### 详细测试用例

#### useNotifications Hook 测试

**文件**: `src/hooks/useNotifications.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useNotifications } from './useNotifications';

// Mock 依赖
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    channel: vi.fn(),
    removeChannel: vi.fn(),
  },
}));

describe('useNotifications', () => {
  // ========== 初始化测试 ==========
  describe('Initialization', () => {
    it('TC-UN-001: should initialize with loading state', () => {
      // Arrange
      const { useAuth } = require('@/contexts/AuthContext');
      useAuth.mockReturnValue({ user: { id: 'user-1' }, isAuthenticated: true });

      // Act
      const { result } = renderHook(() => useNotifications());

      // Assert
      expect(result.current.isLoading).toBe(true);
      expect(result.current.notifications).toEqual([]);
      expect(result.current.unreadCount).toBe(0);
    });

    it('TC-UN-002: should return empty state when not authenticated', () => {
      // Arrange
      const { useAuth } = require('@/contexts/AuthContext');
      useAuth.mockReturnValue({ user: null, isAuthenticated: false });

      // Act
      const { result } = renderHook(() => useNotifications());

      // Assert
      expect(result.current.isLoading).toBe(false);
      expect(result.current.notifications).toEqual([]);
    });
  });

  // ========== 数据获取测试 ==========
  describe('Data Fetching', () => {
    it('TC-UN-003: should fetch notifications on mount', async () => {
      // Arrange
      const mockNotifications = [
        { id: '1', title: 'Test', read: false, created_at: new Date().toISOString() },
      ];
      const { useAuth } = require('@/contexts/AuthContext');
      const { supabase } = require('@/lib/supabase');
      
      useAuth.mockReturnValue({ user: { id: 'user-1' }, isAuthenticated: true });
      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockNotifications, error: null }),
      });

      // Act
      const { result } = renderHook(() => useNotifications());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.notifications).toHaveLength(1);
      });
    });

    it('TC-UN-004: should handle fetch error gracefully', async () => {
      // Arrange
      const { useAuth } = require('@/contexts/AuthContext');
      const { supabase } = require('@/lib/supabase');
      
      useAuth.mockReturnValue({ user: { id: 'user-1' }, isAuthenticated: true });
      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: null, error: new Error('Network error') }),
      });

      // Act
      const { result } = renderHook(() => useNotifications());

      // Assert
      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });
    });
  });

  // ========== 操作测试 ==========
  describe('Actions', () => {
    it('TC-UN-005: should mark notification as read', async () => {
      // Arrange
      const mockNotifications = [
        { id: '1', title: 'Test', read: false, created_at: new Date().toISOString() },
      ];
      const { useAuth } = require('@/contexts/AuthContext');
      const { supabase } = require('@/lib/supabase');
      
      useAuth.mockReturnValue({ user: { id: 'user-1' }, isAuthenticated: true });
      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockNotifications, error: null }),
        update: vi.fn().mockReturnThis(),
      });

      // Act
      const { result } = renderHook(() => useNotifications());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.markAsRead('1');
      });

      // Assert
      expect(result.current.notifications[0].read).toBe(true);
    });

    it('TC-UN-006: should mark all notifications as read', async () => {
      // Similar to TC-UN-005 but for markAllAsRead
    });

    it('TC-UN-007: should calculate unread count correctly', async () => {
      // Test unread count calculation
    });

    it('TC-UN-008: should handle optimistic update rollback on error', async () => {
      // Test rollback behavior
    });
  });
});
```

---

#### AuthModal 组件测试

**文件**: `src/components/AuthModal.test.tsx`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthModal from './AuthModal';

// Mock 依赖
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn(),
    signup: vi.fn(),
  }),
}));

vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key: string) => key,
  }),
}));

describe('AuthModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    initialMode: 'login' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ========== 渲染测试 ==========
  describe('Rendering', () => {
    it('TC-AM-001: should render login form by default', () => {
      render(<AuthModal {...defaultProps} />);
      
      expect(screen.getByTestId('auth-modal-title')).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
    });

    it('TC-AM-002: should render signup form when initialMode is signup', () => {
      render(<AuthModal {...defaultProps} initialMode="signup" />);
      
      expect(screen.getByTestId('username-input')).toBeInTheDocument();
      expect(screen.getByTestId('name-input')).toBeInTheDocument();
    });

    it('TC-AM-003: should not render when isOpen is false', () => {
      render(<AuthModal {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByTestId('auth-modal-title')).not.toBeInTheDocument();
    });
  });

  // ========== 表单验证测试 ==========
  describe('Form Validation', () => {
    it('TC-AM-004: should show error for invalid email format', async () => {
      render(<AuthModal {...defaultProps} />);
      const user = userEvent.setup();
      
      const emailInput = screen.getByTestId('email-input');
      await user.type(emailInput, 'invalid-email');
      await user.tab(); // 触发 blur
      
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    it('TC-AM-005: should disable submit button when form is invalid', () => {
      render(<AuthModal {...defaultProps} />);
      
      const submitButton = screen.getByTestId('auth-submit-button');
      expect(submitButton).toBeDisabled();
    });

    it('TC-AM-006: should enable submit button when form is valid', async () => {
      render(<AuthModal {...defaultProps} />);
      const user = userEvent.setup();
      
      await user.type(screen.getByTestId('email-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'password123');
      
      const submitButton = screen.getByTestId('auth-submit-button');
      expect(submitButton).not.toBeDisabled();
    });

    it('TC-AM-007: should validate password length (min 6 chars)', async () => {
      render(<AuthModal {...defaultProps} initialMode="signup" />);
      const user = userEvent.setup();
      
      await user.type(screen.getByTestId('password-input'), '12345');
      await user.tab();
      
      // 应该显示密码长度错误
      expect(screen.getByText(/password/i)).toBeInTheDocument();
    });
  });

  // ========== 交互测试 ==========
  describe('Interactions', () => {
    it('TC-AM-008: should switch between login and signup modes', async () => {
      render(<AuthModal {...defaultProps} />);
      const user = userEvent.setup();
      
      const toggleButton = screen.getByTestId('auth-mode-toggle');
      await user.click(toggleButton);
      
      expect(screen.getByTestId('username-input')).toBeInTheDocument();
    });

    it('TC-AM-009: should call onClose when close button is clicked', async () => {
      const onClose = vi.fn();
      render(<AuthModal {...defaultProps} onClose={onClose} />);
      const user = userEvent.setup();
      
      await user.click(screen.getByTestId('close-auth-modal'));
      
      expect(onClose).toHaveBeenCalled();
    });

    it('TC-AM-010: should toggle password visibility', async () => {
      render(<AuthModal {...defaultProps} />);
      const user = userEvent.setup();
      
      const passwordInput = screen.getByTestId('password-input');
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      await user.click(screen.getByTestId('toggle-password-visibility'));
      
      expect(passwordInput).toHaveAttribute('type', 'text');
    });
  });

  // ========== 提交测试 ==========
  describe('Form Submission', () => {
    it('TC-AM-011: should call login function on valid login submit', async () => {
      const { useAuth } = require('@/contexts/AuthContext');
      const mockLogin = vi.fn().mockResolvedValue({ success: true });
      useAuth.mockReturnValue({ login: mockLogin, signup: vi.fn() });
      
      render(<AuthModal {...defaultProps} />);
      const user = userEvent.setup();
      
      await user.type(screen.getByTestId('email-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'password123');
      await user.click(screen.getByTestId('auth-submit-button'));
      
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('TC-AM-012: should show loading state during submission', async () => {
      const { useAuth } = require('@/contexts/AuthContext');
      const mockLogin = vi.fn().mockImplementation(() => new Promise(() => {})); // 永不 resolve
      useAuth.mockReturnValue({ login: mockLogin, signup: vi.fn() });
      
      render(<AuthModal {...defaultProps} />);
      const user = userEvent.setup();
      
      await user.type(screen.getByTestId('email-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'password123');
      await user.click(screen.getByTestId('auth-submit-button'));
      
      expect(screen.getByTestId('auth-submit-button')).toBeDisabled();
    });
  });
});
```

---

## 集成测试计划

### 测试范围

| 模块 | 测试内容 | 测试用例数 | 优先级 |
|------|----------|------------|--------|
| 认证流程 | 登录/注册/登出 | 8 | P0 |
| 通知系统 | CRUD + Realtime | 6 | P0 |
| 任务系统 | 提交/审核流程 | 10 | P1 |
| XP 系统 | 奖励/扣除/等级 | 8 | P1 |
| 支付系统 | Stripe 集成 | 6 | P2 |

### 认证流程集成测试

**文件**: `tests/integration/auth.test.ts`

```typescript
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

describe('Authentication Integration', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
  };

  // ========== 注册流程 ==========
  describe('Sign Up Flow', () => {
    it('TC-AUTH-INT-001: should create new user with valid credentials', async () => {
      const { data, error } = await supabase.auth.signUp({
        email: testUser.email,
        password: testUser.password,
      });

      expect(error).toBeNull();
      expect(data.user).toBeTruthy();
      expect(data.user?.email).toBe(testUser.email);
    });

    it('TC-AUTH-INT-002: should create profile after signup', async () => {
      // 等待触发器创建 profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', testUser.email)
        .single();

      // Profile 应该被触发器自动创建
      expect(data).toBeTruthy();
    });

    it('TC-AUTH-INT-003: should reject duplicate email', async () => {
      const { error } = await supabase.auth.signUp({
        email: testUser.email,
        password: testUser.password,
      });

      expect(error).toBeTruthy();
    });
  });

  // ========== 登录流程 ==========
  describe('Sign In Flow', () => {
    it('TC-AUTH-INT-004: should login with valid credentials', async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testUser.email,
        password: testUser.password,
      });

      expect(error).toBeNull();
      expect(data.session).toBeTruthy();
    });

    it('TC-AUTH-INT-005: should reject invalid password', async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email: testUser.email,
        password: 'WrongPassword',
      });

      expect(error).toBeTruthy();
    });
  });

  // ========== 登出流程 ==========
  describe('Sign Out Flow', () => {
    it('TC-AUTH-INT-006: should invalidate session on logout', async () => {
      // 先登录
      await supabase.auth.signInWithPassword({
        email: testUser.email,
        password: testUser.password,
      });

      // 登出
      const { error } = await supabase.auth.signOut();

      expect(error).toBeNull();

      // 验证会话已失效
      const { data } = await supabase.auth.getSession();
      expect(data.session).toBeNull();
    });
  });

  // ========== 清理 ==========
  afterAll(async () => {
    // 删除测试用户
    // 注意：需要 service_role 权限
  });
});
```

---

## E2E 测试计划

### 测试范围

| 页面/功能 | 测试文件 | 测试用例数 | 优先级 |
|-----------|----------|------------|--------|
| 首页 | `home.spec.ts` | 6 | P1 |
| 认证 | `auth.spec.ts` | 13 | P0 |
| 仪表板 | `dashboard.spec.ts` | 19 | P0 |
| 任务列表 | `tasks.spec.ts` | 10 | P1 |
| 任务详情 | `task-detail.spec.ts` | 8 | P1 |
| 个人资料 | `profile.spec.ts` | 6 | P2 |
| 设置 | `settings.spec.ts` | 5 | P2 |
| Admin | `admin.spec.ts` | 8 | P1 |

### 认证 E2E 测试

**文件**: `tests/e2e/auth.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ========== 登录测试 ==========
  test.describe('Login', () => {
    test('TC-E2E-AUTH-001: should display login button for unauthenticated users', async ({ page }) => {
      const loginButton = page.getByTestId('login-button');
      await expect(loginButton).toBeVisible();
    });

    test('TC-E2E-AUTH-002: should open auth modal when clicking login', async ({ page }) => {
      await page.getByTestId('login-button').click();
      
      const authModal = page.getByTestId('auth-modal-title');
      await expect(authModal).toBeVisible();
    });

    test('TC-E2E-AUTH-003: should validate email format in real-time', async ({ page }) => {
      await page.getByTestId('login-button').click();
      
      const emailInput = page.getByTestId('email-input');
      await emailInput.fill('invalid-email');
      await emailInput.blur();
      
      const errorMessage = page.getByTestId('error-message');
      await expect(errorMessage).toBeVisible();
    });

    test('TC-E2E-AUTH-004: should disable submit button when form is invalid', async ({ page }) => {
      await page.getByTestId('login-button').click();
      
      const submitButton = page.getByTestId('auth-submit-button');
      await expect(submitButton).toBeDisabled();
    });

    test('TC-E2E-AUTH-005: should enable submit button when form is valid', async ({ page }) => {
      await page.getByTestId('login-button').click();
      
      await page.getByTestId('email-input').fill('test@example.com');
      await page.getByTestId('password-input').fill('password123');
      
      const submitButton = page.getByTestId('auth-submit-button');
      await expect(submitButton).not.toBeDisabled();
    });

    test('TC-E2E-AUTH-006: should show error message for invalid credentials', async ({ page }) => {
      await page.getByTestId('login-button').click();
      
      await page.getByTestId('email-input').fill('nonexistent@example.com');
      await page.getByTestId('password-input').fill('wrongpassword');
      await page.getByTestId('auth-submit-button').click();
      
      const errorMessage = page.getByTestId('error-message');
      await expect(errorMessage).toBeVisible({ timeout: 10000 });
    });

    test('TC-E2E-AUTH-007: should redirect to dashboard after successful login', async ({ page }) => {
      // 使用测试账户
      await page.getByTestId('login-button').click();
      
      await page.getByTestId('email-input').fill(process.env.TEST_USER_EMAIL!);
      await page.getByTestId('password-input').fill(process.env.TEST_USER_PASSWORD!);
      await page.getByTestId('auth-submit-button').click();
      
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    });
  });

  // ========== 注册测试 ==========
  test.describe('Signup', () => {
    test('TC-E2E-AUTH-008: should switch to signup mode', async ({ page }) => {
      await page.getByTestId('login-button').click();
      await page.getByTestId('auth-mode-toggle').click();
      
      const usernameInput = page.getByTestId('username-input');
      await expect(usernameInput).toBeVisible();
    });

    test('TC-E2E-AUTH-009: should validate username format', async ({ page }) => {
      await page.getByTestId('login-button').click();
      await page.getByTestId('auth-mode-toggle').click();
      
      await page.getByTestId('username-input').fill('ab'); // 太短
      await page.getByTestId('username-input').blur();
      
      // 应该显示用户名长度错误
      const errorMessage = page.getByTestId('error-message');
      await expect(errorMessage).toBeVisible();
    });
  });

  // ========== 登出测试 ==========
  test.describe('Logout', () => {
    test.beforeEach(async ({ page }) => {
      // 先登录
      await page.getByTestId('login-button').click();
      await page.getByTestId('email-input').fill(process.env.TEST_USER_EMAIL!);
      await page.getByTestId('password-input').fill(process.env.TEST_USER_PASSWORD!);
      await page.getByTestId('auth-submit-button').click();
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    });

    test('TC-E2E-AUTH-010: should logout successfully', async ({ page }) => {
      await page.getByTestId('logout-button').click();
      
      // 应该重定向到首页
      await expect(page).toHaveURL('/');
      
      // 应该显示登录按钮
      const loginButton = page.getByTestId('login-button');
      await expect(loginButton).toBeVisible();
    });

    test('TC-E2E-AUTH-011: should clear local storage after logout', async ({ page }) => {
      await page.getByTestId('logout-button').click();
      
      // 检查 localStorage
      const hasSupabaseKeys = await page.evaluate(() => {
        return Object.keys(localStorage).some(key => key.includes('supabase'));
      });
      
      expect(hasSupabaseKeys).toBe(false);
    });
  });

  // ========== 模态框交互测试 ==========
  test.describe('Modal Interactions', () => {
    test('TC-E2E-AUTH-012: should close modal when clicking close button', async ({ page }) => {
      await page.getByTestId('login-button').click();
      await page.getByTestId('close-auth-modal').click();
      
      const authModal = page.getByTestId('auth-modal-title');
      await expect(authModal).not.toBeVisible();
    });

    test('TC-E2E-AUTH-013: should close modal when pressing Escape', async ({ page }) => {
      await page.getByTestId('login-button').click();
      await page.keyboard.press('Escape');
      
      const authModal = page.getByTestId('auth-modal-title');
      await expect(authModal).not.toBeVisible();
    });
  });
});
```

---

### 仪表板 E2E 测试

**文件**: `tests/e2e/dashboard.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E', () => {
  // 登录 fixture
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('login-button').click();
    await page.getByTestId('email-input').fill(process.env.TEST_USER_EMAIL!);
    await page.getByTestId('password-input').fill(process.env.TEST_USER_PASSWORD!);
    await page.getByTestId('auth-submit-button').click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  });

  // ========== 页面加载测试 ==========
  test.describe('Page Load', () => {
    test('TC-E2E-DASH-001: should load dashboard page', async ({ page }) => {
      await expect(page.getByTestId('dashboard-page')).toBeVisible();
    });

    test('TC-E2E-DASH-002: should display user stats', async ({ page }) => {
      await expect(page.getByTestId('user-stats')).toBeVisible();
    });

    test('TC-E2E-DASH-003: should display active tasks count', async ({ page }) => {
      await expect(page.getByTestId('active-tasks-count')).toBeVisible();
    });

    test('TC-E2E-DASH-004: should display completed tasks count', async ({ page }) => {
      await expect(page.getByTestId('completed-tasks-count')).toBeVisible();
    });
  });

  // ========== 导航测试 ==========
  test.describe('Navigation', () => {
    test('TC-E2E-DASH-005: should navigate to tasks page', async ({ page }) => {
      await page.getByTestId('view-all-tasks').click();
      await expect(page).toHaveURL(/\/tasks/);
    });

    test('TC-E2E-DASH-006: should navigate to create task page', async ({ page }) => {
      await page.getByTestId('create-task-button').click();
      await expect(page).toHaveURL(/\/tasks\/new|\/tasks\/create/);
    });
  });

  // ========== 通知测试 ==========
  test.describe('Notifications', () => {
    test('TC-E2E-DASH-007: should open notifications panel', async ({ page }) => {
      await page.getByTestId('notifications-button').click();
      
      const panel = page.getByTestId('notifications-panel');
      await expect(panel).toBeVisible();
    });

    test('TC-E2E-DASH-008: should close notifications panel', async ({ page }) => {
      await page.getByTestId('notifications-button').click();
      await page.getByTestId('close-notifications').click();
      
      const panel = page.getByTestId('notifications-panel');
      await expect(panel).not.toBeVisible();
    });
  });

  // ========== 用户菜单测试 ==========
  test.describe('User Menu', () => {
    test('TC-E2E-DASH-009: should display user avatar', async ({ page }) => {
      await expect(page.getByTestId('user-avatar')).toBeVisible();
    });

    test('TC-E2E-DASH-010: should open user menu', async ({ page }) => {
      await page.getByTestId('user-menu').click();
      
      const settingsLink = page.getByTestId('settings-link');
      await expect(settingsLink).toBeVisible();
    });
  });

  // ========== 刷新测试 ==========
  test.describe('Refresh', () => {
    test('TC-E2E-DASH-011: should refresh dashboard data', async ({ page }) => {
      const refreshButton = page.getByTestId('refresh-dashboard');
      await refreshButton.click();
      
      // 验证数据已刷新（检查加载状态）
      // 这里可以检查 loading 状态或数据变化
    });
  });
});
```

---

## 性能测试计划

### 测试指标

| 指标 | 目标值 | 测量方法 |
|------|--------|----------|
| LCP | < 2.5s | Web Vitals |
| FID | < 100ms | Web Vitals |
| CLS | < 0.1 | Web Vitals |
| INP | < 200ms | Web Vitals |
| TTFB | < 800ms | Web Vitals |
| Bundle Size | < 300KB | Build output |
| 首屏加载 | < 2s | Lighthouse |

### Lighthouse 测试脚本

```bash
# 安装 Lighthouse CLI
npm install -g lighthouse

# 运行性能测试
lighthouse https://www.follow-ai.com \
  --output=json \
  --output-path=./lighthouse-report.json \
  --chrome-flags="--headless"

# 生成 HTML 报告
lighthouse https://www.follow-ai.com \
  --output=html \
  --output-path=./lighthouse-report.html
```

---

## 安全测试计划

### RLS 策略测试

| 表 | 测试内容 | 测试用例数 |
|-----|----------|------------|
| profiles | 只能查看/编辑自己的资料 | 4 |
| notifications | 只能查看/编辑自己的通知 | 4 |
| task_submissions | 只能查看/编辑自己的提交 | 4 |
| wallets | 只能查看自己的钱包 | 2 |

### RLS 测试示例

```typescript
describe('RLS Security Tests', () => {
  it('TC-SEC-001: should not allow user to view other users notifications', async () => {
    // 使用 user1 的 token
    const user1Client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${user1Token}` } }
    });

    // 尝试查询 user2 的通知
    const { data, error } = await user1Client
      .from('notifications')
      .select('*')
      .eq('user_id', user2Id);

    // 应该返回空数组（RLS 过滤）
    expect(data).toHaveLength(0);
  });
});
```

---

## 可访问性测试计划

### WCAG 2.2 AA 检查清单

| 准则 | 描述 | 测试方法 |
|------|------|----------|
| 1.1.1 | 非文本内容有替代文本 | axe-core |
| 1.4.3 | 对比度至少 4.5:1 | axe-core |
| 2.1.1 | 键盘可访问 | 手动测试 |
| 2.4.7 | 焦点可见 | 手动测试 |
| 4.1.2 | 名称、角色、值 | axe-core |

### axe-core 集成测试

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('TC-A11Y-001: homepage should have no accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('TC-A11Y-002: dashboard should have no accessibility violations', async ({ page }) => {
    // 先登录
    await page.goto('/');
    // ... 登录流程
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

---

## 测试执行时间表

| 阶段 | 测试类型 | 执行时间 | 负责人 |
|------|----------|----------|--------|
| Phase 1 完成后 | 单元测试 (Hooks) | 2h | 开发者 |
| Phase 2 完成后 | 单元测试 (监控) | 1h | 开发者 |
| Phase 3 完成后 | 性能测试 | 2h | 开发者 |
| Phase 4 完成后 | 集成测试 (Admin) | 3h | 开发者 |
| Phase 5 完成后 | 单元测试 (游戏化) | 2h | 开发者 |
| Phase 6 完成后 | 可访问性测试 | 2h | 开发者 |
| Phase 7 完成后 | 完整 E2E 测试 | 4h | 开发者 |
| 发布前 | 回归测试 | 4h | QA |

---

## 测试报告模板

### 测试执行报告

```markdown
# Follow.ai 测试执行报告

## 基本信息
- **测试日期**: YYYY-MM-DD
- **测试版本**: vX.X.X
- **测试环境**: Production / Staging
- **执行者**: XXX

## 测试结果摘要

| 测试类型 | 总数 | 通过 | 失败 | 跳过 | 通过率 |
|----------|------|------|------|------|--------|
| 单元测试 | XX | XX | XX | XX | XX% |
| 集成测试 | XX | XX | XX | XX | XX% |
| E2E 测试 | XX | XX | XX | XX | XX% |
| **总计** | **XX** | **XX** | **XX** | **XX** | **XX%** |

## 失败测试详情

### TC-XXX-XXX: 测试名称
- **失败原因**: 
- **错误信息**: 
- **截图**: 
- **建议修复**: 

## 性能测试结果

| 指标 | 目标 | 实际 | 状态 |
|------|------|------|------|
| LCP | < 2.5s | X.Xs | ✅/❌ |
| FID | < 100ms | Xms | ✅/❌ |
| CLS | < 0.1 | X.XX | ✅/❌ |

## 结论与建议

### 可发布: ✅ / ❌

### 建议:
1. 
2. 
3. 
```

---

**文档版本**: 1.0  
**最后更新**: 2026年1月8日  
**作者**: Manus AI
