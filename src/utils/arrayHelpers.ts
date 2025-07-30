/**
 * Utility functions for safe array operations
 * These functions help prevent "map is not a function" errors
 */

/**
 * Safely maps over an array, returning empty array if input is not an array
 * @param data - The data to map over
 * @param mapFn - The mapping function
 * @returns Mapped array or empty array if input is invalid
 */
export const safeMap = <T, R>(
  data: unknown,
  mapFn: (item: T, index: number) => R
): R[] => {
  if (!Array.isArray(data)) {
    console.warn('safeMap: Expected array but received:', typeof data, data);
    return [];
  }
  return data.map(mapFn);
};

/**
 * Ensures the input is an array, returns empty array if not
 * @param data - The data to ensure is an array
 * @returns Array or empty array if input is invalid
 */
export const ensureArray = <T>(data: unknown): T[] => {
  if (Array.isArray(data)) {
    return data;
  }
  console.warn('ensureArray: Expected array but received:', typeof data, data);
  return [];
};

/**
 * Safely filters an array, returning empty array if input is not an array
 * @param data - The data to filter
 * @param filterFn - The filter function
 * @returns Filtered array or empty array if input is invalid
 */
export const safeFilter = <T>(
  data: unknown,
  filterFn: (item: T, index: number) => boolean
): T[] => {
  if (!Array.isArray(data)) {
    console.warn('safeFilter: Expected array but received:', typeof data, data);
    return [];
  }
  return data.filter(filterFn);
};

/**
 * Safely reduces an array, returning initial value if input is not an array
 * @param data - The data to reduce
 * @param reduceFn - The reduce function
 * @param initialValue - The initial value
 * @returns Reduced value or initial value if input is invalid
 */
export const safeReduce = <T, R>(
  data: unknown,
  reduceFn: (acc: R, item: T, index: number) => R,
  initialValue: R
): R => {
  if (!Array.isArray(data)) {
    console.warn('safeReduce: Expected array but received:', typeof data, data);
    return initialValue;
  }
  return data.reduce(reduceFn, initialValue);
};

/**
 * Type guard to check if a value is an array
 * @param value - The value to check
 * @returns True if value is an array
 */
export const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

/**
 * Type guard to check if a value is a non-empty array
 * @param value - The value to check
 * @returns True if value is a non-empty array
 */
export const isNonEmptyArray = <T>(value: unknown): value is T[] => {
  return Array.isArray(value) && value.length > 0;
};
