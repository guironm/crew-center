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
  // Sample static employees data
  private employees: Employee[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Software Engineer',
      department: 'Engineering',
      salary: 95000,
      status: 'active',
      hireDate: new Date('2021-01-15'),
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'Product Manager',
      department: 'Product',
      salary: 110000,
      status: 'active',
      hireDate: new Date('2020-08-10'),
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@company.com',
      role: 'UX Designer',
      department: 'Design',
      salary: 90000,
      status: 'active',
      hireDate: new Date('2022-03-22'),
    },
  ];

  // Track the next available ID
  private nextId = 4;

  constructor(
    private readonly usersService: UsersService,
    private readonly userToEmployeePipe: UserToEmployeePipe,
  ) {}

  async findAll(): Promise<Employee[]> {
    // Get existing employees
    const existingEmployees = [...this.employees];

    // Get additional random users and convert them to employees using the pipe
    try {
      const randomUsers = await this.usersService.getRandomUsers(5);
      const additionalEmployees = randomUsers.map((user) =>
        this.userToEmployeePipe.transform(user),
      );

      // Combine existing employees with new ones generated from random users
      return [...existingEmployees, ...additionalEmployees];
    } catch {
      // If there's an error fetching random users, just return existing employees
      return existingEmployees;
    }
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
