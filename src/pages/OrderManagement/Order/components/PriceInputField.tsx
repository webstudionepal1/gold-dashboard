import React from "react";
import { twMerge } from "tailwind-merge";

interface PriceInputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  variant?: string;
  inputClassName?: string;
  defaultPadding?: boolean;
  border?: boolean;
  readonly?: boolean;
  step?: string | "any";
}

export const PriceInputField = React.forwardRef<
  HTMLInputElement,
  PriceInputFieldProps
>(
  (
    {
      label,
      placeholder,
      type = "text",
      required = false,
      step,
      border = true,
      readonly = false,
      inputClassName,
      defaultPadding = true,
      ...other
    },
    ref
  ) => (
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
          type={type}
          step={step}
          placeholder={placeholder}
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
  )
);

PriceInputField.displayName = "PriceInputField";
