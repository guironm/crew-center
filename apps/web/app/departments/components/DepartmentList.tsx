"use client";

import { useState } from "react";
import { useDepartments, useSearchDepartments } from "../hooks/useDepartments";
import { ApiSearchParams } from "@repo/schemas";
import SearchBar from "../../components/ui/SearchBar";
import DepartmentCard from "./DepartmentCard";

export default function DepartmentList() {
  // Initialize with required sortOrder from schema
  const [searchParams, setSearchParams] = useState<ApiSearchParams>({
    sortOrder: "asc",
  });

  const isSearching = Object.values(searchParams).some(
    (value, index) =>
      // Skip checking sortOrder since it's always there
      index !== Object.keys(searchParams).indexOf("sortOrder") &&
      value !== undefined &&
      value !== "",
  );

  // Use the search hook if search params are provided, otherwise use the regular getAll hook
  const {
    data: departments,
    isLoading,
    error,
  } = isSearching ? useSearchDepartments(searchParams) : useDepartments();

  const handleSearch = (params: ApiSearchParams) => {
    setSearchParams(params);
  };

  if (isLoading) return <DepartmentListSkeleton />;

  if (error)
    return (
      <div className="flex justify-center items-center py-10 text-red-500">
        Error:{" "}
        {error instanceof Error ? error.message : "An unknown error occurred"}
      </div>
    );

  if (!departments || departments.length === 0)
    return (
      <div>
        <SearchBar
          onSearch={handleSearch}
          initialParams={searchParams}
          placeholder="Search departments by name or description..."
        />
        <div className="text-center py-10">
          No departments found. Try adjusting your filters.
        </div>
      </div>
    );

  return (
    <div>
      <SearchBar
        onSearch={handleSearch}
        initialParams={searchParams}
        placeholder="Search departments by name or description..."
      />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Departments{" "}
          {isSearching && (
            <span className="text-sm font-normal text-gray-500">
              ({departments.length} results)
            </span>
          )}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <DepartmentCard key={department.id} department={department} />
        ))}
      </div>
    </div>
  );
}

function DepartmentListSkeleton() {
  return (
    <div>
      <div className="h-8 bg-slate-200 rounded w-1/6 mb-6 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 animate-pulse border-2 border-slate-300"
          >
            <div className="h-5 bg-slate-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
