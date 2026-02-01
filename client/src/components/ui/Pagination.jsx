import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/**
 * Pagination Component
 *
 * A styled pagination component using the site's rose/orange theme.
 *
 * @param {Object} props
 * @param {number} props.page - Current page number (1-indexed)
 * @param {number} props.totalPages - Total number of pages
 * @param {function} props.onChange - Callback when page changes
 * @param {boolean} props.showPageNumbers - Whether to show page numbers (default: true)
 * @param {number} props.maxPageButtons - Max page buttons to show (default: 5)
 */
const Pagination = ({
  page,
  totalPages,
  onChange,
  showPageNumbers = true,
  maxPageButtons = 5
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, page - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    // Adjust start if we're near the end
    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous button */}
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-1 px-4 py-2 rounded-xl
          bg-gradient-to-r from-rose-100 to-orange-100
          text-rose-700 font-medium
          disabled:opacity-50 disabled:cursor-not-allowed
          hover:from-rose-200 hover:to-orange-200
          transition-all duration-200
          shadow-sm hover:shadow"
        aria-label="Previous page"
      >
        <FiChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page numbers */}
      {showPageNumbers && (
        <div className="flex items-center gap-1">
          {getPageNumbers()[0] > 1 && (
            <>
              <button
                onClick={() => onChange(1)}
                className="w-10 h-10 rounded-lg text-stone-600 hover:bg-rose-100 transition-colors"
              >
                1
              </button>
              {getPageNumbers()[0] > 2 && (
                <span className="px-2 text-stone-400">...</span>
              )}
            </>
          )}

          {getPageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onChange(pageNum)}
              className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                pageNum === page
                  ? 'bg-gradient-to-r from-rose-400 to-orange-400 text-white shadow-md'
                  : 'text-stone-600 hover:bg-rose-100'
              }`}
            >
              {pageNum}
            </button>
          ))}

          {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
            <>
              {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                <span className="px-2 text-stone-400">...</span>
              )}
              <button
                onClick={() => onChange(totalPages)}
                className="w-10 h-10 rounded-lg text-stone-600 hover:bg-rose-100 transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>
      )}

      {/* Current page indicator (for compact mode) */}
      {!showPageNumbers && (
        <span className="px-4 py-2 text-stone-600 font-medium">
          Page {page} of {totalPages}
        </span>
      )}

      {/* Next button */}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-1 px-4 py-2 rounded-xl
          bg-gradient-to-r from-rose-100 to-orange-100
          text-rose-700 font-medium
          disabled:opacity-50 disabled:cursor-not-allowed
          hover:from-rose-200 hover:to-orange-200
          transition-all duration-200
          shadow-sm hover:shadow"
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <FiChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
