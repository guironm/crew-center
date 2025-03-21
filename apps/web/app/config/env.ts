/**
 * Environment configuration utility
 *
 * This module provides type-safe access to environment variables with proper Next.js prefixing.
 * Uses NEXT_PUBLIC_ prefix for client-side accessible variables.
 */

// Environment variables with default fallbacks
export const env = {
  // API Configuration
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost",
  API_BASE_PORT: parseInt(process.env.NEXT_PUBLIC_API_BASE_PORT || "491", 10),

  // App Configuration
  NODE_ENV: process.env.NODE_ENV || "development",

  // Feature flags
  ENABLE_LOGGING: process.env.NEXT_PUBLIC_ENABLE_LOGGING === "true" || false,
};

// For type safety, define the expected environment variable types
type EnvVars = {
  API_BASE_URL: string;
  API_BASE_PORT: number;
  NODE_ENV: string;
  ENABLE_LOGGING: boolean;
};

// Ensure the exported object matches the expected types
export const config: EnvVars = env as EnvVars;

// Prevent modifications to the env object
Object.freeze(env);
