import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Employee, PaginatedSearchParams } from '@repo/schemas';
import { EmployeeEntity } from '../entities/employee.entity';
import { PaginatedQueryParams } from '../../shared/repositories/paginated-repository.interface';
import { withTypeOrmPagination } from '../../shared/repositories/pagination-mixin';
import { EmployeeEntityMapper } from '../mappers/employee-entity.mapper';
import { validate as isUUID } from 'uuid';

@Injectable()
export class PaginatedEmployeeRepository {
  private paginationHandler;

  constructor(
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,
    private readonly mapper: EmployeeEntityMapper,
  ) {
    this.paginationHandler = withTypeOrmPagination<Employee, EmployeeEntity>(
      employeeRepository,
      this.applyQueryParams.bind(this),
      (entities) => this.mapper.toDomainList(entities),
    );
  }

  /**
   * Delegate to the pagination handler
   */
  async findManyPaginated(queryParams: PaginatedQueryParams<Employee>) {
    try {
      return await this.paginationHandler.findManyPaginated(queryParams);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Apply query parameters to the query builder
   * This method encapsulates the TypeORM-specific query building logic
   */
  private applyQueryParams(
    queryBuilder: SelectQueryBuilder<EmployeeEntity>,
    queryParams: PaginatedQueryParams<Employee>,
  ): SelectQueryBuilder<EmployeeEntity> {
    try {
      // CRITICAL: Explicitly set the correct alias for the entity
      // This is important for TypeORM to build the correct SQL
      const query =
        queryBuilder.alias === 'entity'
          ? queryBuilder
          : queryBuilder.from(EmployeeEntity, 'entity');

      // Join department with explicit alias
      query.leftJoinAndSelect('entity.department', 'department');

      // Apply text search if provided
      if (queryParams.textSearch) {
        const fields = queryParams.textSearch.fields;
        const searchConditions = fields
          .map((field) => `entity.${String(field)} ILIKE :query`)
          .join(' OR ');

        query.andWhere(`(${searchConditions})`, {
          query: `%${queryParams.textSearch.query}%`,
        });
      }

      // Apply filters if provided
      if (queryParams.filters) {
        Object.entries(queryParams.filters).forEach(([key, value]) => {
          // Skip null, undefined, or empty string values
          if (value === null || value === undefined || value === '') {
            return;
          }

          // Special handling for ID fields that expect UUID format
          if (key === 'id' || key === 'departmentId') {
            // Only apply UUID filtering if the value is actually a valid UUID
            if (isUUID(String(value))) {
              query.andWhere(`entity.${key} = :${key}`, { [key]: value });
            } else {
              console.warn(
                `Invalid UUID format for ${key}: ${value}, skipping filter`,
              );
            }
          } else if (key === 'department') {
            query.andWhere('department.name = :departmentName', {
              departmentName: value,
            });
          } else if (key === 'status') {
            // Handle enum mapping for status - convert PascalCase to snake_case if needed
            const dbStatus = String(value).toLowerCase().replace(' ', '_');
            if (['active', 'inactive', 'on_leave'].includes(dbStatus)) {
              query.andWhere('entity.status = :status', { status: dbStatus });
            } else {
              query.andWhere('entity.status = :status', { status: value });
            }
          } else {
            query.andWhere(`entity.${key} = :${key}`, { [key]: value });
          }
        });
      }

      // Apply sorting if provided
      if (queryParams.sort) {
        const order = queryParams.sort.order.toUpperCase() as 'ASC' | 'DESC';
        query.orderBy(`entity.${String(queryParams.sort.field)}`, order);
      }

      return query;
    } catch (error) {
      // Return a simple query that retrieves all employees as fallback
      return queryBuilder
        .from(EmployeeEntity, 'entity')
        .leftJoinAndSelect('entity.department', 'department');
    }
  }
}
