import { Injectable } from '@nestjs/common';
import { Employee, PagedResponse, PaginatedSearchParams } from '@repo/schemas';
import { PaginatedEmployeeRepository } from '../repositories/paginated-employee-repository';
import { PaginatedEmployeeQueryBuilder } from './paginated-query-builder.service';

@Injectable()
export class PaginatedEmployeesService {
  constructor(
    private readonly paginatedRepository: PaginatedEmployeeRepository,
    private readonly paginatedQueryBuilder: PaginatedEmployeeQueryBuilder,
  ) {}

  /**
   * Find employees with pagination
   * @param searchParams Search parameters including pagination options
   * @returns Paginated list of employees
   */
  async findPaginated(
    apiParams: PaginatedSearchParams,
  ): Promise<PagedResponse<Employee>> {
    try {
      // Build query params with the optional parameters
      const queryParams =
        this.paginatedQueryBuilder.buildPaginatedQueryParams(apiParams);

      // Delegate to the repository to handle the pagination
      return await this.paginatedRepository.findManyPaginated(queryParams);
    } catch (error) {
      throw error;
    }
  }
}
