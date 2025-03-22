import { Injectable } from '@nestjs/common';
import { BaseInMemoryRepository } from '../../shared/repositories/base-in-memory.repository';
import { Department } from '../entities/department.entity';
import { IDepartmentRepository } from './department-repository.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateDepartmentDto, UpdateDepartmentDto } from '@repo/schemas';

@Injectable()
export class InMemoryDepartmentRepository
  extends BaseInMemoryRepository<
    Department,
    string,
    CreateDepartmentDto,
    UpdateDepartmentDto
  >
  implements IDepartmentRepository
{
  constructor() {
    super();
    // Initialize with hardcoded departments
    this.seedInitialDepartments();
  }

  protected get idField(): keyof Department {
    return 'id';
  }

  protected generateId(): string {
    return uuidv4();
  }

  protected mapToEntity(
    createDto: CreateDepartmentDto,
    id: string,
  ): Department {
    return {
      id,
      ...createDto,
    };
  }

  /**
   * Find a department by name (case-insensitive)
   */
  findByName(name: string): Promise<Department | null> {
    const department = this.items.find(
      (dept) => dept.name.toLowerCase() === name.toLowerCase(),
    );
    return Promise.resolve(department || null);
  }

  /**
   * Seed initial departments
   */
  private seedInitialDepartments(): void {
    const initialDepartments: Department[] = [
      {
        id: uuidv4(),
        name: 'Engineering',
        description: 'Software development and infrastructure',
      },
      {
        id: uuidv4(),
        name: 'Marketing',
        description: 'Marketing, communications, and brand management',
      },
      {
        id: uuidv4(),
        name: 'Sales',
        description: 'Client acquisition and account management',
      },
      {
        id: uuidv4(),
        name: 'Finance',
        description: 'Financial operations and accounting',
      },
      {
        id: uuidv4(),
        name: 'HR',
        description: 'Human resources and talent management',
      },
      {
        id: uuidv4(),
        name: 'Design',
        description: 'User experience and product design',
      },
      {
        id: uuidv4(),
        name: 'Product',
        description: 'Product management and strategy',
      },
    ];

    this.items = initialDepartments;
  }
}
