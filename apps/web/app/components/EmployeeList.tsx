"use client";

import { useEffect, useState } from "react";
import EmployeeCard from "./EmployeeCard";
import { Employee } from "@repo/schemas";

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:491/employees");

        if (!response.ok) {
          throw new Error(`Error fetching employees: ${response.status}`);
        }

        const data = await response.json();
        setEmployees(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        Loading employees...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center py-10 text-red-500">
        Error: {error}
      </div>
    );
  if (employees.length === 0)
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
