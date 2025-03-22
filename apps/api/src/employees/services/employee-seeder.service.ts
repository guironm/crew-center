import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { UserToEmployeePipe } from '../pipes/user-to-employee.pipe';
import type { IEmployeeRepository } from '../repositories/employee-repository.interface';
import { env } from '../../config/env';

@Injectable()
export class EmployeeSeederService implements OnModuleInit {
  private readonly logger = new Logger(EmployeeSeederService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly userToEmployeePipe: UserToEmployeePipe,
    @Inject('EMPLOYEE_REPOSITORY')
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  /**
   * Automatically run when the module is initialized
   */
  async onModuleInit(): Promise<void> {
    this.logger.log('Initializing employee seeder...');
    await this.seedEmployees();
  }

  /**
   * Seeds the employee repository with random users
   */
  async seedEmployees(): Promise<void> {
    try {
      const count = env.SEED_EMPLOYEE_COUNT;
      this.logger.log(`Seeding ${count} employees...`);

      // Check if we already have employees in the repository
      const existingEmployees = await this.employeeRepository.findAll();
      if (existingEmployees.length > 0) {
        this.logger.log(
          `Found ${existingEmployees.length} existing employees. Skipping seeding.`,
        );
        return;
      }

      // Get random users and convert them to employees using the pipe
      const randomUsers = await this.usersService.getRandomUsers(count);
      const newEmployees = randomUsers.map((user) =>
        this.userToEmployeePipe.transform(user),
      );

      // Add them to the repository
      await this.employeeRepository.addMany(newEmployees);
      this.logger.log(`Successfully seeded ${newEmployees.length} employees`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to seed employees: ${errorMessage}`);
    }
  }
}
