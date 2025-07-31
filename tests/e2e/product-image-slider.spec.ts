/**
 * End-to-End Tests for ProductImage Component with Custom Pagination
 * Tests the react-slick custom pagination functionality
 *
 * Prerequisites:
 * 1. Application running on localhost:5173
 * 2. Test user account configured
 * 3. Product with multiple images available for testing
 */

import { test, expect, Page } from "@playwright/test";

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
class ProductImageTestHelper {
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

  async navigateToProductList() {
    await this.page.goto(`${TEST_CONFIG.baseURL}/product/product-list`);
    await this.page.waitForLoadState("networkidle");
  }

  async navigateToFirstProductDetail() {
    await this.navigateToProductList();
    
    // Find the first product in the list and click on it
    const firstProductRow = this.page.locator('tbody tr').first();
    await expect(firstProductRow).toBeVisible();
    
    // Click on the product name or view button to navigate to detail page
    const viewButton = firstProductRow.locator('button:has-text("View")');
    if (await viewButton.isVisible()) {
      await viewButton.click();
    } else {
      // Alternative: click on the product name link
      const productLink = firstProductRow.locator('a').first();
      await productLink.click();
    }
    
    await this.page.waitForLoadState("networkidle");
  }

  async getProductImageSlider() {
    const slider = this.page.locator('.slick-slider');
    await expect(slider).toBeVisible();
    return slider;
  }

  async getCustomPagination() {
    const pagination = this.page.locator('.custom-pagination');
    await expect(pagination).toBeVisible();
    return pagination;
  }

  async getThumbnailButtons() {
    const thumbnails = this.page.locator('.custom-pagination li button');
    return thumbnails;
  }

  async getMainSlideImages() {
    const slides = this.page.locator('.slick-slide img');
    return slides;
  }

  async getCurrentSlideIndicator() {
    const indicator = this.page.locator('.absolute.top-2.right-2');
    return indicator;
  }

  async getNavigationArrows() {
    const prevArrow = this.page.locator('button[aria-label="Previous image"]');
    const nextArrow = this.page.locator('button[aria-label="Next image"]');
    return { prevArrow, nextArrow };
  }
}

