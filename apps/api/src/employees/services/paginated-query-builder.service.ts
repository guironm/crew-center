import { Injectable } from '@nestjs/common';
import { PaginatedSearchParams, Employee } from '@repo/schemas';
import { PaginatedQueryParams } from '../../shared/repositories/paginated-repository.interface';
import { EmployeeQueryBuilderService } from './query-builder.service';

@Injectable()
export class PaginatedEmployeeQueryBuilder {
  constructor(private readonly baseQueryBuilder: EmployeeQueryBuilderService) {}

  /**
   * Build query parameters for paginated queries from API search parameters
   */
  buildPaginatedQueryParams(
    apiParams: PaginatedSearchParams,
  ): PaginatedQueryParams<Employee> {
    // Use the base query builder to build the filters, which will handle the types correctly
    const baseParams = this.baseQueryBuilder.buildQueryParams({
      query: apiParams.query,
      department: apiParams.department,
      status: apiParams.status,
      sortBy: apiParams.sortBy,
      sortOrder: apiParams.sortOrder,
    });

    // Add pagination parameters
    return {
      ...baseParams,
      pagination: {
        page: apiParams.page || 1,
        limit: apiParams.limit || 10,
      },
    };
  }
}
