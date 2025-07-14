import { useState, useMemo, useCallback } from 'react';

export const usePagination = ({
  totalItems,
  itemsPerPage = 10,
  initialPage = 0,
  maxVisiblePages = 5
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    
    // Calculate visible page numbers
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(0, currentPage - halfVisible);
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }
    
    const visiblePages = [];
    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return {
      totalPages,
      totalItems,
      currentPage,
      itemsPerPage,
      startIndex,
      endIndex,
      visiblePages,
      hasNextPage: currentPage < totalPages - 1,
      hasPreviousPage: currentPage > 0,
      isFirstPage: currentPage === 0,
      isLastPage: currentPage === totalPages - 1
    };
  }, [totalItems, itemsPerPage, currentPage, maxVisiblePages]);

  const goToPage = useCallback((page) => {
    const newPage = Math.max(0, Math.min(page, paginationData.totalPages - 1));
    setCurrentPage(newPage);
  }, [paginationData.totalPages]);

  const goToNextPage = useCallback(() => {
    if (paginationData.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [paginationData.hasNextPage]);

  const goToPreviousPage = useCallback(() => {
    if (paginationData.hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [paginationData.hasPreviousPage]);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(0);
  }, []);

  const goToLastPage = useCallback(() => {
    setCurrentPage(paginationData.totalPages - 1);
  }, [paginationData.totalPages]);

  const getPageData = useCallback((data) => {
    return data.slice(paginationData.startIndex, paginationData.endIndex);
  }, [paginationData.startIndex, paginationData.endIndex]);

  return {
    ...paginationData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    getPageData
  };
};

export default usePagination;