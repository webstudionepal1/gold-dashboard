/**
 * Utility functions for price conversions
 */

// 1 tola = 11.6638 grams (standard conversion)
export const GRAMS_PER_TOLA = 11.6638;

/**
 * Convert price per gram to price per tola
 * @param pricePerGram - Price per gram
 * @returns Price per tola
 */
export const convertGramToTola = (pricePerGram: number): number => {
  return pricePerGram * GRAMS_PER_TOLA;
};

/**
 * Convert price per tola to price per gram
 * @param pricePerTola - Price per tola
 * @returns Price per gram
 */
export const convertTolaToGram = (pricePerTola: number): number => {
  return pricePerTola / GRAMS_PER_TOLA;
};

/**
 * Format currency symbol based on currency code
 * @param currency - Currency code (e.g., 'NPR', 'Nrs', 'USD')
 * @returns Formatted currency symbol
 */
export const getCurrencySymbol = (currency: string): string => {
  const currencyMap: { [key: string]: string } = {
    NPR: "Rs",
    Nrs: "Rs",
    NRS: "Rs",
    RS: "Rs",
    USD: "$",
    AUD: "A$",
    EUR: "€",
    GBP: "£",
  };
  
  return currencyMap[currency.toUpperCase()] || "Rs"; // Default to NPR symbol
};

/**
 * Format price with currency symbol
 * @param price - Price value
 * @param currency - Currency code (default: 'NPR')
 * @returns Formatted price string
 */
export const formatPrice = (
  price: number | null | undefined,
  currency: string = "NPR"
): string => {
  const symbol = getCurrencySymbol(currency);
  const safePrice = Number(price) || 0;
  return `${symbol} ${safePrice.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Format price for tola display
 * @param pricePerGram - Price per gram
 * @param currency - Currency code (default: 'NPR')
 * @returns Formatted price per tola string
 */
export const formatPricePerTola = (
  pricePerGram: number | null | undefined,
  currency: string = "NPR"
): string => {
  const pricePerTola = convertGramToTola(Number(pricePerGram) || 0);
  return formatPrice(pricePerTola, currency);
};
