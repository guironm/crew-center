import {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  ApiSearchParams,
} from "@repo/schemas";
import { config } from "../config/env";
import axios from "axios";

const API_URL = `${config.API_BASE_URL}:${config.API_BASE_PORT}`;

export const employeeApi = {
  getAll: async (): Promise<Employee[]> => {
    try {
      const response = await axios.get(`${API_URL}/employees`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Error fetching employees: ${error.response?.status}`);
      }
      throw error;
    }
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

    try {
      // Build query params object
      const queryParams: Record<string, string> = {};
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams[key] = String(value);
        }
      });

      console.log(
        `[${new Date().toISOString()}] Search API called with params:`,
        queryParams,
      );

      const response = await axios.get(`${API_URL}/employees/search`, {
        params: queryParams
      });

      console.log(`[${new Date().toISOString()}] Search API response:`, response.data);
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Error searching employees: ${error.response?.status}`);
      }
      throw error;
    }
  },

  getById: async (id: string | number): Promise<Employee> => {
    try {
      const response = await axios.get(`${API_URL}/employees/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Error fetching employee: ${error.response?.status}`);
      }
      throw error;
    }
  },

  create: async (data: CreateEmployeeDto): Promise<Employee> => {
    try {
      const response = await axios.post(`${API_URL}/employees`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Error creating employee: ${error.response?.status}`);
      }
      throw error;
    }
  },

  update: async (
    id: string | number,
    data: UpdateEmployeeDto,
  ): Promise<Employee> => {
    try {
      const response = await axios.put(`${API_URL}/employees/${id}`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Error updating employee: ${error.response?.status}`);
      }
      throw error;
    }
  },

  delete: async (id: string | number): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/employees/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Error deleting employee: ${error.response?.status}`);
      }
      throw error;
    }
  },
};
