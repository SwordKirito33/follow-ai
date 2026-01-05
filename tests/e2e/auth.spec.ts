import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { TEST_USERS, clearStorage } from '../utils/testHelpers';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage before each test
    await clearStorage(page);
  });

  test('should navigate to login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // Verify page elements
    expect(await loginPage.isEmailFieldVisible()).toBeTruthy();
    expect(await loginPage.isPasswordFieldVisible()).toBeTruthy();
    expect(await loginPage.isLoginButtonVisible()).toBeTruthy();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // Login with valid credentials
    await loginPage.login(TEST_USERS.user.email, TEST_USERS.user.password);
    
    // Verify login was successful
    expect(await loginPage.isLoggedIn()).toBeTruthy();
    
    // Verify dashboard is loaded
    const dashboardPage = new DashboardPage(page);
    expect(await dashboardPage.isDashboardLoaded()).toBeTruthy();
  });

  test('should show error with invalid email', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // Try to login with invalid email
    await loginPage.fillEmail('invalid-email');
    await loginPage.fillPassword(TEST_USERS.user.password);
    await loginPage.clickLoginButton();
    
    // Verify error is shown
    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
  });

  test('should show error with incorrect password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // Try to login with incorrect password
    await loginPage.login(TEST_USERS.user.email, 'WrongPassword123!@#');
    
    // Verify error is shown
    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
  });

  test('should show error with empty credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // Try to login with empty credentials
    await loginPage.clickLoginButton();
    
    // Verify error is shown
    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
  });

  test('should disable login button when fields are empty', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // Clear fields
    await loginPage.clearFields();
    
    // Verify button is disabled
    expect(await loginPage.isLoginButtonEnabled()).toBeFalsy();
  });

  test('should logout successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    // Login first
    await loginPage.goto();
    await loginPage.login(TEST_USERS.user.email, TEST_USERS.user.password);
    
    // Verify logged in
    expect(await dashboardPage.isUserLoggedIn()).toBeTruthy();
    
    // Logout
    await dashboardPage.logout();
    
    // Verify logged out
    expect(await loginPage.isLoggedIn()).toBeFalsy();
  });

  test('should redirect to login when accessing protected page without auth', async ({ page }) => {
    // Try to access dashboard without login
    await page.goto('/dashboard');
    
    // Should be redirected to login
    expect(page.url()).toContain('/login');
  });

  test('should persist login session', async ({ page, context }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    // Login
    await loginPage.goto();
    await loginPage.login(TEST_USERS.user.email, TEST_USERS.user.password);
    
    // Verify logged in
    expect(await dashboardPage.isUserLoggedIn()).toBeTruthy();
    
    // Create new page with same context
    const newPage = await context.newPage();
    await newPage.goto('/dashboard');
    
    // Should still be logged in
    const newDashboard = new DashboardPage(newPage);
    expect(await newDashboard.isUserLoggedIn()).toBeTruthy();
    
    await newPage.close();
  });

  test('should clear session on logout', async ({ page, context }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    // Login
    await loginPage.goto();
    await loginPage.login(TEST_USERS.user.email, TEST_USERS.user.password);
    
    // Logout
    await dashboardPage.logout();
    
    // Create new page with same context
    const newPage = await context.newPage();
    await newPage.goto('/dashboard');
    
    // Should be redirected to login
    expect(newPage.url()).toContain('/login');
    
    await newPage.close();
  });

  test('should show user name after login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    // Login
    await loginPage.goto();
    await loginPage.login(TEST_USERS.user.email, TEST_USERS.user.password);
    
    // Verify user name is displayed
    const userName = await dashboardPage.getUserName();
    expect(userName).toBeTruthy();
  });

  test('should handle login timeout gracefully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // Mock slow network
    await page.route('**/api/auth/login', route => {
      setTimeout(() => route.abort('timedout'), 5000);
    });
    
    // Try to login
    await loginPage.fillEmail(TEST_USERS.user.email);
    await loginPage.fillPassword(TEST_USERS.user.password);
    await loginPage.clickLoginButton();
    
    // Should show error
    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
  });

  test('should validate email format', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // Try invalid email formats
    const invalidEmails = [
      'notanemail',
      'missing@domain',
      '@nodomain.com',
      'spaces in@email.com'
    ];
    
    for (const email of invalidEmails) {
      await loginPage.fillEmail(email);
      await loginPage.fillPassword(TEST_USERS.user.password);
      await loginPage.clickLoginButton();
      
      // Should show error or prevent submission
      expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
    }
  });
});
