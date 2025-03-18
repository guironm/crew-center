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
});

export type Employee = z.infer<typeof employeeSchema>;

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
