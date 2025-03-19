import { Module } from '@nestjs/common';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { SharedModule } from '../shared/shared.module';
import { SearchService } from '../search/search.service';

@Module({
  imports: [SharedModule],
  controllers: [DepartmentsController],
  providers: [DepartmentsService, SearchService],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
