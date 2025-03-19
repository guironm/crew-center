import { z } from "zod";
import { departmentSchema } from "./department.schema";

// Response DTO schema
export const departmentResponseSchema = departmentSchema;

export type DepartmentResponseDto = z.infer<typeof departmentResponseSchema>;
