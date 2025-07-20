import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { twMerge } from "tailwind-merge";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "filled";
  inputClassName?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      icon,
      error,
      helperText,
      variant = "default",
      className,
      inputClassName,
      required,
      ...props
    },
    ref
  ) => {
    const baseInputClasses = "w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent";
    
    const variantClasses = {
      default: "border-gray-300 bg-white text-gray-900 placeholder-gray-500",
      filled: "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500"
    };

    const errorClasses = error 
      ? "border-red-500 focus:ring-red-500" 
      : variantClasses[variant];

    return (
      <div className={twMerge("space-y-2", className)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon icon={icon} className="w-5 h-5 text-gray-400" />
            </div>
          )}
          
          <input
            ref={ref}
            className={twMerge(
              baseInputClasses,
              errorClasses,
              icon ? "pl-10" : "",
              inputClassName
            )}
            {...props}
          />
        </div>
        
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <Icon icon="material-symbols:error" className="w-4 h-4" />
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
