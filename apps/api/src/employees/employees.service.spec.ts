import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesService } from './employees.service';
import { UsersService } from '../users/users.service';
import { UserToEmployeePipe } from './pipes/user-to-employee.pipe';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto, UpdateEmployeeDto, Employee } from '@repo/schemas';

describe('EmployeesService', () => {
  let service: EmployeesService;

  const mockUsersService = {
    getRandomUsers: jest.fn(),
  };

  const mockUserToEmployeePipe = {
    transform: jest.fn(),
  };

  const mockEmployeeRepository = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByEmail: jest.fn(),
    findWithFilters: jest.fn(),
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
        { provide: UsersService, useValue: mockUsersService },
        { provide: UserToEmployeePipe, useValue: mockUserToEmployeePipe },
        { provide: 'EMPLOYEE_REPOSITORY', useValue: mockEmployeeRepository },
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
          id: '1',
          name: 'Employee 1',
          email: 'employee1@example.com',
          role: 'Developer',
          department: 'Engineering',
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
        id: '1',
        name: 'Employee 1',
        email: 'employee1@example.com',
        role: 'Developer',
        department: 'Engineering',
        salary: 95000,
        status: 'active',
      };

      mockEmployeeRepository.findOne.mockResolvedValue(mockEmployee);

      const result = await service.findOne('1');
      expect(result).toEqual(mockEmployee);
      expect(mockEmployeeRepository.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when invalid ID is provided', async () => {
      mockEmployeeRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
      expect(mockEmployeeRepository.findOne).toHaveBeenCalledWith('999');
    });
  });

  describe('create', () => {
    it('should create a new employee', async () => {
      const createEmployeeDto: CreateEmployeeDto = {
        name: 'New Employee',
        email: 'new@example.com',
        role: 'Designer',
        department: 'Design',
        salary: 85000,
        status: 'active',
      };

      const createdEmployee: Employee = {
        id: '123',
        ...createEmployeeDto,
      };

      mockEmployeeRepository.findByEmail.mockResolvedValue(null);
      mockEmployeeRepository.create.mockResolvedValue(createdEmployee);

      const result = await service.create(createEmployeeDto);

      expect(result).toEqual(createdEmployee);
      expect(mockEmployeeRepository.findByEmail).toHaveBeenCalledWith(
        'new@example.com',
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
        department: 'Design',
        salary: 85000,
        status: 'active',
      };

      const existingEmployee: Employee = {
        id: '123',
        name: 'Existing Employee',
        email: existingEmail,
        role: 'Developer',
        department: 'Engineering',
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
    it('should update an existing employee', async () => {
      const employeeId = '1';
      const updateEmployeeDto: UpdateEmployeeDto = {
        name: 'Updated Name',
        salary: 100000,
      };

      const updatedEmployee: Employee = {
        id: employeeId,
        name: 'Updated Name',
        email: 'test@example.com',
        role: 'Developer',
        department: 'Engineering',
        salary: 100000,
        status: 'active',
      };

      mockEmployeeRepository.findByEmail.mockResolvedValue(null);
      mockEmployeeRepository.update.mockResolvedValue(updatedEmployee);

      const result = await service.update(employeeId, updateEmployeeDto);

      expect(result).toEqual(updatedEmployee);
      expect(mockEmployeeRepository.update).toHaveBeenCalledWith(
        employeeId,
        updateEmployeeDto,
      );
    });

    it('should throw not found exception if repository throws it', async () => {
      const employeeId = '999';
      const updateEmployeeDto: UpdateEmployeeDto = {
        name: 'Updated Name',
      };

      mockEmployeeRepository.findByEmail.mockResolvedValue(null);
      mockEmployeeRepository.update.mockRejectedValue(new NotFoundException());

      await expect(
        service.update(employeeId, updateEmployeeDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw conflict exception if updating to an existing email', async () => {
      const employeeId = '1';
      const existingEmail = 'existing@example.com';
      const updateEmployeeDto: UpdateEmployeeDto = {
        email: existingEmail,
      };

      const existingEmployee: Employee = {
        id: '2', // Different ID
        name: 'Existing Employee',
        email: existingEmail,
        role: 'Developer',
        department: 'Engineering',
        salary: 95000,
        status: 'active',
      };

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
      const employeeId = '1';
      const mockEmployee: Employee = {
        id: employeeId,
        name: 'Employee to Delete',
        email: 'delete@example.com',
        role: 'Developer',
        department: 'Engineering',
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
      const employeeId = '999';

      mockEmployeeRepository.findOne.mockResolvedValue(null);

      await expect(service.delete(employeeId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockEmployeeRepository.findOne).toHaveBeenCalledWith(employeeId);
      expect(mockEmployeeRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('find', () => {
    it('should call repository findWithFilters with search params', async () => {
      const mockEmployees: Employee[] = [
        {
          id: '1',
          name: 'Employee 1',
          email: 'employee1@example.com',
          role: 'Developer',
          department: 'Engineering',
          salary: 95000,
          status: 'active',
        },
      ];

      const searchParams = { query: 'Engineer', sortOrder: 'asc' as const };
      mockEmployeeRepository.findWithFilters.mockResolvedValue(mockEmployees);

      const result = await service.find(searchParams);

      expect(result).toEqual(mockEmployees);
      expect(mockEmployeeRepository.findWithFilters).toHaveBeenCalledWith(
        searchParams,
      );
    });
  });
});
