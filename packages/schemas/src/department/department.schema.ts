import { z } from "zod";

// Department schema
export const departmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
});

export type Department = z.infer<typeof departmentSchema>;

// Department name - now just a string instead of enum
export const departmentNameSchema = z.string();

export type DepartmentName = z.infer<typeof departmentNameSchema>;

// Role schema for each department - now a record with any string key
export const rolesByDepartmentSchema = z.record(
  z.string(),
  z.array(z.string()),
);

// Default roles by department - still keeping defaults for existing departments
export const defaultRolesByDepartment: Record<string, string[]> = {
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
