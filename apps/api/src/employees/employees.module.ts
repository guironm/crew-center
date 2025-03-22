import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { UsersModule } from '../users/users.module';
import { UserToEmployeePipe } from './pipes/user-to-employee.pipe';
import { InMemoryEmployeeRepository } from './repositories/in-memory-employee.repository';
import { TypeOrmEmployeeRepository } from './repositories/typeorm-employee.repository';
import { SharedModule } from '../shared/shared.module';
import { EmployeeSeederService } from './services/employee-seeder.service';
import { EmployeeQueryBuilderService } from './services/query-builder.service';
import { EMPLOYEE_REPOSITORY } from './repositories/employee-repository.interface';
import { EmployeeEntity } from './entities/employee.entity';
import { env } from '../config/env';
import { EmployeeEntityMapper } from './mappers/employee-entity.mapper';
import { DepartmentsModule } from '../departments/departments.module';
import { PaginatedEmployeeQueryBuilder } from './services/paginated-query-builder.service';
import { PaginatedEmployeeRepository } from './repositories/paginated-employee-repository';
import { PaginatedEmployeesService } from './services/paginated-employees.service';

@Module({
  imports: [
    UsersModule,
    SharedModule,
    DepartmentsModule,
    TypeOrmModule.forFeature([EmployeeEntity]),
  ],
  controllers: [EmployeesController],
  providers: [
    EmployeesService,
    UserToEmployeePipe,
    EmployeeSeederService,
    EmployeeQueryBuilderService,
    EmployeeEntityMapper,
    PaginatedEmployeeQueryBuilder,
    PaginatedEmployeeRepository,
    PaginatedEmployeesService,
    {
      provide: EMPLOYEE_REPOSITORY,
      useClass: env.USE_DATABASE
        ? TypeOrmEmployeeRepository
        : InMemoryEmployeeRepository,
    },
  ],
  exports: [EmployeesService, PaginatedEmployeesService],
})
export class EmployeesModule {}
