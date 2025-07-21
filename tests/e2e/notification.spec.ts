/**
 * End-to-End Tests for Notification System
 * Tests the complete notification flow from registration to receiving notifications
 *
 * Prerequisites:
 * 1. Application running on localhost:5173
 * 2. Test user account configured
 * 3. Firebase test project configured
 * 4. Notification permissions granted in test environment
 */

import { test, expect, Page, BrowserContext } from "@playwright/test";

// Test configuration
const TEST_CONFIG = {
  baseURL: "http://localhost:5173",
  timeout: 30000,
  testUser: {
    email: "test@example.com",
    password: "testpassword123",
  },
};

// Helper functions
class NotificationTestHelper {
  constructor(private page: Page) {}

  async navigateToApp() {
    await this.page.goto(TEST_CONFIG.baseURL);
    await this.page.waitForLoadState("networkidle");
  }

  async login() {
    await this.page.goto(`${TEST_CONFIG.baseURL}/login`);
    await this.page.fill(
      '[data-testid="email-input"]',
      TEST_CONFIG.testUser.email
    );
    await this.page.fill(
      '[data-testid="password-input"]',
      TEST_CONFIG.testUser.password
    );
    await this.page.click('[data-testid="login-button"]');
    await this.page.waitForURL(`${TEST_CONFIG.baseURL}/`);
  }

  async navigateToNotificationTest() {
    await this.page.goto(`${TEST_CONFIG.baseURL}/notification-test`);
    await this.page.waitForLoadState("networkidle");
  }

  async navigateToNotificationAdmin() {
    await this.page.goto(`${TEST_CONFIG.baseURL}/notification-admin`);
    await this.page.waitForLoadState("networkidle");
  }

  async grantNotificationPermission() {
    // Grant notification permission programmatically
    await this.page.evaluate(() => {
      return new Promise((resolve) => {
        if ("Notification" in window) {
          Notification.requestPermission().then(resolve);
        } else {
          resolve("granted");
        }
      });
    });
  }

  async waitForNotificationInitialization() {
    await this.page.waitForFunction(
      () => {
        return (
          window.localStorage.getItem("notification-initialized") === "true"
        );
      },
      { timeout: 10000 }
    );
  }

  async checkNotificationBell() {
    const notificationBell = this.page.locator(
      '[data-testid="notification-bell"]'
    );
    await expect(notificationBell).toBeVisible();
    return notificationBell;
  }

  async openNotificationCenter() {
    const bell = await this.checkNotificationBell();
    await bell.click();

    const notificationCenter = this.page.locator(
      '[data-testid="notification-center"]'
    );
    await expect(notificationCenter).toBeVisible();
    return notificationCenter;
  }

  async sendTestNotification(
    title: string,
    message: string,
    priority: string = "medium"
  ) {
    await this.navigateToNotificationTest();

    await this.page.fill('[data-testid="notification-title"]', title);
    await this.page.fill('[data-testid="notification-message"]', message);
    await this.page.selectOption(
      '[data-testid="notification-priority"]',
      priority
    );

    await this.page.click('[data-testid="send-notification-button"]');

    // Wait for success toast
    await expect(this.page.locator(".Toastify__toast--success")).toBeVisible();
  }

  async checkNotificationInCenter(title: string) {
    const center = await this.openNotificationCenter();
    const notification = center.locator(
      `[data-testid="notification-item"]:has-text("${title}")`
    );
    await expect(notification).toBeVisible();
    return notification;
  }

  async checkCriticalNotificationBanner() {
    const banner = this.page.locator(
      '[data-testid="critical-notification-banner"]'
    );
    return banner;
  }
}

