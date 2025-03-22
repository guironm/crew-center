import { z } from "zod";
import { employeeSchema } from "./employee.schema";

// Update Employee DTO schema - all fields optional
export const updateEmployeeSchema = employeeSchema
  .omit({ id: true, department: true })
  .partial()
  .extend({
    // Override date to accept string input that will be converted to Date
    hireDate: z.string().datetime().optional().or(z.date().optional()),
  });

export type UpdateEmployeeDto = z.infer<typeof updateEmployeeSchema>;
