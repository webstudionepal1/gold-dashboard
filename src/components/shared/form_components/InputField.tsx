import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Icon } from '@iconify/react/dist/iconify.js';

interface InputFieldPropTypes
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: string;
  inputClassName?: string;
  step?: string | 'any';
  defaultPadding?: boolean;
  border?: boolean;
  readonly?: boolean;
  icon?: string;
  helperText?: string;
  error?: string;

  // Number-specific props
  numberValue?: number;
  onNumberChange?: (value: number) => void;
  allowNegative?: boolean;
  clearZeroOnFocus?: boolean;
}

export const InputField = React.forwardRef<
  HTMLInputElement,
  InputFieldPropTypes
>(
  (
    {
      label,
      placeholder,
      type = 'text',
      required = false,
      step,
      border = true,
      readonly = false,
      inputClassName,
      defaultPadding = true,
      icon,
      helperText,
      error,

      // Number-specific props
      numberValue,
      onNumberChange,
      allowNegative = false,
      clearZeroOnFocus = true,

      ...other
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const { value: valueProp, ...inputRest } = other;

    const toControlledValue = (v: unknown): string | number | readonly string[] => {
      if (v == null) return '';
      return v as string | number | readonly string[];
    };

    // Use number input logic if this is a number type and numberValue/onNumberChange are provided
    const isNumberInput =
      type === 'number' && numberValue !== undefined && onNumberChange;

    const numberInputProps = useClearableNumberInput(
      numberValue ?? 0,
      onNumberChange || (() => {}),
      allowNegative
    );

    // Determine which props to use
    const inputProps =
      isNumberInput && clearZeroOnFocus
        ? {
            value: numberInputProps.value,
            onChange: numberInputProps.onChange,
            onKeyDown: numberInputProps.onKeyDown,
            onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
              setIsFocused(true);
              numberInputProps.onFocus(e);
            },
          }
        : {
            value:
              numberValue !== undefined
                ? String(numberValue)
                : toControlledValue(valueProp),
            onChange: onNumberChange
              ? (e: React.ChangeEvent<HTMLInputElement>) =>
                  onNumberChange(parseFloat(e.target.value) || 0)
              : other.onChange,
            onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
              setIsFocused(true);
              other.onFocus?.(e);
            },
          };

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="flex gap-1 text-nowrap">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            {required && <span className="text-red">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              <Icon icon={icon} className="w-4 h-4 text-gray-400" />
            </div>
          )}

          <input
            ref={ref}
            step={step}
            type={type}
            onWheel={(e) => type === 'number' && e.currentTarget.blur()} 
            placeholder={placeholder}
            {...inputProps}
            onBlur={(e) => {
              setIsFocused(false);
              inputRest.onBlur?.(e);
            }}
            className={twMerge(
              `w-full transition-all duration-200 ease-in-out`,
              `${border ? 'border' : ''} ${
                error
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                  : isFocused
                  ? 'border-blue-400 focus:border-blue-500 focus:ring-blue-500/20'
                  : 'border-gray-200 hover:border-gray-300'
              }`,
              `${
                defaultPadding
                  ? icon
                    ? 'py-2.5 pl-10 pr-3'
                    : 'py-2.5 px-3'
                  : ''
              }`,
              `rounded-lg text-sm`,
              `${
                readonly
                  ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-gray-900'
              }`,
              `placeholder:text-gray-400`,
              `focus:outline-none focus:ring-2`,
              `shadow-sm`,
              inputClassName
            )}
            readOnly={readonly}
            {...(isNumberInput ? {} : inputRest)} // value handled above; omit null from spread
          />
        </div>

        {(helperText || error) && (
          <div className="flex items-center gap-1">
            {error && (
              <Icon
                icon="material-symbols:error"
                className="w-3 h-3 text-red flex-shrink-0"
              />
            )}
            <span
              className={`text-xs ${error ? 'text-red' : 'text-gray-500'}`}
            >
              {error || helperText}
            </span>
          </div>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

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
  if ((value === 0 || value === '0') && !showZero) {
    return '';
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
  if (inputValue === '' || inputValue === null || inputValue === undefined) {
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
    if (value === 0 && e.key === 'Backspace') {
      // Allow the backspace to clear the field
      return;
    }

    // Prevent typing negative sign if negative values are not allowed
    if (!allowNegative && e.key === '-') {
      e.preventDefault();
    }

    // Prevent typing 'e', 'E', '+' which are valid in number inputs but not desired
    if (['e', 'E', '+'].includes(e.key)) {
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
    value: value === 0 ? '' : String(value), // Show empty string for 0 to improve UX, actual value otherwise
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
  };
};

// Second iteration
// import React from "react";
// import { twMerge } from "tailwind-merge";

// interface InputFieldPropTypes
//   extends React.InputHTMLAttributes<HTMLInputElement> {
//   label?: string;
//   variant?: string;
//   inputClassName?: string;
//   step?: string | "any";
//   defaultPadding?: boolean;
//   border?: boolean;
//   readonly?: boolean;
// }

// export const InputField = React.forwardRef<
//   HTMLInputElement,
//   InputFieldPropTypes
// >(
//   (
//     {
//       label,
//       placeholder,
//       type = "text",
//       required = false,
//       step,
//       border = true,
//       readonly = false,
//       inputClassName,
//       defaultPadding = true,
//       ...other
//     },
//     ref
//   ) => (
//     <div className="flex flex-col gap-2 w-full">
//       <label className="flex gap-1">
//         <p className="text-[#95949a]">{label}</p>
//         {required && <span className="text-red">*</span>}
//       </label>
//       <input
//         ref={ref}
//         step={step}
//         type={type}
//         placeholder={placeholder}
//         className={twMerge(
//           `min-h-[44px] ${border && "border"} border-gray-200 ${
//             defaultPadding && "py-2 px-4"
//           } rounded-xl ${
//             readonly
//               ? "placeholder:text-[#95949a] cursor-auto"
//               : "text-[#86878d]"
//           } outline-none w-full ${inputClassName} bg-[#f6f7f9]`
//         )}
//         readOnly={readonly}
//         {...other}
//       />
//     </div>
//   )
// );

// InputField.displayName = "InputField";
