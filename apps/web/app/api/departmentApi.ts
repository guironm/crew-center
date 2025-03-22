import { Department, ApiSearchParams } from "@repo/schemas";
import { config } from "../config/env";
import axios from "axios";

const API_URL = `${config.API_BASE_URL}:${config.API_BASE_PORT}`;

export const departmentApi = {
  getAll: async (): Promise<Department[]> => {
    try {
      const response = await axios.get(`${API_URL}/departments`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Error fetching departments: ${error.response?.status}`,
        );
      }
      throw error;
    }
  },

  search: async (params: ApiSearchParams): Promise<Department[]> => {
    try {
      // Build query params object
      const queryParams: Record<string, string> = {};

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams[key] = String(value);
        }
      });

      const response = await axios.get(`${API_URL}/departments/search`, {
        params: queryParams,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Error searching departments: ${error.response?.status}`,
        );
      }
      throw error;
    }
  },

  getById: async (id: string | number): Promise<Department> => {
    try {
      const response = await axios.get(`${API_URL}/departments/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Error fetching department: ${error.response?.status}`);
      }
      throw error;
    }
  },
};
