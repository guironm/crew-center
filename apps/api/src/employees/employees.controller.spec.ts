/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '@repo/schemas';
import { EmployeeMapper } from '../shared/mappers';
import { PaginatedEmployeesService } from './services/paginated-employees.service';
import { PaginatedEmployeeQueryBuilder } from './services/paginated-query-builder.service';
import { PaginatedEmployeeRepository } from './repositories/paginated-employee-repository';
import { EmployeeQueryBuilderService } from './services/query-builder.service';
import { EMPLOYEE_REPOSITORY } from './repositories/employee-repository.interface';
import { EmployeeEntityMapper } from './mappers/employee-entity.mapper';
import { SharedModule } from '../shared/shared.module';

describe('EmployeesController', () => {
  let controller: EmployeesController;

  // Mock department data
  const mockDepartments = {
    engineering: { id: 'd1', name: 'Engineering', description: 'Engineering department' },
    product: { id: 'd2', name: 'Product', description: 'Product department' },
    design: { id: 'd3', name: 'Design', description: 'Design department' },
  };

  // Create mock employees
  const mockEmployees: Employee[] = [
    {
      id: '1c24ab2c-e192-4188-8d69-481e98e83236',
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Software Engineer',
      departmentId: mockDepartments.engineering.id,
      department: mockDepartments.engineering,
      salary: 95000,
      status: 'active',
      hireDate: new Date('2021-01-15'),
    },
    {
      id: '3a36c384-d714-45b7-b5c9-24d9e2c9344e',
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'Product Manager',
      departmentId: mockDepartments.product.id,
      department: mockDepartments.product,
      salary: 110000,
      status: 'active',
      hireDate: new Date('2020-08-10'),
    },
  ];

  // Mock employee response DTOs
  const mockEmployeeResponseDtos = mockEmployees.map((emp) => ({
    ...emp,
    hireDate: emp.hireDate?.toISOString(),
  }));

  // Mock the EmployeesService
  const mockEmployeesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
  };

  // Mock the PaginatedEmployeesService
  const mockPaginatedEmployeesService = {
    findPaginated: jest.fn(),
  };

  // Mock repositories and other dependencies
  const mockEmployeeRepository = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findWithFilters: jest.fn(),
    addMany: jest.fn(),
  };
  
  const mockPaginatedEmployeeRepository = {
    findManyPaginated: jest.fn(),
  };

  const mockEmployeeQueryBuilder = {
    buildQueryParams: jest.fn(),
  };

  const mockPaginatedEmployeeQueryBuilder = {
    buildPaginatedQueryParams: jest.fn(),
  };

  const mockEmployeeEntityMapper = {
    toDomain: jest.fn(),
    toDomainList: jest.fn(),
    toEntity: jest.fn(),
  };

  // Mock the EmployeeMapper
  const mockEmployeeMapper = {
    toResponseDto: jest.fn().mockImplementation((emp) => ({
      ...emp,
      hireDate: emp.hireDate?.toISOString(),
    })),
    toResponseDtoList: jest.fn().mockImplementation((emps) =>
      emps.map((emp) => ({
        ...emp,
        hireDate: emp.hireDate?.toISOString(),
      })),
    ),
    toResponseDtoWithoutId: jest.fn(),
    toResponseDtoListWithoutId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [EmployeesController],
      providers: [
        { provide: EmployeesService, useValue: mockEmployeesService },
        { provide: EmployeeMapper, useValue: mockEmployeeMapper },
        { provide: PaginatedEmployeesService, useValue: mockPaginatedEmployeesService },
        { provide: PaginatedEmployeeQueryBuilder, useValue: mockPaginatedEmployeeQueryBuilder },
        { provide: PaginatedEmployeeRepository, useValue: mockPaginatedEmployeeRepository },
        { provide: EmployeeQueryBuilderService, useValue: mockEmployeeQueryBuilder },
        { provide: EmployeeEntityMapper, useValue: mockEmployeeEntityMapper },
        { provide: EMPLOYEE_REPOSITORY, useValue: mockEmployeeRepository },
      ],
    }).compile();

    controller = module.get<EmployeesController>(EmployeesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of employees', async () => {
      mockEmployeesService.findAll.mockResolvedValue(mockEmployees);
      mockEmployeeMapper.toResponseDtoList.mockReturnValue(
        mockEmployeeResponseDtos,
      );

      const result = await controller.findAll();

      expect(result.length).toBe(mockEmployees.length);
      expect(mockEmployeesService.findAll).toHaveBeenCalled();
      expect(mockEmployeeMapper.toResponseDtoList).toHaveBeenCalledWith(
        mockEmployees,
      );
    });
  });

  describe('findOne', () => {
    it('should return a single employee', async () => {
      const employeeId = '1c24ab2c-e192-4188-8d69-481e98e83236';
      mockEmployeesService.findOne.mockResolvedValue(mockEmployees[0]);
      mockEmployeeMapper.toResponseDto.mockReturnValue(
        mockEmployeeResponseDtos[0],
      );

      const result = await controller.findOne(employeeId);

      expect(result).toBeDefined();
      expect(result.id).toBe(employeeId);
      expect(mockEmployeesService.findOne).toHaveBeenCalledWith(employeeId);
      expect(mockEmployeeMapper.toResponseDto).toHaveBeenCalledWith(
        mockEmployees[0],
      );
    });
  });

  describe('create', () => {
    it('should create a new employee', async () => {
      const createEmployeeDto: CreateEmployeeDto = {
        name: 'New Employee',
        email: 'new@example.com',
        role: 'Designer',
        departmentId: mockDepartments.design.id,
        salary: 85000,
        status: 'active',
      };

      const newEmployee = {
        id: '4f7d0e9d-7c6b-49c3-8c41-a3a58c8d3b9f',
        ...createEmployeeDto,
        department: mockDepartments.design,
        hireDate: new Date(),
      };

      const newEmployeeResponse = {
        ...newEmployee,
        hireDate: newEmployee.hireDate.toISOString(),
      };

      mockEmployeesService.create.mockResolvedValue(newEmployee);
      mockEmployeeMapper.toResponseDto.mockReturnValue(newEmployeeResponse);

      const result = await controller.create(createEmployeeDto);

      expect(result).toBeDefined();
      expect(result.name).toBe(createEmployeeDto.name);
      expect(mockEmployeesService.create).toHaveBeenCalledWith(
        createEmployeeDto,
      );
      expect(mockEmployeeMapper.toResponseDto).toHaveBeenCalledWith(
        newEmployee,
      );
    });
  });

  describe('update', () => {
    it('should update an employee', async () => {
      const employeeId = '1c24ab2c-e192-4188-8d69-481e98e83236';
      const updateEmployeeDto: UpdateEmployeeDto = {
        name: 'Updated Name',
        salary: 100000,
      };

      const updatedEmployee = {
        ...mockEmployees[0],
        name: 'Updated Name',
        salary: 100000,
      };

      const updatedEmployeeResponse = {
        ...updatedEmployee,
        hireDate: updatedEmployee.hireDate
          ? updatedEmployee.hireDate.toISOString()
          : undefined,
      };

      mockEmployeesService.update.mockResolvedValue(updatedEmployee);
      mockEmployeeMapper.toResponseDto.mockReturnValue(updatedEmployeeResponse);

      const result = await controller.update(employeeId, updateEmployeeDto);

      expect(result).toBeDefined();
      expect(result.name).toBe(updateEmployeeDto.name);
      expect(result.salary).toBe(updateEmployeeDto.salary);
      expect(mockEmployeesService.update).toHaveBeenCalledWith(
        employeeId,
        updateEmployeeDto,
      );
      expect(mockEmployeeMapper.toResponseDto).toHaveBeenCalledWith(
        updatedEmployee,
      );
    });
  });

  describe('delete', () => {
    it('should delete an employee', async () => {
      const employeeId = '1c24ab2c-e192-4188-8d69-481e98e83236';

      await controller.delete(employeeId);

      expect(mockEmployeesService.delete).toHaveBeenCalledWith(employeeId);
    });
  });

  describe('search', () => {
    it('should search employees with query params', async () => {
      const searchParams = {
        query: 'John',
        department: 'Engineering',
        status: 'active',
        sortBy: 'name',
        sortOrder: 'asc' as const,
      };

      // Mock the find method to return filtered employees
      mockEmployeesService.find.mockResolvedValue([mockEmployees[0]]);
      mockEmployeeMapper.toResponseDtoList.mockReturnValue([
        mockEmployeeResponseDtos[0],
      ]);

      const result = await controller.search(
        searchParams.query,
        searchParams.department,
        searchParams.status,
        searchParams.sortBy,
        searchParams.sortOrder,
      );

      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0]?.name).toBe('John Doe');
      expect(mockEmployeesService.find).toHaveBeenCalledWith(searchParams);
      expect(mockEmployeeMapper.toResponseDtoList).toHaveBeenCalledWith([
        mockEmployees[0],
      ]);
    });

    it('should handle empty search params', async () => {
      // When no params are provided, should use default sortOrder
      mockEmployeesService.find.mockResolvedValue(mockEmployees);
      mockEmployeeMapper.toResponseDtoList.mockReturnValue(
        mockEmployeeResponseDtos,
      );

      const result = await controller.search(
        undefined,
        undefined,
        undefined,
        undefined,
        'asc',
      );

      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(mockEmployeesService.find).toHaveBeenCalledWith({
        query: undefined,
        department: undefined,
        status: undefined,
        sortBy: undefined,
        sortOrder: 'asc',
      });
      expect(mockEmployeeMapper.toResponseDtoList).toHaveBeenCalledWith(
        mockEmployees,
      );
    });

    it('should search with a query parameter', async () => {
      // Mock a search with just a query parameter
      mockEmployeesService.find.mockResolvedValue([mockEmployees[0]]);
      mockEmployeeMapper.toResponseDtoList.mockReturnValue([
        mockEmployeeResponseDtos[0],
      ]);

      await controller.search('John', undefined, undefined, undefined, 'asc');

      // Verify the service was called with the right parameters
      expect(mockEmployeesService.find).toHaveBeenCalledWith({
        query: 'John',
        department: undefined,
        status: undefined,
        sortBy: undefined,
        sortOrder: 'asc',
      });
      expect(mockEmployeeMapper.toResponseDtoList).toHaveBeenCalledWith([
        mockEmployees[0],
      ]);
    });
  });

  describe('searchPaginated', () => {
    it('should search employees with pagination', async () => {
      const searchParams = {
        query: 'John',
        department: 'Engineering',
        status: 'active',
        sortBy: 'name',
        sortOrder: 'asc' as const,
        page: 1,
        limit: 10,
      };

      const paginatedResult = {
        data: [mockEmployees[0]],
        meta: {
          page: 1,
          limit: 10,
          totalItems: 1,
          totalPages: 1,
        },
      };

      // Mock the findPaginated method to return filtered employees with pagination
      mockPaginatedEmployeesService.findPaginated.mockResolvedValue(paginatedResult);
      mockEmployeeMapper.toResponseDtoList.mockReturnValue([
        mockEmployeeResponseDtos[0],
      ]);

      const result = await controller.searchPaginated(searchParams);

      expect(result).toBeDefined();
      expect(result.data.length).toBe(1);
      expect(result.data[0]?.name).toBe('John Doe');
      expect(result.meta.totalItems).toBe(1);
      expect(mockPaginatedEmployeesService.findPaginated).toHaveBeenCalledWith(searchParams);
      expect(mockEmployeeMapper.toResponseDtoList).toHaveBeenCalledWith([
        mockEmployees[0],
      ]);
    });

    it('should handle errors during paginated search', async () => {
      const searchParams = {
        page: 1,
        limit: 10,
        sortOrder: 'asc' as const,
      };

      const testError = new Error('Test error');
      mockPaginatedEmployeesService.findPaginated.mockRejectedValue(testError);

      await expect(controller.searchPaginated(searchParams)).rejects.toThrow(testError);
      expect(mockPaginatedEmployeesService.findPaginated).toHaveBeenCalledWith(searchParams);
    });
  });
});
