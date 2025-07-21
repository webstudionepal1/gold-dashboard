/**
 * Global setup for Playwright tests
 * Prepares the test environment before running tests
 */

import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...');

  // Launch browser for setup
  const browser = await chromium.launch();
  const context = await browser.newContext({
    permissions: ['notifications']
  });
  const page = await context.newPage();

  try {
    // Navigate to the application
    await page.goto('http://localhost:5173');
    
    // Wait for app to load
    await page.waitForLoadState('networkidle');
    
    // Check if app is accessible
    const title = await page.title();
    console.log(`✅ Application loaded: ${title}`);

    // Setup test data in localStorage if needed
    await page.evaluate(() => {
      // Clear any existing notification data
      localStorage.removeItem('gold-dashboard-notifications');
      localStorage.removeItem('notification-analytics');
      localStorage.removeItem('notification-sound-preferences');
      localStorage.removeItem('notification-templates');
      
      // Set test environment flag
      localStorage.setItem('test-environment', 'true');
      
      console.log('Test environment prepared');
    });

    // Grant notification permissions
    await context.grantPermissions(['notifications']);
    console.log('✅ Notification permissions granted');

    // Test Firebase connectivity (if needed)
    try {
      await page.evaluate(() => {
        // Test if Firebase is accessible
        return fetch('https://fcm.googleapis.com/fcm/send', {
          method: 'HEAD',
          mode: 'no-cors'
        });
      });
      console.log('✅ Firebase connectivity verified');
    } catch (error) {
      console.warn('⚠️ Firebase connectivity test failed:', error);
    }

    // Create test user session if needed
    await page.evaluate(() => {
      const testUser = {
        id: 'test-user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin'
      };
      
      const testToken = 'test-jwt-token-123';
      
      // Store test auth data
      localStorage.setItem('auth-user', JSON.stringify(testUser));
      localStorage.setItem('auth-token', testToken);
    });

    console.log('✅ Test user session created');

  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }

  console.log('✅ Global setup completed successfully');
}

export default globalSetup;
