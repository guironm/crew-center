import { z } from "zod";

/**
 * Enum for sort order options
 */
export const sortOrderSchema = z.enum(["asc", "desc"]);
export type SortOrder = z.infer<typeof sortOrderSchema>;

/**
 * Generic search params factory that creates a search params schema for any entity
 * @param entitySchema The Zod schema for the entity
 * @returns A search params schema with query, filters and sorting
 */
export function createSearchParamsSchema<T extends z.ZodType>(entitySchema: T) {
  // Extract the entity shape
  const shape = entitySchema instanceof z.ZodObject ? entitySchema.shape : {};

  // Extract keys for sorting (convert to array of keys)
  const sortableFields = Object.keys(shape);

  return z.object({
    // Free text search (always available)
    query: z.string().optional(),

    // Allow sorting by any field
    sortBy: z.enum(sortableFields as [string, ...string[]]).optional(),

    // Sort order (asc or desc)
    sortOrder: sortOrderSchema.default("asc"),
  });
}

/**
 * Generic search params type
 * Use this for any entity's search parameters
 */
export type ApiSearchParams = {
  query?: string;
  sortBy?: string;
  sortOrder: "asc" | "desc";
  [key: string]: any; // Allow for additional entity-specific filters
};
