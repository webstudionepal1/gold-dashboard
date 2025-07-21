import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SafeImage from '../SafeImage';

// Mock the useImageWithFallback hook
vi.mock('../../hooks/useImageWithFallback', () => ({
  useImageWithFallback: vi.fn()
}));

import { useImageWithFallback } from '../../hooks/useImageWithFallback';

const mockUseImageWithFallback = useImageWithFallback as vi.MockedFunction<typeof useImageWithFallback>;

describe('SafeImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders image when loading is complete and no error', () => {
    mockUseImageWithFallback.mockReturnValue({
      imageSrc: 'test-image.jpg',
      isLoading: false,
      hasError: false,
      handleLoad: vi.fn(),
      handleError: vi.fn()
    });

    render(<SafeImage src="test-image.jpg" alt="Test image" />);
    
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test image');
  });

  it('shows loading placeholder when showLoadingPlaceholder is true and isLoading is true', () => {
    mockUseImageWithFallback.mockReturnValue({
      imageSrc: 'test-image.jpg',
      isLoading: true,
      hasError: false,
      handleLoad: vi.fn(),
      handleError: vi.fn()
    });

    render(<SafeImage src="test-image.jpg" alt="Test image" showLoadingPlaceholder={true} />);
    
    // Should show loading placeholder (SVG icon)
    const loadingIcon = screen.getByRole('img', { hidden: true });
    expect(loadingIcon).toBeInTheDocument();
  });

  it('shows error component when hasError is true and errorComponent is provided', () => {
    mockUseImageWithFallback.mockReturnValue({
      imageSrc: 'test-image.jpg',
      isLoading: false,
      hasError: true,
      handleLoad: vi.fn(),
      handleError: vi.fn()
    });

    const errorComponent = <div data-testid="error">Failed to load image</div>;
    render(<SafeImage src="test-image.jpg" alt="Test image" errorComponent={errorComponent} />);
    
    expect(screen.getByTestId('error')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('calls handleLoad and handleError from hook', () => {
    const mockHandleLoad = vi.fn();
    const mockHandleError = vi.fn();

    mockUseImageWithFallback.mockReturnValue({
      imageSrc: 'test-image.jpg',
      isLoading: false,
      hasError: false,
      handleLoad: mockHandleLoad,
      handleError: mockHandleError
    });

    render(<SafeImage src="test-image.jpg" alt="Test image" />);
    
    const image = screen.getByRole('img');
    
    fireEvent.load(image);
    expect(mockHandleLoad).toHaveBeenCalledTimes(1);
    
    fireEvent.error(image);
    expect(mockHandleError).toHaveBeenCalledTimes(1);
  });
});
