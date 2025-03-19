import { z } from "zod";

// Department schema
export const departmentSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
});

export type Department = z.infer<typeof departmentSchema>;

// Department name enum
export const departmentNameSchema = z.enum([
  "Engineering",
  "Marketing",
  "Sales",
  "Finance",
  "HR",
  "Design",
  "Product",
]);

export type DepartmentName = z.infer<typeof departmentNameSchema>;

// Role schema for each department
export const rolesByDepartmentSchema = z.record(
  departmentNameSchema,
  z.array(z.string()),
);

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
  status: z.enum(["active", "inactive", "on_leave"]).default("active"),
});

export type Employee = z.infer<typeof employeeSchema>;

// Create Employee DTO schema - excludes id which is server-generated
export const createEmployeeSchema = employeeSchema.omit({ id: true }).extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Must be a valid email address"),
  salary: z.number().positive("Salary must be a positive number"),
  hireDate: z.date().optional(),
});

export type CreateEmployeeDto = z.infer<typeof createEmployeeSchema>;

// Update Employee DTO schema - all fields optional
export const updateEmployeeSchema = employeeSchema
  .omit({ id: true })
  .partial()
  .extend({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    email: z.string().email("Must be a valid email address").optional(),
    salary: z.number().positive("Salary must be a positive number").optional(),
  });

export type UpdateEmployeeDto = z.infer<typeof updateEmployeeSchema>;

// Response DTO schema
export const employeeResponseSchema = employeeSchema.extend({
  hireDate: z.string().optional(), // Dates are serialized as strings in JSON
});

export type EmployeeResponseDto = z.infer<typeof employeeResponseSchema>;

// Default roles by department
export const defaultRolesByDepartment: Record<DepartmentName, string[]> = {
  Engineering: [
    "Software Engineer",
    "DevOps Engineer",
    "QA Engineer",
    "Engineering Manager",
  ],
  Marketing: [
    "Marketing Specialist",
    "Content Writer",
    "SEO Specialist",
    "Marketing Manager",
  ],
  Sales: ["Sales Representative", "Account Executive", "Sales Manager"],
  Finance: ["Financial Analyst", "Accountant", "Finance Manager"],
  HR: ["HR Specialist", "Recruiter", "HR Manager"],
  Design: ["UX Designer", "UI Designer", "Graphic Designer", "Design Manager"],
  Product: ["Product Manager", "Product Owner", "Business Analyst"],
};

// Re-export all schemas from their respective modules
export * from "./department";
export * from "./employee";
export * from "./common";