// Test suite
test.describe("Notification System E2E Tests", () => {
  let helper: NotificationTestHelper;

  test.beforeEach(async ({ page }) => {
    helper = new NotificationTestHelper(page);
    await helper.navigateToApp();
  });

  test("should initialize notification system on app load", async ({
    page,
  }) => {
    await helper.login();
    await helper.grantNotificationPermission();

    // Check if notification system initializes
    await helper.waitForNotificationInitialization();

    // Verify notification bell is visible
    await helper.checkNotificationBell();

    // Check system status in test component
    await helper.navigateToNotificationTest();

    const systemStatus = page.locator('[data-testid="system-status"]');
    await expect(systemStatus).toContainText("Browser Support: Yes");
    await expect(systemStatus).toContainText("Initialized: Yes");
  });

  test("should request and handle notification permissions", async ({
    page,
  }) => {
    await helper.login();
    await helper.navigateToNotificationTest();

    // Click request permission button
    await page.click('[data-testid="request-permission-button"]');

    // Grant permission in the test environment
    await helper.grantNotificationPermission();

    // Verify permission status updates
    await expect(
      page.locator('[data-testid="permission-status"]')
    ).toContainText("granted");

    // Verify success toast
    await expect(page.locator(".Toastify__toast--success")).toBeVisible();
  });

  test("should register FCM token successfully", async ({ page }) => {
    await helper.login();
    await helper.grantNotificationPermission();
    await helper.navigateToNotificationTest();

    // Click register token button
    await page.click('[data-testid="register-token-button"]');

    // Wait for token registration
    await page.waitForFunction(
      () => {
        const tokenElement = document.querySelector(
          '[data-testid="fcm-token"]'
        );
        return (
          tokenElement &&
          tokenElement.textContent &&
          tokenElement.textContent.length > 10
        );
      },
      { timeout: 10000 }
    );

    // Verify token is displayed
    const tokenElement = page.locator('[data-testid="fcm-token"]');
    const tokenText = await tokenElement.textContent();
    expect(tokenText).toBeTruthy();
    expect(tokenText!.length).toBeGreaterThan(10);

    // Verify registration status
    await expect(
      page.locator('[data-testid="token-registered"]')
    ).toContainText("Yes");
  });

  test("should send and receive notifications", async ({ page }) => {
    await helper.login();
    await helper.grantNotificationPermission();

    const testTitle = "Test Notification";
    const testMessage = "This is a test notification message";

    // Send test notification
    await helper.sendTestNotification(testTitle, testMessage);

    // Navigate back to main app
    await helper.navigateToApp();

    // Check notification appears in notification center
    await helper.checkNotificationInCenter(testTitle);

    // Verify unread count updates
    const bell = await helper.checkNotificationBell();
    const badge = bell.locator('[data-testid="notification-badge"]');
    await expect(badge).toBeVisible();

    const badgeText = await badge.textContent();
    expect(parseInt(badgeText || "0")).toBeGreaterThan(0);
  });

  test("should handle different notification priorities", async ({ page }) => {
    await helper.login();
    await helper.grantNotificationPermission();

    const priorities = ["low", "medium", "high", "critical"];

    for (const priority of priorities) {
      const title = `${priority.toUpperCase()} Priority Test`;
      const message = `This is a ${priority} priority notification`;

      await helper.sendTestNotification(title, message, priority);

      // For critical notifications, check if banner appears
      if (priority === "critical") {
        await helper.navigateToApp();
        const banner = await helper.checkCriticalNotificationBanner();
        await expect(banner).toBeVisible();
      }
    }

    // Verify all notifications appear in center
    await helper.navigateToApp();
    const center = await helper.openNotificationCenter();

    for (const priority of priorities) {
      const title = `${priority.toUpperCase()} Priority Test`;
      const notification = center.locator(
        `[data-testid="notification-item"]:has-text("${title}")`
      );
      await expect(notification).toBeVisible();
    }
  });

  test("should mark notifications as read", async ({ page }) => {
    await helper.login();
    await helper.grantNotificationPermission();

    const testTitle = "Mark as Read Test";
    await helper.sendTestNotification(testTitle, "Test message");

    await helper.navigateToApp();
    const center = await helper.openNotificationCenter();

    // Find the notification
    const notification = center.locator(
      `[data-testid="notification-item"]:has-text("${testTitle}")`
    );
    await expect(notification).toBeVisible();

    // Check if it's marked as unread initially
    await expect(notification).toHaveClass(/unread/);

    // Click to mark as read
    const markReadButton = notification.locator(
      '[data-testid="mark-read-button"]'
    );
    await markReadButton.click();

    // Verify it's marked as read
    await expect(notification).not.toHaveClass(/unread/);

    // Verify unread count decreases
    const bell = await helper.checkNotificationBell();
    const badge = bell.locator('[data-testid="notification-badge"]');

    // Badge should either be hidden or show decreased count
    await expect(badge).not.toBeVisible().or(expect(badge).toContainText("0"));
  });

  test("should filter notifications by priority and type", async ({ page }) => {
    await helper.login();
    await helper.grantNotificationPermission();

    // Send notifications with different priorities and types
    await helper.sendTestNotification(
      "High Order",
      "High priority order notification",
      "high"
    );
    await helper.sendTestNotification(
      "Low System",
      "Low priority system notification",
      "low"
    );

    await helper.navigateToApp();
    const center = await helper.openNotificationCenter();

    // Test priority filter
    const priorityFilter = center.locator('[data-testid="priority-filter"]');
    await priorityFilter.selectOption("high");

    // Should only show high priority notification
    await expect(
      center.locator('[data-testid="notification-item"]:has-text("High Order")')
    ).toBeVisible();
    await expect(
      center.locator('[data-testid="notification-item"]:has-text("Low System")')
    ).not.toBeVisible();

    // Reset filter
    await priorityFilter.selectOption("all");

    // Both should be visible again
    await expect(
      center.locator('[data-testid="notification-item"]:has-text("High Order")')
    ).toBeVisible();
    await expect(
      center.locator('[data-testid="notification-item"]:has-text("Low System")')
    ).toBeVisible();
  });

  test("should persist notifications across browser sessions", async ({
    page,
    context,
  }) => {
    await helper.login();
    await helper.grantNotificationPermission();

    const testTitle = "Persistence Test";
    await helper.sendTestNotification(testTitle, "This should persist");

    // Close and reopen browser
    await page.close();
    const newPage = await context.newPage();
    helper = new NotificationTestHelper(newPage);

    await helper.navigateToApp();
    await helper.login();

    // Check if notification is still there
    await helper.checkNotificationInCenter(testTitle);
  });

  test("should handle notification sound preferences", async ({ page }) => {
    await helper.login();
    await helper.grantNotificationPermission();
    await helper.navigateToNotificationTest();

    // Test sound for different priorities
    const priorities = ["low", "medium", "high", "critical"];

    for (const priority of priorities) {
      const testSoundButton = page.locator(
        `[data-testid="test-sound-${priority}"]`
      );
      await testSoundButton.click();

      // Verify success toast appears (indicating sound played)
      await expect(page.locator(".Toastify__toast--success")).toBeVisible();
    }
  });

  test("should handle admin notification panel", async ({ page }) => {
    await helper.login();
    await helper.navigateToNotificationAdmin();

    // Test custom notification sending
    await page.fill('[data-testid="admin-notification-title"]', "Admin Test");
    await page.fill(
      '[data-testid="admin-notification-message"]',
      "Admin test message"
    );
    await page.selectOption(
      '[data-testid="admin-notification-priority"]',
      "high"
    );

    await page.click('[data-testid="admin-send-button"]');

    // Verify success toast
    await expect(page.locator(".Toastify__toast--success")).toBeVisible();

    // Test template creation
    await page.click('[data-testid="templates-tab"]');

    await page.fill('[data-testid="template-name"]', "Test Template");
    await page.fill('[data-testid="template-title"]', "Template Title");
    await page.fill(
      '[data-testid="template-body"]',
      "Template body with {variable}"
    );

    await page.click('[data-testid="save-template-button"]');

    // Verify template appears in list
    await expect(page.locator('[data-testid="template-list"]')).toContainText(
      "Test Template"
    );
  });

  test("should display analytics correctly", async ({ page }) => {
    await helper.login();
    await helper.grantNotificationPermission();

    // Send some test notifications to generate analytics data
    await helper.sendTestNotification("Analytics Test 1", "Test message 1");
    await helper.sendTestNotification(
      "Analytics Test 2",
      "Test message 2",
      "high"
    );

    await helper.navigateToNotificationAdmin();
    await page.click('[data-testid="analytics-tab"]');

    // Check analytics display
    await expect(
      page.locator('[data-testid="total-notifications"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="unread-count"]')).toBeVisible();

    // Check priority breakdown
    await expect(
      page.locator('[data-testid="priority-breakdown"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="type-breakdown"]')).toBeVisible();
  });
});

