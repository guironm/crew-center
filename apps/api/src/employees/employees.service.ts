import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  ValidationMessages,
} from '@repo/schemas';
import { UserToEmployeePipe } from './pipes/user-to-employee.pipe';

@Injectable()
export class EmployeesService {
  // Store employees fetched from the API
  private employees: Employee[] = [];
  
  // Track the next available ID
  private nextId = 1;

  constructor(
    private readonly usersService: UsersService,
    private readonly userToEmployeePipe: UserToEmployeePipe,
  ) {}

  async findAll(): Promise<Employee[]> {
    // If we haven't already added employees, fetch them
    if (this.employees.length === 0) {
      try {
        // Get random users and convert them to employees using the pipe
        const randomUsers = await this.usersService.getRandomUsers(8);
        const newEmployees = randomUsers.map((user) =>
          this.userToEmployeePipe.transform(user)
        );
        
        // Store these in our employees array so they can be accessed individually
        this.employees.push(...newEmployees);
      } catch (error) {
        console.error('Failed to fetch random users:', error);
      }
    }

    // Return all employees
    return this.employees;
  }

  findOne(id: number): Employee {
    const employee = this.employees.find((employee) => employee.id === id);

    if (!employee) {
      throw new NotFoundException(ValidationMessages.EMPLOYEE_NOT_FOUND(id));
    }

    return employee;
  }

  create(createEmployeeDto: CreateEmployeeDto): Employee {
    // Check if employee with the same email already exists
    if (createEmployeeDto.email) {
      const existingEmployee = this.employees.find(
        (employee) => employee.email === createEmployeeDto.email,
      );

      if (existingEmployee) {
        throw new ConflictException(
          ValidationMessages.EMPLOYEE_EMAIL_EXISTS(createEmployeeDto.email),
        );
      }
    }

    // Create new employee
    const newEmployee: Employee = {
      id: this.nextId++,
      ...createEmployeeDto,
      status: createEmployeeDto.status || 'active',
      hireDate: createEmployeeDto.hireDate || new Date(),
    };

    // Add to employees array
    this.employees.push(newEmployee);

    return newEmployee;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto): Employee {
    // Find the employee
    const index = this.employees.findIndex((employee) => employee.id === id);

    if (index === -1) {
      throw new NotFoundException(ValidationMessages.EMPLOYEE_NOT_FOUND(id));
    }

    // Since we've checked the index exists, we can safely get the employee
    const currentEmployee = this.employees[index]!;

    // Check if updating email and if it conflicts with existing email
    if (
      updateEmployeeDto.email &&
      updateEmployeeDto.email !== currentEmployee.email &&
      this.employees.some((emp) => emp.email === updateEmployeeDto.email)
    ) {
      throw new ConflictException(
        ValidationMessages.EMPLOYEE_EMAIL_EXISTS(updateEmployeeDto.email),
      );
    }

    // Create the updated employee - explicitly maintaining required fields from the current employee
    const updatedEmployee: Employee = {
      id: currentEmployee.id, // Preserve ID
      name: updateEmployeeDto.name || currentEmployee.name,
      email: updateEmployeeDto.email || currentEmployee.email,
      role: updateEmployeeDto.role || currentEmployee.role,
      department: updateEmployeeDto.department || currentEmployee.department,
      salary: updateEmployeeDto.salary || currentEmployee.salary,
      status: updateEmployeeDto.status || currentEmployee.status,
      picture:
        updateEmployeeDto.picture !== undefined
          ? updateEmployeeDto.picture
          : currentEmployee.picture,
      hireDate: updateEmployeeDto.hireDate || currentEmployee.hireDate,
    };

    this.employees[index] = updatedEmployee;

    return updatedEmployee;
  }

  delete(id: number): void {
    const index = this.employees.findIndex((employee) => employee.id === id);

    if (index === -1) {
      throw new NotFoundException(ValidationMessages.EMPLOYEE_NOT_FOUND(id));
    }

    this.employees.splice(index, 1);
  }
}
