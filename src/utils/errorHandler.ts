import { toast } from "react-toastify";

/**
 * Interface for backend error response structure
 */
interface BackendErrorResponse {
  success: boolean;
  message: string;
  error?: Array<{
    field?: string;
    message: string;
  }> | string;
}

/**
 * Interface for axios error structure
 */
interface AxiosError {
  response?: {
    data?: BackendErrorResponse;
    status?: number;
  };
  message?: string;
  code?: string;
}

/**
 * Extracts the most relevant error message from backend response
 * @param error - The error object from API call
 * @returns The formatted error message string
 */
export const extractErrorMessage = (error: any): string => {
  // Handle string errors directly
  if (typeof error === "string") {
    return error;
  }

  // Handle axios errors
  if (error?.response?.data) {
    const errorData = error.response.data as BackendErrorResponse;
    
    // If there's a specific error array with detailed messages
    if (errorData.error && Array.isArray(errorData.error) && errorData.error.length > 0) {
      // Return the first error message, or combine multiple if needed
      const firstError = errorData.error[0];
      if (typeof firstError === "object" && firstError.message) {
        return firstError.message;
      }
      if (typeof firstError === "string") {
        return firstError;
      }
    }

    // If there's a general message
    if (errorData.message) {
      return errorData.message;
    }

    // If error is a string
    if (typeof errorData.error === "string") {
      return errorData.error;
    }
  }

  // Handle direct error object (not wrapped in axios response)
  if (error?.error && Array.isArray(error.error) && error.error.length > 0) {
    const firstError = error.error[0];
    if (typeof firstError === "object" && firstError.message) {
      return firstError.message;
    }
    if (typeof firstError === "string") {
      return firstError;
    }
  }

  // Handle direct message property
  if (error?.message) {
    return error.message;
  }

  // Handle network errors
  if (error?.code === "NETWORK_ERROR" || error?.code === "ERR_NETWORK") {
    return "Network error. Please check your internet connection.";
  }

  // Handle timeout errors
  if (error?.code === "ECONNABORTED") {
    return "Request timeout. Please try again.";
  }

  // Default fallback
  return "An unexpected error occurred. Please try again.";
};

/**
 * Shows error toast with properly extracted backend message
 * @param error - The error object from API call
 * @param fallbackMessage - Optional fallback message if extraction fails
 */
export const showErrorToast = (error: any, fallbackMessage?: string): void => {
  const errorMessage = extractErrorMessage(error);
  const finalMessage = errorMessage || fallbackMessage || "An error occurred";
  
  toast.error(finalMessage);
};

/**
 * Shows success toast
 * @param message - Success message to display
 */
export const showSuccessToast = (message: string): void => {
  toast.success(message);
};

/**
 * Shows info toast
 * @param message - Info message to display
 */
export const showInfoToast = (message: string): void => {
  toast.info(message);
};

/**
 * Shows warning toast
 * @param message - Warning message to display
 */
export const showWarningToast = (message: string): void => {
  toast.warning(message);
};

/**
 * Dismisses all active toasts
 */
export const dismissAllToasts = (): void => {
  toast.dismiss();
};

/**
 * Enhanced error handler for mutations with automatic toast display
 * @param error - The error object from API call
 * @param customMessage - Optional custom error message prefix
 */
export const handleMutationError = (error: any, customMessage?: string): void => {
  const extractedMessage = extractErrorMessage(error);
  const finalMessage = customMessage 
    ? `${customMessage}: ${extractedMessage}`
    : extractedMessage;
  
  toast.error(finalMessage);
};

/**
 * Enhanced success handler for mutations with automatic toast display
 * @param message - Success message to display
 */
export const handleMutationSuccess = (message: string): void => {
  toast.success(message);
};
