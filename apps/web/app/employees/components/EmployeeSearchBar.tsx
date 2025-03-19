"use client";

import {
  ApiSearchParams,
  EMPLOYEE_STATUSES,
  EmployeeStatus,
  departmentNameSchema,
} from "@repo/schemas";
import SearchBar from "../../components/ui/SearchBar";

interface EmployeeSearchBarProps {
  onSearch: (params: ApiSearchParams) => void;
  initialParams?: ApiSearchParams;
}

export default function EmployeeSearchBar({
  onSearch,
  initialParams,
}: EmployeeSearchBarProps) {
  // Get department options from the schema
  const departmentOptions = Object.values(departmentNameSchema.enum).map(
    (dept) => ({
      value: dept,
      label: dept,
    }),
  );

  // Get status options from the schema
  const statusOptions = EMPLOYEE_STATUSES.map((status) => ({
    value: status,
    label: formatStatusLabel(status),
  }));

  // Helper function to format status labels for display
  function formatStatusLabel(status: EmployeeStatus): string {
    // Convert "on_leave" to "On Leave" etc.
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <SearchBar
      onSearch={onSearch}
      initialParams={initialParams}
      placeholder="Search employees by name, email, or role..."
      filters={[
        {
          name: "department",
          label: "All Departments",
          options: departmentOptions,
        },
        {
          name: "status",
          label: "All Statuses",
          options: statusOptions,
        },
      ]}
    />
  );
}
