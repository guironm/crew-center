"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateEmployee } from "../hooks/useEmployees";
import {
  createEmployeeSchema,
  CreateEmployeeDto,
  defaultRolesByDepartment,
  Department,
} from "@repo/schemas";
import { useDepartments } from "../hooks/useDepartments";

interface CreateEmployeeFormProps {
  onSuccess?: () => void;
}

export default function CreateEmployeeForm({
  onSuccess,
}: CreateEmployeeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const createMutation = useCreateEmployee();
  const { data: departments = [] } = useDepartments();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEmployeeDto>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      departmentId: "",
      salary: 50000,
      status: "active",
    },
  });

  // Handle form submission
  const onSubmit = async (data: CreateEmployeeDto) => {
    setIsSubmitting(true);
    setErrorMessage(null); // Clear any previous errors
    
    try {
      await createMutation.mutateAsync(data);
      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error creating employee:", error);
      setErrorMessage(error instanceof Error ? error.message : "An error occurred while creating the employee.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {errorMessage}
        </div>
      )}
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
          htmlFor="departmentId"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Department
        </label>
        <select
          id="departmentId"
          {...register("departmentId")}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a department</option>
          {departments.map((dept: Department) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
        {errors.departmentId && (
          <p className="mt-1 text-sm text-red-600">
            {errors.departmentId.message}
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

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
        >
          {isSubmitting ? "Creating..." : "Create Employee"}
        </button>
      </div>
    </form>
  );
}
