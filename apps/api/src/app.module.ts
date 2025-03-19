import { Module } from '@nestjs/common';

import { EmployeesModule } from './employees/employees.module';
import { UsersModule } from './users/users.module';
import { DepartmentsModule } from './departments/departments.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [EmployeesModule, UsersModule, DepartmentsModule, SharedModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
