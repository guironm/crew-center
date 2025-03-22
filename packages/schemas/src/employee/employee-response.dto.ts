import { z } from "zod";
import { employeeSchema } from "./employee.schema";
import { departmentResponseSchema } from "../department";

// Response DTO schema
export const employeeResponseSchema = employeeSchema
  .omit({ department: true })
  .extend({
    hireDate: z.string().optional(), // Dates are serialized as strings in JSON
    department: departmentResponseSchema.optional(), // Include full department info
  });

export type EmployeeResponseDto = z.infer<typeof employeeResponseSchema>;
