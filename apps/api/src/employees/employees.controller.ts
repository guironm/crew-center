import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
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
import { EmployeeMapper } from '../shared/mappers';

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
  constructor(
    private readonly employeesService: EmployeesService,
    private readonly employeeMapper: EmployeeMapper,
  ) {}

  @Get('search')
  @ApiOperation({ summary: 'Search for employees' })
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Search query for name, email, or role',
    type: String,
  })
  @ApiQuery({
    name: 'department',
    required: false,
    description: 'Filter by department',
    type: String,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status',
    type: String,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Sort by field',
    type: String,
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order (asc or desc)',
    type: String,
    enum: ['asc', 'desc'],
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

    return this.employeeMapper.toResponseDtoList(employees);
  }

  @Get()
  @ApiOperation({ summary: 'Get all employees' })
  @ApiOkResponse({
    description:
      'Returns all employees including those generated from random users',
  })
  async findAll(): Promise<EmployeeResponseDto[]> {
    const employees = await this.employeesService.findAll();
    return this.employeeMapper.toResponseDtoList(employees);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an employee by ID' })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the employee',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The found employee',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Software Engineer',
        department: 'Engineering',
        salary: 80000,
        status: 'active',
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<EmployeeResponseDto> {
    const employee = await this.employeesService.findOne(id);
    return this.employeeMapper.toResponseDto(employee);
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
  async create(
    @Body(new ZodPipe(createEmployeeSchema)) body: CreateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    const employee = await this.employeesService.create(body);
    return this.employeeMapper.toResponseDto(employee);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an employee' })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the employee to update',
    type: String,
  })
  @ApiBody({
    schema: { example: { name: 'Jane Doe', salary: 85000 } },
  })
  @ApiResponse({
    status: 200,
    description: 'The updated employee',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Jane Doe',
        email: 'john.doe@example.com',
        salary: 85000,
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  @ApiConflictResponse({ description: 'Email already in use' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodPipe(updateEmployeeSchema)) body: UpdateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    const updatedEmployee = await this.employeesService.update(id, body);
    return this.employeeMapper.toResponseDto(updatedEmployee);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an employee' })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the employee to delete',
    type: String,
  })
  @ApiResponse({ status: 204, description: 'Employee deleted successfully' })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.employeesService.delete(id);
  }
}
