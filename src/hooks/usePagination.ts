/**
 * Pagination hook for managing paginated data
 */

import { useState, useCallback } from 'react';

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const { initialPage = 0, initialLimit = 20 } = options;

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(page + 1);
  }, [page, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(page - 1);
  }, [page, goToPage]);

  const reset = useCallback(() => {
    setPage(initialPage);
  }, [initialPage]);

  const range = {
    from: page * limit,
    to: (page + 1) * limit - 1,
  };

  return {
    page,
    limit,
    total,
    totalPages,
    setTotal,
    setLimit,
    goToPage,
    nextPage,
    prevPage,
    reset,
    range,
    hasNextPage: page < totalPages - 1,
    hasPrevPage: page > 0,
  };
}
