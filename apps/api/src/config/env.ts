/**
 * Environment configuration utility for the API
 *
 * This module provides type-safe access to environment variables with fallbacks.
 */

import { z } from 'zod';

// Environment variables with default fallbacks
export const env = {
  // API Configuration
  API_BASE_PORT: parseInt(process.env.API_BASE_PORT || '491', 10),
  HOST: process.env.HOST || 'localhost',

  // External APIs
  RANDOM_USER_API_URL:
    process.env.RANDOM_USER_API_URL || 'https://randomuser.me/api/',

  // App Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Feature flags
  ENABLE_DETAILED_LOGGING:
    process.env.ENABLE_DETAILED_LOGGING === 'true' || false,

  // New environment variable
  SEED_EMPLOYEE_COUNT: parseInt(process.env.SEED_EMPLOYEE_COUNT || '8', 10),
};

// For type safety, define the expected environment variable types
type EnvVars = {
  API_BASE_PORT: number;
  HOST: string;
  RANDOM_USER_API_URL: string;
  NODE_ENV: string;
  ENABLE_DETAILED_LOGGING: boolean;
  SEED_EMPLOYEE_COUNT: number;
};

// Ensure the exported object matches the expected types
export const config: EnvVars = env as EnvVars;

// Prevent modifications to the env object
Object.freeze(env);

export const envVariables = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('0.0.0.0'),
  SEED_EMPLOYEE_COUNT: z.coerce.number().default(8),
  // ... existing env variables ...
});
