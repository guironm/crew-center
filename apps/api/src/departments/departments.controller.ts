import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Department } from './entities/department.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('departments')
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all departments' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all departments',
  })
  findAll(): Department[] {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a department by ID' })
  @ApiParam({ name: 'id', description: 'Department ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the department with the specified ID',
  })
  @ApiResponse({ status: 404, description: 'Department not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Department | undefined {
    return this.departmentsService.findOne(id);
  }
}
