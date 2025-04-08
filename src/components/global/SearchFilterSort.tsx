import React, { useState } from "react";
import { Icon } from "@iconify/react";

interface SearchFilterSortProps {
  onSearch: (query: string) => void;
  onFilter: (filter: string) => void;
  onSort: (sort: string) => void;
  filterOptions?: { value: string; label: string }[];
  sortOptions?: { value: string; label: string }[];
  placeholder?: string;
  onViewChange?: (view: "grid" | "column") => void;
  showSearch?: boolean; // Control search input visibility
  showFilter?: boolean; // Control filter dropdown visibility
  showView?: boolean; // Control view select visibility
  showSort?: boolean; // Control sort dropdown visibility
}

export const SearchFilterSort: React.FC<SearchFilterSortProps> = ({
  onSearch,
  onFilter,
  onSort,
  filterOptions = [],
  sortOptions = [],
  placeholder = "Search",
  onViewChange,
  showSearch = true, // Default to true for each
  showFilter = true,
  showView = true,
  showSort = true,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [view, setView] = useState<"grid" | "column">("grid");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filter = e.target.value;
    setSelectedFilter(filter);
    onFilter(filter);
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
    <div className="container my-4">
      <div className="flex  justify-between flex-row gap-x-40 md:flex-row">
        {/* Search Input */}
        <div className="flex flex-row w-full">
          {showSearch && (
            <div className="relative flex-grow ">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon
                  icon="mynaui:search"
                  fontSize={16}
                  className="text-gray-400 size-auto"
                />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={placeholder}
                className="pl-10 pr-4 py-3 border rounded-md w-full  text-sm  text-fade-black outline-none"
              />
            </div>
          )}
        </div>

        <div className="flex items-center divide-x-2 border rounded-lg">
          {/* Filter Dropdown */}
          {showFilter && filterOptions.length > 0 && (
            <div className="relative w-auto flex justify-center">
              {" "}
              {/* Set equal width */}
              <label htmlFor="filter-select" className="sr-only">
                Filter
              </label>
              <select
                id="filter-select"
                value={selectedFilter}
                onChange={handleFilterChange}
                className="appearance-none pl-8 pr-6  w-auto text-sm text-black outline-none"
              >
                <option value="">Filter</option>
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                <Icon
                  icon="rivet-icons:filter"
                  fontSize={16}
                  className="text-black"
                />
              </div>
              <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
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
            <div className="relative w-auto flex justify-center">
              {" "}
              {/* Equal width */}
              <label htmlFor="view-select" className="sr-only">
                View
              </label>
              <select
                id="view-select"
                value={view}
                onChange={handleViewChange}
                className="appearance-none pl-8 pr-6  w-auto text-sm outline-none text-black"
              >
                <option value="grid">Grid</option>
                <option value="column">Column</option>
              </select>
              <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                <Icon
                  icon={
                    view === "grid" ? "mdi:view-grid-outline" : "mynaui:rows"
                  }
                  fontSize={16}
                  className="text-black"
                />
              </div>
              <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
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
            <div className="relative w-auto flex justify-center">
              {" "}
              {/* Equal width */}
              <label htmlFor="sort-select" className="sr-only">
                Sort
              </label>
              <select
                id="sort-select"
                value={selectedSort}
                onChange={handleSortChange}
                className="appearance-none pl-8 pr-6  w-auto text-sm outline-none text-black"
              >
                <option value="">Sort</option>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                <Icon
                  icon="lucide:sort-desc"
                  fontSize={16}
                  className="text-black"
                />
              </div>
              <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                <Icon icon="mdi:chevron-down" className="text-black text-lg" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
