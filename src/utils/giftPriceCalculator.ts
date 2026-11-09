import { IFetchGift } from "../server/api/giftHooks";

export interface GiftPriceCalculation {
  totalOriginalPrice: number;
  totalDiscountedPrice: number;
  savings: number;
  hasValidProducts: boolean;
  productBreakdown: ProductPriceBreakdown[];
  pricingIssue?: string;
}

export interface ProductPriceBreakdown {
  productId: string;
  productName: string;
  quantity: number;
  isOptional: boolean;
  basePrice: number;
  makingCharges: number;
  wastageCost: number;
  stonesCost: number;
  othersCost: number;
  pricePerUnit: number;
  totalPrice: number;
  status: "calculated" | "inactive" | "no_variant" | "no_price";
  reason: string;
}

/**
 * Calculate gift prices from product data
 * @param gift - The gift object containing products and pricing information
 * @returns GiftPriceCalculation object with detailed pricing breakdown
 */
export const calculateGiftPrices = (gift: IFetchGift): GiftPriceCalculation => {
  const fixedPriceNum = Number(gift.fixedPrice || 0);
  if ((gift.pricingType === "fixed" || (!gift.products || gift.products.length === 0)) && fixedPriceNum > 0) {
    const discountPercentage = gift.discountPercentage || 0;
    const totalOriginalPrice = fixedPriceNum;
    const totalDiscountedPrice = totalOriginalPrice * (1 - discountPercentage / 100);
    return {
      totalOriginalPrice,
      totalDiscountedPrice,
      savings: totalOriginalPrice - totalDiscountedPrice,
      hasValidProducts: true,
      productBreakdown: [],
    };
  }

  if (!gift.products || gift.products.length === 0) {
    return {
      totalOriginalPrice: 0,
      totalDiscountedPrice: 0,
      savings: 0,
      hasValidProducts: false,
      productBreakdown: [],
      pricingIssue: "No products found in gift",
    };
  }

  let totalOriginalPrice = fixedPriceNum > 0 && gift.pricingType === "fixed" ? fixedPriceNum : 0;
  let hasValidProducts = false;
  const productBreakdown: ProductPriceBreakdown[] = [];

  // Calculate total price from all products
  gift.products.forEach((giftProduct) => {
    const { product, quantity, isOptional } = giftProduct;

    if (!product) {
      productBreakdown.push({
        productId: "unknown",
        productName: "No Product Data",
        quantity,
        isOptional,
        basePrice: 0,
        makingCharges: 0,
        wastageCost: 0,
        stonesCost: 0,
        othersCost: 0,
        pricePerUnit: 0,
        totalPrice: 0,
        status: "no_price",
        reason: "Product object is null or undefined",
      });
      return;
    }

    if (!product.isActive) {
      productBreakdown.push({
        productId: product._id,
        productName: product.name,
        quantity,
        isOptional,
        basePrice: 0,
        makingCharges: 0,
        wastageCost: 0,
        stonesCost: 0,
        othersCost: 0,
        pricePerUnit: 0,
        totalPrice: 0,
        status: "inactive",
        reason: "Product is inactive",
      });
      return;
    }

    const variants =
      product.variant?.length
        ? product.variant
        : (product as { variants?: typeof product.variant }).variants;

    if (!variants || variants.length === 0) {
      productBreakdown.push({
        productId: product._id,
        productName: product.name,
        quantity,
        isOptional,
        basePrice: 0,
        makingCharges: 0,
        wastageCost: 0,
        stonesCost: 0,
        othersCost: 0,
        pricePerUnit: 0,
        totalPrice: 0,
        status: "no_variant",
        reason: "No product variants found",
      });
      return;
    }

    const activeVariant =
      variants.find((v) => v.isActive) || variants[0];
    if (!activeVariant || !activeVariant.price) {
      productBreakdown.push({
        productId: product._id,
        productName: product.name,
        quantity,
        isOptional,
        basePrice: 0,
        makingCharges: 0,
        wastageCost: 0,
        stonesCost: 0,
        othersCost: 0,
        pricePerUnit: 0,
        totalPrice: 0,
        status: "no_price",
        reason: "No active variant with price found",
      });
      return;
    }

    // Calculate base price from variant
    const basePrice = activeVariant.price;

    // Add making charges
    const makingCharges = product.makingCharges || 0;

    // Calculate wastage cost if available
    let wastageCost = 0;
    if (product.wastage) {
      if (product.wastage.type === "fixed") {
        wastageCost = product.wastage.value || 0;
      } else if (product.wastage.type === "per") {
        wastageCost = (basePrice * (product.wastage.value || 0)) / 100;
      }
    }

    // Add stones cost if available
    const stonesCost = (product.stones || []).reduce(
      (total: number, stone: { price: string }) => {
        return total + (parseFloat(stone.price) || 0);
      },
      0
    );

    // Add others cost if available
    const othersCost = (product.others || []).reduce(
      (total: number, other: { name: string; value: number }) => {
        return total + (other.value || 0);
      },
      0
    );

    // Calculate total price per unit
    const pricePerUnit =
      basePrice + makingCharges + wastageCost + stonesCost + othersCost;

    // Calculate total price for this product
    const totalProductPrice = pricePerUnit * quantity;

    totalOriginalPrice += totalProductPrice;
    hasValidProducts = true;

    productBreakdown.push({
      productId: product._id,
      productName: product.name,
      quantity,
      isOptional,
      basePrice,
      makingCharges,
      wastageCost,
      stonesCost,
      othersCost,
      pricePerUnit,
      totalPrice: totalProductPrice,
      status: "calculated",
      reason: "Price calculated successfully",
    });
  });

  // Apply discount if available
  const discountPercentage = gift.discountPercentage || 0;
  const totalDiscountedPrice =
    totalOriginalPrice * (1 - discountPercentage / 100);
  const savings = totalOriginalPrice - totalDiscountedPrice;

  return {
    totalOriginalPrice,
    totalDiscountedPrice,
    savings,
    hasValidProducts,
    productBreakdown,
    pricingIssue: !hasValidProducts
      ? "No valid products to calculate price"
      : undefined,
  };
};

/**
 * Format price in Indian Rupees
 * @param price - The price to format
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "NPR",
    minimumFractionDigits: 0,
  }).format(price);
};

/**
 * Get a summary of gift pricing issues
 * @param calculation - The gift price calculation result
 * @returns Summary object with issue details
 */
export const getGiftPricingSummary = (calculation: GiftPriceCalculation) => {
  const totalProducts = calculation.productBreakdown.length;
  const calculatedProducts = calculation.productBreakdown.filter(
    (p) => p.status === "calculated"
  ).length;
  const inactiveProducts = calculation.productBreakdown.filter(
    (p) => p.status === "inactive"
  ).length;
  const noPriceProducts = calculation.productBreakdown.filter(
    (p) => p.status === "no_price"
  ).length;
  const noVariantProducts = calculation.productBreakdown.filter(
    (p) => p.status === "no_variant"
  ).length;

  return {
    totalProducts,
    calculatedProducts,
    inactiveProducts,
    noPriceProducts,
    noVariantProducts,
    hasIssues: !calculation.hasValidProducts,
    totalValue: calculation.totalOriginalPrice,
    finalValue: calculation.totalDiscountedPrice,
    savings: calculation.savings,
  };
};
