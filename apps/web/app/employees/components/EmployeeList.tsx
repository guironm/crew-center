"use client";

import EmployeeCard from "./EmployeeCard";
import { useEmployees } from "../hooks/useEmployees";

export default function EmployeeList() {
  const { data: employees, isLoading, error } = useEmployees();

  if (isLoading)
    return <EmployeeListSkeleton />;

  if (error)
    return (
      <div className="flex justify-center items-center py-10 text-red-500">
        Error: {error instanceof Error ? error.message : "An unknown error occurred"}
      </div>
    );

  if (!employees || employees.length === 0)
    return <div className="text-center py-10">No employees found.</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-800">Employees</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <EmployeeCard key={employee.id} employee={employee} />
        ))}
      </div>
    </div>
  );
}

function EmployeeListSkeleton() {
  return (
    <div>
      <div className="h-8 bg-slate-200 rounded w-1/6 mb-6 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 animate-pulse border-2 border-slate-300"
          >
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-slate-200 mr-4"></div>
              <div className="flex-1">
                <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-slate-200 rounded-full mr-2"></div>
                <div className="h-4 bg-slate-200 rounded w-4/5"></div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-slate-200 rounded-full mr-2"></div>
                <div className="h-4 bg-slate-200 rounded w-3/5"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 