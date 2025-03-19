/**
 * Validation message templates using native template literals
 */
export const ValidationMessages = {
  // General validation messages
  REQUIRED: "This field is required",
  INVALID_TYPE: (expectedType: string) =>
    `Invalid type, expected ${expectedType}`,

  // String validation messages
  MIN_LENGTH: (minLength: number) => `Must be at least ${minLength} characters`,
  MAX_LENGTH: (maxLength: number) => `Must not exceed ${maxLength} characters`,
  EMAIL_FORMAT: "Must be a valid email address",

  // Number validation messages
  MIN_VALUE: (minValue: number) => `Must be at least ${minValue}`,
  MAX_VALUE: (maxValue: number) => `Must not exceed ${maxValue}`,
  POSITIVE: "Must be a positive number",

  // Employee validation messages
  EMPLOYEE_NAME_MIN_LENGTH: (minLength: number) =>
    `Name must be at least ${minLength} characters`,
  EMPLOYEE_EMAIL_FORMAT: "Must be a valid email address",
  EMPLOYEE_SALARY_POSITIVE: "Salary must be a positive number",
  EMPLOYEE_EMAIL_EXISTS: (email: string) =>
    `Employee with email ${email} already exists`,
  EMPLOYEE_NOT_FOUND: (id: number) => `Employee with ID ${id} not found`,

  // Department validation messages
  DEPARTMENT_NAME_MIN_LENGTH: (minLength: number) =>
    `Department name must be at least ${minLength} characters`,
  DEPARTMENT_DESCRIPTION_LENGTH: (min: number, max: number) =>
    `Description must be between ${min} and ${max} characters`,
};
