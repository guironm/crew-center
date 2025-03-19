import { z } from "zod";
import { departmentNameSchema } from "../department";

// Employee status enum
export const employeeStatusEnum = z.enum(["active", "inactive", "on_leave"]);
export type EmployeeStatus = z.infer<typeof employeeStatusEnum>;

// Explicitly define the status values as a constant array
export const EMPLOYEE_STATUSES: EmployeeStatus[] = [
  "active",
  "inactive",
  "on_leave",
];

// Employee schema
export const employeeSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  role: z.string(),
  department: departmentNameSchema,
  salary: z.number().positive(),
  picture: z.string().url().optional(),
  hireDate: z.date().optional(),
  status: employeeStatusEnum.default("active"),
});

export type Employee = z.infer<typeof employeeSchema>;
