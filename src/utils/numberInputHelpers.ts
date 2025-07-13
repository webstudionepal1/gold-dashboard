/**
 * Utility functions for handling number inputs in forms
 */

/**
 * Formats a number value for display in an input field
 * Returns empty string for 0 values to allow proper editing
 * @param value - The numeric value from the form state
 * @returns String representation for the input field
 */
export const formatNumberInputValue = (value: number | string): string => {
  if (value === 0 || value === "0") {
    return "";
  }
  return String(value);
};

/**
 * Parses input value and returns appropriate number for form state
 * Returns 0 for empty strings to maintain form validation
 * @param inputValue - The string value from the input field
 * @returns Numeric value for the form state
 */
export const parseNumberInputValue = (inputValue: string): number => {
  if (inputValue === "" || inputValue === null || inputValue === undefined) {
    return 0;
  }
  const parsed = Number(inputValue);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Creates a standardized onChange handler for number inputs
 * @param handleChange - The form field's handleChange function
 * @returns onChange handler function
 */
export const createNumberInputHandler = (
  handleChange: (value: number) => void
) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleChange(parseNumberInputValue(value));
  };
};

/**
 * Hook for managing number input state with proper empty field handling
 * @param initialValue - Initial numeric value
 * @param onChange - Callback when value changes
 * @returns Object with display value and change handler
 */
export const useNumberInput = (
  initialValue: number,
  onChange: (value: number) => void
) => {
  return {
    value: formatNumberInputValue(initialValue),
    onChange: createNumberInputHandler(onChange),
  };
};
