import React, { useState, useEffect, useCallback, ReactNode } from "react";
import { debounce } from "lodash"; // Make sure this import is included
import clsx from "clsx";
import TableAction from "./_table/TableAction";

// Define proper TypeScript interfaces
interface Column {
  key: string;
  title: string;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

interface Row {
  id?: string | number;
  [key: string]: any;
}

interface MasterTableProps {
  rows?: Row[];
  columns?: Column[];
  entriesPerPage?: number;
  canSearch?: boolean;
  canSelect?: boolean;
  onMultipleDelete?: (ids: Array<string | number>) => void;
  onDelete?: (id: string) => void;
  apiPagination?: boolean;
  totalItems?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  onSearch?: (searchTerm: string) => void;
  loading?: boolean;
  showTopPageSelector?: boolean;
  filterSection?: ReactNode;
  tabsOptions?: ReactNode;
  showAction?: boolean;
  viewAction?: (row: any) => void;
  toggleAction?: (row: any) => void;
  editAction?: (row: any) => void;
  returnAction?: (row: any) => void;
  emptyStateMessage?: string;
  printAction?: (row: any) => void;
  mainClassName?:string;
}

const MasterTable: React.FC<MasterTableProps> = ({
  rows = [],
  columns = [],
  entriesPerPage = 5,
  canSearch = true,
  canSelect = false,
  onMultipleDelete,
  onDelete,
  apiPagination = false,
  totalItems = 0,
  onPageChange,
  onSearch,
  loading = false,
  filterSection,
  tabsOptions,
  showAction = false,
  viewAction,
  toggleAction,
  editAction,
  returnAction,
  printAction,
  mainClassName,
  emptyStateMessage = "No data available",
}) => {
  // State
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize] = useState<number>(entriesPerPage);
  const [filteredRows, setFilteredRows] = useState<Row[]>(rows);
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set()
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

  // Create a debounced search function only once
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setGlobalFilter(value);

