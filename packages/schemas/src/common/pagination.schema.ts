import { z } from "zod";

/**
 * Schema for pagination parameters
 */
export const paginationParamsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type PaginationParams = z.infer<typeof paginationParamsSchema>;

/**
 * Schema for paginated search params (extends existing ApiSearchParams)
 * Use coerce to handle string values from query parameters
 */
export const paginatedSearchParamsSchema = z
  .object({
    query: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
    page: paginationParamsSchema.shape.page,
    limit: paginationParamsSchema.shape.limit,
  })
  .passthrough(); // Allow additional entity-specific filters

export type PaginatedSearchParams = z.infer<typeof paginatedSearchParamsSchema>;

/**
 * Response metadata for paginated results
 */
export const paginationMetaSchema = z.object({
  page: z.number().int(),
  limit: z.number().int(),
  totalItems: z.number().int(),
  totalPages: z.number().int(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

/**
 * Generic paginated response
 */
export interface PagedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
