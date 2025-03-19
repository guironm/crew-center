import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import type { DepartmentResponseDto } from './entities/department.entity';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('departments')
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all departments' })
  @ApiOkResponse({
    description: 'Returns a list of all departments',
  })
  findAll(): DepartmentResponseDto[] {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a department by ID' })
  @ApiParam({ name: 'id', description: 'Department ID' })
  @ApiOkResponse({
    description: 'Returns the department with the specified ID',
  })
  @ApiNotFoundResponse({ description: 'Department not found' })
  findOne(@Param('id', ParseIntPipe) id: number): DepartmentResponseDto {
    return this.departmentsService.findOne(id);
  }
}
