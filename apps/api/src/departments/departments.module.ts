import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { Department } from './entities/department.entity';
import { InMemoryDepartmentRepository } from './repositories/in-memory-department.repository';
import { TypeOrmDepartmentRepository } from './repositories/typeorm-department.repository';
import { DepartmentQueryBuilderService } from './query-builder.service';
import { DEPARTMENT_REPOSITORY } from './repositories/department-repository.interface';
import { env } from '../config/env';
import { DepartmentSeederService } from './services/department-seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Department])],
  controllers: [DepartmentsController],
  providers: [
    DepartmentsService,
    DepartmentQueryBuilderService,
    DepartmentSeederService,
    {
      provide: DEPARTMENT_REPOSITORY,
      useClass: env.USE_DATABASE
        ? TypeOrmDepartmentRepository
        : InMemoryDepartmentRepository,
    },
  ],
  exports: [DepartmentsService, DEPARTMENT_REPOSITORY],
})
export class DepartmentsModule {}
