const API_BASE_URL = 'http://localhost:491';

import { 
  Employee, 
  CreateEmployeeDto, 
  UpdateEmployeeDto 
} from "@repo/schemas";

export const employeeApi = {
  getAll: async (): Promise<Employee[]> => {
    const response = await fetch(`${API_BASE_URL}/employees`);
    if (!response.ok) {
      throw new Error(`Error fetching employees: ${response.status}`);
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
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Error creating employee: ${response.status}`);
    }
    
    return response.json();
  },

  update: async (id: string | number, data: UpdateEmployeeDto): Promise<Employee> => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
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
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error deleting employee: ${response.status}`);
    }
  }
}; 