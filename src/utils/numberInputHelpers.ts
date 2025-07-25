/**
 * Utility functions for handling number inputs in forms
 */

/**
 * Formats a number value for display in an input field
 * @param value - The numeric value from the form state
 * @param showZero - Whether to show 0 as "0" or empty string (default: true to maintain existing behavior)
 * @returns String representation for the input field
 */
export const formatNumberInputValue = (
  value: number | string,
  showZero: boolean = true
): string => {
  if ((value === 0 || value === "0") && !showZero) {
    return "";
  }
  return String(value);
};

/**
 * Parses input value and returns appropriate number for form state
 * Returns 0 for empty strings to maintain form validation
 * @param inputValue - The string value from the input field
 * @param allowNegative - Whether to allow negative values (default: false)
 * @returns Numeric value for the form state
 */
export const parseNumberInputValue = (
  inputValue: string,
  allowNegative: boolean = false
): number => {
  if (inputValue === "" || inputValue === null || inputValue === undefined) {
    return 0;
  }
  const parsed = Number(inputValue);
  if (isNaN(parsed)) {
    return 0;
  }
  // Prevent negative values unless explicitly allowed
  if (!allowNegative && parsed < 0) {
    return 0;
  }
  return parsed;
};

/**
 * Creates a standardized onChange handler for number inputs
 * @param handleChange - The form field's handleChange function
 * @param allowNegative - Whether to allow negative values (default: false)
 * @returns onChange handler function
 */
export const createNumberInputHandler = (
  handleChange: (value: number) => void,
  allowNegative: boolean = false
) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleChange(parseNumberInputValue(value, allowNegative));
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

/**
 * Creates a number input handler with clearable zero behavior
 * Shows "0" initially but allows easy clearing with backspace
 * @param value - Current numeric value
 * @param onChange - Change handler function
 * @param allowNegative - Whether to allow negative values
 * @returns Object with display value and handlers
 */
export const useClearableNumberInput = (
  value: number,
  onChange: (value: number) => void,
  allowNegative: boolean = false
) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(parseNumberInputValue(inputValue, allowNegative));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If the current value is 0 and user presses backspace, clear the field
    if (value === 0 && e.key === "Backspace") {
      // Allow the backspace to clear the field
      return;
    }

    // Prevent typing negative sign if negative values are not allowed
    if (!allowNegative && e.key === "-") {
      e.preventDefault();
    }

    // Prevent typing 'e', 'E', '+' which are valid in number inputs but not desired
    if (["e", "E", "+"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // When field is focused and value is 0, select all text for easy replacement
    if (value === 0) {
      e.target.select();
    }
  };

  return {
    value: value === 0 ? "" : String(value), // Show empty string for 0 to improve UX, actual value otherwise
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
  };
};
