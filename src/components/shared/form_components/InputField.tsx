import React from "react";

import { twMerge } from "tailwind-merge";

interface InputFieldPropTypes
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  variant?: string;
  inputClassName?: string;
  defaultPadding?: boolean;
  border?: boolean;
  readonly?: boolean;
}

// Refactor InputField with React.forwardRef
export const InputField = React.forwardRef<
  HTMLInputElement,
  InputFieldPropTypes
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
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={twMerge(
          `${border && "border"} border-grey-200 ${
            defaultPadding && "py-3 px-4"
          } rounded-xl ${
            readonly
              ? "placeholder:text-[#95949a] cursor-auto"
              : "text-[#86878d]"
          } outline-none w-full ${inputClassName} bg-[#f6f7f9] `
        )}
        readOnly={readonly}
        {...other}
      />
    </div>
  )
);

InputField.displayName = "InputField";
