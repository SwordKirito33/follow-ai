# 需要应用的修复清单

**生成日期：** 2024-01-05  
**优先级：** P0 (关键)

---

## 📋 修复清单

### 修复 1: 添加 data-testid 属性到 AuthModal.tsx

**文件：** `src/components/AuthModal.tsx`

**修改位置：** 第 131-250 行

**需要添加的属性：**

```tsx
// 关闭按钮
<button
  onClick={onClose}
  className="absolute top-4 right-4 text-gray-400 hover:text-gray-400 transition-colors"
  data-testid="close-auth-modal"
>

// 登录/注册标题
<h2 
  className="text-3xl font-black text-white tracking-tight"
  data-testid="auth-modal-title"
>

// 错误消息
<div 
  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-shake"
  data-testid="auth-error-message"
>

// 用户名输入
<input
  type="text"
  value={username}
  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
  className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
  placeholder={t('auth.usernamePlaceholder') || 'username (3-20 characters)'}
  minLength={3}
  maxLength={20}
  pattern="[a-zA-Z0-9_]+"
  disabled={isSubmitting}
  required
  data-testid="username-input"
/>

// 名字输入
<input
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
  placeholder={t('auth.namePlaceholder')}
  disabled={isSubmitting}
  required
  data-testid="name-input"
/>

// 邮箱输入
<input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
  placeholder={t('auth.emailPlaceholder')}
  disabled={isSubmitting}
  required
  data-testid="email-input"
/>

// 密码输入
<input
  type={showPassword ? 'text' : 'password'}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="w-full pl-10 pr-12 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
  placeholder={t('auth.passwordPlaceholder')}
  disabled={isSubmitting}
  required
  data-testid="password-input"
/>

// 显示/隐藏密码按钮
<button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-400 transition-colors"
  data-testid="toggle-password-visibility"
>

// 提交按钮
<button
  type="submit"
  disabled={isSubmitting}
  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
  data-testid="auth-submit-button"
>

// 模式切换按钮
<button
  type="button"
  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
  data-testid="auth-mode-toggle"
>
```

---

### 修复 2: 添加 data-testid 属性到 Dashboard.tsx

**文件：** `src/pages/Dashboard.tsx`

**需要添加的属性：**

```tsx
// 仪表板容器
<div 
  className="min-h-screen py-12 px-4 relative"
  data-testid="dashboard-container"
>

// 仪表板标题
<h1 
  className="text-4xl sm:text-5xl font-black gradient-text mb-2 tracking-tight"
  data-testid="dashboard-title"
>

// 用户信息卡片
<div 
  className="..."
  data-testid="user-info-card"
>

// 用户名
<h2 
  className="..."
  data-testid="user-name"
>

// 用户 XP
<div 
  className="..."
  data-testid="user-xp"
>

// 用户等级
<div 
  className="..."
  data-testid="user-level"
>

// 用户余额
<div 
  className="..."
  data-testid="user-balance"
>

// 创建任务按钮
<Link 
  to="/tasks/create"
  className="..."
  data-testid="create-task-button"
>

// 查看所有任务按钮
<Link 
  to="/tasks"
  className="..."
  data-testid="view-all-tasks-button"
>

// 查看排行榜按钮
<Link 
  to="/leaderboard"
  className="..."
  data-testid="view-leaderboard-button"
>

// 用户菜单
<button 
  className="..."
  data-testid="user-menu-button"
>

// 通知徽章
<div 
  className="..."
  data-testid="notification-badge"
>

// 用户头像
<img 
  className="..."
  data-testid="user-avatar"
  alt="User avatar"
/>

// 欢迎信息
<p 
  className="..."
  data-testid="welcome-message"
>

// 活动项目
<div 
  className="..."
  data-testid="activity-item"
>
```

---

### 修复 3: 更新测试代码以使用实际选择器

**文件：** `tests/e2e/auth.spec.ts` 和 `tests/e2e/dashboard.spec.ts`

**需要更新的选择器：**

```typescript
// 旧的（失败的）
await page.click('[data-testid="login-button"]');

// 新的（使用实际元素）
// 方案 A: 使用 data-testid（修复后）
await page.click('[data-testid="auth-submit-button"]');

// 方案 B: 使用文本选择器
await page.click('button:has-text("Login")');

// 方案 C: 使用 role 选择器
await page.click('button[role="button"]:has-text("Login")');
```

---

### 修复 4: 创建测试用户

**文件：** `tests/fixtures/setupUsers.ts` (新建)

```typescript
import { Page } from '@playwright/test';

export const TEST_USERS = {
  user: {
    email: 'test@example.com',
    password: 'Test123!@#',
    name: 'Test User',
    username: 'testuser'
  },
  admin: {
    email: 'admin@example.com',
    password: 'Admin123!@#',
    name: 'Admin User',
    username: 'admin'
  }
};

export async function createTestUser(page: Page, user: typeof TEST_USERS.user) {
  try {
    // 方案 1: 通过 UI 创建
    await page.goto('/');
    
    // 等待应用加载
    await page.waitForLoadState('networkidle');
    
    // 打开注册模态框
    await page.click('button:has-text("Sign Up")');
    
    // 填充表单
    await page.fill('[data-testid="username-input"]', user.username);
    await page.fill('[data-testid="name-input"]', user.name);
    await page.fill('[data-testid="email-input"]', user.email);
    await page.fill('[data-testid="password-input"]', user.password);
    
    // 提交
    await page.click('[data-testid="auth-submit-button"]');
    
    // 等待注册完成
    await page.waitForTimeout(1000);
    
    return true;
  } catch (error) {
    console.error('Failed to create test user:', error);
    return false;
  }
}

export async function deleteTestUser(page: Page, email: string) {
  try {
    // 通过 API 删除用户（如果有管理端点）
    const response = await page.evaluate(async (email) => {
      const res = await fetch('/api/admin/users/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      return res.ok;
    }, email);
    
    return response;
  } catch (error) {
    console.error('Failed to delete test user:', error);
    return false;
  }
}
```

