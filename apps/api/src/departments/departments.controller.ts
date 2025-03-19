import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import type { DepartmentResponseDto } from './entities/department.entity';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('departments')
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search for departments' })
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Search query for name or description',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order',
  })
  @ApiOkResponse({
    description: 'Returns departments matching the search criteria',
  })
  search(
    @Query('query') query?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
  ): DepartmentResponseDto[] {
    const searchParams = {
      query,
      sortBy,
      sortOrder,
    };

    return this.departmentsService.find(searchParams);
  }

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
