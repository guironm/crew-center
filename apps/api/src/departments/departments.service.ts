import { Injectable } from '@nestjs/common';
import { Department } from './entities/department.entity';

@Injectable()
export class DepartmentsService {
  private departments: Department[] = [
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

  findAll(): Department[] {
    return this.departments;
  }

  findOne(id: number): Department | undefined {
    return this.departments.find((department) => department.id === id);
  }

  findByName(name: string): Department | undefined {
    return this.departments.find(
      (department) => department.name.toLowerCase() === name.toLowerCase(),
    );
  }
}
