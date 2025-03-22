"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateEmployee } from "../hooks/useEmployees";
import {
  updateEmployeeSchema,
  UpdateEmployeeDto,
  defaultRolesByDepartment,
  Employee,
} from "@repo/schemas";

interface EditEmployeeFormProps {
  employee: Employee;
  onSuccess?: () => void;
}

export default function EditEmployeeForm({
  employee,
  onSuccess,
}: EditEmployeeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateMutation = useUpdateEmployee(employee.id);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateEmployeeDto>({
    resolver: zodResolver(updateEmployeeSchema),
    defaultValues: {
      name: employee.name,
      email: employee.email,
      role: employee.role,
      department: employee.department,
      salary: employee.salary,
      status: employee.status,
    },
  });

  // Reset form when employee changes
  useEffect(() => {
    reset({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      department: employee.department,
      salary: employee.salary,
      status: employee.status,
    });
  }, [employee, reset]);

  // Handle form submission
  const onSubmit = async (data: UpdateEmployeeDto) => {
    setIsSubmitting(true);
    try {
      await updateMutation.mutateAsync(data);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error updating employee:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get department names for the dropdown
  const departmentNames = Object.keys(defaultRolesByDepartment);

  // Get status options
  const statusOptions = ["active", "inactive", "on_leave"];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Full Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Role
        </label>
        <input
          id="role"
          type="text"
          {...register("role")}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.role && (
          <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="department"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Department
        </label>
        <select
          id="department"
          {...register("department")}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {departmentNames.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        {errors.department && (
          <p className="mt-1 text-sm text-red-600">
            {errors.department.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="salary"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Salary
        </label>
        <input
          id="salary"
          type="number"
          min="1"
          {...register("salary", {
            valueAsNumber: true,
            required: "Salary is required",
            min: { value: 1, message: "Salary must be greater than 0" },
          })}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Enter a positive number (greater than 0)
        </p>
        {errors.salary && (
          <p className="mt-1 text-sm text-red-600">{errors.salary.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Status
        </label>
        <select
          id="status"
          {...register("status")}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.replace("_", " ")}
            </option>
          ))}
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
        >
          {isSubmitting ? "Updating..." : "Update Employee"}
        </button>
      </div>
    </form>
  );
}
