import { z } from "zod";
import { employeeSchema } from "./employee.schema";

// Create Employee DTO schema - excludes id which is server-generated
export const createEmployeeSchema = employeeSchema.omit({ id: true }).extend({
  // Override date to accept string input that will be converted to Date
  hireDate: z.string().datetime().optional().or(z.date().optional()),
});

export type CreateEmployeeDto = z.infer<typeof createEmployeeSchema>;
