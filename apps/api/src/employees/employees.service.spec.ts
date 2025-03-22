/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesService } from './employees.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto, UpdateEmployeeDto, Employee } from '@repo/schemas';
import { EmployeeQueryBuilderService } from './services/query-builder.service';
import { EMPLOYEE_REPOSITORY } from './repositories/employee-repository.interface';
import { v4 as uuidv4 } from 'uuid';

describe('EmployeesService', () => {
  let service: EmployeesService;

  // Define fixed UUIDs for consistent testing
  const employeeIds = {
    employee1: '1c24ab2c-e192-4188-8d69-481e98e83236',
    employee2: '3a36c384-d714-45b7-b5c9-24d9e2c9344e',
    newEmployee: '4f7d0e9d-7c6b-49c3-8c41-a3a58c8d3b9f',
    invalidId: 'af98bd2f-c53e-47e9-bb6c-46ad9195482d',
  };

  const departmentIds = {
    engineering: 'b8a9a2d8-5c0f-4a0c-8f88-43f0e26392c3',
    design: 'c7b2a1d7-4b0e-3a0b-7f77-32e0e15281b2',
  };

  const mockDepartments = {
    engineering: {
      id: departmentIds.engineering,
      name: 'Engineering',
      description: 'Engineering department',
    },
    design: {
      id: departmentIds.design,
      name: 'Design',
      description: 'Design department',
    },
  };

  const mockEmployeeQueryBuilder = {
    buildQueryParams: jest.fn(),
  };

  const mockEmployeeRepository = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByEmail: jest.fn(),
    findWithFilters: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    addMany: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        {
          provide: EmployeeQueryBuilderService,
          useValue: mockEmployeeQueryBuilder,
        },
        { provide: EMPLOYEE_REPOSITORY, useValue: mockEmployeeRepository },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all employees from repository', async () => {
      const mockEmployees: Employee[] = [
        {
          id: employeeIds.employee1,
          name: 'Employee 1',
          email: 'employee1@example.com',
          role: 'Developer',
          departmentId: departmentIds.engineering,
          department: mockDepartments.engineering,
          salary: 95000,
          status: 'active',
        },
      ];

      mockEmployeeRepository.findAll.mockResolvedValue(mockEmployees);

      const result = await service.findAll();
      expect(result).toEqual(mockEmployees);
      expect(mockEmployeeRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an employee when valid ID is provided', async () => {
      const mockEmployee: Employee = {
        id: employeeIds.employee1,
        name: 'Employee 1',
        email: 'employee1@example.com',
        role: 'Developer',
        departmentId: departmentIds.engineering,
        department: mockDepartments.engineering,
        salary: 95000,
        status: 'active',
      };

      mockEmployeeRepository.findOne.mockResolvedValue(mockEmployee);

      const result = await service.findOne(employeeIds.employee1);
      expect(result).toEqual(mockEmployee);
      expect(mockEmployeeRepository.findOne).toHaveBeenCalledWith(
        employeeIds.employee1,
      );
    });

    it('should throw NotFoundException when invalid ID is provided', async () => {
      mockEmployeeRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(employeeIds.invalidId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockEmployeeRepository.findOne).toHaveBeenCalledWith(
        employeeIds.invalidId,
      );
    });
  });

  describe('create', () => {
    it('should create a new employee', async () => {
      const createEmployeeDto: CreateEmployeeDto = {
        name: 'New Employee',
        email: 'new@example.com',
        role: 'Developer',
        departmentId: departmentIds.engineering,
        salary: 85000,
        status: 'active',
        hireDate: '2023-01-15T00:00:00.000Z',
      };

      const mockEmployee: Employee = {
        id: employeeIds.newEmployee,
        name: 'New Employee',
        email: 'new@example.com',
        role: 'Developer',
        departmentId: departmentIds.engineering,
        department: mockDepartments.engineering,
        salary: 85000,
        status: 'active',
        hireDate: new Date('2023-01-15T00:00:00.000Z'),
      };

      mockEmployeeRepository.findByEmail.mockResolvedValue(null);
      mockEmployeeRepository.create.mockResolvedValue(mockEmployee);

      const result = await service.create(createEmployeeDto);
      expect(result).toEqual(mockEmployee);
      expect(mockEmployeeRepository.findByEmail).toHaveBeenCalledWith(
        createEmployeeDto.email,
      );
      expect(mockEmployeeRepository.create).toHaveBeenCalledWith(
        createEmployeeDto,
      );
    });

    it('should throw conflict exception if email already exists', async () => {
      const existingEmail = 'existing@example.com';
      const createEmployeeDto: CreateEmployeeDto = {
        name: 'New Employee',
        email: existingEmail,
        role: 'Designer',
        departmentId: departmentIds.design,
        salary: 85000,
        status: 'active',
      };

      const existingEmployee: Employee = {
        id: employeeIds.employee2,
        name: 'Existing Employee',
        email: existingEmail,
        role: 'Developer',
        departmentId: departmentIds.engineering,
        department: mockDepartments.engineering,
        salary: 95000,
        status: 'active',
      };

      mockEmployeeRepository.findByEmail.mockResolvedValue(existingEmployee);

      await expect(service.create(createEmployeeDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockEmployeeRepository.findByEmail).toHaveBeenCalledWith(
        existingEmail,
      );
      expect(mockEmployeeRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an employee when employee exists and no email conflict', async () => {
      const employeeId = employeeIds.employee1;
      const updateEmployeeDto: UpdateEmployeeDto = {
        name: 'Updated Name',
        email: 'updated@example.com',
        salary: 100000,
        hireDate: '2023-03-15T00:00:00.000Z',
      };

      const existingEmployee: Employee = {
        id: employeeId,
        name: 'Original Name',
        email: 'original@example.com',
        role: 'Developer',
        departmentId: departmentIds.engineering,
        department: mockDepartments.engineering,
        salary: 95000,
        status: 'active',
        hireDate: new Date('2022-01-15'),
      };

      const updatedEmployee: Employee = {
        ...existingEmployee,
        name: updateEmployeeDto.name!,
        email: updateEmployeeDto.email!,
        salary: updateEmployeeDto.salary!,
        hireDate: updateEmployeeDto.hireDate
          ? new Date(updateEmployeeDto.hireDate)
          : undefined,
      };

      mockEmployeeRepository.findByEmail.mockResolvedValue(null);
      mockEmployeeRepository.update.mockResolvedValue(updatedEmployee);

      const result = await service.update(employeeId, updateEmployeeDto);

      expect(result).toEqual(updatedEmployee);
      expect(mockEmployeeRepository.findByEmail).toHaveBeenCalledWith(
        updateEmployeeDto.email,
      );
      expect(mockEmployeeRepository.update).toHaveBeenCalledWith(
        employeeId,
        updateEmployeeDto,
      );
    });

    it('should throw not found exception if repository throws it', async () => {
      const employeeId = employeeIds.invalidId;
      const updateEmployeeDto: UpdateEmployeeDto = {
        name: 'Updated Name',
      };

      mockEmployeeRepository.findByEmail.mockResolvedValue(null);
      mockEmployeeRepository.update.mockRejectedValue(new NotFoundException());

      await expect(
        service.update(employeeId, updateEmployeeDto),
      ).rejects.toThrow(NotFoundException);

      expect(mockEmployeeRepository.update).toHaveBeenCalledWith(
        employeeId,
        updateEmployeeDto,
      );
    });

    it('should throw conflict exception if updating to an existing email', async () => {
      const employeeId = employeeIds.employee1;
      const existingEmail = 'existing@example.com';
      const updateEmployeeDto: UpdateEmployeeDto = {
        email: existingEmail,
      };

      const existingEmployee: Employee = {
        id: employeeIds.employee2, // Different ID
        name: 'Existing Employee',
        email: existingEmail,
        role: 'Developer',
        departmentId: departmentIds.engineering,
        department: mockDepartments.engineering,
        salary: 95000,
        status: 'active',
      };

      mockEmployeeRepository.findOne.mockResolvedValue({
        id: employeeId,
        name: 'Original Employee',
        email: 'original@example.com',
        role: 'Developer',
        departmentId: departmentIds.engineering,
        department: mockDepartments.engineering,
        salary: 95000,
        status: 'active',
      });
      mockEmployeeRepository.findByEmail.mockResolvedValue(existingEmployee);

      await expect(
        service.update(employeeId, updateEmployeeDto),
      ).rejects.toThrow(ConflictException);
      expect(mockEmployeeRepository.findByEmail).toHaveBeenCalledWith(
        existingEmail,
      );
      expect(mockEmployeeRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete an existing employee', async () => {
      const employeeId = employeeIds.employee1;
      const mockEmployee: Employee = {
        id: employeeId,
        name: 'Employee to Delete',
        email: 'delete@example.com',
        role: 'Developer',
        departmentId: departmentIds.engineering,
        department: mockDepartments.engineering,
        salary: 95000,
        status: 'active',
      };

      mockEmployeeRepository.findOne.mockResolvedValue(mockEmployee);
      mockEmployeeRepository.delete.mockResolvedValue(undefined);

      await service.delete(employeeId);

      expect(mockEmployeeRepository.findOne).toHaveBeenCalledWith(employeeId);
      expect(mockEmployeeRepository.delete).toHaveBeenCalledWith(employeeId);
    });

    it('should throw not found exception if employee does not exist', async () => {
      const employeeId = employeeIds.invalidId;

      mockEmployeeRepository.findOne.mockResolvedValue(null);

      await expect(service.delete(employeeId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockEmployeeRepository.findOne).toHaveBeenCalledWith(employeeId);
      expect(mockEmployeeRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('find', () => {
    it('should find employees based on search parameters', async () => {
      const searchParams = {
        query: 'John',
        department: 'Engineering',
        status: 'active',
        sortBy: 'name',
        sortOrder: 'asc' as const,
      };

      const mockQueryParams = {
        textSearch: { query: 'John', fields: ['name', 'email', 'role'] },
        filters: { department: 'Engineering', status: 'active' },
        sort: { field: 'name', order: 'asc' },
      };

      const mockEmployees: Employee[] = [
        {
          id: employeeIds.employee1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'Developer',
          departmentId: departmentIds.engineering,
          department: mockDepartments.engineering,
          salary: 95000,
          status: 'active',
        },
      ];

      mockEmployeeQueryBuilder.buildQueryParams.mockReturnValue(
        mockQueryParams,
      );
      mockEmployeeRepository.findMany.mockResolvedValue(mockEmployees);

      const result = await service.find(searchParams);

      expect(result).toEqual(mockEmployees);
      expect(mockEmployeeQueryBuilder.buildQueryParams).toHaveBeenCalledWith(
        searchParams,
      );
      expect(mockEmployeeRepository.findMany).toHaveBeenCalledWith(
        mockQueryParams,
      );
    });
  });
});
