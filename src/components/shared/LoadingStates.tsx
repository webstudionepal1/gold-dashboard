import React from "react";
import { Icon } from "@iconify/react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "text-blue-600",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <Icon
      icon="mdi:loading"
      className={`animate-spin ${sizeClasses[size]} ${color} ${className}`}
    />
  );
};

interface TableLoadingProps {
  rows?: number;
  columns?: number;
}

export const TableLoading: React.FC<TableLoadingProps> = ({
  rows = 5,
  columns = 4,
}) => {
  return (
    <div className="animate-pulse">
      {/* Table Header */}
      <div className="flex space-x-4 mb-4">
        {Array.from({ length: columns }).map((_, index) => (
          <div
            key={index}
            className="h-4 bg-gray-300 rounded flex-1"
          />
        ))}
      </div>
      
      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 mb-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-6 bg-gray-200 rounded flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

interface CardLoadingProps {
  className?: string;
}

export const CardLoading: React.FC<CardLoadingProps> = ({
  className = "",
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-4" />
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
          <div className="h-3 bg-gray-200 rounded w-4/6" />
        </div>
      </div>
    </div>
  );
};

interface FullPageLoadingProps {
  message?: string;
}

export const FullPageLoading: React.FC<FullPageLoadingProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <LoadingSpinner size="xl" />
      <p className="mt-4 text-lg text-gray-600">{message}</p>
    </div>
  );
};

interface InlineLoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  message = "Loading...",
  size = "md",
}) => {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <LoadingSpinner size={size} />
      <span className="text-gray-600">{message}</span>
    </div>
  );
};

interface ButtonLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  isLoading,
  children,
  loadingText = "Loading...",
  className = "",
  disabled = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`flex items-center justify-center gap-2 ${className} ${
        isLoading || disabled ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {isLoading && <LoadingSpinner size="sm" color="text-current" />}
      {isLoading ? loadingText : children}
    </button>
  );
};

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "mdi:inbox-outline",
  title,
  description,
  action,
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <Icon icon={icon} className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 text-center max-w-md mb-6">{description}</p>
      )}
      {action}
    </div>
  );
};

// Skeleton components for specific use cases
export const OrderCardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="h-4 bg-gray-300 rounded w-1/3" />
        <div className="h-6 bg-gray-300 rounded-full w-20" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  );
};

export const OrderDetailsSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header */}
      <div className="h-8 bg-gray-300 rounded w-1/3" />
      
      {/* Progress tracker */}
      <div className="flex justify-between">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full mb-2" />
            <div className="h-3 bg-gray-200 rounded w-16" />
          </div>
        ))}
      </div>
      
      {/* Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <CardLoading />
          <CardLoading />
        </div>
        <div className="space-y-4">
          <CardLoading />
          <CardLoading />
        </div>
      </div>
    </div>
  );
};
