# Backend Error Message Display Guide

This guide explains how to properly display backend error messages in toast notifications throughout the project.

## Overview

The new error handling system automatically extracts and displays the actual backend error messages in toast notifications, providing users with meaningful feedback instead of generic error messages.

## Key Files

- `src/utils/errorHandler.ts` - Main error handling utilities
- `src/server/utils/api-config.ts` - Updated generic API hooks
- `src/server/utils/ApiGateway.ts` - Updated to pass full error objects

## Backend Error Response Structure

The backend returns errors in this format:
```json
{
  "success": false,
  "message": "General error message",
  "error": [
    {
      "field": "email",
      "message": "Email already exists"
    }
  ]
}
```

## Usage

### 1. For New API Hooks

```typescript
import { handleMutationError, handleMutationSuccess } from "../../utils/errorHandler";

export const useCreateSomethingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      return apiClient.post("something", data);
    },
    onSuccess: () => {
      handleMutationSuccess("Item created successfully");
      queryClient.invalidateQueries({ queryKey: ["something"] });
    },
    onError: (error: any) => {
      handleMutationError(error, "Error creating item");
    },
  });
};
```

### 2. For Existing API Hooks

Replace old error handling:
```typescript
// OLD WAY ❌
onError: (err: string) => {
  toast.error(err || "Generic error message");
}

// NEW WAY ✅
onError: (err: any) => {
  handleMutationError(err, "Error creating item");
}
```

### 3. For Custom Error Handling

```typescript
import { extractErrorMessage, showErrorToast } from "../../utils/errorHandler";

try {
  await someApiCall();
} catch (error) {
  // Option 1: Show toast automatically
  showErrorToast(error, "Custom fallback message");
  
  // Option 2: Extract message for custom handling
  const errorMessage = extractErrorMessage(error);
  console.log("Error:", errorMessage);
  // Handle the error message as needed
}
```

## Available Functions

### `handleMutationError(error, customMessage?)`
- Automatically extracts backend error and shows toast
- `customMessage` is used as prefix: "Custom Message: Backend Error"

### `handleMutationSuccess(message)`
- Shows success toast with the provided message

### `extractErrorMessage(error)`
- Extracts the most relevant error message from backend response
- Returns string message for custom handling

### `showErrorToast(error, fallbackMessage?)`
- Shows error toast with extracted backend message
- Uses fallbackMessage if extraction fails

## Error Message Priority

The system extracts error messages in this priority order:

1. **Detailed field errors**: `error[0].message` (e.g., "Email already exists")
2. **General message**: `message` (e.g., "Validation error")
3. **String error**: Direct string error
4. **Network errors**: Special handling for network/timeout issues
5. **Fallback**: Generic error message

## Migration Status

### ✅ Updated Files
- `src/server/utils/api-config.ts` - Generic API hooks
- `src/server/utils/ApiGateway.ts` - Error interceptor
- `src/server/api/productHooks.tsx` - Product mutations
- `src/server/api/purchaseHooks.tsx` - Purchase mutations
- `src/server/api/expensesHook.tsx` - Expense mutations

### 🔄 Files to Update
Apply the same pattern to other API hook files:
- `src/server/api/supplierHooks.tsx`
- `src/server/api/orderHooks.tsx`
- `src/server/api/customerHooks.tsx`
- Any other custom API hooks

## Benefits

1. **User-Friendly**: Shows actual backend validation messages
2. **Consistent**: Standardized error handling across the app
3. **Maintainable**: Centralized error extraction logic
4. **Flexible**: Works with various backend error formats
5. **Debugging**: Better error logging and handling

## Example Backend Errors Now Displayed

- ✅ "Email already exists" (instead of "Error creating user")
- ✅ "Product name is required" (instead of "Validation error")
- ✅ "Insufficient stock available" (instead of "Error updating order")
- ✅ "Invalid phone number format" (instead of "Error creating supplier")

## Testing

To test the error handling:
1. Try creating duplicate entries (email, product name, etc.)
2. Submit forms with invalid data
3. Check that specific backend validation messages appear in toasts
4. Verify network error handling works properly

This system ensures users see meaningful error messages that help them understand and fix issues, rather than generic technical errors.
