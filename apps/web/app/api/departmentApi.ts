const API_BASE_URL = 'http://localhost:491';

import { Department } from "@repo/schemas";

export const departmentApi = {
  getAll: async (): Promise<Department[]> => {
    const response = await fetch(`${API_BASE_URL}/departments`);
    if (!response.ok) {
      throw new Error(`Error fetching departments: ${response.status}`);
    }
    return response.json();
  },

  getById: async (id: string | number): Promise<Department> => {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`);
    if (!response.ok) {
      throw new Error(`Error fetching department: ${response.status}`);
    }
    return response.json();
  }
}; 