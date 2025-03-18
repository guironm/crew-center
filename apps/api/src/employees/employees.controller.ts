import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Employee } from '@repo/schemas';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all employees' })
  @ApiResponse({
    status: 200,
    description:
      'Returns all employees including those generated from random users',
  })
  async findAll(): Promise<Employee[]> {
    return this.employeesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an employee by ID' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the employee with the specified ID',
  })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Employee | undefined {
    return this.employeesService.findOne(id);
  }
}
