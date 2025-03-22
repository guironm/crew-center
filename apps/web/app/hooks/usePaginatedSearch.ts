import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { PaginatedSearchParams, PagedResponse } from "@repo/schemas";

export type FetchPaginatedFn<T> = (
  params: PaginatedSearchParams,
) => Promise<PagedResponse<T>>;

/**
 * Custom hook for paginated search
 * @param fetchFn Function that fetches paginated results
 * @param initialParams Initial search parameters
 */
export function usePaginatedSearch<T>(
  fetchFn: FetchPaginatedFn<T>,
  initialParams: PaginatedSearchParams = {
    sortOrder: "asc",
    page: 1,
    limit: 10,
  },
) {
  const [searchParams, setSearchParams] =
    useState<PaginatedSearchParams>(initialParams);

  // Use React Query for data fetching, caching, and refetching
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["paginatedSearch", searchParams],
    queryFn: async () => {
      console.log(
        `[${new Date().toISOString()}] Fetching paginated results:`,
        searchParams,
      );
      return fetchFn(searchParams);
    },
  });

  // Utility functions for pagination control
  const goToPage = useCallback((page: number) => {
    setSearchParams((prev) => ({
      ...prev,
      page: Math.max(1, page),
    }));
  }, []);

  const nextPage = useCallback(() => {
    if (data?.meta.hasNextPage) {
      goToPage(data.meta.page + 1);
    }
  }, [data?.meta, goToPage]);

  const prevPage = useCallback(() => {
    if (data?.meta.hasPreviousPage) {
      goToPage(data.meta.page - 1);
    }
  }, [data?.meta, goToPage]);

  const changePageSize = useCallback((newLimit: number) => {
    setSearchParams((prev) => ({
      ...prev,
      limit: newLimit,
      page: 1, // Reset to first page when changing page size
    }));
  }, []);

  // Function to update search params (for filters, sorting, etc.)
  const updateSearchParams = useCallback(
    (newParams: Partial<PaginatedSearchParams>) => {
      setSearchParams((prev) => ({
        ...prev,
        ...newParams,
        // Reset to first page when changing search criteria
        page: newParams.page || 1,
      }));
    },
    [],
  );

  return {
    // Data and state
    data: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    searchParams,

    // Actions
    setSearchParams,
    updateSearchParams,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    refetch,
  };
}
