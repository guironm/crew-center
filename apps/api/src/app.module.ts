import { Module } from '@nestjs/common';

import { EmployeesModule } from './employees/employees.module';
import { UsersModule } from './users/users.module';
import { DepartmentsModule } from './departments/departments.module';

@Module({
  imports: [EmployeesModule, UsersModule, DepartmentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
