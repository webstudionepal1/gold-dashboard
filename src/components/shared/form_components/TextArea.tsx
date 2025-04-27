import React from "react";
import { twMerge } from "tailwind-merge";

interface TextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  border?: boolean;
  readonly?: boolean;
  defaultPadding?: boolean;
  inputClassName?: string;
}

export const TextareaField = React.forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(
  (
    {
      label,
      placeholder,
      required = false,
      border = true,
      readonly = false,
      rows = 4,
      defaultPadding = true,
      inputClassName,
      ...other
    },
    ref
  ) => (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="flex gap-1">
          <p className="text-[#95949a]">{label}</p>
          {required && <span className="text-red">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        placeholder={placeholder}
        rows={rows}
        readOnly={readonly}
        className={twMerge(
          `${border && "border"} border-grey-200 ${
            defaultPadding && "py-3 px-4"
          } rounded-xl ${
            readonly
              ? "placeholder:text-[#95949a] cursor-auto"
              : "text-[#86878d]"
          } outline-none w-full ${inputClassName} bg-[#f6f7f9] resize-none`
        )}
        {...other}
      />
    </div>
  )
);

TextareaField.displayName = "TextareaField";
