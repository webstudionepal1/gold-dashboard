import { Icon } from '@iconify/react/dist/iconify.js';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export default function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 8) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 8; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 7; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-2 py-1 text-sm text-gray-500 disabled:opacity-50"
            aria-label="Previous page"
          >
            <Icon icon="icon-park-outline:left" className="h-4 w-4" />
            <span className="cursor-pointer">Back</span>
          </button>
          <div className="flex items-center gap-[6px]">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && onPageChange?.(page)}
                disabled={page === '...'}
                className={`min-w-[32px] rounded-sm px-2 py-1 text-sm ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : page === '...'
                      ? 'text-gray-500'
                      : 'text-lynch-400 bg-fade-bg border rounded border-lynch-50'
                }`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-2 py-1 text-sm text-gray-500 disabled:opacity-50"
            aria-label="Next page"
          >
            <span>Next</span>
            <Icon icon="icon-park-outline:right" className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 ">
          <span className="text-sm text-gray-600">Result per page</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange?.(Number(e.target.value))}
            className="rounded border border-gray-300 px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      <div className="text-sm text-gray-500 mt-2 mb-4 flex justify-end">
        {startItem}-{endItem} of {totalItems}
      </div>
    </div>
  );
}
