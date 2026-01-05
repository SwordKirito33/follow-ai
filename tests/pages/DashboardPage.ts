import { Page, expect } from '@playwright/test';

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
   */
  async isDashboardLoaded(): Promise<boolean> {
    try {
      await this.page.waitForSelector('[data-testid="dashboard-header"]', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get user XP
   */
  async getUserXP(): Promise<number> {
    const xpElement = this.page.locator('[data-testid="user-xp"]');
    const xpText = await xpElement.textContent();
    return parseInt(xpText?.replace(/\D/g, '') || '0', 10);
  }

  /**
   * Get user level
   */
  async getUserLevel(): Promise<number> {
    const levelElement = this.page.locator('[data-testid="user-level"]');
    const levelText = await levelElement.textContent();
    return parseInt(levelText?.replace(/\D/g, '') || '0', 10);
  }

  /**
   * Get user balance
   */
  async getUserBalance(): Promise<number> {
    const balanceElement = this.page.locator('[data-testid="user-balance"]');
    const balanceText = await balanceElement.textContent();
    return parseFloat(balanceText?.replace(/\D/g, '') || '0');
  }

  /**
   * Get active tasks count
   */
  async getActiveTasksCount(): Promise<number> {
    const tasksElement = this.page.locator('[data-testid="active-tasks-count"]');
    const tasksText = await tasksElement.textContent();
    return parseInt(tasksText?.replace(/\D/g, '') || '0', 10);
  }

  /**
   * Get completed tasks count
   */
  async getCompletedTasksCount(): Promise<number> {
    const tasksElement = this.page.locator('[data-testid="completed-tasks-count"]');
    const tasksText = await tasksElement.textContent();
    return parseInt(tasksText?.replace(/\D/g, '') || '0', 10);
  }

  /**
   * Click on a task card
   */
  async clickTaskCard(taskTitle: string) {
    await this.page.click(`text=${taskTitle}`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click "Create Task" button
   */
  async clickCreateTaskButton() {
    await this.page.click('[data-testid="create-task-button"]');
    await this.page.waitForURL('**/tasks/create');
  }

  /**
   * Click "View All Tasks" link
   */
  async clickViewAllTasks() {
    await this.page.click('text=View All Tasks');
    await this.page.waitForURL('**/tasks');
  }

  /**
   * Click "View Leaderboard" link
   */
  async clickViewLeaderboard() {
    await this.page.click('text=View Leaderboard');
    await this.page.waitForURL('**/leaderboard');
  }

  /**
   * Click user menu
   */
  async clickUserMenu() {
    await this.page.click('[data-testid="user-menu"]');
  }

  /**
   * Click logout
   */
  async logout() {
    await this.clickUserMenu();
    await this.page.click('text=Logout');
    await this.page.waitForURL('**/login');
  }

  /**
   * Click settings
   */
  async clickSettings() {
    await this.clickUserMenu();
    await this.page.click('text=Settings');
    await this.page.waitForURL('**/settings');
  }

  /**
   * Check if user is logged in
   */
  async isUserLoggedIn(): Promise<boolean> {
    try {
      await this.page.waitForSelector('[data-testid="user-menu"]', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get user name
   */
  async getUserName(): Promise<string | null> {
    const userNameElement = this.page.locator('[data-testid="user-name"]');
    return userNameElement.textContent();
  }

  /**
   * Wait for dashboard to load
   */
  async waitForDashboardLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForSelector('[data-testid="dashboard-header"]');
  }

  /**
   * Check if notification badge is visible
   */
  async isNotificationBadgeVisible(): Promise<boolean> {
    return this.page.isVisible('[data-testid="notification-badge"]');
  }

  /**
   * Get notification count
   */
  async getNotificationCount(): Promise<number> {
    const badge = this.page.locator('[data-testid="notification-badge"]');
    const text = await badge.textContent();
    return parseInt(text?.replace(/\D/g, '') || '0', 10);
  }

  /**
   * Click notifications
   */
  async clickNotifications() {
    await this.page.click('[data-testid="notification-bell"]');
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(): Promise<string[]> {
    const activities = await this.page.locator('[data-testid="activity-item"]').allTextContents();
    return activities;
  }

  /**
   * Refresh dashboard
   */
  async refresh() {
    await this.page.reload();
    await this.waitForDashboardLoad();
  }
}

export default DashboardPage;
