import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  icon?: string;
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "default",
      size = "md",
      icon,
      loading = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variantClasses = {
      default: "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500",
      outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
      ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
      destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
    };
    
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base"
    };

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={twMerge(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <Icon
            icon="material-symbols:hourglass-empty"
            className="w-4 h-4 mr-2 animate-spin"
          />
        )}
        {!loading && icon && (
          <Icon icon={icon} className="w-4 h-4 mr-2" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
