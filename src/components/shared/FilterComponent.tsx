import React, { memo, useState } from "react";
import { Icon } from "@iconify/react";

interface FilterSortProps {
  onFilter?: (filter: string) => void; // Optional filter handler
  onSort?: (sort: string) => void; // Optional sort handler
  filterOptions?: { value: string; label: string }[];
  sortOptions?: { value: string; label: string }[];
  onViewChange?: (view: "grid" | "column") => void;
  showFilter?: boolean; // Control filter dropdown visibility
  showView?: boolean; // Control view select visibility
  showSort?: boolean; // Control sort dropdown visibility
  defaultFilter?: string; // Default filter value
  defaultSort?: string; // Default sort value
  defaultView?: "grid" | "column"; // Default view
}

export const FilterComponent: React.FC<FilterSortProps> = memo(({
  onFilter,
  onSort,
  filterOptions = [],
  sortOptions = [],
  onViewChange,
  showFilter = true,
  showView = true,
  showSort = true,
  defaultFilter = "",
  defaultSort = "",
  defaultView = "grid"
}) => {
  const [selectedFilter, setSelectedFilter] = useState(defaultFilter);
  const [selectedSort, setSelectedSort] = useState(defaultSort);
  const [view, setView] = useState<"grid" | "column">(defaultView);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filter = e.target.value;
    setSelectedFilter(filter);
    if (onFilter) onFilter(filter);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value;
    setSelectedSort(sort);
    if (onSort) onSort(sort);
  };

  const handleViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newView = e.target.value as "grid" | "column";
    setView(newView);
    if (onViewChange) onViewChange(newView);
  };
  
  // Check if we should render the component at all
  const shouldRenderFilter = showFilter && filterOptions.length > 0 && onFilter;
  const shouldRenderSort = showSort && sortOptions.length > 0 && onSort;
  const shouldRenderView = showView && onViewChange;
  
  // If nothing to render, return null
  if (!shouldRenderFilter && !shouldRenderSort && !shouldRenderView) {
    return null;
  }
  
  return (
    <div className="container my-4">
      <div className="flex flex-row justify-between gap-4 text-sm md:flex-row">
        <div className="flex items-center border divide-x-2 rounded-lg">
          {/* Filter Dropdown */}
          {shouldRenderFilter && (
            <div className="relative flex justify-center w-auto">
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
          {shouldRenderView && (
            <div className="relative flex justify-center w-auto">
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
          {shouldRenderSort && (
            <div className="relative flex justify-center w-auto">
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
                <Icon icon="mdi:chevron-down" className="text-lg text-black" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

// Example usage:
// const filteredAndSortedData = filterAndSort(data, {
//   filter: {
//     value: "pending",
//     field: "status"
//   },
//   sort: {
//     value: "date-newest",
//     compareFunctions: {
//       "date-newest": (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//     }
//   }
// });