// Performance tests
test.describe("Notification Performance Tests", () => {
  let helper: NotificationTestHelper;

  test.beforeEach(async ({ page }) => {
    helper = new NotificationTestHelper(page);
    await helper.navigateToApp();
  });

  test("should handle large number of notifications efficiently", async ({
    page,
  }) => {
    await helper.login();
    await helper.grantNotificationPermission();

    // Send multiple notifications quickly
    for (let i = 0; i < 50; i++) {
      await helper.sendTestNotification(`Bulk Test ${i}`, `Message ${i}`);
    }

    await helper.navigateToApp();

    // Measure time to open notification center
    const startTime = Date.now();
    await helper.openNotificationCenter();
    const endTime = Date.now();

    // Should open within reasonable time (less than 2 seconds)
    expect(endTime - startTime).toBeLessThan(2000);

    // Verify virtualization is working (not all notifications rendered at once)
    const renderedNotifications = await page
      .locator('[data-testid="notification-item"]')
      .count();
    expect(renderedNotifications).toBeLessThanOrEqual(20); // Page size limit
  });

  test("should not cause memory leaks with frequent updates", async ({
    page,
  }) => {
    await helper.login();
    await helper.grantNotificationPermission();

    // Monitor memory usage
    const initialMemory = await page.evaluate(
      () => (performance as any).memory?.usedJSHeapSize || 0
    );

    // Send notifications repeatedly
    for (let i = 0; i < 20; i++) {
      await helper.sendTestNotification(`Memory Test ${i}`, `Message ${i}`);
      await page.waitForTimeout(100);
    }

    // Force garbage collection if available
    await page.evaluate(() => {
      if ((window as any).gc) {
        (window as any).gc();
      }
    });

    const finalMemory = await page.evaluate(
      () => (performance as any).memory?.usedJSHeapSize || 0
    );

    // Memory increase should be reasonable (less than 50MB)
    if (initialMemory > 0 && finalMemory > 0) {
      const memoryIncrease = finalMemory - initialMemory;
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB
    }
  });
});

