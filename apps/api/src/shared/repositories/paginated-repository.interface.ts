import { QueryParams } from './base-repository.interface';
import { PagedResponse, PaginationParams } from '@repo/schemas';

/**
 * Extended query params with pagination
 */
export interface PaginatedQueryParams<T> extends QueryParams<T> {
  pagination: PaginationParams;
}

/**
 * Interface for repositories that support pagination
 * This extends existing repositories without modifying them
 */
export interface PaginatedRepository<T> {
  /**
   * Find entities with pagination support
   */
  findManyPaginated(
    queryParams: PaginatedQueryParams<T>,
  ): Promise<PagedResponse<T>>;
}
