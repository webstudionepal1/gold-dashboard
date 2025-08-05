import React from "react";
import { twMerge } from "tailwind-merge";
import {
  formatNumberInputValue,
  parseNumberInputValue,
} from "../../../utils/numberInputHelpers";

interface PriceNumberInputFieldProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange" | "value"
  > {
  label: string;
  variant?: string;
  inputClassName?: string;
  defaultPadding?: boolean;
  border?: boolean;
  readonly?: boolean;
  allowNegative?: boolean;
  value: number;
  onChange: (value: number) => void;
}

export const PriceNumberInputField = React.forwardRef<
  HTMLInputElement,
  PriceNumberInputFieldProps
>(
  (
    {
      label,
      placeholder,
      required = false,
      border = true,
      readonly = false,
      inputClassName,
      defaultPadding = true,
      allowNegative = false,
      value,
      onChange,
      min = allowNegative ? undefined : "0",
      ...other
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const numericValue = parseNumberInputValue(inputValue, allowNegative);
      onChange(numericValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Prevent typing negative sign if negative values are not allowed
      if (!allowNegative && e.key === "-") {
        e.preventDefault();
      }

      // Prevent typing 'e', 'E', '+' which are valid in number inputs but not desired
      if (["e", "E", "+"].includes(e.key)) {
        e.preventDefault();
      }
    };

    return (
      <div className="flex flex-col gap-2 w-full">
        <label className="flex gap-1">
          <p className="text-[#95949a]">{label}</p>
          {required && <span className="text-red">*</span>}
        </label>

        <div className="relative w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-md text-[#95949a] pointer-events-none">
            Rs. |
          </span>
          <input
            ref={ref}
            type="number"
            placeholder={placeholder || "0"}
            value={formatNumberInputValue(value, false)}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            min={min}
            className={twMerge(
              `min-h-[44px] ${border && "border"} border-grey-200 ${
                defaultPadding && "py-2 pl-14 pr-4"
              } rounded-xl ${
                readonly
                  ? "placeholder:text-[#95949a] cursor-auto"
                  : "text-gray-800"
              } outline-none w-full ${inputClassName} bg-[#f6f7f9]`
            )}
            readOnly={readonly}
            {...other}
          />
        </div>
      </div>
    );
  }
);

PriceNumberInputField.displayName = "PriceNumberInputField";
