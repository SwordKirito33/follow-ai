import { Page, expect } from '@playwright/test';

/**
 * Login Page Object
 * Encapsulates all interactions with the login/auth modal
 */
export class LoginPage {
  constructor(private page: Page) {}

  /**
   * Navigate to home page and open login modal
   */
  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
    
    // Open login modal by clicking login button in header
    try {
      const loginButton = this.page.locator('button:has-text("Login")').first();
      await loginButton.click({ timeout: 5000 });
      // Wait for modal to appear
      await this.page.waitForSelector('[data-testid="auth-modal-title"]', { timeout: 5000 });
    } catch (error) {
      console.log('Login modal might already be open or login button not found');
    }
  }

  /**
   * Check if email field is visible
   */
  async isEmailFieldVisible(): Promise<boolean> {
    try {
      await this.page.waitForSelector('[data-testid="email-input"]', { timeout: 5000 });
      return await this.page.isVisible('[data-testid="email-input"]');
    } catch {
      return false;
    }
  }

  /**
   * Check if password field is visible
   */
  async isPasswordFieldVisible(): Promise<boolean> {
    try {
      await this.page.waitForSelector('[data-testid="password-input"]', { timeout: 5000 });
      return await this.page.isVisible('[data-testid="password-input"]');
    } catch {
      return false;
    }
  }

  /**
   * Check if login button is visible
   */
  async isLoginButtonVisible(): Promise<boolean> {
    try {
      await this.page.waitForSelector('[data-testid="auth-submit-button"]', { timeout: 5000 });
      return await this.page.isVisible('[data-testid="auth-submit-button"]');
    } catch {
      return false;
    }
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    try {
      await this.page.waitForSelector('[data-testid="auth-error-message"]', { timeout: 5000 });
      return await this.page.isVisible('[data-testid="auth-error-message"]');
    } catch {
      return false;
    }
  }

  /**
   * Fill email field
   */
  async fillEmail(email: string) {
    await this.page.fill('[data-testid="email-input"]', email);
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string) {
    await this.page.fill('[data-testid="password-input"]', password);
  }

  /**
   * Clear all fields
   */
  async clearFields() {
    await this.page.fill('[data-testid="email-input"]', '');
    await this.page.fill('[data-testid="password-input"]', '');
  }

  /**
   * Click login button
   */
  async clickLoginButton() {
    await this.page.click('[data-testid="auth-submit-button"]');
  }

  /**
   * Check if login button is enabled
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    const button = this.page.locator('[data-testid="auth-submit-button"]');
    const isDisabled = await button.getAttribute('disabled');
    return isDisabled === null;
  }

  /**
   * Login with credentials
   */
  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLoginButton();
    
    // Wait for login to complete (either success or error)
    await this.page.waitForTimeout(2000); // Give time for auth to process
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });
  }

  /**
   * Check if login was successful (dashboard is visible)
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      // Check if dashboard container is visible
      await this.page.waitForSelector('[data-testid="dashboard-container"]', { timeout: 5000 });
      return true;
    } catch {
      // Alternative: check if auth modal is closed
      const modalVisible = await this.page.isVisible('[data-testid="auth-modal-title"]');
      return !modalVisible;
    }
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string | null> {
    try {
      const errorElement = this.page.locator('[data-testid="auth-error-message"]');
      await errorElement.waitFor({ timeout: 5000 });
      return await errorElement.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Toggle password visibility
   */
  async togglePasswordVisibility() {
    await this.page.click('[data-testid="toggle-password-visibility"]');
  }

  /**
   * Switch to signup mode
   */
  async switchToSignup() {
    await this.page.click('[data-testid="auth-mode-toggle"]');
    await this.page.waitForSelector('[data-testid="username-input"]', { timeout: 5000 });
  }

  /**
   * Switch to login mode
   */
  async switchToLogin() {
    await this.page.click('[data-testid="auth-mode-toggle"]');
  }

  /**
   * Close auth modal
   */
  async closeModal() {
    await this.page.click('[data-testid="close-auth-modal"]');
  }

  /**
   * Get page title
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
