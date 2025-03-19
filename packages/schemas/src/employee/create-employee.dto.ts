import { z } from "zod";
import { employeeSchema } from "./employee.schema";
import { MIN_NAME_LENGTH, ValidationMessages } from "../common";

// Create Employee DTO schema - excludes id which is server-generated
export const createEmployeeSchema = employeeSchema.omit({ id: true }).extend({
  name: z
    .string()
    .min(
      MIN_NAME_LENGTH,
      ValidationMessages.EMPLOYEE_NAME_MIN_LENGTH(MIN_NAME_LENGTH),
    ),
  email: z.string().email(ValidationMessages.EMPLOYEE_EMAIL_FORMAT),
  salary: z.number().positive(ValidationMessages.EMPLOYEE_SALARY_POSITIVE),
  hireDate: z.date().optional(),
});

export type CreateEmployeeDto = z.infer<typeof createEmployeeSchema>;
