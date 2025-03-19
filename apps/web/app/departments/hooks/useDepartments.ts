'use client';

import { useQuery } from '@tanstack/react-query';
import { departmentApi } from '../../api/departmentApi';


export function useDepartments(options = {}) {
  return useQuery({
    queryKey: ['departments'],
    queryFn: departmentApi.getAll,
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep data in cache for 10 minutes (garbage collection time)
    refetchOnWindowFocus: false, 
    ...options
  });
}

export function useDepartment(id: string | number, options = {}) {
  return useQuery({
    queryKey: ['department', id],
    queryFn: () => departmentApi.getById(id),
    
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep data in cache for 10 minutes (garbage collection time)
    refetchOnWindowFocus: false,
    enabled: !!id,
    ...options
  });
} 