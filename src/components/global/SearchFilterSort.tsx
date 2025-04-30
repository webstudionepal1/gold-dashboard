import React, { memo, useState } from "react";
import { Icon } from "@iconify/react";

interface SearchFilterSortProps {
  onFilter?: (filter: string) => void;
  onSort: (sort: string) => void;
  filterOptions?: { value: string; label: string }[];
  sortOptions?: { value: string; label: string }[];
  placeholder?: string;
  onViewChange?: (view: "grid" | "column") => void;
  showFilter?: boolean; // Control filter dropdown visibility
  showView?: boolean; // Control view select visibility
  showSort?: boolean; // Control sort dropdown visibility
}

export const SearchFilterSort: React.FC<SearchFilterSortProps> = memo(
  ({
    onFilter,
    onSort,
    filterOptions = [],
    sortOptions = [],
    onViewChange,
    showFilter = true,
    showView = false,
    showSort = true,
  }) => {
    const [selectedFilter, setSelectedFilter] = useState("");
    const [selectedSort, setSelectedSort] = useState("");
    const [view, setView] = useState<"grid" | "column">("grid");

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const filter = e.target.value;
      setSelectedFilter(filter);
      onFilter?.(filter);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const sort = e.target.value;
      setSelectedSort(sort);
      onSort(sort);
    };

    const handleViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newView = e.target.value as "grid" | "column";
      setView(newView);
      if (onViewChange) onViewChange(newView);
    };
    return (
      <div className="container">
        <div className="flex flex-row justify-between gap-4 text-sm md:flex-row ">
          <div className="flex items-center border divide-x-2 rounded-lg">
            {/* Filter Dropdown */}
            {showFilter && filterOptions.length > 0 && (
              <div className="relative flex justify-center w-auto">
                {" "}
                {/* Set equal width */}
                <label htmlFor="filter-select" className="sr-only">
                  Filter
                </label>
                <select
                  id="filter-select"
                  value={selectedFilter}
                  onChange={handleFilterChange}
                  className="w-auto px-3 py-2 pl-8 pr-6 text-sm text-black bg-white outline-none appearance-none"
                >
                  <option value="">Filter</option>
                  {filterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 flex items-center pointer-events-none left-2">
                  <Icon
                    icon="rivet-icons:filter"
                    fontSize={16}
                    className="text-black"
                  />
                </div>
                <div className="absolute inset-y-0 flex items-center pointer-events-none right-2">
                  <Icon
                    icon="mdi:chevron-down"
                    fontSize={16}
                    className="text-black"
                  />
                </div>
              </div>
            )}

            {/* Grid/Column View Select */}
            {showView && (
              <div className="relative flex justify-center w-auto">
                {/* Equal width */}
                <label htmlFor="view-select" className="sr-only">
                  View
                </label>
                <select
                  id="view-select"
                  value={view}
                  onChange={handleViewChange}
                  className="w-auto px-3 py-2 pl-8 pr-6 text-sm text-black bg-white outline-none appearance-none"
                >
                  <option value="grid">Grid</option>
                  <option value="column">Column</option>
                </select>
                <div className="absolute inset-y-0 flex items-center pointer-events-none left-2">
                  <Icon
                    icon={
                      view === "grid" ? "mdi:view-grid-outline" : "mynaui:rows"
                    }
                    fontSize={16}
                    className="text-black"
                  />
                </div>
                <div className="absolute inset-y-0 flex items-center pointer-events-none right-2">
                  <Icon
                    icon="mdi:chevron-down"
                    fontSize={16}
                    className="text-black"
                  />
                </div>
              </div>
            )}

            {/* Sort Dropdown */}
            {showSort && sortOptions.length > 0 && (
              <div className="relative flex justify-center w-auto">
                {/* Equal width */}
                <label htmlFor="sort-select" className="sr-only">
                  Sort
                </label>
                <select
                  id="sort-select"
                  value={selectedSort}
                  onChange={handleSortChange}
                  className="w-auto px-3 py-2 pl-8 pr-6 text-sm text-black bg-white outline-none appearance-none"
                >
                  <option value="">Sort</option>
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 flex items-center pointer-events-none left-2">
                  <Icon
                    icon="lucide:sort-desc"
                    fontSize={16}
                    className="text-black"
                  />
                </div>
                <div className="absolute inset-y-0 flex items-center pointer-events-none right-2">
                  <Icon
                    icon="mdi:chevron-down"
                    className="text-lg text-black"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);
