/**
 * Utility functions for handling numbers and counts
 */

/**
 * Ensures a product count is never negative
 * @param count - The count value (can be undefined, null, or negative)
 * @returns A non-negative number (minimum 0)
 */
export const getSafeProductCount = (count: number | undefined | null): number => {
  const value = count || 0;
  return Math.max(0, value);
};

/**
 * Ensures any count is never negative
 * @param count - The count value (can be undefined, null, or negative)
 * @returns A non-negative number (minimum 0)
 */
export const getSafeCount = (count: number | undefined | null): number => {
  const value = count || 0;
  return Math.max(0, value);
};

/**
 * Formats a count with proper handling of negative values
 * @param count - The count value
 * @param fallback - The fallback value if count is invalid (default: 0)
 * @returns A formatted count string
 */
export const formatCount = (count: number | undefined | null, fallback: number = 0): string => {
  const safeCount = getSafeCount(count);
  return safeCount.toString();
};
