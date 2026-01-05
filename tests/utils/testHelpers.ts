import { Page, expect } from '@playwright/test';

/**
 * Test Helper Functions
 * Common utilities for E2E testing
 */

// Test user credentials
export const TEST_USERS = {
  admin: {
    email: 'admin@test.com',
    password: 'Admin123!@#',
    role: 'admin'
  },
  reviewer: {
    email: 'reviewer@test.com',
    password: 'Reviewer123!@#',
    role: 'reviewer'
  },
  user: {
    email: 'user@test.com',
    password: 'User123!@#',
    role: 'user'
  }
};

// Test data
export const TEST_DATA = {
  tasks: {
    simple: {
      title: 'Simple Test Task',
      description: 'A simple test task for E2E testing',
      reward: 100,
      difficulty: 'easy'
    },
    complex: {
      title: 'Complex Test Task',
      description: 'A complex test task for E2E testing',
      reward: 500,
      difficulty: 'hard'
    }
  },
  submissions: {
    valid: {
      content: 'This is a valid submission for testing',
      attachments: []
    }
  }
};

/**
 * Login as a specific user
 */
export async function loginAsUser(page: Page, user = TEST_USERS.user) {
  await page.goto('/login');
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[type="password"]', user.password);
  await page.click('button:has-text("Login")');
  
  // Wait for login to complete
  await page.waitForURL('**/dashboard', { timeout: 10000 });
}

/**
 * Logout current user
 */
export async function logout(page: Page) {
  // Click user menu
  await page.click('[data-testid="user-menu"]');
  
  // Click logout
  await page.click('text=Logout');
  
  // Wait for redirect to login
  await page.waitForURL('**/login');
}

/**
 * Create a task via UI
 */
export async function createTaskViaUI(page: Page, taskData: any) {
  await page.goto('/tasks/create');
  
  // Fill form
  await page.fill('input[name="title"]', taskData.title);
  await page.fill('textarea[name="description"]', taskData.description);
  await page.fill('input[name="reward"]', taskData.reward.toString());
  
  if (taskData.difficulty) {
    await page.selectOption('select[name="difficulty"]', taskData.difficulty);
  }
  
  // Submit
  await page.click('button:has-text("Create Task")');
  
  // Wait for success
  await expect(page.locator('text=Task created successfully')).toBeVisible();
}

/**
 * Submit a task via UI
 */
export async function submitTaskViaUI(page: Page, taskId: string, submissionData: any) {
  await page.goto(`/tasks/${taskId}/submit`);
  
  // Fill form
  await page.fill('textarea[name="content"]', submissionData.content);
  
  // Submit
  await page.click('button:has-text("Submit")');
  
  // Wait for success
  await expect(page.locator('text=Submission successful')).toBeVisible();
}

/**
 * Wait for element and get text
 */
export async function getElementText(page: Page, selector: string): Promise<string> {
  await page.waitForSelector(selector);
  return page.textContent(selector) || '';
}

/**
 * Wait for element and get value
 */
export async function getInputValue(page: Page, selector: string): Promise<string> {
  await page.waitForSelector(selector);
  return page.inputValue(selector);
}

/**
 * Check if element is visible
 */
export async function isElementVisible(page: Page, selector: string): Promise<boolean> {
  try {
    await page.waitForSelector(selector, { timeout: 5000 });
    return page.isVisible(selector);
  } catch {
    return false;
  }
}

/**
 * Wait for notification toast
 */
export async function waitForToast(page: Page, message: string, timeout = 5000) {
  await page.waitForSelector(`text=${message}`, { timeout });
}

/**
 * Clear all storage
 */
export async function clearStorage(page: Page) {
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Get current URL path
 */
export async function getCurrentPath(page: Page): Promise<string> {
  return page.evaluate(() => window.location.pathname);
}

/**
 * Navigate and wait for load
 */
export async function navigateAndWait(page: Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
}

/**
 * Fill form field
 */
export async function fillFormField(page: Page, name: string, value: string) {
  const selector = `[name="${name}"]`;
  const element = page.locator(selector);
  
  const tagName = await element.evaluate(el => el.tagName);
  
  if (tagName === 'TEXTAREA') {
    await element.fill(value);
  } else if (tagName === 'SELECT') {
    await element.selectOption(value);
  } else {
    await element.fill(value);
  }
}

/**
 * Submit form
 */
export async function submitForm(page: Page, buttonText = 'Submit') {
  await page.click(`button:has-text("${buttonText}")`);
}

/**
 * Wait for API response
 */
export async function waitForAPIResponse(page: Page, urlPattern: string | RegExp) {
  return page.waitForResponse(response => {
    if (typeof urlPattern === 'string') {
      return response.url().includes(urlPattern);
    }
    return urlPattern.test(response.url());
  });
}

/**
 * Mock API response
 */
export async function mockAPIResponse(page: Page, urlPattern: string | RegExp, responseData: any) {
  await page.route(urlPattern, route => {
    route.abort('blockedbyresponse');
  });
  
  await page.route(urlPattern, route => {
    route.continue({
      response: {
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(responseData)
      }
    });
  });
}

/**
 * Get all console messages
 */
export async function getConsoleMessages(page: Page): Promise<string[]> {
  const messages: string[] = [];
  
  page.on('console', msg => {
    messages.push(msg.text());
  });
  
  return messages;
}

/**
 * Check for console errors
 */
export async function checkForConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  return errors;
}

/**
 * Take screenshot
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `tests/screenshots/${name}.png` });
}

/**
 * Measure page load time
 */
export async function measureLoadTime(page: Page, url: string): Promise<number> {
  const startTime = Date.now();
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  return Date.now() - startTime;
}

/**
 * Get page performance metrics
 */
export async function getPerformanceMetrics(page: Page) {
  return page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      ttfb: navigation.responseStart - navigation.requestStart,
      download: navigation.responseEnd - navigation.responseStart,
      domInteractive: navigation.domInteractive - navigation.fetchStart,
      domComplete: navigation.domComplete - navigation.fetchStart,
      loadComplete: navigation.loadEventEnd - navigation.fetchStart
    };
  });
}

export default {
  TEST_USERS,
  TEST_DATA,
  loginAsUser,
  logout,
  createTaskViaUI,
  submitTaskViaUI,
  getElementText,
  getInputValue,
  isElementVisible,
  waitForToast,
  clearStorage,
  getCurrentPath,
  navigateAndWait,
  fillFormField,
  submitForm,
  waitForAPIResponse,
  mockAPIResponse,
  getConsoleMessages,
  checkForConsoleErrors,
  takeScreenshot,
  measureLoadTime,
  getPerformanceMetrics
};
