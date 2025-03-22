import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  ValidationMessages,
  ApiSearchParams,
} from '@repo/schemas';
import { UserToEmployeePipe } from './pipes/user-to-employee.pipe';
import type { IEmployeeRepository } from './repositories/employee-repository.interface';
import { EmployeeQueryBuilderService } from './services/query-builder.service';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly usersService: UsersService,
    private readonly userToEmployeePipe: UserToEmployeePipe,
    private readonly queryBuilder: EmployeeQueryBuilderService,
    @Inject('EMPLOYEE_REPOSITORY')
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.findAll();
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne(id);
    if (!employee) {
      throw new NotFoundException(ValidationMessages.EMPLOYEE_NOT_FOUND(id));
    }
    return employee;
  }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    // Check if employee with this email already exists
    const existingEmployee = await this.employeeRepository.findByEmail(
      createEmployeeDto.email,
    );

    if (existingEmployee) {
      throw new ConflictException(
        ValidationMessages.EMAIL_ALREADY_EXISTS(createEmployeeDto.email),
      );
    }

    // Create new employee with UUID
    return this.employeeRepository.create(createEmployeeDto);
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    // Check if we're trying to update to an email that's already taken
    if (updateEmployeeDto.email) {
      const emailOwner = await this.employeeRepository.findByEmail(
        updateEmployeeDto.email,
      );

      if (emailOwner && emailOwner.id !== id) {
        throw new ConflictException(
          ValidationMessages.EMAIL_ALREADY_EXISTS(
            updateEmployeeDto.email + ' ',
          ),
        );
      }
    }

    try {
      return await this.employeeRepository.update(id, updateEmployeeDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(ValidationMessages.EMPLOYEE_NOT_FOUND(id));
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to update employee: ${errorMessage}`);
    }
  }

  async delete(id: string): Promise<void> {
    // Check if employee exists first
    const employee = await this.employeeRepository.findOne(id);
    if (!employee) {
      throw new NotFoundException(ValidationMessages.EMPLOYEE_NOT_FOUND(id));
    }

    await this.employeeRepository.delete(id);
  }

  /**
   * Find employees based on search parameters
   * @param searchParams Search parameters for filtering
   * @returns Filtered list of employees
   */
  async find(searchParams: ApiSearchParams): Promise<Employee[]> {
    // For backward compatibility, we still support the old format
    // but internally we use our new query parameters format

    // Option 1: Use the legacy method that is already compatible with our repositories
    // return this.employeeRepository.findWithFilters(searchParams);

    // Option 2: Use the new query builder approach (commented out for now)
    const queryParams = this.queryBuilder.buildQueryParams(searchParams);
    return this.employeeRepository.findMany(queryParams);
  }
}
