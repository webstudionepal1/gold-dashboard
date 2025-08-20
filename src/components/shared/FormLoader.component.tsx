import clsx from 'clsx';

interface FormLoaderProps {
  isLoading?: boolean;
  message?: string;
  className?: string;
  variant?: 'overlay' | 'modal' | 'linear';
}

export function FormLoader({
  isLoading = true,
  message = 'Processing...',
  className,
  variant = 'overlay',
}: FormLoaderProps) {
  if (!isLoading) return null;

  if (variant === 'linear') {
    return (
      <div className={clsx('absolute top-0 left-0 right-0 z-20', className)}>
        {/* Progress bar container */}
        <div className="h-1 bg-white dark:bg-orange overflow-hidden">
          <div className="h-full bg-gradient-to-r from-fade-yellow via-yellow to-white animate-pulse">
            <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite] w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  const containerClasses =
    variant === 'modal'
      ? 'absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center'
      : 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center';

  return (
    <div className={clsx(containerClasses, className)}>
      <div className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-2xl border border-yellow-200 dark:border-yellow-800">
        <div className="flex flex-col items-center space-y-4">
          {/* Gold spinning ring loader */}
          <div className="relative">
            <div className="w-12 h-12 border-4 border-yellow-100 dark:border-yellow-900 rounded-full animate-spin">
              <div className="absolute inset-0 border-4 border-transparent border-t-yellow-500 rounded-full animate-spin"></div>
            </div>
            {/* Inner pulsing dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Loading message */}
          <div className="text-center">
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              {message}
            </p>
            {/* Animated dots */}
            <div className="flex justify-center space-x-1 mt-2">
              <div className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
