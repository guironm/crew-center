import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  ApiSearchParams,
} from '@repo/schemas';
import { IEmployeeRepository } from './employee-repository.interface';
import { BaseInMemoryRepository } from '../../shared/repositories/base-in-memory.repository';
import { QueryParams } from '../../shared/repositories/base-repository.interface';

@Injectable()
export class InMemoryEmployeeRepository
  extends BaseInMemoryRepository<
    Employee,
    string,
    CreateEmployeeDto,
    UpdateEmployeeDto
  >
  implements IEmployeeRepository
{
  protected get idField(): keyof Employee {
    return 'id';
  }

  protected generateId(): string {
    return uuidv4();
  }

  protected mapToEntity(createDto: CreateEmployeeDto, id: string): Employee {
    return {
      ...createDto,
      id,
      salary: Number(createDto.salary),
      hireDate: createDto.hireDate ? new Date(createDto.hireDate) : undefined,
      status: createDto.status || 'active',
    };
  }

  async findByEmail(email: string): Promise<Employee | null> {
    const employee = this.items.find((emp) => emp.email === email);
    return employee || null;
  }

  async findWithFilters(
    filters: Partial<ApiSearchParams>,
  ): Promise<Employee[]> {
    // Map the legacy ApiSearchParams to our new QueryParams format
    const queryParams: QueryParams<Employee> = {};

    // Process text search
    if (filters.query && filters.query.trim() !== '') {
      queryParams.textSearch = {
        query: filters.query,
        fields: ['name', 'email', 'role'],
      };
    }

    // Process filters
    const entityFilters: Partial<Record<keyof Employee, any>> = {};

    if (filters.department) {
      entityFilters.department = filters.department;
    }

    if (filters.status) {
      entityFilters.status = filters.status;
    }

    if (Object.keys(entityFilters).length > 0) {
      queryParams.filters = entityFilters;
    }

    // Process sorting
    if (filters.sortBy) {
      queryParams.sort = {
        field: filters.sortBy as keyof Employee,
        order: filters.sortOrder || 'asc',
      };
    }

    // Use the base repository's findMany method with our query params
    return this.findMany(queryParams);
  }
}
