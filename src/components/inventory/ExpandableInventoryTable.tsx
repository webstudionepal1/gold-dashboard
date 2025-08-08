import React, { useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { VariantRows, ExpandableRowToggle } from './VariantDropdown';

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

interface InventoryItem {
  _id: string;
  name: string;
  totalStock: number;
  remainingStock: number;
  usedStock: number;
  unit: string;
  reorder_point: number;
  status: 'On Stock' | 'Low Stock' | 'Out of Stock';
  image?: string;
  category?: string;
  subCategory?: string;
  price?: number;
  variants?: ProductVariant[];
  variantCount?: number;
}

interface Column {
  key: string;
  title: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface ExpandableInventoryTableProps {
  data: InventoryItem[];
  columns: Column[];
  loading?: boolean;
}

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

export const ExpandableInventoryTable: React.FC<
  ExpandableInventoryTableProps
> = ({ data, columns, loading = false }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (rowId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId);
    } else {
      newExpanded.add(rowId);
    }
    setExpandedRows(newExpanded);
  };

  const renderCell = (column: Column, item: InventoryItem): React.ReactNode => {
    if (column.key === 'name') {
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{item.name}</span>
          {item.variantCount && item.variantCount > 1 && (
            <>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {item.variantCount} variants
              </span>
              <Icon
                icon={
                  expandedRows.has(item._id)
                    ? 'material-symbols:expand-less'
                    : 'material-symbols:expand-more'
                }
                className="w-4 h-4 text-gray-500 ml-auto"
              />
            </>
          )}
        </div>
      );
    }

    if (column.key === 'price' && item.variants && item.variants.length > 1) {
      const prices = item.variants
        .map((v: any) => v.price || 0)
        .filter((p: number) => p > 0);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      return minPrice === maxPrice
        ? `₹${minPrice}`
        : `₹${minPrice} - ₹${maxPrice}`;
    }

    if (column.key === 'status') {
      return (
        <span
          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
            item.status
          )}`}
        >
          {item.status}
        </span>
      );
    }

    if (column.render) {
      return column.render(item[column.key as keyof InventoryItem], item);
    }

    const value = item[column.key as keyof InventoryItem];
    return value !== undefined && value !== null ? String(value) : '—';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-sm text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <React.Fragment key={item._id}>
                {/* Main product row */}
                <tr
                  className={`hover:bg-gray-50 transition-colors ${
                    item.variants && item.variants.length > 1
                      ? 'cursor-pointer select-none'
                      : ''
                  }`}
                  onClick={() => {
                    if (item.variants && item.variants.length > 1) {
                      toggleRow(item._id);
                    }
                  }}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 text-sm text-center whitespace-nowrap"
                    >
                      {renderCell(column, item)}
                    </td>
                  ))}
                </tr>

                {/* Variant rows */}
                {expandedRows.has(item._id) &&
                  item.variants &&
                  item.variants.length > 1 && (
                    <VariantRows variants={item.variants} columns={columns} />
                  )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
