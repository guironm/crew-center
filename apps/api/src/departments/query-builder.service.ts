import { Injectable } from '@nestjs/common';
import { ApiSearchParams } from '@repo/schemas';
import { QueryParams } from '../shared/repositories/base-repository.interface';
import { Department } from './entities/department.entity';

@Injectable()
export class DepartmentQueryBuilderService {
  private readonly textSearchFields = ['name', 'description'] as const;
  private readonly sortableFields = ['id', 'name', 'description'] as const;

  /**
   * Creates a structured query params object from API search parameters
   */
  buildQueryParams(apiParams: ApiSearchParams): QueryParams<Department> {
    const queryParams: QueryParams<Department> = {};

    // Process text search
    if (apiParams.query && apiParams.query.trim() !== '') {
      queryParams.textSearch = {
        query: apiParams.query,
        fields: this.textSearchFields as unknown as (keyof Department)[],
      };
    }

    // Process filters - convert API params to structured filters
    const filters: Record<string, any> = {};

    // Add any department-specific filters here if needed

    if (Object.keys(filters).length > 0) {
      queryParams.filters = filters as Partial<Record<keyof Department, any>>;
    }

    // Process sorting
    if (apiParams.sortBy && this.isSortableField(apiParams.sortBy)) {
      queryParams.sort = {
        field: apiParams.sortBy as keyof Department,
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
