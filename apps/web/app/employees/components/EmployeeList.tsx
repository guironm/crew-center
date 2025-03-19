"use client";

import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import EmployeeCard from "./EmployeeCard";
import { useSearchEmployees } from "../hooks/useEmployees";
import EmployeeSearchBar from "./EmployeeSearchBar";
import { ApiSearchParams } from "@repo/schemas";
import EmployeeListSkeleton from "./EmployeeListSkeleton";

export default function EmployeeList() {
  const queryClient = useQueryClient();

  // Initialize with required sortOrder from schema
  const [searchParams, setSearchParams] = useState<ApiSearchParams>({
    sortOrder: "asc",
  });

  // More specific check for non-empty search parameters
  const isSearching = useMemo(() => {
    // Only these keys matter for search status
    const searchKeys = ["query", "department", "status"];

    // Return true if any of the search keys have a value
    return searchKeys.some(
      (key) =>
        searchParams[key as keyof typeof searchParams] !== undefined &&
        searchParams[key as keyof typeof searchParams] !== "" &&
        searchParams[key as keyof typeof searchParams] !== null,
    );
  }, [searchParams]);

  // Only use one hook for both searching and getting all employees
  const {
    data: employees = [],
    isLoading,
    error,
  } = useSearchEmployees(searchParams);

  const handleSearch = (params: ApiSearchParams) => {
    // First check if the params are actually different from current state
    // to avoid unnecessary state updates
    const hasChanges = Object.entries(params).some(([key, value]) => {
      const currentValue = searchParams[key as keyof typeof searchParams];
      return value !== currentValue;
    });

    if (!hasChanges) {
      console.log("Search params unchanged, skipping update");
      return;
    }

    // Cancel any pending queries before updating
    queryClient.cancelQueries({
      queryKey: ["employees", "search"],
      exact: false,
    });

    // Update search params state
    setSearchParams(params);

    // Clean params for the query key
    const cleanParams = { ...params };
    Object.keys(cleanParams).forEach((key) => {
      if (
        cleanParams[key as keyof typeof cleanParams] === "" ||
        cleanParams[key as keyof typeof cleanParams] === undefined
      ) {
        delete cleanParams[key as keyof typeof cleanParams];
      }
    });

    // Always keep sortOrder if it exists
    if (params.sortOrder && !cleanParams.sortOrder) {
      cleanParams.sortOrder = params.sortOrder;
    }

    // Invalidate the search query with the exact clean params
    queryClient.invalidateQueries({
      queryKey: ["employees", "search", JSON.stringify(cleanParams)],
      exact: true,
    });
  };

  if (isLoading) return <EmployeeListSkeleton />;

  if (error)
    return (
      <div className="flex justify-center items-center py-10 text-red-500">
        Error:{" "}
        {error instanceof Error ? error.message : "An unknown error occurred"}
      </div>
    );

  if (!employees || employees.length === 0)
    return (
      <div>
        <EmployeeSearchBar
          onSearch={handleSearch}
          initialParams={searchParams}
        />
        <div className="text-center py-10">
          No employees found. Try adjusting your filters.
        </div>
      </div>
    );

  return (
    <div>
      <EmployeeSearchBar onSearch={handleSearch} initialParams={searchParams} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Employees{" "}
          {isSearching && (
            <span className="text-sm font-normal text-gray-500">
              ({employees.length} results)
            </span>
          )}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <EmployeeCard key={employee.id} employee={employee} />
        ))}
      </div>
    </div>
  );
}
