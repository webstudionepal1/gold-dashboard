import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { twMerge } from "tailwind-merge";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label?: string;
  placeholder?: string;
  options: Option[];
  value?: string;
  onValueChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  placeholder = "Select an option",
  options,
  value,
  onValueChange,
  error,
  helperText,
  disabled = false,
  required = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onValueChange?.(optionValue);
    setIsOpen(false);
  };

  const baseClasses = "w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer";
  
  const errorClasses = error 
    ? "border-red-500 focus:ring-red-500" 
    : "border-gray-300 bg-white text-gray-900";

  const disabledClasses = disabled 
    ? "bg-gray-100 text-gray-500 cursor-not-allowed" 
    : "hover:border-gray-400";

  return (
    <div className={twMerge("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative" ref={selectRef}>
        <div
          className={twMerge(
            baseClasses,
            errorClasses,
            disabledClasses,
            "flex items-center justify-between"
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <Icon 
            icon="material-symbols:keyboard-arrow-down" 
            className={twMerge(
              "w-5 h-5 text-gray-400 transition-transform duration-200",
              isOpen ? "rotate-180" : ""
            )}
          />
        </div>
        
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.length === 0 ? (
              <div className="px-4 py-3 text-gray-500 text-sm">No options available</div>
            ) : (
              options.map((option) => (
                <div
                  key={option.value}
                  className={twMerge(
                    "px-4 py-3 cursor-pointer transition-colors duration-150",
                    option.value === value 
                      ? "bg-purple-50 text-purple-700" 
                      : "text-gray-900 hover:bg-gray-50"
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        )}
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
};
