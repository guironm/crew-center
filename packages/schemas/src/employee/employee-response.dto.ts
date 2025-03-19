import { z } from "zod";
import { employeeSchema } from "./employee.schema";

// Response DTO schema
export const employeeResponseSchema = employeeSchema.extend({
  hireDate: z.string().optional(), // Dates are serialized as strings in JSON
});

export type EmployeeResponseDto = z.infer<typeof employeeResponseSchema>;
