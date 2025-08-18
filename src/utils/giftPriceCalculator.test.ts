import { calculateGiftPrices, formatPrice, getGiftPricingSummary } from './giftPriceCalculator';
import { IFetchGift } from '../server/api/giftHooks';

// Mock gift data for testing
const mockGift: IFetchGift = {
  _id: 'test-gift-1',
  name: 'Test Gift Set',
  description: 'A test gift set',
  type: 'gift',
  products: [
    {
      product: {
        _id: 'product-1',
        name: 'Gold Ring',
        description: 'Beautiful gold ring',
        category: { _id: 'cat-1', name: 'Rings', description: '', image: '', isActive: true, subCategory: [], createdAt: '', updatedAt: '' },
        subCategory: { _id: 'sub-1', name: 'Gold Rings', description: '', category: '', image: '', isActive: true, createdAt: '', updatedAt: '' },
        variant: [
          { price: 10000, wt: 5, unit: 'grams' }
        ],
        makingCharges: 500,
        length: 0,
        claspType: { _id: 'clasp-1', name: 'Standard', description: '', createdAt: '', updatedAt: '' },
        rhodoumFinishes: false,
        shape: 'Round',
        quantity: 10,
        totalCarat: 0,
        color: 'Yellow',
        clarity: 'VS1',
        dimension: 0,
        tags: [],
        visibleAs: 'product',
        images: [],
        averageRating: 0,
        numberOfReviews: 0,
        createdAt: '',
        updatedAt: '',
        isActive: true
      },
      quantity: 2,
      isOptional: false,
      alternativeProducts: []
    },
    {
      product: {
        _id: 'product-2',
        name: 'Silver Chain',
        description: 'Elegant silver chain',
        category: { _id: 'cat-2', name: 'Chains', description: '', image: '', isActive: true, subCategory: [], createdAt: '', updatedAt: '' },
        subCategory: { _id: 'sub-2', name: 'Silver Chains', description: '', category: '', image: '', isActive: true, createdAt: '', updatedAt: '' },
        variant: [
          { price: 5000, wt: 3, unit: 'grams' }
        ],
        makingCharges: 300,
        length: 0,
        claspType: { _id: 'clasp-2', name: 'Standard', description: '', createdAt: '', updatedAt: '' },
        rhodoumFinishes: false,
        shape: 'Round',
        quantity: 5,
        totalCarat: 0,
        color: 'White',
        clarity: 'VS2',
        dimension: 0,
        tags: [],
        visibleAs: 'product',
        images: [],
        averageRating: 0,
        numberOfReviews: 0,
        createdAt: '',
        updatedAt: '',
        isActive: true
      },
      quantity: 1,
      isOptional: true,
      alternativeProducts: []
    }
  ],
  pricingType: 'discounted',
  discountPercentage: 10,
  tags: ['jewelry', 'gift'],
  isActive: true,
  isAvailable: true,
  stockType: 'unlimited',
  images: [],
  visibleAs: 'gift',
  isCustomizable: false,
  allowPartialPurchase: false,
  createdAt: '',
  updatedAt: ''
};

describe('Gift Price Calculator', () => {
  describe('calculateGiftPrices', () => {
    it('should calculate correct prices for a valid gift', () => {
      const result = calculateGiftPrices(mockGift);
      
      expect(result.hasValidProducts).toBe(true);
      expect(result.totalOriginalPrice).toBe(21000); // (10000 + 500) * 2 + (5000 + 300) * 1
      expect(result.totalDiscountedPrice).toBe(18900); // 21000 * 0.9 (10% discount)
      expect(result.savings).toBe(2100); // 21000 - 18900
      expect(result.productBreakdown).toHaveLength(2);
    });

    it('should handle gift with no products', () => {
      const emptyGift: IFetchGift = { ...mockGift, products: [] };
      const result = calculateGiftPrices(emptyGift);
      
      expect(result.hasValidProducts).toBe(false);
      expect(result.totalOriginalPrice).toBe(0);
      expect(result.totalDiscountedPrice).toBe(0);
      expect(result.savings).toBe(0);
    });

    it('should handle gift with inactive products', () => {
      const inactiveGift: IFetchGift = {
        ...mockGift,
        products: [
          {
            ...mockGift.products[0],
            product: {
              ...mockGift.products[0].product,
              isActive: false
            }
          }
        ]
      };
      
      const result = calculateGiftPrices(inactiveGift);
      
      expect(result.hasValidProducts).toBe(false);
      expect(result.totalOriginalPrice).toBe(0);
    });

    it('should handle gift with no discount', () => {
      const noDiscountGift: IFetchGift = { ...mockGift, discountPercentage: 0 };
      const result = calculateGiftPrices(noDiscountGift);
      
      expect(result.totalDiscountedPrice).toBe(result.totalOriginalPrice);
      expect(result.savings).toBe(0);
    });
  });

  describe('formatPrice', () => {
    it('should format price in Indian Rupees', () => {
      expect(formatPrice(1000)).toBe('₹1,000');
      expect(formatPrice(100000)).toBe('₹1,00,000');
      expect(formatPrice(0)).toBe('₹0');
    });
  });

  describe('getGiftPricingSummary', () => {
    it('should provide correct summary statistics', () => {
      const calculation = calculateGiftPrices(mockGift);
      const summary = getGiftPricingSummary(calculation);
      
      expect(summary.totalProducts).toBe(2);
      expect(summary.calculatedProducts).toBe(2);
      expect(summary.inactiveProducts).toBe(0);
      expect(summary.hasIssues).toBe(false);
      expect(summary.totalValue).toBe(21000);
      expect(summary.finalValue).toBe(18900);
      expect(summary.savings).toBe(2100);
    });
  });
});
