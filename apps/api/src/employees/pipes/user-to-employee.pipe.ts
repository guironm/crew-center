import { PipeTransform, Injectable } from '@nestjs/common';
import {
  DepartmentName,
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
    const departmentNames = Object.keys(
      defaultRolesByDepartment,
    ) as DepartmentName[];
    const departmentIndex = Math.floor(Math.random() * departmentNames.length);
    // This is safe because we know departmentNames has values from the enum
    const department = departmentNames[departmentIndex] as DepartmentName;

    // Get roles for the department - this is now type-safe
    const roles = defaultRolesByDepartment[department];
    const roleIndex = Math.floor(Math.random() * roles.length);
    const role = roles[roleIndex] as string; // Non-null assertion

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
