import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Icon } from "@iconify/react/dist/iconify.js";

interface TextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  border?: boolean;
  readonly?: boolean;
  defaultPadding?: boolean;
  inputClassName?: string;
  helperText?: string;
  error?: string;
  showCharCount?: boolean;
  maxLength?: number;
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
      helperText,
      error,
      showCharCount = false,
      maxLength,
      value,
      ...other
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="flex gap-1 text-nowrap">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            placeholder={placeholder}
            rows={rows}
            readOnly={readonly}
            maxLength={maxLength}
            value={value}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={twMerge(
              `w-full transition-all duration-200 ease-in-out resize-none`,
              `${border ? "border" : ""} ${
                error
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                  : isFocused
                    ? "border-blue-400 focus:border-blue-500 focus:ring-blue-500/20"
                    : "border-gray-200 hover:border-gray-300"
              }`,
              `${defaultPadding ? "py-2.5 px-3" : ""}`,
              `rounded-lg text-sm`,
              `${readonly
                ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-900"
              }`,
              `placeholder:text-gray-400`,
              `focus:outline-none focus:ring-2`,
              `shadow-sm`,
              inputClassName
            )}
            {...other}
          />

          {showCharCount && maxLength && (
            <div className="absolute bottom-2 right-3 text-xs text-gray-400">
              {currentLength}/{maxLength}
            </div>
          )}
        </div>

        {(helperText || error) && (
          <div className="flex items-center gap-1">
            {error && (
              <Icon icon="material-symbols:error" className="w-3 h-3 text-red-500 flex-shrink-0" />
            )}
            <span className={`text-xs ${error ? "text-red-500" : "text-gray-500"}`}>
              {error || helperText}
            </span>
          </div>
        )}
      </div>
    );
  }
);

TextareaField.displayName = "TextareaField";
