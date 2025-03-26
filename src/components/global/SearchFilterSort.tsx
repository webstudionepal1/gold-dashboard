import React, { useState } from 'react';
import { Icon } from '@iconify/react';

interface SearchFilterSortProps {
    onSearch: (query: string) => void;
    onFilter: (filter: string) => void;
    onSort: (sort: string) => void;
    filterOptions?: { value: string; label: string }[];
    sortOptions?: { value: string; label: string }[];
    placeholder?: string;
    onViewChange?: (view: 'grid' | 'column') => void;
    showSearch?: boolean; // Control search input visibility
    showFilter?: boolean; // Control filter dropdown visibility
    showView?: boolean;   // Control view select visibility
    showSort?: boolean;   // Control sort dropdown visibility
}

export const SearchFilterSort: React.FC<SearchFilterSortProps> = ({
    onSearch,
    onFilter,
    onSort,
    filterOptions = [],
    sortOptions = [],
    placeholder = 'Search...',
    onViewChange,
    showSearch = true,  // Default to true for each
    showFilter = true,
    showView = true,
    showSort = true,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('');
    const [selectedSort, setSelectedSort] = useState('');
    const [view, setView] = useState<'grid' | 'column'>('grid');

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
        const newView = e.target.value as 'grid' | 'column';
        setView(newView);
        if (onViewChange) onViewChange(newView);
    };
    return (
        <div className="flex flex-col w-full mb-6">
            <div className="flex flex-col md:flex-row gap-4 w-full">
                {/* Search Input */}
                {showSearch && (
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icon icon="mdi:magnify" fontSize={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder={placeholder}
                            className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-fade-black"
                        />
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-4">
                    {/* Filter Dropdown */}
                    {showFilter && filterOptions.length > 0 && (
                        <div className="relative w-full md:w-auto">
                            <label htmlFor="filter-select" className="sr-only">Filter</label>
                            <select
                                id="filter-select"
                                value={selectedFilter}
                                onChange={handleFilterChange}
                                className="appearance-none pl-10 pr-8 py-3 border border-gray-300 rounded-lg w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-fade-black"
                            >
                                <option value="">Filter</option>
                                {filterOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Icon icon="mdi:filter-outline" fontSize={16} className="text-gray-400" />
                            </div>
                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                                <Icon icon="mdi:chevron-down" fontSize={16} className="text-gray-400" />
                            </div>
                        </div>
                    )}

                    {/* Grid/Column View Select */}
                    {showView && (
                        <div className="relative w-full md:w-auto">
                            <label htmlFor="view-select" className="sr-only">View</label>
                            <select
                                id="view-select"
                                value={view}
                                onChange={handleViewChange}
                                className="appearance-none pl-10 pr-8 py-3 border border-gray-300 rounded-lg w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-fade-black"
                            >
                                <option value="grid">Grid</option>
                                <option value="column">Column</option>
                            </select>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Icon
                                    icon={view === 'grid' ? 'mdi:view-grid-outline' : 'mdi:view-column-outline'}
                                    fontSize={16}
                                    className="text-gray-400"
                                />
                            </div>
                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                                <Icon icon="mdi:chevron-down" fontSize={16} className="text-gray-400" />
                            </div>
                        </div>
                    )}

                    {/* Sort Dropdown */}
                    {showSort && sortOptions.length > 0 && (
                        <div className="relative w-full md:w-auto">
                            <label htmlFor="sort-select" className="sr-only">Sort</label>
                            <select
                                id="sort-select"
                                value={selectedSort}
                                onChange={handleSortChange}
                                className="appearance-none pl-10 pr-8 py-3 border border-gray-300 rounded-lg w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-fade-black"
                            >
                                <option value="">Sort</option>
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Icon icon="mdi:sort" fontSize={16} className="text-gray-400" />
                            </div>
                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                                <Icon icon="mdi:chevron-down" fontSize={16} className="text-gray-400" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};