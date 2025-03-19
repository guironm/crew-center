const API_BASE_URL = "http://localhost:491";

import {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  ApiSearchParams,
} from "@repo/schemas";

export const employeeApi = {
  getAll: async (): Promise<Employee[]> => {
    const response = await fetch(`${API_BASE_URL}/employees`);
    if (!response.ok) {
      throw new Error(`Error fetching employees: ${response.status}`);
    }
    return response.json();
  },

  search: async (params: ApiSearchParams): Promise<Employee[]> => {
    // Check if we have any meaningful search parameters
    const hasSearchParams = Object.entries(params).some(([key, value]) => {
      // Skip sortOrder - it's always present
      if (key === "sortOrder") return false;
      return value !== undefined && value !== "";
    });

    // If no search parameters, just return all employees
    if (!hasSearchParams) {
      console.log(
        `[${new Date().toISOString()}] No search params provided, getting all employees`,
      );
      return employeeApi.getAll();
    }

    // Build query string from params
    const queryParams = new URLSearchParams();

    console.log(
      `[${new Date().toISOString()}] Search API called with params:`,
      params,
    );

    // Add all params directly to queryParams
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        console.log(`Adding param ${key}:`, value);
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/employees/search${queryString ? `?${queryString}` : ""}`;

    console.log(`[${new Date().toISOString()}] Final search URL:`, url);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error searching employees: ${response.status}`);
    }
    return response.json();
  },

  getById: async (id: string | number): Promise<Employee> => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`);
    if (!response.ok) {
      throw new Error(`Error fetching employee: ${response.status}`);
    }
    return response.json();
  },

  create: async (data: CreateEmployeeDto): Promise<Employee> => {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error creating employee: ${response.status}`);
    }

    return response.json();
  },

  update: async (
    id: string | number,
    data: UpdateEmployeeDto,
  ): Promise<Employee> => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error updating employee: ${response.status}`);
    }

    return response.json();
  },

  delete: async (id: string | number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error deleting employee: ${response.status}`);
    }
  },
};
