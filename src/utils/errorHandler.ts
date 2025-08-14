import { toast } from "react-toastify";

/**
 * Handles mutation errors with consistent error messaging
 * @param error - The error object from the mutation
 * @param defaultMessage - Default message to show if error parsing fails
 */
export const handleMutationError = (error: unknown, defaultMessage: string = "An error occurred") => {
  let errorMessage = defaultMessage;

  if (error && typeof error === 'object') {
    // Handle Axios error response
    if ('response' in error && error.response && typeof error.response === 'object') {
      const response = error.response as { data?: { message?: string; error?: string } };
      if (response.data?.message) {
        errorMessage = response.data.message;
      } else if (response.data?.error) {
        errorMessage = response.data.error;
      }
    }
    // Handle error with message property
    else if ('message' in error && typeof error.message === 'string') {
      errorMessage = error.message;
    }
  }
  // Handle string errors
  else if (typeof error === 'string') {
    errorMessage = error;
  }

  toast.error(errorMessage);
  console.error('Mutation error:', error);
};

/**
 * Handles mutation success with consistent success messaging
 * @param message - Success message to display
 * @param data - Optional data from the successful mutation
 */
export const handleMutationSuccess = (message: string, data?: unknown) => {
  toast.success(message);
  if (data) {
    console.log('Mutation success:', data);
  }
};

/**
 * Capitalizes the first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export const capitalize = (str: string): string => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};