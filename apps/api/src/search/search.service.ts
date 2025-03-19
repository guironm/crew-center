import { Injectable } from '@nestjs/common';
import { ApiSearchParams } from '@repo/schemas';

@Injectable()
export class SearchService {
  /**
   * Generic search function that can filter any entity array
   * @param entities Array of entities to search
   * @param params Search parameters
   * @param textSearchFields Fields to search when query is provided
   * @returns Filtered and sorted array of entities
   */
  search<T>(
    entities: T[],
    params: ApiSearchParams,
    textSearchFields: (keyof T)[] = [],
  ): T[] {
    if (!entities || !entities.length) {
      return [];
    }

    // Cast parameters with explicit typing at the start of the function
    const safeParams = params as unknown as Record<string, unknown>;

    console.log('Search params received:', params);
    console.log('Text search fields:', textSearchFields);

    let results = [...entities];

    // Apply text search if query is provided
    if (
      params.query &&
      params.query.trim() !== '' &&
      textSearchFields.length > 0
    ) {
      const query = params.query.toLowerCase().trim();
      results = results.filter((entity) =>
        textSearchFields.some((field) => {
          const value = entity[field];
          return (
            typeof value === 'string' && value.toLowerCase().includes(query)
          );
        }),
      );
      console.log(`After text search, results count: ${results.length}`);
    }

    // Apply filters for any additional fields in params
    Object.keys(safeParams).forEach((key) => {
      // Skip standard search params
      if (['query', 'sortBy', 'sortOrder'].includes(key)) {
        return;
      }

      const filterValue = safeParams[key];
      if (filterValue !== undefined && filterValue !== '') {
        console.log(`Applying filter for ${key}:`, filterValue);
        const beforeCount = results.length;

        results = results.filter((entity) => {
          // Use type assertion with unknown as an intermediate step for type safety
          const entityValue = (entity as unknown as Record<string, unknown>)[
            key
          ];
          console.log(
            `Comparing entity[${key}]:`,
            entityValue,
            'with filter value:',
            filterValue,
          );

          // Handle undefined entity values
          if (entityValue === undefined || entityValue === null) {
            return false;
          }

          // Improved string comparison (case-insensitive)
          if (
            typeof entityValue === 'string' &&
            typeof filterValue === 'string'
          ) {
            return entityValue.toLowerCase() === filterValue.toLowerCase();
          }

          // Direct comparison for non-string values
          return entityValue === (filterValue as unknown);
        });

        console.log(
          `After filtering by ${key}, results count: ${results.length} (removed ${beforeCount - results.length})`,
        );
      }
    });

    // Apply sorting
    if (safeParams.sortBy) {
      const sortOrder = (safeParams.sortOrder as string) === 'desc' ? -1 : 1;
      const sortField = safeParams.sortBy as unknown as keyof T;

      results.sort((a, b) => {
        const valueA = a[sortField];
        const valueB = b[sortField];

        // Handle null or undefined values
        if (valueA == null && valueB == null) return 0;
        if (valueA == null) return -1 * sortOrder;
        if (valueB == null) return 1 * sortOrder;

        // Safe comparison after handling null/undefined
        if (valueA < valueB) return -1 * sortOrder;
        if (valueA > valueB) return 1 * sortOrder;
        return 0;
      });

      console.log(
        `After sorting by ${typeof safeParams.sortBy === 'object' ? JSON.stringify(safeParams.sortBy) : String(safeParams.sortBy)}, results count: ${results.length}`,
      );
    }

    return results;
  }
}
