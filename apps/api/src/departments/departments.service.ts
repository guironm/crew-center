import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Department } from './entities/department.entity';
import { ApiSearchParams } from '@repo/schemas';
import { DEPARTMENT_REPOSITORY } from './repositories/department-repository.interface';
import type { IDepartmentRepository } from './repositories/department-repository.interface';
import { DepartmentQueryBuilderService } from './query-builder.service';

@Injectable()
export class DepartmentsService {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
    private readonly queryBuilder: DepartmentQueryBuilderService,
  ) {}

  /**
   * Get all departments
   * @returns List of all departments
   */
  findAll(): Promise<Department[]> {
    return this.departmentRepository.findAll();
  }

  /**
   * Find a department by ID
   * @param id Department ID
   * @returns Department if found
   * @throws NotFoundException if department not found
   */
  async findOne(id: string): Promise<Department> {
    const department = await this.departmentRepository.findOne(id);

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return department;
  }

  /**
   * Find a department by name (case-insensitive)
   * @param name Department name
   * @returns Department if found, otherwise undefined
   */
  findByName(name: string): Promise<Department | null> {
    return this.departmentRepository.findByName(name);
  }

  /**
   * Find departments based on search parameters
   * @param searchParams Search parameters for filtering
   * @returns Filtered list of departments
   */
  async find(searchParams: ApiSearchParams): Promise<Department[]> {
    const queryParams = this.queryBuilder.buildQueryParams(searchParams);
    return this.departmentRepository.findMany(queryParams);
  }
}
