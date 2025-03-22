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
import { DEPARTMENT_REPOSITORY } from '../../departments/repositories/department-repository.interface';
import { Inject } from '@nestjs/common';

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
  constructor(
    @Inject(DEPARTMENT_REPOSITORY) private departmentRepository: any,
  ) {
    super();
  }

  protected get idField(): keyof Employee {
    return 'id';
  }

  protected generateId(): string {
    return uuidv4();
  }

  protected async mapToEntity(
    createDto: CreateEmployeeDto,
    id: string,
  ): Promise<Employee> {
    // Get department data if departmentId is provided
    let department = undefined;
    if (createDto.departmentId) {
      department = await this.departmentRepository.findOne(
        createDto.departmentId,
      );
    }

    return {
      ...createDto,
      id,
      departmentId: createDto.departmentId,
      department,
      salary: Number(createDto.salary),
      hireDate: createDto.hireDate ? new Date(createDto.hireDate) : undefined,
      status: createDto.status || 'active',
    };
  }

  async findOne(id: string): Promise<Employee | null> {
    const employee = await super.findOne(id);
    if (employee && employee.departmentId) {
      // Fetch department data
      const department = await this.departmentRepository.findOne(
        employee.departmentId,
      );
      return { ...employee, department };
    }
    return employee;
  }

  async findAll(): Promise<Employee[]> {
    const employees = await super.findAll();
    // Enrich with department data
    return Promise.all(
      employees.map(async (employee) => {
        if (employee.departmentId) {
          const department = await this.departmentRepository.findOne(
            employee.departmentId,
          );
          return { ...employee, department };
        }
        return employee;
      }),
    );
  }

  async findByEmail(email: string): Promise<Employee | null> {
    const employee = this.items.find((emp) => emp.email === email);
    if (employee && employee.departmentId) {
      // Fetch department data
      const department = await this.departmentRepository.findOne(
        employee.departmentId,
      );
      return { ...employee, department };
    }
    return employee || null;
  }

  async update(id: string, updateDto: UpdateEmployeeDto): Promise<Employee> {
    const updated = await super.update(id, updateDto);
    // Fetch department data if departmentId exists
    if (updated.departmentId) {
      const department = await this.departmentRepository.findOne(
        updated.departmentId,
      );
      return { ...updated, department };
    }
    return updated;
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
      // Find department by name first, then filter by departmentId
      const departments = await this.departmentRepository.findAll();
      const matchingDept = departments.find(
        (d) => d.name === filters.department,
      );
      if (matchingDept) {
        entityFilters.departmentId = matchingDept.id;
      }
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
    const employees = await this.findMany(queryParams);

    // Enrich with department data
    return Promise.all(
      employees.map(async (employee) => {
        if (employee.departmentId) {
          const department = await this.departmentRepository.findOne(
            employee.departmentId,
          );
          return { ...employee, department };
        }
        return employee;
      }),
    );
  }

  async findMany(queryParams: QueryParams<Employee>): Promise<Employee[]> {
    const employees = await super.findMany(queryParams);
    // Enrich with department data
    return Promise.all(
      employees.map(async (employee) => {
        if (employee.departmentId) {
          const department = await this.departmentRepository.findOne(
            employee.departmentId,
          );
          return { ...employee, department };
        }
        return employee;
      }),
    );
  }
}
