import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { InputField } from "../shared/form_components/InputField";
import { DropdownField } from "../shared/form_components/Dropdown";
import {
  IStoneFilters,
  STONE_TYPES,
  STONE_COLORS,
} from "../../types/Stone.interface";

interface StoneFiltersProps {
  filters: IStoneFilters;
  onFiltersChange: (filters: IStoneFilters) => void;
  onReset: () => void;
}

const StoneFilters: React.FC<StoneFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
}) => {
  const handleFilterChange = (key: keyof IStoneFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== "" && value !== null
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Icon icon="material-symbols:filter-list" className="w-5 h-5" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="px-3 py-1.5 text-sm border border-gray-300 bg-white text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center gap-1">
            <Icon icon="material-symbols:clear-all" className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <InputField
            label="Search"
            placeholder="Search by name or description..."
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        {/* Stone Type */}
        <div>
          <DropdownField
            label="Stone Type"
            firstInput="All types"
            options={[
              { value: "", label: "All types" },
              ...STONE_TYPES.map((type) => ({
                value: type.value,
                label: type.label,
              })),
            ]}
            value={filters.type || ""}
            onChange={(e) =>
              handleFilterChange("type", e.target.value || undefined)
            }
          />
        </div>

        {/* Color */}
        <div>
          <DropdownField
            label="Color"
            firstInput="All colors"
            options={[
              { value: "", label: "All colors" },
              ...STONE_COLORS.map((color) => ({
                value: color.value,
                label: color.label,
              })),
            ]}
            value={filters.color || ""}
            onChange={(e) =>
              handleFilterChange("color", e.target.value || undefined)
            }
          />
        </div>

        {/* Carat Range */}
        <div>
          <InputField
            label="Min Carat"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={filters.minCarat || ""}
            onChange={(e) =>
              handleFilterChange(
                "minCarat",
                e.target.value ? parseFloat(e.target.value) : undefined
              )
            }
          />
        </div>

        <div>
          <InputField
            label="Max Carat"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={filters.maxCarat || ""}
            onChange={(e) =>
              handleFilterChange(
                "maxCarat",
                e.target.value ? parseFloat(e.target.value) : undefined
              )
            }
          />
        </div>

        {/* Price Range */}
        <div>
          <InputField
            label="Min Price (NPR)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={filters.minPrice || ""}
            onChange={(e) =>
              handleFilterChange(
                "minPrice",
                e.target.value ? parseFloat(e.target.value) : undefined
              )
            }
          />
        </div>

        <div>
          <InputField
            label="Max Price (NPR)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={filters.maxPrice || ""}
            onChange={(e) =>
              handleFilterChange(
                "maxPrice",
                e.target.value ? parseFloat(e.target.value) : undefined
              )
            }
          />
        </div>
      </div>

      {/* Active Status Toggle */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <label className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="isActive"
                checked={filters.isActive === undefined}
                onChange={() => handleFilterChange("isActive", undefined)}
                className="text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-600">All</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="isActive"
                checked={filters.isActive === true}
                onChange={() => handleFilterChange("isActive", true)}
                className="text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-600">Active</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="isActive"
                checked={filters.isActive === false}
                onChange={() => handleFilterChange("isActive", false)}
                className="text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-600">Inactive</span>
            </label>
          </div>
        </label>
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: {filters.search}
                <button
                  onClick={() => handleFilterChange("search", undefined)}
                  className="ml-1 text-blue-600 hover:text-blue-800">
                  <Icon icon="material-symbols:close" className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.type && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Type: {STONE_TYPES.find((t) => t.value === filters.type)?.label}
                <button
                  onClick={() => handleFilterChange("type", undefined)}
                  className="ml-1 text-purple-600 hover:text-purple-800">
                  <Icon icon="material-symbols:close" className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.color && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Color:{" "}
                {STONE_COLORS.find((c) => c.value === filters.color)?.label}
                <button
                  onClick={() => handleFilterChange("color", undefined)}
                  className="ml-1 text-green-600 hover:text-green-800">
                  <Icon icon="material-symbols:close" className="w-3 h-3" />
                </button>
              </span>
            )}
            {(filters.minCarat || filters.maxCarat) && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Carat: {filters.minCarat || 0} - {filters.maxCarat || "∞"}
                <button
                  onClick={() => {
                    handleFilterChange("minCarat", undefined);
                    handleFilterChange("maxCarat", undefined);
                  }}
                  className="ml-1 text-yellow-600 hover:text-yellow-800">
                  <Icon icon="material-symbols:close" className="w-3 h-3" />
                </button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Price: NPR {filters.minPrice || 0} - {filters.maxPrice || "∞"}
                <button
                  onClick={() => {
                    handleFilterChange("minPrice", undefined);
                    handleFilterChange("maxPrice", undefined);
                  }}
                  className="ml-1 text-red-600 hover:text-red-800">
                  <Icon icon="material-symbols:close" className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.isActive !== undefined && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Status: {filters.isActive ? "Active" : "Inactive"}
                <button
                  onClick={() => handleFilterChange("isActive", undefined)}
                  className="ml-1 text-gray-600 hover:text-gray-800">
                  <Icon icon="material-symbols:close" className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoneFilters;
