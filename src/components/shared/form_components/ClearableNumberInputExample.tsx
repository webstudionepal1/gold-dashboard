import React, { useState } from "react";
import { useClearableNumberInput } from "../../../utils/numberInputHelpers";

/**
 * Example component demonstrating the clearable number input behavior
 * Shows "0" initially but allows easy clearing with backspace or focus+select
 */
export const ClearableNumberInputExample: React.FC = () => {
  const [value, setValue] = useState(0);
  
  const numberInput = useClearableNumberInput(value, setValue);

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="mb-2 font-semibold">Clearable Number Input Example</h3>
      <p className="mb-4 text-sm text-gray-600">
        This input shows "0" initially but allows easy clearing:
        <br />• Click and backspace to clear
        <br />• Focus automatically selects all text when value is 0
        <br />• Prevents negative values
        <br />• Blocks invalid characters (e, E, +, -)
      </p>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Example Number Input:
        </label>
        <input
          type="number"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter a number"
          min="0"
          {...numberInput}
        />
        <p className="text-xs text-gray-500">
          Current value: {value} (type: {typeof value})
        </p>
      </div>
    </div>
  );
};
