import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseInMemoryRepository } from '../../shared/repositories/base-in-memory.repository';
import { Department } from '../entities/department.entity';
import { DepartmentDto } from '../dto/department.dto';

interface DepartmentCreateDto {
  name: string;
  description: string;
}

interface DepartmentUpdateDto {
  name?: string;
  description?: string;
}

@Injectable()
export class InMemoryDepartmentRepository extends BaseInMemoryRepository<
  Department,
  number,
  DepartmentCreateDto,
  DepartmentUpdateDto
> {
  constructor() {
    super();
    // Initialize with hardcoded departments
    this.seedInitialDepartments();
  }

  protected get idField(): keyof Department {
    return 'id';
  }

  protected generateId(): number {
    return this.items.length > 0
      ? Math.max(...this.items.map((item) => item.id)) + 1
      : 1;
  }

  protected mapToEntity(
    createDto: DepartmentCreateDto,
    id: number,
  ): Department {
    return {
      id,
      ...createDto,
    };
  }

  /**
   * Find a department by name (case-insensitive)
   */
  async findByName(name: string): Promise<Department | null> {
    const department = this.items.find(
      (dept) => dept.name.toLowerCase() === name.toLowerCase(),
    );
    return department || null;
  }

  /**
   * Seed initial departments
   */
  private seedInitialDepartments(): void {
    const initialDepartments: Department[] = [
      {
        id: 1,
        name: 'Engineering',
        description: 'Software development and infrastructure',
      },
      {
        id: 2,
        name: 'Marketing',
        description: 'Marketing, communications, and brand management',
      },
      {
        id: 3,
        name: 'Sales',
        description: 'Client acquisition and account management',
      },
      {
        id: 4,
        name: 'Finance',
        description: 'Financial operations and accounting',
      },
      {
        id: 5,
        name: 'HR',
        description: 'Human resources and talent management',
      },
      {
        id: 6,
        name: 'Design',
        description: 'User experience and product design',
      },
      {
        id: 7,
        name: 'Product',
        description: 'Product management and strategy',
      },
    ];

    this.items = initialDepartments;
  }
}