// Error handling tests
test.describe("Notification Error Handling", () => {
  let helper: NotificationTestHelper;

  test.beforeEach(async ({ page }) => {
    helper = new NotificationTestHelper(page);
    await helper.navigateToApp();
  });

  test("should handle permission denied gracefully", async ({ page }) => {
    await helper.login();
    await helper.navigateToNotificationTest();

    // Simulate permission denied
    await page.evaluate(() => {
      Object.defineProperty(Notification, "permission", {
        value: "denied",
        writable: false,
      });
    });

    await page.click('[data-testid="request-permission-button"]');

    // Should show appropriate error message
    await expect(page.locator(".Toastify__toast--error")).toBeVisible();
    await expect(
      page.locator('[data-testid="permission-status"]')
    ).toContainText("denied");
  });

  test("should handle network errors during token registration", async ({
    page,
  }) => {
    await helper.login();
    await helper.grantNotificationPermission();
    await helper.navigateToNotificationTest();

    // Intercept and fail the token registration request
    await page.route("**/user/**", (route) => route.abort());

    await page.click('[data-testid="register-token-button"]');

    // Should handle error gracefully
    await expect(page.locator(".Toastify__toast--error")).toBeVisible();
  });

  test("should handle service worker registration failures", async ({
    page,
  }) => {
    await helper.login();

    // Simulate service worker registration failure
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "serviceWorker", {
        value: undefined,
        writable: false,
      });
    });

    await helper.navigateToNotificationTest();

    // Should show appropriate error state
    await expect(page.locator('[data-testid="system-status"]')).toContainText(
      "Browser Support: No"
    );
  });
});

export { NotificationTestHelper, TEST_CONFIG };
