import React from 'react';
import { FiChevronLeft, FiChevronRight, FiMoreHorizontal } from 'react-icons/fi';

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  maxVisiblePages = 5
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (totalPages <= 1) return null;

  const halfVisible = Math.floor(maxVisiblePages / 2);
  let startPage = Math.max(0, currentPage - halfVisible);
  let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(0, endPage - maxVisiblePages + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing {currentPage * itemsPerPage + 1} to{' '}
        {Math.min((currentPage + 1) * itemsPerPage, totalItems)} of {totalItems} results
      </div>
      
      <div className="pagination-controls">
        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          <FiChevronLeft />
          Previous
        </button>

        {startPage > 0 && (
          <>
            <button
              className="pagination-page"
              onClick={() => onPageChange(0)}
            >
              1
            </button>
            {startPage > 1 && (
              <span className="pagination-ellipsis">
                <FiMoreHorizontal />
              </span>
            )}
          </>
        )}

        {pages.map(page => (
          <button
            key={page}
            className={`pagination-page ${page === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page + 1}
          </button>
        ))}

        {endPage < totalPages - 1 && (
          <>
            {endPage < totalPages - 2 && (
              <span className="pagination-ellipsis">
                <FiMoreHorizontal />
              </span>
            )}
            <button
              className="pagination-page"
              onClick={() => onPageChange(totalPages - 1)}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          Next
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;