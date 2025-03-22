import { z } from "zod";
import { departmentSchema } from "./department.schema";

// Update Department DTO schema - all fields are optional
export const updateDepartmentSchema = departmentSchema
  .omit({ id: true })
  .partial();

export type UpdateDepartmentDto = z.infer<typeof updateDepartmentSchema>;
