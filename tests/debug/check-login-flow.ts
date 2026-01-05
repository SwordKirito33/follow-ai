import { test } from '@playwright/test';

/**
 * Debug script to check the actual login flow on follow-ai.com
 * This helps identify the correct selectors and flow
 */
test('Debug: Check login flow', async ({ page }) => {
  console.log('='.repeat(80));
  console.log('DEBUG: Checking login flow on follow-ai.com');
  console.log('='.repeat(80));
  
  // Visit homepage
  console.log('\n1. Visiting homepage...');
  await page.goto('https://www.follow-ai.com');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot of homepage
  await page.screenshot({ path: 'debug-screenshots/01-homepage.png', fullPage: true });
  console.log('✅ Screenshot saved: debug-screenshots/01-homepage.png');
  
  // Find all buttons
  console.log('\n2. Finding all buttons...');
  const buttons = await page.locator('button').all();
  console.log(`Total buttons found: ${buttons.length}`);
  
  for (let i = 0; i < Math.min(buttons.length, 20); i++) {
    try {
      const text = await buttons[i].textContent();
      const visible = await buttons[i].isVisible();
      const dataTestId = await buttons[i].getAttribute('data-testid');
      console.log(`  Button ${i}: "${text?.trim()}" (visible: ${visible}, data-testid: ${dataTestId || 'none'})`);
    } catch (error) {
      console.log(`  Button ${i}: Error getting info`);
    }
  }
  
  // Find all links
  console.log('\n3. Finding all links...');
  const links = await page.locator('a').all();
  console.log(`Total links found: ${links.length}`);
  
  for (let i = 0; i < Math.min(links.length, 20); i++) {
    try {
      const text = await links[i].textContent();
      const href = await links[i].getAttribute('href');
      const visible = await links[i].isVisible();
      const dataTestId = await links[i].getAttribute('data-testid');
      console.log(`  Link ${i}: "${text?.trim()}" -> ${href} (visible: ${visible}, data-testid: ${dataTestId || 'none'})`);
    } catch (error) {
      console.log(`  Link ${i}: Error getting info`);
    }
  }
  
  // Try to find login button
  console.log('\n4. Trying to find login button...');
  const loginSelectors = [
    '[data-testid="login-button"]',
    'button:has-text("Login")',
    'button:has-text("Sign In")',
    'button:has-text("登录")',
    'a:has-text("Login")',
    'a:has-text("Sign In")',
    'a:has-text("登录")',
  ];
  
  for (const selector of loginSelectors) {
    try {
      const element = page.locator(selector).first();
      const visible = await element.isVisible({ timeout: 1000 });
      if (visible) {
        const text = await element.textContent();
        console.log(`  ✅ Found: ${selector} -> "${text?.trim()}"`);
      }
    } catch {
      console.log(`  ❌ Not found: ${selector}`);
    }
  }
  
  // Try to click login button
  console.log('\n5. Trying to open login modal...');
  let modalOpened = false;
  
  for (const selector of loginSelectors) {
    try {
      const element = page.locator(selector).first();
      if (await element.isVisible({ timeout: 1000 })) {
        console.log(`  Clicking: ${selector}`);
        await element.click();
        await page.waitForTimeout(2000);
        
        // Take screenshot after click
        await page.screenshot({ path: 'debug-screenshots/02-after-click.png', fullPage: true });
        console.log('  ✅ Screenshot saved: debug-screenshots/02-after-click.png');
        
        // Check if modal appeared
        const modalVisible = await page.isVisible('[data-testid="auth-modal-title"]', { timeout: 2000 });
        if (modalVisible) {
          console.log('  ✅ Auth modal appeared!');
          modalOpened = true;
          break;
        } else {
          console.log('  ❌ Auth modal did not appear');
        }
      }
    } catch (error) {
      console.log(`  ❌ Failed to click: ${selector}`);
    }
  }
  
  if (modalOpened) {
    // Check modal elements
    console.log('\n6. Checking modal elements...');
    
    const modalElements = [
      '[data-testid="email-input"]',
      '[data-testid="password-input"]',
      '[data-testid="auth-submit-button"]',
      'input[type="email"]',
      'input[type="password"]',
      'button:has-text("Login")',
      'button:has-text("Sign In")',
    ];
    
    for (const selector of modalElements) {
      try {
        const visible = await page.isVisible(selector, { timeout: 1000 });
        console.log(`  ${visible ? '✅' : '❌'} ${selector}`);
      } catch {
        console.log(`  ❌ ${selector}`);
      }
    }
    
    // Take final screenshot
    await page.screenshot({ path: 'debug-screenshots/03-modal-open.png', fullPage: true });
    console.log('  ✅ Screenshot saved: debug-screenshots/03-modal-open.png');
  }
  
  // Wait for manual inspection
  console.log('\n7. Waiting 10 seconds for manual inspection...');
  await page.waitForTimeout(10000);
  
  console.log('\n' + '='.repeat(80));
  console.log('DEBUG: Check complete');
  console.log('='.repeat(80));
});
