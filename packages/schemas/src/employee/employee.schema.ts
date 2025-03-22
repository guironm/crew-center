import { z } from "zod";
import { departmentSchema } from "../department";
import { MIN_NAME_LENGTH, ValidationMessages } from "../common";

// Employee status enum - the single source of truth for status values
export const employeeStatusEnum = z.enum(["active", "inactive", "on_leave"]);
export type EmployeeStatus = z.infer<typeof employeeStatusEnum>;

// Employee schema with proper validation messages
export const employeeSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .min(
      MIN_NAME_LENGTH,
      ValidationMessages.EMPLOYEE_NAME_MIN_LENGTH(MIN_NAME_LENGTH),
    ),
  email: z.string().email(ValidationMessages.EMPLOYEE_EMAIL_FORMAT),
  role: z.string(),
  departmentId: z.string()
    .min(1, ValidationMessages.EMPLOYEE_DEPARTMENT_REQUIRED)
    .uuid({ message: ValidationMessages.EMPLOYEE_DEPARTMENT_REQUIRED }),
  department: departmentSchema.optional(),
  salary: z.coerce
    .number()
    .positive(ValidationMessages.EMPLOYEE_SALARY_POSITIVE),
  picture: z.string().url().optional().nullable(),
  hireDate: z.date().optional(),
  status: employeeStatusEnum.default("active"),
});

export type Employee = z.infer<typeof employeeSchema>;
