import { Page } from '@playwright/test';

/**
 * Dashboard Page Object
 * Encapsulates all interactions with the dashboard page
 */
export class DashboardPage {
  constructor(private page: Page) {}

  /**
   * Navigate to dashboard
   */
  async goto() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if dashboard is loaded
   * Uses multiple indicators to ensure dashboard is ready
   */
  async isDashboardLoaded(): Promise<boolean> {
    try {
      // Wait for dashboard container
      await this.page.waitForSelector('[data-testid="dashboard-container"]', { timeout: 10000 });
      
      // Wait for at least one key element to be visible
      await Promise.race([
        this.page.waitForSelector('[data-testid="user-xp"]', { timeout: 5000 }),
        this.page.waitForSelector('[data-testid="user-level"]', { timeout: 5000 }),
        this.page.waitForSelector('[data-testid="welcome-message"]', { timeout: 5000 }),
      ]);
      
      // Wait for network to settle
      await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {
        console.log('[DashboardPage] Network did not settle, but dashboard is visible');
      });
      
      console.log('[DashboardPage] ✅ Dashboard loaded');
      return true;
    } catch (error) {
      console.log('[DashboardPage] ❌ Dashboard not loaded:', error);
      
      // Take screenshot for debugging
      await this.page.screenshot({ path: 'debug-screenshots/dashboard-not-loaded.png', fullPage: true });
      
      return false;
    }
  }

  /**
   * Wait for dashboard to load
   */
  async waitForDashboardLoad() {
    await this.page.waitForSelector('[data-testid="dashboard-container"]', { timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if user is logged in
   */
  async isUserLoggedIn(): Promise<boolean> {
    try {
      await this.page.waitForSelector('[data-testid="welcome-message"]', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get user name from welcome message
   */
  async getUserName(): Promise<string> {
    const welcomeMessage = await this.page.textContent('[data-testid="welcome-message"]');
    return welcomeMessage || '';
  }

  /**
   * Get user XP
   */
  async getUserXP(): Promise<number> {
    const xpText = await this.page.textContent('[data-testid="user-xp"]');
    if (!xpText) return 0;
    // Extract number from "1,234 XP" format
    const match = xpText.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, '')) : 0;
  }

  /**
   * Get user level
   */
  async getUserLevel(): Promise<number> {
    const levelText = await this.page.textContent('[data-testid="user-level"]');
    if (!levelText) return 0;
    // Extract number from "Level 5" format
    const match = levelText.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }

  /**
   * Get user balance
   */
  async getUserBalance(): Promise<number> {
    const balanceText = await this.page.textContent('[data-testid="user-balance"]');
    if (!balanceText) return 0;
    // Extract number from "$1,234" format
    const match = balanceText.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, '')) : 0;
  }

  /**
   * Get profile completion percentage
   */
  async getProfileCompletion(): Promise<number> {
    const completionText = await this.page.textContent('[data-testid="profile-completion"]');
    if (!completionText) return 0;
    // Extract number from "75%" format
    const match = completionText.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }

  /**
   * Get active tasks count
   */
  async getActiveTasksCount(): Promise<number> {
    try {
      const countText = await this.page.textContent('[data-testid="active-tasks-count"]');
      return countText ? parseInt(countText) : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Get completed tasks count
   */
  async getCompletedTasksCount(): Promise<number> {
    try {
      const countText = await this.page.textContent('[data-testid="completed-tasks-count"]');
      return countText ? parseInt(countText) : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Click create task button
   */
  async clickCreateTaskButton() {
    await this.page.click('button:has-text("Create Task"), a:has-text("Create Task")');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click view all tasks
   */
  async clickViewAllTasks() {
    await this.page.click('a:has-text("View All Tasks"), button:has-text("View All Tasks")');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click view leaderboard
   */
  async clickViewLeaderboard() {
    await this.page.click('a:has-text("Leaderboard"), button:has-text("Leaderboard")');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click user menu
   */
  async clickUserMenu() {
    await this.page.click('[data-testid="user-menu"], button:has-text("User Menu")');
    await this.page.waitForTimeout(500); // Wait for menu to open
  }

  /**
   * Click settings
   */
  async clickSettings() {
    await this.clickUserMenu();
    await this.page.click('text=Settings');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Logout
   */
  async logout() {
    await this.clickUserMenu();
    await this.page.click('text=Logout, text=Log out');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if notification badge is visible
   */
  async isNotificationBadgeVisible(): Promise<boolean> {
    try {
      return await this.page.isVisible('[data-testid="notification-badge"]');
    } catch {
      return false;
    }
  }

  /**
   * Get notification count
   */
  async getNotificationCount(): Promise<number> {
    try {
      const countText = await this.page.textContent('[data-testid="notification-badge"]');
      return countText ? parseInt(countText) : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Click notifications
   */
  async clickNotifications() {
    await this.page.click('[data-testid="notifications-button"], button:has-text("Notifications")');
    await this.page.waitForTimeout(500); // Wait for panel to open
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(): Promise<string[]> {
    try {
      const activities = await this.page.locator('[data-testid="activity-item"]').allTextContents();
      return activities;
    } catch {
      return [];
    }
  }

  /**
   * Refresh dashboard
   */
  async refresh() {
    await this.page.reload();
    await this.waitForDashboardLoad();
  }

  /**
   * Get dashboard header text
   */
  async getDashboardHeaderText(): Promise<string> {
    const headerText = await this.page.textContent('[data-testid="dashboard-title"]');
    return headerText || '';
  }
}

export default DashboardPage;
