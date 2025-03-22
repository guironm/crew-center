import { PagedResponse } from '@repo/schemas';
import {
  PaginatedQueryParams,
  PaginatedRepository,
} from './paginated-repository.interface';
import { Repository, SelectQueryBuilder, ObjectLiteral } from 'typeorm';

/**
 * Mixin to add TypeORM pagination capabilities to repositories
 * @param repository TypeORM repository
 * @param applyQueryParams Function to apply query parameters to query builder
 * @param toDomainMapper Function to map entities to domain objects
 * @returns An object implementing PaginatedRepository interface
 */
export function withTypeOrmPagination<T, EntityType extends ObjectLiteral>(
  repository: Repository<EntityType>,
  applyQueryParams: (
    queryBuilder: SelectQueryBuilder<EntityType>,
    queryParams: PaginatedQueryParams<T>,
  ) => SelectQueryBuilder<EntityType>,
  toDomainMapper: (entities: EntityType[]) => T[],
): PaginatedRepository<T> {
  return {
    async findManyPaginated(
      queryParams: PaginatedQueryParams<T>,
    ): Promise<PagedResponse<T>> {
      // Create query builder
      const queryBuilder = repository.createQueryBuilder('entity');

      // Apply query params (filtering, sorting, etc.)
      const configuredQuery = applyQueryParams(queryBuilder, queryParams);

      // Count total matching items before pagination
      const totalItems = await configuredQuery.getCount();

      // Clone query and apply pagination
      const paginatedQuery = configuredQuery.clone();
      const { page, limit } = queryParams.pagination;
      const skip = (page - 1) * limit;
      paginatedQuery.skip(skip).take(limit);

      // Execute paginated query
      const entities = await paginatedQuery.getMany();
      const items = toDomainMapper(entities);

      // Create pagination metadata
      const meta = {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit) || 1, // At least 1 page even if empty
        hasNextPage: page < Math.ceil(totalItems / limit),
        hasPreviousPage: page > 1,
      };

      return { data: items, meta };
    },
  };
}

/**
 * Mixin to add in-memory pagination capabilities to repositories
 * @param findAllFn Function to retrieve all items
 * @param applyFilters Function to apply filtering and sorting
 * @returns An object implementing PaginatedRepository interface
 */
export function withInMemoryPagination<T>(
  findAllFn: () => Promise<T[]>,
  applyFilters: (items: T[], queryParams: PaginatedQueryParams<T>) => T[],
): PaginatedRepository<T> {
  return {
    async findManyPaginated(
      queryParams: PaginatedQueryParams<T>,
    ): Promise<PagedResponse<T>> {
      // Get all items
      const allItems = await findAllFn();

      // Apply filters, sorting, text search
      const filteredItems = applyFilters(allItems, queryParams);

      // Get total count after filtering
      const totalItems = filteredItems.length;

      // Apply pagination
      const { page, limit } = queryParams.pagination;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedItems = filteredItems.slice(startIndex, endIndex);

      // Create pagination metadata
      const meta = {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit) || 1, // At least 1 page even if empty
        hasNextPage: page < Math.ceil(totalItems / limit),
        hasPreviousPage: page > 1,
      };

      return { data: paginatedItems, meta };
    },
  };
}
