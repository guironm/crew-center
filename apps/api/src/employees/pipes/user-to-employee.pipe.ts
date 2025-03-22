import {
  PipeTransform,
  Injectable,
  Inject,
  ArgumentMetadata,
} from '@nestjs/common';
import {
  Employee,
  defaultRolesByDepartment,
  employeeStatusEnum,
  EmployeeStatus,
} from '@repo/schemas';
import { RandomUser } from '../../users/schemas/random-user.schema';
import { v4 as uuidv4 } from 'uuid';
import { DEPARTMENT_REPOSITORY } from '../../departments/repositories/department-repository.interface';

//I was hoping to use this pipe to transform the user to an employee, but currently I am just using it as a mapper
@Injectable()
export class UserToEmployeePipe
  implements PipeTransform<RandomUser, Promise<Employee>>
{
  private departmentCache: Map<string, string> = new Map(); // Cache department names to IDs

  constructor(
    @Inject(DEPARTMENT_REPOSITORY) private departmentRepository: any,
  ) {}

  async transform(
    user: RandomUser,
    metadata?: ArgumentMetadata,
  ): Promise<Employee> {
    // Randomly select a department from our known departments
    const departmentNames = Object.keys(defaultRolesByDepartment);
    const departmentIndex = Math.floor(Math.random() * departmentNames.length);
    // Default to Engineering if for some reason the array is empty
    const departmentName = departmentNames[departmentIndex] || 'Engineering';

    // Get roles for the department - ensure there's always at least one role
    const roles = defaultRolesByDepartment[departmentName] || ['Employee'];
    const roleIndex = Math.floor(Math.random() * roles.length);
    const role = roles[roleIndex] || 'Employee';

    // Generate a random salary between 60000 and 150000
    const salary = Math.floor(Math.random() * (150000 - 60000)) + 60000;

    // Generate a random status using the enum values
    const statusValues = Object.values(employeeStatusEnum.enum);
    const randomStatusIndex = Math.floor(Math.random() * statusValues.length);
    // Use a default value to ensure we never have undefined
    const randomStatus: EmployeeStatus =
      statusValues[randomStatusIndex] || 'active';

    // Generate a random hire date between 5 years ago and today
    const today = new Date();
    const fiveYearsAgo = new Date(today);
    fiveYearsAgo.setFullYear(today.getFullYear() - 5);
    const randomTimestamp =
      fiveYearsAgo.getTime() +
      Math.random() * (today.getTime() - fiveYearsAgo.getTime());
    const hireDate = new Date(randomTimestamp);

    // Get departmentId from cache or find/create it
    let departmentId: string = this.departmentCache.get(departmentName) || '';

    if (!departmentId) {
      // Check if department exists
      const departments = await this.departmentRepository.findAll();
      const existingDepartment = departments.find(
        (d) => d.name === departmentName,
      );

      if (existingDepartment) {
        departmentId = existingDepartment.id;
      } else {
        // Create the department if it doesn't exist
        const newDepartment = await this.departmentRepository.create({
          name: departmentName,
          description: `${departmentName} department`,
        });
        departmentId = newDepartment.id;
      }

      // Cache the departmentId for future use
      this.departmentCache.set(departmentName, departmentId);
    }

    // Use the user's UUID if it exists, otherwise generate a new one
    return {
      id: user.id || uuidv4(), // Generate a UUID for each employee
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      status: randomStatus,
      role,
      departmentId,
      salary,
      picture: user.picture.large,
      hireDate,
    };
  }
}
