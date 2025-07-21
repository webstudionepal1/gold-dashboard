import React from 'react';
import { useImageWithFallback } from '../../hooks/useImageWithFallback';

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'onLoad' | 'onError'> {
  src: string;
  fallbackSrc?: string;
  showLoadingPlaceholder?: boolean;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc = '/placeholder.svg',
  showLoadingPlaceholder = false,
  loadingComponent,
  errorComponent,
  className = '',
  alt = '',
  ...props
}) => {
  const { imageSrc, isLoading, hasError, handleLoad, handleError } = useImageWithFallback({
    src,
    fallbackSrc
  });

  if (hasError && errorComponent) {
    return <>{errorComponent}</>;
  }

  if (isLoading && showLoadingPlaceholder) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }
    
    return (
      <div className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}>
        <svg
          className="w-6 h-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <img
      {...props}
      src={imageSrc}
      alt={alt}
      className={className}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
};

export default SafeImage;
