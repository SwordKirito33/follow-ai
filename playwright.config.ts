import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration
 * Defines test settings, browsers, and execution parameters
 * 
 * Usage:
 * - Local dev server: npm test
 * - Production: PLAYWRIGHT_TEST_BASE_URL=https://www.follow-ai.com npm test
 */

// Check if we're testing against production
const isProduction = !!process.env.PLAYWRIGHT_TEST_BASE_URL;
const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5173';

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.spec.ts', '**/debug/**/*.ts'],
  
  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1, // 增加本地重试次数
  workers: process.env.CI ? 1 : 2, // 减少并发数以提高稳定性
  
  // Timeout settings - longer for production
  timeout: isProduction ? 60 * 1000 : 60 * 1000, // 增加到 60s 提高稳定性
  expect: {
    timeout: isProduction ? 10 * 1000 : 10 * 1000, // 增加到 10s
  },
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],
  
  // Global test settings
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  
  // Browser configurations
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Mobile browsers
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  
  // Web server configuration - only for local development
  // When PLAYWRIGHT_TEST_BASE_URL is set, skip local server
  ...(isProduction ? {} : {
    webServer: {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  }),
});
