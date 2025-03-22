import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { DEPARTMENT_REPOSITORY } from '../repositories/department-repository.interface';
import type { IDepartmentRepository } from '../repositories/department-repository.interface';
import { CreateDepartmentDto } from '@repo/schemas';

@Injectable()
export class DepartmentSeederService implements OnModuleInit {
  private readonly logger = new Logger(DepartmentSeederService.name);

  // Required departments that should always exist
  private readonly requiredDepartments: CreateDepartmentDto[] = [
    {
      name: 'Engineering',
      description: 'Software development and infrastructure',
    },
    {
      name: 'Marketing',
      description: 'Marketing, communications, and brand management',
    },
    {
      name: 'Sales',
      description: 'Client acquisition and account management',
    },
    {
      name: 'Finance',
      description: 'Financial operations and accounting',
    },
    {
      name: 'HR',
      description: 'Human resources and talent management',
    },
    {
      name: 'Design',
      description: 'User experience and product design',
    },
    {
      name: 'Product',
      description: 'Product management and strategy',
    },
  ];

  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  /**
   * Automatically run when the module is initialized
   */
  async onModuleInit(): Promise<void> {
    this.logger.log('Initializing department seeder...');
    await this.seedRequiredDepartments();
  }

  /**
   * Seeds required departments if they don't already exist
   */
  async seedRequiredDepartments(): Promise<void> {
    try {
      this.logger.log('Checking for required departments...');

      // Create a list to keep track of departments that need to be created
      const departmentsToCreate: CreateDepartmentDto[] = [];

      // Check each required department
      for (const requiredDept of this.requiredDepartments) {
        const existingDept = await this.departmentRepository.findByName(
          requiredDept.name,
        );

        if (!existingDept) {
          this.logger.log(
            `Department "${requiredDept.name}" not found. Will create.`,
          );
          departmentsToCreate.push(requiredDept);
        } else {
          this.logger.log(`Department "${requiredDept.name}" already exists.`);
        }
      }

      // Create any missing departments
      if (departmentsToCreate.length > 0) {
        this.logger.log(
          `Creating ${departmentsToCreate.length} missing departments...`,
        );

        for (const deptToCreate of departmentsToCreate) {
          await this.departmentRepository.create(deptToCreate);
          this.logger.log(`Created department: ${deptToCreate.name}`);
        }

        this.logger.log(
          'All required departments have been created successfully.',
        );
      } else {
        this.logger.log(
          'All required departments already exist. No seeding needed.',
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to seed departments: ${errorMessage}`);
      throw error; // Re-throw to ensure the application startup fails if departments can't be seeded
    }
  }
}
