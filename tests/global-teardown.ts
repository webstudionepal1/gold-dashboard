/**
 * Global teardown for Playwright tests
 * Cleans up after all tests have completed
 */

import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global test teardown...');

  // Launch browser for cleanup
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the application
    await page.goto('http://localhost:5173');
    
    // Clean up test data
    await page.evaluate(() => {
      // Clear test-related localStorage
      const keysToRemove = [
        'gold-dashboard-notifications',
        'notification-analytics',
        'notification-sound-preferences',
        'notification-templates',
        'test-environment',
        'auth-user',
        'auth-token'
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Clear any test cookies
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
      
      console.log('Test data cleaned up');
    });

    console.log('✅ Application cleanup completed');

  } catch (error) {
    console.warn('⚠️ Application cleanup failed:', error);
  } finally {
    await browser.close();
  }

  // Generate test report summary
  try {
    const resultsPath = path.join(process.cwd(), 'test-results', 'results.json');
    
    if (fs.existsSync(resultsPath)) {
      const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
      
      const summary = {
        totalTests: results.stats?.total || 0,
        passed: results.stats?.passed || 0,
        failed: results.stats?.failed || 0,
        skipped: results.stats?.skipped || 0,
        duration: results.stats?.duration || 0,
        timestamp: new Date().toISOString()
      };
      
      console.log('📊 Test Summary:');
      console.log(`   Total: ${summary.totalTests}`);
      console.log(`   Passed: ${summary.passed}`);
      console.log(`   Failed: ${summary.failed}`);
      console.log(`   Skipped: ${summary.skipped}`);
      console.log(`   Duration: ${Math.round(summary.duration / 1000)}s`);
      
      // Save summary
      const summaryPath = path.join(process.cwd(), 'test-results', 'summary.json');
      fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
      
      console.log(`✅ Test summary saved to ${summaryPath}`);
    }
  } catch (error) {
    console.warn('⚠️ Failed to generate test summary:', error);
  }

  // Clean up temporary files
  try {
    const tempDir = path.join(process.cwd(), 'temp');
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
      console.log('✅ Temporary files cleaned up');
    }
  } catch (error) {
    console.warn('⚠️ Failed to clean up temporary files:', error);
  }

  console.log('✅ Global teardown completed successfully');
}

export default globalTeardown;
