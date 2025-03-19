import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { UsersModule } from '../users/users.module';
import { DepartmentsModule } from '../departments/departments.module';
import { UserToEmployeePipe } from './pipes/user-to-employee.pipe';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [UsersModule, DepartmentsModule, SharedModule],
  controllers: [EmployeesController],
  providers: [EmployeesService, UserToEmployeePipe],
  exports: [EmployeesService],
})
export class EmployeesModule {}
