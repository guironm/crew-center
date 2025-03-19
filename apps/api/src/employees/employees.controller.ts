import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import type {
  ApiSearchParams,
  CreateEmployeeDto,
  Employee,
  EmployeeResponseDto,
  UpdateEmployeeDto,
} from '@repo/schemas';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  employeeResponseSchema,
} from '@repo/schemas';
import { ZodPipe } from '../shared/pipes';

// Define local search params interface for simplicity
interface EmployeeSearchParams {
  query?: string;
  department?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@ApiTags('employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search for employees' })
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Search query for name, email, or role',
  })
  @ApiQuery({
    name: 'department',
    required: false,
    description: 'Filter by department',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status',
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
    description: 'Returns employees matching the search criteria',
  })
  async search(
    @Query('query') query?: string,
    @Query('department') department?: string,
    @Query('status') status?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
  ): Promise<EmployeeResponseDto[]> {
    const searchParams = {
      query,
      department,
      status,
      sortBy,
      sortOrder,
    };

    console.log('Received search params:', searchParams);

    // Use the find method which delegates to the search service
    const employees = await this.employeesService.find(searchParams);

    return employees.map((employee) => this.convertToResponseDto(employee));
  }

  @Get()
  @ApiOperation({ summary: 'Get all employees' })
  @ApiOkResponse({
    description:
      'Returns all employees including those generated from random users',
  })
  async findAll(): Promise<EmployeeResponseDto[]> {
    const employees = await this.employeesService.findAll();
    // Convert using the employeeResponseSchema
    return employees.map((employee) => this.convertToResponseDto(employee));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an employee by ID' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @ApiOkResponse({
    description: 'Returns the employee with the specified ID',
  })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  findOne(@Param('id', ParseIntPipe) id: number): EmployeeResponseDto {
    const employee = this.employeesService.findOne(id);
    return this.convertToResponseDto(employee);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiBody({
    description: 'Employee creation data',
  })
  @ApiCreatedResponse({
    description: 'Employee created successfully',
  })
  @ApiConflictResponse({ description: 'Email already exists' })
  create(
    @Body(new ZodPipe(createEmployeeSchema)) body: CreateEmployeeDto,
  ): EmployeeResponseDto {
    const employee = this.employeesService.create(body);
    return this.convertToResponseDto(employee);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an employee' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @ApiBody({
    description: 'Employee update data',
  })
  @ApiOkResponse({
    description: 'Employee updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  @ApiConflictResponse({ description: 'Email already exists' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodPipe(updateEmployeeSchema)) body: UpdateEmployeeDto,
  ): EmployeeResponseDto {
    const employee = this.employeesService.update(id, body);
    return this.convertToResponseDto(employee);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an employee' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @ApiResponse({ status: 204, description: 'Employee deleted successfully' })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  delete(@Param('id', ParseIntPipe) id: number): void {
    this.employeesService.delete(id);
  }

  /**
   * Convert an Employee entity to an EmployeeResponseDto using Zod schema
   */
  private convertToResponseDto(employee: Employee): EmployeeResponseDto {
    // Pre-process the employee data to handle Date conversion
    const processedData = {
      ...employee,
      hireDate: employee.hireDate ? employee.hireDate.toISOString() : undefined,
    };

    // Use Zod schema to validate and transform the data
    return employeeResponseSchema.parse(processedData);
  }
}
