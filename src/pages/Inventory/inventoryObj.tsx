import React from "react";
import { VariantDropdown } from "../../components/inventory/VariantDropdown";

export const inventoryColumns = [
  { key: "sn", title: "S.N" },
  {
    key: "item",
    title: "Items",
  },
  { key: "wt", title: "Weight" },
  { key: "unit", title: "Unit" },
  { key: "price", title: "Price" },
  { key: "totalStock", title: "Total Stock" },
  { key: "remainingStock", title: "Ramaining Stock" },
  {
    key: "status",
    title: "Status",
  },
];
export const columns = [
  {
    key: "name",
    title: "Items",
    render: (value: any, row: any) => (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">{value}</span>
          {row.variantCount > 1 && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {row.variantCount} variants
            </span>
          )}
        </div>
        {row.variants && row.variants.length > 1 && (
          <VariantDropdown variants={row.variants} productName={value} />
        )}
      </div>
    ),
  },
  { key: "category", title: "Category" },
  {
    key: "price",
    title: "Price (Rs)",
    render: (value: any, row: any) => {
      if (row.variants && row.variants.length > 1) {
        const prices = row.variants
          .map((v: any) => v.price || 0)
          .filter((p: number) => p > 0);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        return minPrice === maxPrice
          ? `₹${minPrice}`
          : `₹${minPrice} - ₹${maxPrice}`;
      }
      return `₹${value || 0}`;
    },
  },
  { key: "unit", title: "Unit" },
  { key: "totalStock", title: "Total Stock" },
  { key: "remainingStock", title: "Remaining" },
  { key: "usedStock", title: "Used" },
  { key: "reorder_point", title: "Reorder Point" },
  { key: "status", title: "Status" },
];
