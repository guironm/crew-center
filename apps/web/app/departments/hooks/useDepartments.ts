"use client";

import { useQuery } from "@tanstack/react-query";
import { departmentApi } from "../../api/departmentApi";
import { ApiSearchParams } from "@repo/schemas";
import { useSearch } from "../../hooks/useSearch";

/**
 * Hook for fetching all departments
 * @param options React Query options
 * @returns Query result with all departments
 */
export function useDepartments(options = {}) {
  return useQuery({
    queryKey: ["departments"],
    queryFn: departmentApi.getAll,
    staleTime: 10 * 60 * 1000, // Data considered fresh for 10 minutes
    gcTime: 30 * 60 * 1000, // Keep data in cache for 30 minutes (garbage collection time)
    refetchOnWindowFocus: true,
    refetchOnMount: true,
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
  return useSearch("departments", departmentApi.search, params, options);
}

/**
 * Hook for fetching a single department by ID
 * @param id Department ID
 * @param options React Query options
 * @returns Query result with the department
 */
export function useDepartment(id: string | number, options = {}) {
  return useQuery({
    queryKey: ["department", id],
    queryFn: () => departmentApi.getById(id),
    staleTime: 10 * 60 * 1000, // Data considered fresh for 10 minutes
    gcTime: 30 * 60 * 1000, // Keep data in cache for 30 minutes
    refetchOnWindowFocus: false,
    enabled: !!id,
    ...options,
  });
}
