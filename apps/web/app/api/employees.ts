import { apiClient } from "./apiClient";
import { Employee } from "@repo/schemas";

export interface CreateEmployeeData {
  name: string;
  email: string;
  role: string;
  department: string;
}

export interface UpdateEmployeeData {
  name?: string;
  email?: string;
  role?: string;
  department?: string;
}

export const employeesService = {
  // Get all employees
  getAll: async (): Promise<Employee[]> => {
    return apiClient.get<Employee[]>("/employees");
  },

  // Get a single employee by ID
  getById: async (id: string): Promise<Employee> => {
    return apiClient.get<Employee>(`/employees/${id}`);
  },

  // Create a new employee
  create: async (data: CreateEmployeeData): Promise<Employee> => {
    return apiClient.post<Employee>("/employees", data);
  },

  // Update an existing employee
  update: async (id: string, data: UpdateEmployeeData): Promise<Employee> => {
    return apiClient.put<Employee>(`/employees/${id}`, data);
  },

  // Delete an employee
  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/employees/${id}`);
  }
}; 