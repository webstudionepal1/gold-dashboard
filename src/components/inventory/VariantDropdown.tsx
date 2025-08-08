import React, { useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

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

interface ExpandableRowProps {
  variants: ProductVariant[];
  productName: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const getStockStatus = (
  remainingStock: number,
  totalStock: number,
  reorderPoint?: number
): 'On Stock' | 'Low Stock' | 'Out of Stock' => {
  if (remainingStock <= 0) return 'Out of Stock';
  const threshold = reorderPoint || Math.floor(totalStock * 0.2);
  return remainingStock <= threshold ? 'Low Stock' : 'On Stock';
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'On Stock':
      return 'bg-green text-white';
    case 'Low Stock':
      return 'bg-yellow text-white';
    case 'Out of Stock':
      return 'bg-red text-white';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const ExpandableRowToggle: React.FC<ExpandableRowProps> = ({
  variants,
  productName,
  isExpanded,
  onToggle,
}) => {
  if (!variants || variants.length <= 1) {
    return null;
  }

  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
    >
      <Icon
        icon={
          isExpanded
            ? 'material-symbols:expand-less'
            : 'material-symbols:expand-more'
        }
        className="w-4 h-4"
      />
      {isExpanded ? 'Hide' : 'Show'} Variants ({variants.length})
    </button>
  );
};

export const VariantRows: React.FC<{
  variants: ProductVariant[];
  columns: any[];
}> = ({ variants, columns }) => {
  return (
    <>
      {variants.map((variant, index) => {
        const status = getStockStatus(
          variant.remainingStock,
          variant.totalStock,
          variant.reorderPoint
        );

        return (
          <tr
            key={variant._id || `variant-${index}`}
            className="bg-blue-50/30 border-l-4 border-blue-200"
          >
            {columns.map((column) => {
              let cellContent;

              switch (column.key) {
                case 'name':
                  cellContent = (
                    <div className="flex items-center gap-2 pl-8">
                      <Icon
                        icon="material-symbols:subdirectory-arrow-right"
                        className="w-4 h-4 text-gray-400"
                      />
                      <div className="text-sm">
                        <div className="font-medium text-gray-700">
                          {variant.sku
                            ? `SKU: ${variant.sku}`
                            : `Variant ${index + 1}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          Weight: {variant.wt}g
                        </div>
                      </div>
                    </div>
                  );
                  break;
                case 'category':
                  cellContent = (
                    <span className="text-gray-400 text-sm">—</span>
                  );
                  break;
                case 'price':
                  cellContent = `₹${variant.price}`;
                  break;
                case 'unit':
                  cellContent = variant.unit;
                  break;
                case 'totalStock':
                  cellContent = variant.totalStock;
                  break;
                case 'remainingStock':
                  cellContent = variant.remainingStock;
                  break;
                case 'usedStock':
                  cellContent = variant.usedStock;
                  break;
                case 'reorder_point':
                  cellContent = variant.reorderPoint;
                  break;
                case 'status':
                  cellContent = (
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                  );
                  break;
                default:
                  cellContent = '—';
              }

              return (
                <td
                  key={column.key}
                  className="px-6 py-3 text-sm text-center whitespace-nowrap"
                >
                  {cellContent}
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
};
