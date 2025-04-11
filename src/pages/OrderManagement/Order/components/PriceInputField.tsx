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
          placeholder={placeholder}
          className={twMerge(
            `${border && "border"} border-grey-200 ${
              defaultPadding && "py-3 pl-14 pr-4"
            } rounded ${
              readonly
                ? "placeholder:text-[#95949a] cursor-auto"
                : "text-[#95949a]"
            } outline-none w-full ${inputClassName}`
          )}
          readOnly={readonly}
          {...other}
        />
      </div>
    </div>
  )
);

PriceInputField.displayName = "PriceInputField";
