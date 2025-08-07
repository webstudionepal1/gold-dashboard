import { get } from "lodash";

/**
 * Safe data access utility functions
 */

// Type-safe getter with default values
export const safeGet = <T = any>(
  object: any,
  path: string | string[],
  defaultValue?: T
): T => {
  return get(object, path, defaultValue);
};

// Safe number conversion
export const safeNumber = (value: any, defaultValue: number = 0): number => {
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};

// Safe string conversion
export const safeString = (value: any, defaultValue: string = ""): string => {
  if (value === null || value === undefined) return defaultValue;
  return String(value);
};

// Safe array access
export const safeArray = <T = any>(value: any, defaultValue: T[] = []): T[] => {
  return Array.isArray(value) ? value : defaultValue;
};

// Format currency safely
export const formatCurrency = (
  amount: any,
  currency: string = "$",
  decimals: number = 2
): string => {
  const num = safeNumber(amount);
  return `${currency}${num.toFixed(decimals)}`;
};

// Safe date formatting
export const safeDate = (date: any, defaultValue: string = "N/A"): string => {
  if (!date) return defaultValue;
  try {
    return new Date(date).toISOString();
  } catch {
    return defaultValue;
  }
};

// Extract order data safely
export const extractOrderData = (order: any) => {
  return {
    id: safeGet(order, "_id", ""),
    customerName: safeGet(order, "customer.name", "Unknown Customer"),
    customerEmail: safeGet(order, "customer.email", ""),
    orderStatus: safeGet(order, "orderStatus", "pending"),
    paymentStatus: safeGet(order, "paymentStatus", "pending"),
    totalAmount: safeNumber(safeGet(order, "totalAmount", 0)),
    orderedProducts: safeArray(safeGet(order, "orderedProducts", [])),
    createdAt: safeGet(order, "createdAt", ""),
    updatedAt: safeGet(order, "updatedAt", ""),
    shippingAddress: {
      fullname: safeGet(order, "shippingAddress.fullname", ""),
      phone: safeGet(order, "shippingAddress.phone", ""),
      email: safeGet(order, "shippingAddress.email", ""),
      address: safeGet(order, "shippingAddress.address", ""),
    },
    billingAddress: {
      fullname: safeGet(order, "billingAddress.fullname", ""),
      phone: safeGet(order, "billingAddress.phone", ""),
      email: safeGet(order, "billingAddress.email", ""),
      address: safeGet(order, "billingAddress.address", ""),
      landMark: safeGet(order, "billingAddress.landMark", ""),
    },
    billDetails: {
      shippingCost: safeNumber(safeGet(order, "billDetails.shippingCost", 0)),
      discount: safeNumber(safeGet(order, "billDetails.discount", 0)),
      taxes: safeNumber(safeGet(order, "billDetails.taxes", 0)),
    },
  };
};

// Extract product data safely
export const extractProductData = (product: any) => {
  return {
    id: safeGet(product, "product._id", ""),
    name: safeGet(product, "product.name", "Unknown Product"),
    images: safeArray(safeGet(product, "product.images", [])),
    quantity: safeNumber(safeGet(product, "selectedVariant.quantity", 0)),
    price: safeNumber(safeGet(product, "selectedVariant.price", 0)),
    totalPrice: safeNumber(safeGet(product, "selectedVariant.quantity", 0)) * 
                safeNumber(safeGet(product, "selectedVariant.price", 0)),
  };
};

// Validate required fields
export const validateOrderData = (order: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!safeGet(order, "_id")) {
    errors.push("Order ID is required");
  }
  
  if (!safeGet(order, "customer.name")) {
    errors.push("Customer name is required");
  }
  
  if (!safeGet(order, "orderStatus")) {
    errors.push("Order status is required");
  }
  
  if (safeNumber(safeGet(order, "totalAmount")) <= 0) {
    errors.push("Total amount must be greater than 0");
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};
