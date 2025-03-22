import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { UsersModule } from '../users/users.module';
import { UserToEmployeePipe } from './pipes/user-to-employee.pipe';
import { InMemoryEmployeeRepository } from './repositories/in-memory-employee.repository';
import { SharedModule } from '../shared/shared.module';
import { EmployeeSeederService } from './services/employee-seeder.service';
import { EmployeeQueryBuilderService } from './services/query-builder.service';

@Module({
  imports: [UsersModule, SharedModule],
  controllers: [EmployeesController],
  providers: [
    EmployeesService,
    UserToEmployeePipe,
    EmployeeSeederService,
    EmployeeQueryBuilderService,
    {
      provide: 'EMPLOYEE_REPOSITORY',
      useClass: InMemoryEmployeeRepository,
    },
  ],
  exports: [EmployeesService],
})
export class EmployeesModule {}
