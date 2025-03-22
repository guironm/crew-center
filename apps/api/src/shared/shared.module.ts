import { Module } from '@nestjs/common';
import { EmployeeMapper } from './mappers';

@Module({
  providers: [EmployeeMapper],
  exports: [EmployeeMapper],
})
export class SharedModule {}
