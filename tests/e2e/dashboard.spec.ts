import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { clearStorage } from '../utils/testHelpers';

const TEST_USERS = {
  user: {
    email: 'test99@gmail.com',
    password: 'test123456'
  }
};

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage before each test
    await clearStorage(page);
    
    // Login before each test
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USERS.user.email, TEST_USERS.user.password);
  });

  test('should load dashboard successfully', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Verify dashboard is loaded
    expect(await dashboardPage.isDashboardLoaded()).toBeTruthy();
  });

  test('should display user information', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Verify user info is displayed
    const userName = await dashboardPage.getUserName();
    expect(userName).toBeTruthy();
    
    // Verify XP is displayed
    const userXP = await dashboardPage.getUserXP();
    expect(userXP).toBeGreaterThanOrEqual(0);
  });

  test('should display user statistics', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Verify statistics are displayed
    const xp = await dashboardPage.getUserXP();
    const level = await dashboardPage.getUserLevel();
    const balance = await dashboardPage.getUserBalance();
    
    expect(xp).toBeGreaterThanOrEqual(0);
    expect(level).toBeGreaterThanOrEqual(0);
    expect(balance).toBeGreaterThanOrEqual(0);
  });

  test('should display active tasks count', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Verify active tasks count is displayed
    const activeTasksCount = await dashboardPage.getActiveTasksCount();
    expect(activeTasksCount).toBeGreaterThanOrEqual(0);
  });

  test('should display completed tasks count', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Verify completed tasks count is displayed
    const completedTasksCount = await dashboardPage.getCompletedTasksCount();
    expect(completedTasksCount).toBeGreaterThanOrEqual(0);
  });

  test('should navigate to create task page', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Click create task button
    await dashboardPage.clickCreateTaskButton();
    
    // Verify navigation - Dashboard links to /submit for output submission
    expect(page.url()).toMatch(/\/(submit|tasks\/create)/);
  });

  test('should navigate to tasks page', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Click view all tasks
    await dashboardPage.clickViewAllTasks();
    
    // Verify navigation
    expect(page.url()).toContain('/tasks');
  });

  test('should navigate to leaderboard page', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Click view leaderboard
    await dashboardPage.clickViewLeaderboard();
    
    // Verify navigation
    expect(page.url()).toContain('/leaderboard');
  });

  test('should open user menu', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Click user menu
    await dashboardPage.clickUserMenu();
    
    // Verify menu is visible
    expect(await page.isVisible('text=Settings')).toBeTruthy();
    expect(await page.isVisible('text=Logout')).toBeTruthy();
  });

  test('should navigate to settings', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Click settings
    await dashboardPage.clickSettings();
    
    // Verify navigation
    expect(page.url()).toContain('/settings');
  });

  test('should display notification badge when there are notifications', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Check if notification badge is visible
    const badgeVisible = await dashboardPage.isNotificationBadgeVisible();
    
    // If visible, check count
    if (badgeVisible) {
      const count = await dashboardPage.getNotificationCount();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should open notifications panel', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Click notifications
    await dashboardPage.clickNotifications();
    
    // Verify notifications panel is visible
    expect(await page.isVisible('[data-testid="notifications-panel"]')).toBeTruthy();
  });

  test('should display recent activity', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Get recent activity
    const activities = await dashboardPage.getRecentActivity();
    
    // Should have some activity or be empty
    expect(Array.isArray(activities)).toBeTruthy();
  });

  test('should refresh dashboard', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Get initial XP
    const initialXP = await dashboardPage.getUserXP();
    
    // Refresh
    await dashboardPage.refresh();
    
    // Verify dashboard is still loaded
    expect(await dashboardPage.isDashboardLoaded()).toBeTruthy();
    
    // Verify XP is still displayed
    const refreshedXP = await dashboardPage.getUserXP();
    expect(refreshedXP).toBeGreaterThanOrEqual(0);
  });

  test('should handle network error gracefully', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Mock network error
    await page.route('**/api/dashboard/**', route => {
      route.abort('failed');
    });
    
    // Refresh dashboard using the refresh button
    await page.click('[data-testid="refresh-dashboard"]').catch(() => {
      // Fallback to page reload if button not found
      page.reload();
    });
    
    // Wait for page to stabilize
    await page.waitForLoadState('domcontentloaded');
    
    // Should still show dashboard container or some content
    expect(await page.isVisible('[data-testid="dashboard-container"], [data-testid="dashboard-title"]')).toBeTruthy();
  });

  test('should load dashboard within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForDashboardLoad();
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 10 seconds (adjusted for network latency)
    expect(loadTime).toBeLessThan(10000);
  });

  test('should maintain dashboard state on navigation', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Get initial XP
    const initialXP = await dashboardPage.getUserXP();
    
    // Navigate away
    await dashboardPage.clickViewAllTasks();
    
    // Navigate back
    await page.goBack();
    
    // Verify XP is still the same
    const returnedXP = await dashboardPage.getUserXP();
    expect(returnedXP).toBe(initialXP);
  });

  test('should display user avatar', async ({ page }) => {
    // Verify user avatar is displayed
    expect(await page.isVisible('[data-testid="user-avatar"]')).toBeTruthy();
  });

  test('should display welcome message', async ({ page }) => {
    // Verify welcome message is displayed
    const welcomeText = await page.textContent('[data-testid="welcome-message"]');
    expect(welcomeText).toBeTruthy();
  });
});
