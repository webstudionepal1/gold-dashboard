import React from "react";
import { twMerge } from "tailwind-merge";
import { Icon } from "@iconify/react/dist/iconify.js";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      loading = false,
      fullWidth = false,
      className,
      disabled,
      ...other
    },
    ref
  ) => {
    const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variantClasses = {
      primary: "bg-[#DF8D28] hover:bg-[#B8691A] text-white focus:ring-[#DF8D28]/50 shadow-sm hover:shadow-md",
      secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500/50 shadow-sm hover:shadow-md",
      outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-gray-500/50 shadow-sm",
      ghost: "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500/50",
      danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500/50 shadow-sm hover:shadow-md",
      success: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500/50 shadow-sm hover:shadow-md"
    };
    
    const sizeClasses = {
      xs: "px-2 py-1 text-xs rounded-sm gap-1",
      sm: "px-3 py-1.5 text-sm rounded-sm gap-1.5",
      md: "px-4 py-2 text-sm rounded-lg gap-2",
      lg: "px-6 py-3 text-base rounded-lg gap-2"
    };
    
    const iconSizes = {
      xs: "w-3 h-3",
      sm: "w-3 h-3", 
      md: "w-4 h-4",
      lg: "w-5 h-5"
    };
    
    const isDisabled = disabled || loading;
    
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={twMerge(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          className
        )}
        {...other}
      >
        {loading && (
          <Icon 
            icon="material-symbols:hourglass-empty" 
            className={`${iconSizes[size]} animate-spin`} 
          />
        )}
        
        {!loading && icon && iconPosition === 'left' && (
          <Icon icon={icon} className={iconSizes[size]} />
        )}
        
        {children}
        
        {!loading && icon && iconPosition === 'right' && (
          <Icon icon={icon} className={iconSizes[size]} />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
