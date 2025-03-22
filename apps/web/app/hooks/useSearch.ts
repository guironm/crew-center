"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiSearchParams } from "@repo/schemas";

/**
 * Generic search hook that can be used for any entity type
 * @param entityType Type of entity to search (used for cache key)
 * @param searchFn Function that performs the actual search API call
 * @param params Search parameters
 * @param options React Query options
 * @returns Query result with filtered entities
 */
export function useSearch<T>(
  entityType: string,
  searchFn: (params: ApiSearchParams) => Promise<T[]>,
  params: ApiSearchParams,
  options = {},
) {
  // Only include non-empty params in the query key to avoid unnecessary fetches
  const cleanParams = { ...params };

  // Remove empty values for more accurate query keys
  Object.keys(cleanParams).forEach((key) => {
    if (
      cleanParams[key as keyof typeof cleanParams] === "" ||
      cleanParams[key as keyof typeof cleanParams] === undefined
    ) {
      delete cleanParams[key as keyof typeof cleanParams];
    }
  });

  // Always keep sortOrder in params if it exists
  if (params.sortOrder && !cleanParams.sortOrder) {
    cleanParams.sortOrder = params.sortOrder;
  }

  // Create a structured query key that accurately represents the search state
  // Use JSON.stringify to get a stable reference for the params object
  const queryKey = [entityType, "search", JSON.stringify(cleanParams)];

  return useQuery({
    queryKey,
    queryFn: () => searchFn(params),
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep data in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false, // Don't retry failed queries automatically
    // Prevent unnecessary rerenders while typing by keeping previous data
    placeholderData: (prev) => prev,
    ...options,
  });
}

/**
 * Hook to manage search parameters for a specific entity type
 * @param entityType Type of entity for the search
 * @param initialParams Initial search parameters
 * @returns Object with search params, setter function, and reset function
 */
export function useSearchParams<T extends ApiSearchParams>(
  entityType: string,
  initialParams: T,
) {
  const queryClient = useQueryClient();

  // Set search parameters and invalidate the relevant query
  const setSearchParams = (newParams: Partial<T>) => {
    const params = { ...initialParams, ...newParams };

    // Invalidate any search queries that may be affected
    queryClient.invalidateQueries({
      queryKey: [entityType, "search"],
      exact: false,
    });

    return params;
  };

  // Reset search parameters to initial state
  const resetSearchParams = () => {
    queryClient.invalidateQueries({
      queryKey: [entityType, "search"],
      exact: false,
    });

    return initialParams;
  };

  return {
    setSearchParams,
    resetSearchParams,
  };
}
