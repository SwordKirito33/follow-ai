import { Page, expect } from '@playwright/test';

/**
 * Login Page Object
 * Encapsulates all interactions with the login page
 */
export class LoginPage {
  constructor(private page: Page) {}

  /**
   * Navigate to login page
   */
  async goto() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Fill email field
   */
  async fillEmail(email: string) {
    await this.page.fill('input[type="email"]', email);
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string) {
    await this.page.fill('input[type="password"]', password);
  }

  /**
   * Click login button
   */
  async clickLoginButton() {
    await this.page.click('button:has-text("Login")');
  }

  /**
   * Login with credentials
   */
  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLoginButton();
    
    // Wait for navigation to dashboard
    await this.page.waitForURL('**/dashboard', { timeout: 10000 });
  }

  /**
   * Check if login was successful
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      await this.page.waitForSelector('[data-testid="user-menu"]', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string | null> {
    try {
      const errorElement = this.page.locator('[data-testid="login-error"]');
      await errorElement.waitFor({ timeout: 5000 });
      return errorElement.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    try {
      await this.page.waitForSelector('[data-testid="login-error"]', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Click "Forgot Password" link
   */
  async clickForgotPassword() {
    await this.page.click('text=Forgot Password');
    await this.page.waitForURL('**/reset-password');
  }

  /**
   * Click "Sign Up" link
   */
  async clickSignUp() {
    await this.page.click('text=Sign Up');
    await this.page.waitForURL('**/register');
  }

  /**
   * Check if email field is visible
   */
  async isEmailFieldVisible(): Promise<boolean> {
    return this.page.isVisible('input[type="email"]');
  }

  /**
   * Check if password field is visible
   */
  async isPasswordFieldVisible(): Promise<boolean> {
    return this.page.isVisible('input[type="password"]');
  }

  /**
   * Check if login button is visible
   */
  async isLoginButtonVisible(): Promise<boolean> {
    return this.page.isVisible('button:has-text("Login")');
  }

  /**
   * Check if login button is enabled
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    const button = this.page.locator('button:has-text("Login")');
    return !await button.isDisabled();
  }

  /**
   * Clear all fields
   */
  async clearFields() {
    await this.page.fill('input[type="email"]', '');
    await this.page.fill('input[type="password"]', '');
  }

  /**
   * Check page title
   */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }
}

export default LoginPage;
