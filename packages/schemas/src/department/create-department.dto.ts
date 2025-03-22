import { z } from "zod";
import { departmentSchema } from "./department.schema";

// Create Department DTO schema - excludes id which is server-generated
export const createDepartmentSchema = departmentSchema.omit({ id: true });

export type CreateDepartmentDto = z.infer<typeof createDepartmentSchema>;
