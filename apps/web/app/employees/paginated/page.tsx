"use client";

import { useState } from "react";
import { usePaginatedSearch } from "../../hooks/usePaginatedSearch";
import { employeeApi } from "../../api/employeeApi";
import SearchBar from "../../components/ui/SearchBar";
import { Pagination } from "../../components/ui/Pagination";
import Link from "next/link";
import { PaginatedSearchParams, ApiSearchParams, employeeStatusEnum, EmployeeStatus } from "@repo/schemas";
import MainLayout from "../../layout/MainLayout";
import { useDepartments } from "../hooks/useDepartments";

// Helper for display formatting of status values
const formatStatus = (status: string): string => {
  if (status === "active") return "Active";
  if (status === "inactive") return "Inactive";
  if (status === "on_leave") return "On Leave";
  return status.charAt(0).toUpperCase() + status.slice(1); // Default formatting
};

export default function PaginatedEmployeeList() {
  const [pageSizeOptions] = useState([5, 10, 25, 50]);
  const { data: departments = [] } = useDepartments();

  const {
    data: employees,
    meta,
    isLoading,
    error,
    searchParams,
    updateSearchParams,
    goToPage,
    changePageSize,
  } = usePaginatedSearch(employeeApi.searchPaginated, {
    sortOrder: "asc",
    page: 1,
    limit: 10,
  });

  const handleSearch = (params: ApiSearchParams) => {
    updateSearchParams({
      ...params,
      page: searchParams.page,
      limit: searchParams.limit,
    });
  };

  // Create department options from fetched departments
  const departmentOptions = [
    { value: "", label: "All Departments" },
    ...departments.map(dept => ({
      value: dept.name,
      label: dept.name
    }))
  ];

  // Create status options from the enum
  const statusOptions = [
    { value: "", label: "All Statuses" },
    ...Object.values(employeeStatusEnum.enum).map((status: EmployeeStatus) => ({
      value: status,
      label: formatStatus(status)
    }))
  ];

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Employees (Paginated)</h1>
        <Link href="/employees" className="text-blue-500 hover:text-blue-700">
          Switch to Standard View
        </Link>
      </div>

      <SearchBar
        onSearch={handleSearch}
        initialParams={searchParams as ApiSearchParams}
        placeholder="Search employees..."
        filters={[
          {
            name: "department",
            label: "All Departments",
            options: departmentOptions,
          },
          {
            name: "status",
            label: "Status",
            options: statusOptions,
          },
        ]}
      />

      <div className="flex justify-between items-center mt-4 mb-2">
        <div>
          <span>Show </span>
          <select
            className="border rounded p-1"
            value={searchParams.limit || 10}
            onChange={(e) => changePageSize(Number(e.target.value))}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span> entries</span>
        </div>

        {meta && (
          <div>
            Showing{" "}
            {meta.totalItems === 0 ? 0 : (meta.page - 1) * meta.limit + 1} to{" "}
            {Math.min(meta.page * meta.limit, meta.totalItems)} of{" "}
            {meta.totalItems} entries
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center my-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700 my-4">
          Error: {error instanceof Error ? error.message : "Unknown error"}
        </div>
      ) : employees.length === 0 ? (
        <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 text-slate-700 my-4">
          No employees found matching your criteria.
        </div>
      ) : (
        <div className="overflow-x-auto shadow-sm rounded-lg">
          <table className="min-w-full bg-white border border-slate-200 mt-4 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="py-3 px-4 text-left font-medium text-slate-700">Name</th>
                <th className="py-3 px-4 text-left font-medium text-slate-700">Email</th>
                <th className="py-3 px-4 text-left font-medium text-slate-700">Department</th>
                <th className="py-3 px-4 text-left font-medium text-slate-700">Role</th>
                <th className="py-3 px-4 text-left font-medium text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <Link
                      href={`/employees/${employee.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {employee.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4">{employee.email}</td>
                  <td className="py-3 px-4">
                    {employee.department?.name || "-"}
                  </td>
                  <td className="py-3 px-4">{employee.role}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        employee.status === "active"
                          ? "bg-green-100 text-green-800"
                          : employee.status === "on_leave"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {formatStatus(employee.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          onPageChange={goToPage}
          hasNextPage={meta.hasNextPage}
          hasPrevPage={meta.hasPreviousPage}
        />
      )}
    </MainLayout>
  );
}
