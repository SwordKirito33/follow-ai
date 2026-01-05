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
    
    // Try multiple selectors to find login button
    const loginSelectors = [
      // data-testid (preferred)
      '[data-testid="login-button"]',
      '[data-testid="open-auth-modal"]',
      
      // Text-based selectors (exact match found from debug)
      'button:has-text("Log in")',  // ✅ Found in debug
      'button:has-text("Login")',
      'button:has-text("Sign In")',
      'button:has-text("Log In")',
      'a:has-text("Log in")',
      'a:has-text("Login")',
      'a:has-text("Sign In")',
      
      // Text-based selectors (Chinese)
      'button:has-text("登录")',
      'button:has-text("登入")',
      'a:has-text("登录")',
      
      // Class-based selectors
      'button.login-button',
      'button.auth-button',
      '.header button:has-text("Log in")',
      
      // Generic selectors
      'header button:nth-child(2)',  // Based on debug: Button 2 is "Log in"
    ];
    
    let modalOpened = false;
    
    for (const selector of loginSelectors) {
      try {
        console.log(`[LoginPage] Trying selector: ${selector}`);
        const element = this.page.locator(selector).first();
        
        // Check if element exists and is visible
        if (await element.isVisible({ timeout: 1000 })) {
          console.log(`[LoginPage] ✅ Found visible element: ${selector}`);
          await element.click();
          
          // Wait for modal to appear
          await this.page.waitForSelector('[data-testid="auth-modal-title"]', { timeout: 3000 });
          modalOpened = true;
          console.log(`[LoginPage] ✅ Login modal opened using selector: ${selector}`);
          break;
        }
      } catch (error) {
        // Try next selector
        continue;
      }
    }
    
    if (!modalOpened) {
      // Take screenshot for debugging
      await this.page.screenshot({ path: 'debug-screenshots/login-button-not-found.png', fullPage: true });
      console.error('[LoginPage] ❌ Login button not found. Check debug-screenshots/login-button-not-found.png');
      throw new Error('Login button not found. Check debug-screenshots/login-button-not-found.png');
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
   * @param email User email
   * @param password User password
   */
  async login(email: string, password: string) {
    console.log(`[LoginPage] Logging in with email: ${email}`);
    
    // Fill credentials
    await this.fillEmail(email);
    await this.fillPassword(password);
    
    // Click login button
    await this.clickLoginButton();
    
    // Wait for one of these outcomes:
    // 1. Dashboard appears (success)
    // 2. Error message appears (failure)
    // 3. Modal closes (success)
    
    try {
      await Promise.race([
        // Success: Dashboard appears
        this.page.waitForSelector('[data-testid="dashboard-container"]', { timeout: 10000 }).then(() => {
          console.log('[LoginPage] ✅ Dashboard appeared');
        }),
        
        // Success: Modal closes
        this.page.waitForSelector('[data-testid="auth-modal-title"]', { state: 'hidden', timeout: 10000 }).then(() => {
          console.log('[LoginPage] ✅ Auth modal closed');
        }),
        
        // Failure: Error message appears
        this.page.waitForSelector('[data-testid="auth-error-message"]', { timeout: 10000 }).then(() => {
          console.log('[LoginPage] ⚠️ Error message appeared');
        }),
      ]);
      
      console.log('[LoginPage] ✅ Login completed');
    } catch (error) {
      // Timeout - take screenshot for debugging
      await this.page.screenshot({ path: 'debug-screenshots/login-timeout.png', fullPage: true });
      console.error('[LoginPage] ❌ Login timeout. Check debug-screenshots/login-timeout.png');
      throw new Error('Login timeout. Check debug-screenshots/login-timeout.png');
    }
    
    // Additional wait for network to settle
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {
      console.log('[LoginPage] Network did not settle, continuing anyway');
    });
  }

  /**
   * Check if user is logged in
   * Uses multiple indicators to determine login status
   */
  async isLoggedIn(): Promise<boolean> {
    // Method 1: Check if dashboard is visible
    try {
      const dashboardVisible = await this.page.isVisible('[data-testid="dashboard-container"]', { timeout: 2000 });
      if (dashboardVisible) {
        console.log('[LoginPage] ✅ Logged in: Dashboard visible');
        return true;
      }
    } catch {
      // Dashboard not visible, try other methods
    }
    
    // Method 2: Check if welcome message is visible
    try {
      const welcomeVisible = await this.page.isVisible('[data-testid="welcome-message"]', { timeout: 2000 });
      if (welcomeVisible) {
        console.log('[LoginPage] ✅ Logged in: Welcome message visible');
        return true;
      }
    } catch {
      // Welcome message not visible, try other methods
    }
    
    // Method 3: Check if auth modal is closed
    try {
      const modalVisible = await this.page.isVisible('[data-testid="auth-modal-title"]', { timeout: 2000 });
      if (!modalVisible) {
        // Modal is closed, check if we're on a protected page
        const url = this.page.url();
        const isProtectedPage = url.includes('/dashboard') || 
                               url.includes('/profile') || 
                               url.includes('/tasks');
        
        if (isProtectedPage) {
          console.log('[LoginPage] ✅ Logged in: Auth modal closed and on protected page');
          return true;
        }
      }
    } catch {
      // Modal check failed
    }
    
    // Method 4: Check if user menu/avatar is visible
    try {
      const userMenuVisible = await this.page.isVisible('[data-testid="user-menu"], [data-testid="user-avatar"]', { timeout: 2000 });
      if (userMenuVisible) {
        console.log('[LoginPage] ✅ Logged in: User menu visible');
        return true;
      }
    } catch {
      // User menu not visible
    }
    
    // Method 5: Check localStorage for auth token
    try {
      const hasAuthToken = await this.page.evaluate(() => {
        try {
          const token = localStorage.getItem('auth_token') || 
                       localStorage.getItem('supabase.auth.token') ||
                       sessionStorage.getItem('auth_token');
          return !!token;
        } catch {
          return false;
        }
      });
      
      if (hasAuthToken) {
        console.log('[LoginPage] ✅ Logged in: Auth token found');
        return true;
      }
    } catch {
      // localStorage check failed
    }
    
    console.log('[LoginPage] ❌ Not logged in: All checks failed');
    return false;
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
