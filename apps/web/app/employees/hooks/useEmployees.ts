"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeApi } from "../../api/employeeApi";
import { UpdateEmployeeDto, ApiSearchParams } from "@repo/schemas";
import { useSearch } from "../../hooks/useSearch";

export function useEmployees(options = {}) {
  return useQuery({
    queryKey: ["employees"],
    queryFn: employeeApi.getAll,
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep data in cache for 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    ...options,
  });
}

/**
 * Hook for searching employees with various filters
 * @param params Search parameters
 * @param options React Query options
 * @returns Query result with filtered employees
 */
export function useSearchEmployees(params: ApiSearchParams, options = {}) {
  return useSearch("employees", employeeApi.search, params, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    ...options,
  });
}

export function useEmployee(id: string | number, options = {}) {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => employeeApi.getById(id),
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep data in cache for 10 minutes
    refetchOnWindowFocus: false,
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook for creating an employee
 * @returns Mutation for creating an employee
 */
export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeApi.create,
    onSuccess: () => {
      // Invalidate everything related to employees with a single call
      queryClient.invalidateQueries({
        queryKey: ["employees"],
        refetchType: "all",
      });
    },
  });
}

/**
 * Hook for updating an employee
 * @param id Employee ID
 * @returns Mutation for updating an employee
 */
export function useUpdateEmployee(id: string | number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateEmployeeDto) => employeeApi.update(id, data),
    onSuccess: (updatedEmployee) => {
      // Specifically invalidate the individual employee cache entry
      queryClient.invalidateQueries({
        queryKey: ["employee", id],
        exact: true,
      });

      // Also update the cache directly with the updated employee data
      queryClient.setQueryData(["employee", id], updatedEmployee);

      // Invalidate all employee lists to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ["employees"],
        exact: false,
      });
    },
  });
}

/**
 * Hook for deleting an employee
 * @returns Mutation for deleting an employee
 */
export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeApi.delete,
    onSuccess: () => {
      // Invalidate everything related to employees with a single call
      queryClient.invalidateQueries({
        queryKey: ["employees"],
        refetchType: "all",
      });
    },
  });
}
