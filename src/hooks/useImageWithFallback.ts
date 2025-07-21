import { useState, useCallback, useRef } from 'react';

interface UseImageWithFallbackProps {
  src: string;
  fallbackSrc?: string;
}

interface UseImageWithFallbackReturn {
  imageSrc: string;
  isLoading: boolean;
  hasError: boolean;
  handleLoad: () => void;
  handleError: () => void;
}

export const useImageWithFallback = ({
  src,
  fallbackSrc = '/placeholder.svg'
}: UseImageWithFallbackProps): UseImageWithFallbackReturn => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const hasTriedFallback = useRef(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    
    // Only try fallback once to prevent infinite loops
    if (!hasTriedFallback.current && imageSrc !== fallbackSrc) {
      hasTriedFallback.current = true;
      setImageSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
    }
  }, [imageSrc, fallbackSrc]);

  // Reset when src changes
  if (src !== imageSrc && !hasTriedFallback.current) {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
    hasTriedFallback.current = false;
  }

  return {
    imageSrc,
    isLoading,
    hasError,
    handleLoad,
    handleError
  };
};
