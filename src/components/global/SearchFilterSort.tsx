import React, { useState } from 'react';
import { Icon } from '@iconify/react';

interface SearchFilterSortProps {
    onSearch: (query: string) => void;
    onFilter: (filter: string) => void;
    onSort: (sort: string) => void;
    filterOptions?: { value: string; label: string }[];
    sortOptions?: { value: string; label: string }[];
    placeholder?: string;
}

export const SearchFilterSort: React.FC<SearchFilterSortProps> = ({
    onSearch,
    onFilter,
    onSort,
    filterOptions = [],
    sortOptions = [],
    placeholder = 'Search...'
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('');
    const [selectedSort, setSelectedSort] = useState('');

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

    return (
        <div className="flex flex-row md:flex-row gap-4 mb-6">
            {/* Search Input */}
            <div className="relative flex-grow">
                <div className="absolute inset-y-0  left-0 pl-3 flex items-center pointer-events-none">
                    <Icon icon="mdi:magnify" className="text-gray-400" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder={placeholder}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Filter Dropdown */}
            {filterOptions.length > 0 && (
                <div className="relative w-full md:w-auto">
                    <label htmlFor="filter-select" className="sr-only">Filter</label>
                    <select
                        id="filter-select"
                        value={selectedFilter}
                        onChange={handleFilterChange}
                        className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Filter</option>
                        {filterOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon icon="mdi:filter-outline" className="text-gray-400" />
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                        <Icon icon="mdi:chevron-down" className="text-gray-400" />
                    </div>
                </div>
            )}

            {/* Sort Dropdown */}
            {sortOptions.length > 0 && (
                <div className="relative w-full md:w-auto">
                    <label htmlFor="sort-select" className="sr-only">Filter</label>
                    <select
                        id='sort-select'
                        value={selectedSort}
                        onChange={handleSortChange}
                        className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Sort</option>
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon icon="mdi:sort" className="text-gray-400" />
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                        <Icon icon="mdi:chevron-down" className="text-gray-400" />
                    </div>
                </div>
            )
            }
        </div >
    );
};