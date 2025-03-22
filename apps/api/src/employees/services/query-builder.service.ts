import { Injectable } from '@nestjs/common';
import { ApiSearchParams, Employee } from '@repo/schemas';
import { QueryParams } from '../../shared/repositories/base-repository.interface';

@Injectable()
export class EmployeeQueryBuilderService {
  private readonly textSearchFields = ['name', 'email', 'role'] as const;
  private readonly sortableFields = [
    'name',
    'email',
    'role',
    'department',
    'salary',
    'status',
  ] as const;

  /**
   * Creates a structured query params object from API search parameters
   */
  buildQueryParams(apiParams: ApiSearchParams): QueryParams<Employee> {
    const queryParams: QueryParams<Employee> = {};

    // Process text search
    if (apiParams.query && apiParams.query.trim() !== '') {
      queryParams.textSearch = {
        query: apiParams.query,
        fields: this.textSearchFields as unknown as (keyof Employee)[],
      };
    }

    // Process filters - convert API params to structured filters
    const filters: Record<string, any> = {};

    if (apiParams.department) {
      filters.department = apiParams.department;
    }

    if (apiParams.status) {
      filters.status = apiParams.status;
    }

    if (Object.keys(filters).length > 0) {
      queryParams.filters = filters as Partial<Record<keyof Employee, any>>;
    }

    // Process sorting
    if (apiParams.sortBy && this.isSortableField(apiParams.sortBy)) {
      queryParams.sort = {
        field: apiParams.sortBy as keyof Employee,
        order: apiParams.sortOrder || 'asc',
      };
    }

    return queryParams;
  }

  /**
   * Checks if a field is valid for sorting
   */
  private isSortableField(field: string): boolean {
    return this.sortableFields.includes(field as any);
  }
}
