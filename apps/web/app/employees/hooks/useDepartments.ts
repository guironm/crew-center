"use client";

import { useQuery } from "@tanstack/react-query";
import { departmentApi } from "../../api/departmentApi";
import { ApiSearchParams } from "@repo/schemas";
import { useSearch } from "../../hooks/useSearch";

/**
 * Hook for fetching all departments
 * @param options React Query options
 * @returns Query result with departments
 */
export function useDepartments(options = {}) {
  return useQuery({
    queryKey: ["departments"],
    queryFn: departmentApi.getAll,
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep data in cache for 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    ...options,
  });
}

/**
 * Hook for searching departments with various filters
 * @param params Search parameters
 * @param options React Query options
 * @returns Query result with filtered departments
 */
export function useSearchDepartments(params: ApiSearchParams, options = {}) {
  return useSearch("departments", departmentApi.search, params, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    ...options,
  });
}

/**
 * Hook for fetching a single department by ID
 * @param id Department ID
 * @param options React Query options
 * @returns Query result with department data
 */
export function useDepartment(id: string | number, options = {}) {
  return useQuery({
    queryKey: ["department", id],
    queryFn: () => departmentApi.getById(id),
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep data in cache for 10 minutes
    refetchOnWindowFocus: false,
    enabled: !!id,
    ...options,
  });
}