---

### 修复 5: 更新测试工具函数

**文件：** `tests/utils/testHelpers.ts`

```typescript
import { Page, expect } from '@playwright/test';

export async function loginAsUser(page: Page, email: string, password: string) {
  // 导航到首页
  await page.goto('/');
  
  // 等待应用加载
  await page.waitForLoadState('networkidle');
  
  // 打开登录模态框
  await page.click('button:has-text("Login")');
  
  // 填充表单
  await page.fill('[data-testid="email-input"]', email);
  await page.fill('[data-testid="password-input"]', password);
  
  // 提交
  await page.click('[data-testid="auth-submit-button"]');
  
  // 等待登录完成和导航
  await page.waitForLoadState('networkidle');
  
  // 验证已登录
  const isDashboardVisible = await page.isVisible('[data-testid="dashboard-container"]');
  expect(isDashboardVisible).toBeTruthy();
}

export async function logout(page: Page) {
  // 点击用户菜单
  await page.click('[data-testid="user-menu-button"]');
  
  // 点击登出
  await page.click('text=Logout');
  
  // 等待导航到首页
  await page.waitForURL('/');
}
```

---

### 修复 6: 更新 Page Objects

**文件：** `tests/pages/LoginPage.ts`

```typescript
import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
    
    // 打开登录模态框
    await this.page.click('button:has-text("Login")');
    
    // 等待模态框出现
    await this.page.waitForSelector('[data-testid="auth-modal-title"]');
  }

  async fillEmail(email: string) {
    await this.page.fill('[data-testid="email-input"]', email);
  }

  async fillPassword(password: string) {
    await this.page.fill('[data-testid="password-input"]', password);
  }

  async clickLoginButton() {
    await this.page.click('[data-testid="auth-submit-button"]');
  }

  async login(email: string, password: string) {
    await this.goto();
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLoginButton();
    
    // 等待登录完成
    await this.page.waitForLoadState('networkidle');
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      await this.page.waitForSelector('[data-testid="dashboard-container"]', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getErrorMessage(): Promise<string | null> {
    try {
      const errorElement = this.page.locator('[data-testid="auth-error-message"]');
      await errorElement.waitFor({ timeout: 5000 });
      return errorElement.textContent();
    } catch {
      return null;
    }
  }
}
```

---

### 修复 7: 更新 DashboardPage

**文件：** `tests/pages/DashboardPage.ts`

```typescript
import { Page, expect } from '@playwright/test';

export class DashboardPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async isDashboardLoaded(): Promise<boolean> {
    try {
      await this.page.waitForSelector('[data-testid="dashboard-container"]', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getUserXP(): Promise<number> {
    const xpElement = this.page.locator('[data-testid="user-xp"]');
    const xpText = await xpElement.textContent();
    return parseInt(xpText?.replace(/\D/g, '') || '0', 10);
  }

  async getUserLevel(): Promise<number> {
    const levelElement = this.page.locator('[data-testid="user-level"]');
    const levelText = await levelElement.textContent();
    return parseInt(levelText?.replace(/\D/g, '') || '0', 10);
  }

  async getUserBalance(): Promise<number> {
    const balanceElement = this.page.locator('[data-testid="user-balance"]');
    const balanceText = await balanceElement.textContent();
    return parseFloat(balanceText?.replace(/\D/g, '') || '0');
  }

  async clickCreateTaskButton() {
    await this.page.click('[data-testid="create-task-button"]');
    await this.page.waitForURL('**/tasks/create');
  }

  async clickViewAllTasks() {
    await this.page.click('[data-testid="view-all-tasks-button"]');
    await this.page.waitForURL('**/tasks');
  }

  async clickViewLeaderboard() {
    await this.page.click('[data-testid="view-leaderboard-button"]');
    await this.page.waitForURL('**/leaderboard');
  }

  async clickUserMenu() {
    await this.page.click('[data-testid="user-menu-button"]');
  }

  async logout() {
    await this.clickUserMenu();
    await this.page.click('text=Logout');
    await this.page.waitForURL('/');
  }
}
```

---

## 📊 修复优先级

| 优先级 | 修复 | 文件 | 时间 |
|--------|------|------|------|
| P0 | 添加 data-testid | AuthModal.tsx | 1h |
| P0 | 添加 data-testid | Dashboard.tsx | 1h |
| P0 | 更新测试选择器 | auth.spec.ts | 30m |
| P0 | 创建测试用户 | setupUsers.ts | 1h |
| P1 | 更新工具函数 | testHelpers.ts | 30m |
| P1 | 更新 Page Objects | LoginPage.ts | 30m |
| P1 | 更新 Page Objects | DashboardPage.ts | 30m |

**总计时间：** 5-6 小时

---

## ✅ 验证清单

修复完成后验证：

- [ ] AuthModal.tsx 中所有关键元素都有 data-testid
- [ ] Dashboard.tsx 中所有关键元素都有 data-testid
- [ ] 测试用户可以成功创建
- [ ] 测试用户可以成功登录
- [ ] 登出功能正常
- [ ] 所有测试选择器都已更新
- [ ] Page Objects 使用新的选择器
- [ ] 运行 npm test 通过 80%+ 的测试

---

**下一步：** 按照优先级顺序应用这些修复
