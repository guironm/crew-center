import { Module } from '@nestjs/common';

import { EmployeesModule } from './employees/employees.module';
import { UsersModule } from './users/users.module';
import { DepartmentsModule } from './departments/departments.module';
import { SharedModule } from './shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pgConfig } from '../dbConfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(pgConfig),
    EmployeesModule,
    UsersModule,
    DepartmentsModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
