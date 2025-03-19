import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { UsersModule } from '../users/users.module';
import { UserToEmployeePipe } from './pipes/user-to-employee.pipe';
import { SearchService } from '../search/search.service';

@Module({
  imports: [UsersModule],
  controllers: [EmployeesController],
  providers: [EmployeesService, UserToEmployeePipe, SearchService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
