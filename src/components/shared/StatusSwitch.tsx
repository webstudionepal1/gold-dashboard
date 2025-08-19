import React, { useState } from 'react';

interface StatusSwitchProps {
  isActive: boolean;
  onToggle: (newStatus: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusSwitch: React.FC<StatusSwitchProps> = ({
  isActive,
  onToggle,
  disabled = false,
  size = 'sm',
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    try {
      await onToggle(!isActive);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: {
      container: 'w-10 h-5',
      toggle: 'w-4 h-4',
      translate: isActive ? 'translate-x-5' : 'translate-x-0.5',
    },
    md: {
      container: 'w-12 h-6',
      toggle: 'w-5 h-5',
      translate: isActive ? 'translate-x-6' : 'translate-x-0.5',
    },
    lg: {
      container: 'w-14 h-7',
      toggle: 'w-6 h-6',
      translate: isActive ? 'translate-x-7' : 'translate-x-0.5',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled || isLoading}
        className={`
          relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
          ${currentSize.container}
          ${
            isActive
              ? 'bg-amber-500 hover:bg-amber-600'
              : 'bg-gray-200 hover:bg-gray-300'
          }
          ${
            disabled || isLoading
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer'
          }
        `}
        aria-pressed={isActive}
        aria-label={`Toggle status ${isActive ? 'off' : 'on'}`}
      >
        <span
          className={`
            inline-block rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out
            ${currentSize.toggle}
            ${currentSize.translate}
            ${isLoading ? 'animate-pulse' : ''}
          `}
        />
      </button>

      {/* <span
        className={`text-xs font-medium ${
          isActive ? "text-green-600" : "text-gray-500"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span> */}
    </div>
  );
};
