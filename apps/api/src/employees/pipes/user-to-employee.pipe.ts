import { PipeTransform, Injectable } from '@nestjs/common';
import {
  DepartmentName,
  Employee,
  defaultRolesByDepartment,
} from '@repo/schemas';
import { RandomUser } from '../../users/schemas/random-user.schema';
import { DepartmentsService } from '../../departments/departments.service';

@Injectable()
export class UserToEmployeePipe implements PipeTransform<RandomUser, Employee> {
  private lastId = 3; // Starting after our static employees

  constructor(private readonly departmentsService: DepartmentsService) {}

  transform(user: RandomUser): Employee {
    // Increment ID for each transformation
    this.lastId += 1;

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

    return {
      id: this.lastId,
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      role,
      department,
      salary,
      picture: user.picture.large,
    };
  }
}