// Test suite
test.describe("ProductImage Component Custom Pagination Tests", () => {
  let helper: ProductImageTestHelper;

  test.beforeEach(async ({ page }) => {
    helper = new ProductImageTestHelper(page);
    await helper.navigateToApp();
  });

  test("should display product image slider with custom pagination", async ({ page }) => {
    await helper.login();
    await helper.navigateToFirstProductDetail();

    // Verify main slider is visible
    const slider = await helper.getProductImageSlider();
    await expect(slider).toBeVisible();

    // Verify custom pagination is visible
    const pagination = await helper.getCustomPagination();
    await expect(pagination).toBeVisible();

    // Verify thumbnail buttons are present
    const thumbnails = await helper.getThumbnailButtons();
    const thumbnailCount = await thumbnails.count();
    expect(thumbnailCount).toBeGreaterThan(0);
  });

  test("should navigate between slides using thumbnail pagination", async ({ page }) => {
    await helper.login();
    await helper.navigateToFirstProductDetail();

    const thumbnails = await helper.getThumbnailButtons();
    const thumbnailCount = await thumbnails.count();

    if (thumbnailCount > 1) {
      // Get initial slide indicator
      const slideIndicator = await helper.getCurrentSlideIndicator();
      await expect(slideIndicator).toContainText("1 /");

      // Click on second thumbnail
      await thumbnails.nth(1).click();
      await page.waitForTimeout(500); // Wait for slide transition

      // Verify slide indicator updated
      await expect(slideIndicator).toContainText("2 /");

      // Click on first thumbnail
      await thumbnails.nth(0).click();
      await page.waitForTimeout(500);

      // Verify back to first slide
      await expect(slideIndicator).toContainText("1 /");
    }
  });

  test("should highlight active thumbnail", async ({ page }) => {
    await helper.login();
    await helper.navigateToFirstProductDetail();

    const thumbnails = await helper.getThumbnailButtons();
    const thumbnailCount = await thumbnails.count();

    if (thumbnailCount > 1) {
      // First thumbnail should be active initially
      const firstThumbnail = thumbnails.nth(0);
      const firstThumbnailImg = firstThumbnail.locator('img');
      await expect(firstThumbnailImg).toHaveClass(/border-amber-500/);

      // Click second thumbnail
      await thumbnails.nth(1).click();
      await page.waitForTimeout(500);

      // Second thumbnail should now be active
      const secondThumbnailImg = thumbnails.nth(1).locator('img');
      await expect(secondThumbnailImg).toHaveClass(/border-amber-500/);

      // First thumbnail should no longer be active
      await expect(firstThumbnailImg).toHaveClass(/border-gray-300/);
    }
  });

  test("should navigate using arrow buttons", async ({ page }) => {
    await helper.login();
    await helper.navigateToFirstProductDetail();

    const thumbnails = await helper.getThumbnailButtons();
    const thumbnailCount = await thumbnails.count();

    if (thumbnailCount > 1) {
      const { prevArrow, nextArrow } = await helper.getNavigationArrows();
      const slideIndicator = await helper.getCurrentSlideIndicator();

      // Should start at slide 1
      await expect(slideIndicator).toContainText("1 /");

      // Click next arrow
      await nextArrow.click();
      await page.waitForTimeout(500);

      // Should be at slide 2
      await expect(slideIndicator).toContainText("2 /");

      // Click previous arrow
      await prevArrow.click();
      await page.waitForTimeout(500);

      // Should be back at slide 1
      await expect(slideIndicator).toContainText("1 /");
    }
  });

  test("should display correct slide count", async ({ page }) => {
    await helper.login();
    await helper.navigateToFirstProductDetail();

    const thumbnails = await helper.getThumbnailButtons();
    const thumbnailCount = await thumbnails.count();
    
    const slideIndicator = await helper.getCurrentSlideIndicator();
    const indicatorText = await slideIndicator.textContent();
    
    // Extract total count from indicator (e.g., "1 / 5")
    const totalFromIndicator = parseInt(indicatorText?.split(' / ')[1] || '0');
    
    // Should match thumbnail count
    expect(totalFromIndicator).toBe(thumbnailCount);
  });

  test("should handle single image gracefully", async ({ page }) => {
    // This test would need a product with only one image
    // For now, we'll test the general behavior
    await helper.login();
    await helper.navigateToFirstProductDetail();

    const thumbnails = await helper.getThumbnailButtons();
    const thumbnailCount = await thumbnails.count();

    if (thumbnailCount === 1) {
      // Navigation arrows should not be visible for single image
      const { prevArrow, nextArrow } = await helper.getNavigationArrows();
      await expect(prevArrow).not.toBeVisible();
      await expect(nextArrow).not.toBeVisible();

      // Slide indicator should show "1 / 1"
      const slideIndicator = await helper.getCurrentSlideIndicator();
      await expect(slideIndicator).toContainText("1 / 1");
    }
  });

  test("should have proper accessibility attributes", async ({ page }) => {
    await helper.login();
    await helper.navigateToFirstProductDetail();

    // Check arrow buttons have proper aria-labels
    const { prevArrow, nextArrow } = await helper.getNavigationArrows();
    
    if (await prevArrow.isVisible()) {
      await expect(prevArrow).toHaveAttribute('aria-label', 'Previous image');
    }
    
    if (await nextArrow.isVisible()) {
      await expect(nextArrow).toHaveAttribute('aria-label', 'Next image');
    }

    // Check images have proper alt attributes
    const mainImages = await helper.getMainSlideImages();
    const imageCount = await mainImages.count();
    
    for (let i = 0; i < imageCount; i++) {
      const image = mainImages.nth(i);
      const altText = await image.getAttribute('alt');
      expect(altText).toContain('Product image');
    }
  });

  test("should maintain responsive design", async ({ page }) => {
    await helper.login();
    await helper.navigateToFirstProductDetail();

    // Test different viewport sizes
    const viewports = [
      { width: 1200, height: 800 }, // Desktop
      { width: 768, height: 1024 }, // Tablet
      { width: 375, height: 667 },  // Mobile
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(500);

      // Slider should still be visible and functional
      const slider = await helper.getProductImageSlider();
      await expect(slider).toBeVisible();

      // Pagination should be visible
      const pagination = await helper.getCustomPagination();
      await expect(pagination).toBeVisible();

      // Thumbnails should be properly sized
      const thumbnails = await helper.getThumbnailButtons();
      if (await thumbnails.count() > 0) {
        const firstThumbnail = thumbnails.nth(0);
        const boundingBox = await firstThumbnail.boundingBox();
        expect(boundingBox?.width).toBeGreaterThan(0);
        expect(boundingBox?.height).toBeGreaterThan(0);
      }
    }
  });
});

export { ProductImageTestHelper, TEST_CONFIG };
