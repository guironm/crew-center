'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeApi } from '../../api/employeeApi';
import { CreateEmployeeDto, UpdateEmployeeDto } from '@repo/schemas';

export function useEmployees(options = {}) {
  return useQuery({
    queryKey: ['employees'],
    queryFn: employeeApi.getAll,
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep data in cache for 10 minutes (garbage collection time)
    refetchOnWindowFocus: true, 
    refetchOnMount: true, 
    ...options
  });
}

export function useEmployee(id: string | number, options = {}) {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeeApi.getById(id),
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep data in cache for 10 minutes
    refetchOnWindowFocus: false, 
    enabled: !!id,
    ...options
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
      // Invalidate employees query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
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
    onSuccess: () => {
      // Invalidate both employees list and this specific employee
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', id.toString()] });
    }
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
      // Invalidate employees query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  });
} 