import { Injectable, NotFoundException } from '@nestjs/common';
import { Department } from './entities/department.entity';
import { SearchService } from '../search/search.service';
import { ApiSearchParams } from '@repo/schemas';

@Injectable()
export class DepartmentsService {
  // Hardcoded list of departments
  private readonly departments: Department[] = [
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

  constructor(private readonly searchService: SearchService) {}

  /**
   * Get all departments
   * @returns List of all departments
   */
  findAll(): Department[] {
    return this.departments;
  }

  /**
   * Find a department by ID
   * @param id Department ID
   * @returns Department if found
   * @throws NotFoundException if department not found
   */
  findOne(id: number): Department {
    const department = this.departments.find(
      (department) => department.id === id,
    );

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
  findByName(name: string): Department | undefined {
    return this.departments.find(
      (department) => department.name.toLowerCase() === name.toLowerCase(),
    );
  }

  /**
   * Find departments based on search parameters
   * @param searchParams Search parameters for filtering
   * @returns Filtered list of departments
   */
  find(searchParams: ApiSearchParams): Department[] {
    return this.searchService.search(
      this.departments,
      searchParams,
      ['name', 'description'], // Fields to search when query is provided
    );
  }
}
