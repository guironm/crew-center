import { PipeTransform, Injectable } from '@nestjs/common';
import {
  Employee,
  defaultRolesByDepartment,
  employeeStatusEnum,
  EmployeeStatus,
} from '@repo/schemas';
import { RandomUser } from '../../users/schemas/random-user.schema';
import { v4 as uuidv4 } from 'uuid';

//I was hoping to use this pipe to transform the user to an employee, but currently I am just using it as a mapper
@Injectable()
export class UserToEmployeePipe implements PipeTransform<RandomUser, Employee> {
  transform(user: RandomUser): Employee {
    // Randomly select a department from our known departments
    const departmentNames = Object.keys(defaultRolesByDepartment);
    const departmentIndex = Math.floor(Math.random() * departmentNames.length);
    // Default to Engineering if for some reason the array is empty
    const department = departmentNames[departmentIndex] || 'Engineering';

    // Get roles for the department - ensure there's always at least one role
    const roles = defaultRolesByDepartment[department] || ['Employee'];
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

    // Use the user's UUID if it exists, otherwise generate a new one
    return {
      id: user.id || uuidv4(), // Generate a UUID for each employee
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      status: randomStatus,
      role,
      department,
      salary,
      picture: user.picture.large,
    };
  }
}
