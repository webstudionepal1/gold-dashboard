import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

interface ProductVariant {
  _id?: string;
  sku?: string;
  price: number;
  wt: number;
  unit: string;
  totalStock: number;
  usedStock: number;
  remainingStock: number;
  reorderPoint: number;
  isActive?: boolean;
}

interface VariantDropdownProps {
  variants: ProductVariant[];
  productName: string;
}

const getStockStatus = (
  remainingStock: number,
  totalStock: number,
  reorderPoint?: number
): "On Stock" | "Low Stock" | "Out of Stock" => {
  if (remainingStock <= 0) return "Out of Stock";
  const threshold = reorderPoint || Math.floor(totalStock * 0.2);
  return remainingStock <= threshold ? "Low Stock" : "On Stock";
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "On Stock":
      return "bg-green-100 text-green-800";
    case "Low Stock":
      return "bg-yellow-100 text-yellow-800";
    case "Out of Stock":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const VariantDropdown: React.FC<VariantDropdownProps> = ({
  variants,
  productName,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!variants || variants.length <= 1) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
      >
        <Icon icon="material-symbols:expand-more" className="w-4 h-4" />
        View Variants ({variants.length})
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
            <div className="p-3 border-b border-gray-100">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <Icon icon="material-symbols:inventory" className="w-4 h-4 text-blue-600" />
                {productName} - Variants
              </h4>
            </div>
            
            <div className="p-2 space-y-2">
              {variants.map((variant, index) => {
                const status = getStockStatus(
                  variant.remainingStock,
                  variant.totalStock,
                  variant.reorderPoint
                );
                
                return (
                  <div
                    key={variant._id || `variant-${index}`}
                    className="p-3 bg-gray-50 rounded-md border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        {variant.sku && (
                          <p className="text-xs text-gray-500 mb-1">
                            SKU: {variant.sku}
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            ₹{variant.price}
                          </span>
                          <span className="text-xs text-gray-500">
                            {variant.wt}g
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-gray-500">Total Stock</p>
                        <p className="font-medium">{variant.totalStock}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Remaining</p>
                        <p className="font-medium">{variant.remainingStock}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Used</p>
                        <p className="font-medium">{variant.usedStock}</p>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex justify-between items-center text-xs">
                      <span className="text-gray-500">
                        Unit: {variant.unit}
                      </span>
                      <span className="text-gray-500">
                        Reorder: {variant.reorderPoint}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