      if (apiPagination && onSearch) {
        onSearch(value);
      }
    }, 300),
    [apiPagination, onSearch]
  );

  // Check screen size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768); // 768px is typical md breakpoint
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Initialize filtered rows when rows change
  useEffect(() => {
    // Only update the filteredRows if there's no search term or if using API pagination
    if (!globalFilter || apiPagination) {
      setFilteredRows(rows);
    }
  }, [rows, globalFilter, apiPagination]);

  // Filter rows when search term changes (for client-side filtering)
  useEffect(() => {
    // Skip this effect for API pagination since filtering happens server-side
    if (apiPagination) {
      return;
    }

    if (!globalFilter) {
      setFilteredRows(rows);
      return;
    }

    const filtered = rows.filter((row) => {
      return columns.some((column) => {
        const value = row[column.key];
        return (
          value &&
          String(value).toLowerCase().includes(globalFilter.toLowerCase())
        );
      });
    });

    setFilteredRows(filtered);
    setPageIndex(0); // Reset to first page when filter changes
  }, [globalFilter, rows, columns, apiPagination]);

  // Calculate total pages based on pagination type
  const totalPages = apiPagination
    ? Math.ceil(totalItems / pageSize)
    : Math.ceil(filteredRows.length / pageSize);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPageIndex(newPage);

    if (apiPagination && onPageChange) {
      onPageChange(newPage, pageSize);
    }
  };

  // Handler for search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  // Calculate pagination for client-side pagination
  const start = pageIndex * pageSize;
  const end = Math.min(
    (pageIndex + 1) * pageSize,
    apiPagination ? totalItems : filteredRows.length
  );

  // Get current page data (only for client-side pagination)
  const currentPageRows = apiPagination
    ? rows // For API pagination, we use the rows directly as they should already be the current page
    : filteredRows.slice(start, end);

  // Reset page index when total pages change
  useEffect(() => {
    if (pageIndex >= totalPages && totalPages > 0) {
      setPageIndex(Math.max(0, totalPages - 1));
    }
  }, [totalPages, pageIndex]);

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedRows.size === currentPageRows.length) {
      // If all are selected, clear selection
      setSelectedRows(new Set());
    } else {
      // Otherwise select all current page rows
      const newSelected = new Set<string | number>();
      currentPageRows.forEach((row) => {
        if (row.id !== undefined) {
          newSelected.add(row.id);
        }
      });
      setSelectedRows(newSelected);
    }
  };

  const toggleSelectRow = (id: string | number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleDelete = () => {
    if (onMultipleDelete && selectedRows.size > 0) {
      onMultipleDelete(Array.from(selectedRows));
      setSelectedRows(new Set());
      setShowDeleteConfirm(false);
    }
  };

  // Check if all current page rows are selected
  const isAllSelected =
    currentPageRows.length > 0 &&
    currentPageRows.every(
      (row) => row.id !== undefined && selectedRows.has(row.id)
    );

  // Check if some (but not all) rows are selected
  const isSomeSelected = selectedRows.size > 0 && !isAllSelected;

  // Function to generate pagination buttons
  const getPaginationButtons = () => {
    const visiblePages = isSmallScreen ? 3 : 5;
    const buttons = [];

    // Determine the range of page buttons to show
    let startPage = 0;
    let endPage = Math.max(1, totalPages) - 1;

    if (totalPages > visiblePages) {
      // Calculate start and end pages to keep the current page centered when possible
      const halfVisible = Math.floor(visiblePages / 2);

      if (pageIndex <= halfVisible) {
        // Near the start
        startPage = 0;
        endPage = visiblePages - 1;
      } else if (pageIndex >= totalPages - halfVisible - 1) {
        // Near the end
        startPage = totalPages - visiblePages;
        endPage = totalPages - 1;
      } else {
        // In the middle
        startPage = pageIndex - halfVisible;
        endPage = pageIndex + halfVisible;
      }
    }

    // Generate the page buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`relative inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium ${
            pageIndex === i
              ? "bg-[#DF8D28] text-white"
              : "text-gray-500 hover:bg-gray-100"
          }`}>
          {i + 1}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className={clsx("p-4 bg-white rounded-md", mainClassName)}>
      <div className="flex flex-col justify-between gap-3 pb-4 md:flex-row md:items-center">
        {tabsOptions && tabsOptions}

        <div
          className={clsx(
            "flex items-center gap-2",
            tabsOptions ? "md:justify-end  w-fit" : "justify-between ",
            (filterSection || canSearch) && "w-full"
          )}>
          {canSearch && (
            <div className="relative w-full md:w-64">
              <input
                type="text"
                onChange={handleSearchChange}
                className="w-full px-3 py-1.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search..."
              />
              <div className="absolute inset-y-0 flex items-center pointer-events-none left-3">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            {canSelect && selectedRows.size > 0 && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 text-red-600 bg-red-50 rounded-xl hover:bg-red-100"
                title="Delete selected">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
            {filterSection && filterSection}
          </div>
        </div>
      </div>
      <div className="w-full overflow-hidden border rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr className="rounded-lg">
                {canSelect && (
                  <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={isAllSelected}
                        ref={(input) => {
                          if (input) {
                            input.indeterminate = isSomeSelected;
                          }
                        }}
                        onChange={toggleSelectAll}
                      />
                    </div>
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={clsx(
                      "px-6 py-3 text-xs font-medium tracking-wider  text-center bg-gray-50 text-gray-500 uppercase"
                    )}
                    style={{ width: column.width }}>
                    {column.title}
                  </th>
                ))}
                {showAction && (
                  <th
                    className={clsx(
                      "px-6 py-3 text-xs font-medium tracking-wider  text-center bg-gray-50 text-gray-500 uppercase"
                    )}>
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={canSelect ? columns.length + 1 : columns.length}
                    className="px-6 py-4 text-sm text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : currentPageRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      canSelect
                        ? columns.length + (showAction ? 2 : 1)
                        : columns.length + (showAction ? 1 : 0)
                    }
                    className="px-6 py-4 text-sm text-center text-gray-500">
                    {emptyStateMessage}
                  </td>
                </tr>
              ) : (
                currentPageRows.map((row, index: number) => (
                  <tr
                    key={row.id ?? index}
                    className={`hover:bg-gray-50 ${
                      row.id !== undefined && selectedRows.has(row.id)
                        ? "bg-blue-50"
                        : ""
                    }`}>
                    {canSelect && (
                      <td className="px-3 py-4 text-sm whitespace-nowrap">
                        {row.id !== undefined && (
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            checked={selectedRows.has(row.id ?? "")}
                            onChange={() => toggleSelectRow(row.id ?? "")}
                          />
                        )}
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-6 py-4 text-sm text-center whitespace-nowrap">
                        {column.render ? (
                          column.render(row[column.key], row)
                        ) : column.key === "attachment" &&
                          row[column.key] === "Null" ? (
                          <span className="text-gray-400">Null</span>
                        ) : (
                          row[column.key]
                        )}
                      </td>
                    ))}
                    {showAction && (
                      <td className="px-0 py-4 text-sm whitespace-nowrap">
                        <TableAction
                          row={row}
                          viewAction={viewAction}
                          toggleAction={toggleAction}
                          editAction={editAction}
                          returnAction={returnAction}
                          printAction={printAction}
                          onDelete={onDelete}
                        />
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom pagination */}
        <div className="px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div className="flex items-center text-sm text-gray-600">
              {currentPageRows.length > 0 ? (
                <>
                  Showing {start + 1} to {end} of{" "}
                  {apiPagination ? totalItems : filteredRows.length}
                </>
              ) : (
                <>No items to display</>
              )}
            </div>
            {totalPages > 0 && (
              <div className="flex items-center justify-center space-x-1 overflow-x-auto md:justify-end">
                <button
                  onClick={() => handlePageChange(Math.max(pageIndex - 1, 0))}
                  disabled={pageIndex === 0}
                  className={`relative inline-flex items-center px-2 py-2 rounded-full text-sm font-medium ${
                    pageIndex === 0
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}>
                  <span className="sr-only">Previous</span>
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Page number buttons with optimized calculation */}
                {getPaginationButtons()}

                <button
                  onClick={() =>
                    handlePageChange(Math.min(pageIndex + 1, totalPages - 1))
                  }
                  disabled={pageIndex === totalPages - 1 || totalPages === 0}
                  className={`relative inline-flex items-center px-2 py-2 rounded-full text-sm font-medium ${
                    pageIndex === totalPages - 1 || totalPages === 0
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}>
                  <span className="sr-only">Next</span>
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Delete confirmation modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true">
                &#8203;
              </span>

              <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                      <svg
                        className="w-6 h-6 text-red-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Delete selected items
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete the selected items?
                          This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleDelete}>
                    Delete
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterTable;
