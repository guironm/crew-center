import { Module } from '@nestjs/common';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { InMemoryDepartmentRepository } from './repositories/in-memory-department.repository';
import { DepartmentQueryBuilderService } from './query-builder.service';

@Module({
  controllers: [DepartmentsController],
  providers: [
    DepartmentsService,
    InMemoryDepartmentRepository,
    DepartmentQueryBuilderService,
  ],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
