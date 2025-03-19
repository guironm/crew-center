const API_BASE_URL = "http://localhost:491";

import { Department, ApiSearchParams } from "@repo/schemas";

export const departmentApi = {
  getAll: async (): Promise<Department[]> => {
    const response = await fetch(`${API_BASE_URL}/departments`);
    if (!response.ok) {
      throw new Error(`Error fetching departments: ${response.status}`);
    }
    return response.json();
  },

  search: async (params: ApiSearchParams): Promise<Department[]> => {
    // Build query string from params
    const queryParams = new URLSearchParams();

    console.log("Search params before processing:", params);

    // Add all params directly to queryParams
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        console.log(`Adding param ${key}:`, value);
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/departments/search${queryString ? `?${queryString}` : ""}`;

    console.log("Final search URL:", url);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error searching departments: ${response.status}`);
    }
    return response.json();
  },

  getById: async (id: string | number): Promise<Department> => {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`);
    if (!response.ok) {
      throw new Error(`Error fetching department: ${response.status}`);
    }
    return response.json();
  },
};
