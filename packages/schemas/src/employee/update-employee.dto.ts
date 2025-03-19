import { z } from "zod";
import { employeeSchema } from "./employee.schema";
import { MIN_NAME_LENGTH, ValidationMessages } from "../common";

// Update Employee DTO schema - all fields optional
export const updateEmployeeSchema = employeeSchema
  .omit({ id: true })
  .partial()
  .extend({
    name: z
      .string()
      .min(
        MIN_NAME_LENGTH,
        ValidationMessages.EMPLOYEE_NAME_MIN_LENGTH(MIN_NAME_LENGTH),
      )
      .optional(),
    email: z
      .string()
      .email(ValidationMessages.EMPLOYEE_EMAIL_FORMAT)
      .optional(),
    salary: z
      .number()
      .positive(ValidationMessages.EMPLOYEE_SALARY_POSITIVE)
      .optional(),
  });

export type UpdateEmployeeDto = z.infer<typeof updateEmployeeSchema>;
