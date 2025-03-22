"use client";

import { useState, useEffect } from "react";
import { employeeApi } from "../../api/employeeApi";
import { departmentApi } from "../../api/departmentApi";

export interface DashboardStatistics {
  employees: {
    total: number;
    active: number;
    inactive: number;
    onLeave: number;
  };
  departments: number;
  communications: number; // This is a placeholder as we don't have real communications data
}

export function useStatistics() {
  const [statistics, setStatistics] = useState<DashboardStatistics>({
    employees: {
      total: 0,
      active: 0,
      inactive: 0,
      onLeave: 0,
    },
    departments: 0,
    communications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchStatistics() {
      try {
        setLoading(true);
        const employeeStats = await employeeApi.getStatistics();
        
        // Get all departments as a fallback in case employeeStats.departments is 0
        const departments = await departmentApi.getAll();
        
        setStatistics({
          employees: {
            total: employeeStats.total,
            active: employeeStats.active, 
            inactive: employeeStats.inactive,
            onLeave: employeeStats.onLeave,
          },
          departments: employeeStats.departments || departments.length,
          // For communications, we'll just use a placeholder for now
          // In a real app, you would get this from a communications API
          communications: Math.floor(employeeStats.total * 0.8),
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch statistics"));
      } finally {
        setLoading(false);
      }
    }

    fetchStatistics();
  }, []);

  return { statistics, loading, error };
} 