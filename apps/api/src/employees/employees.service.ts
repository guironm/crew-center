import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Employee } from '@repo/schemas';
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
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'Product Manager',
      department: 'Product',
      salary: 110000,
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@company.com',
      role: 'UX Designer',
      department: 'Design',
      salary: 90000,
    },
  ];

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

  findOne(id: number): Employee | undefined {
    return this.employees.find((employee) => employee.id === id);
  }
}
