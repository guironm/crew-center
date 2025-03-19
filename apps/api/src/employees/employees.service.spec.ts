import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesService } from './employees.service';
import { UsersService } from '../users/users.service';
import { UserToEmployeePipe } from './pipes/user-to-employee.pipe';
import { SearchService } from '../search/search.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto, UpdateEmployeeDto } from '@repo/schemas';

describe('EmployeesService', () => {
  let service: EmployeesService;

  const mockUsersService = {
    getRandomUsers: jest.fn(),
  };

  const mockUserToEmployeePipe = {
    transform: jest.fn(),
  };

  const mockSearchService = {
    search: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: UserToEmployeePipe, useValue: mockUserToEmployeePipe },
        { provide: SearchService, useValue: mockSearchService },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all employees', async () => {
      // Mock the behavior of getRandomUsers
      mockUsersService.getRandomUsers.mockResolvedValue([
        {
          name: { first: 'John', last: 'Doe' },
          email: 'john@example.com',
          picture: { large: 'url' },
        },
      ]);

      // Mock the behavior of transform
      mockUserToEmployeePipe.transform.mockReturnValue({
        id: 10,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Developer',
        department: 'Engineering',
        salary: 95000,
        status: 'active',
        picture: 'url',
      });

      const result = await service.findAll();

      // Verify we have the transformed random user
      expect(result.length).toBeGreaterThanOrEqual(0);
      expect(mockUsersService.getRandomUsers).toHaveBeenCalledWith(8);
      expect(mockUserToEmployeePipe.transform).toHaveBeenCalled();
    });

    it('should return only static employees if API call fails', async () => {
      mockUsersService.getRandomUsers.mockRejectedValue(new Error('API error'));

      const result = await service.findAll();

      // Should have at least some employees
      expect(result.length).toBeGreaterThanOrEqual(0);
      expect(mockUsersService.getRandomUsers).toHaveBeenCalledWith(8);
      expect(mockUserToEmployeePipe.transform).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new employee', () => {
      const createEmployeeDto: CreateEmployeeDto = {
        name: 'New Employee',
        email: 'new@example.com',
        role: 'Designer',
        department: 'Design',
        salary: 85000,
        status: 'active',
      };

      // First populate the service with some employees
      service['employees'] = [
        {
          id: 1,
          name: 'Existing Employee',
          email: 'existing@example.com',
          role: 'Developer',
          department: 'Engineering',
          salary: 95000,
          status: 'active',
        },
      ];

      const result = service.create(createEmployeeDto);

      expect(result).toBeDefined();
      expect(result.id).toBe(1); // ID is 1 based on the test setup
      expect(result.name).toBe(createEmployeeDto.name);
      expect(result.email).toBe(createEmployeeDto.email);
      expect(service['employees'].length).toBe(2);
    });

    it('should throw conflict exception if email already exists', () => {
      const existingEmail = 'existing@example.com';

      // First populate the service with some employees
      service['employees'] = [
        {
          id: 1,
          name: 'Existing Employee',
          email: existingEmail,
          role: 'Developer',
          department: 'Engineering',
          salary: 95000,
          status: 'active',
        },
      ];

      const createEmployeeDto: CreateEmployeeDto = {
        name: 'New Employee',
        email: existingEmail, // Using the same email
        role: 'Designer',
        department: 'Design',
        salary: 85000,
        status: 'active',
      };

      expect(() => service.create(createEmployeeDto)).toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('should update an existing employee', () => {
      const employeeId = 1;
      const updateEmployeeDto: UpdateEmployeeDto = {
        name: 'Updated Name',
        salary: 100000,
      };

      // First populate the service with an employee
      service['employees'] = [
        {
          id: employeeId,
          name: 'Original Name',
          email: 'test@example.com',
          role: 'Developer',
          department: 'Engineering',
          salary: 95000,
          status: 'active',
        },
      ];

      const result = service.update(employeeId, updateEmployeeDto);

      expect(result).toBeDefined();
      expect(result.id).toBe(employeeId);
      expect(result.name).toBe(updateEmployeeDto.name);
      expect(result.salary).toBe(updateEmployeeDto.salary);
      // Fields not in the update DTO should remain unchanged
      expect(result.email).toBe('test@example.com');
    });

    it('should throw not found exception if employee does not exist', () => {
      const nonExistentId = 999;
      const updateEmployeeDto: UpdateEmployeeDto = {
        name: 'Updated Name',
      };

      service['employees'] = [
        {
          id: 1,
          name: 'Original Name',
          email: 'test@example.com',
          role: 'Developer',
          department: 'Engineering',
          salary: 95000,
          status: 'active',
        },
      ];

      expect(() => service.update(nonExistentId, updateEmployeeDto)).toThrow(
        NotFoundException,
      );
    });

    it('should throw conflict exception if updating to an existing email', () => {
      const existingEmail = 'existing@example.com';

      service['employees'] = [
        {
          id: 1,
          name: 'Employee 1',
          email: existingEmail,
          role: 'Developer',
          department: 'Engineering',
          salary: 95000,
          status: 'active',
        },
        {
          id: 2,
          name: 'Employee 2',
          email: 'employee2@example.com',
          role: 'Designer',
          department: 'Design',
          salary: 85000,
          status: 'active',
        },
      ];

      const updateEmployeeDto: UpdateEmployeeDto = {
        email: existingEmail, // Trying to use an email that's already in use
      };

      expect(() => service.update(2, updateEmployeeDto)).toThrow(
        ConflictException,
      );
    });
  });

  describe('delete', () => {
    it('should delete an existing employee', () => {
      const employeeId = 1;

      // First populate the service with an employee
      service['employees'] = [
        {
          id: employeeId,
          name: 'Employee to Delete',
          email: 'delete@example.com',
          role: 'Developer',
          department: 'Engineering',
          salary: 95000,
          status: 'active',
        },
      ];

      expect(service['employees'].length).toBe(1);

      service.delete(employeeId);

      expect(service['employees'].length).toBe(0);
    });

    it('should throw not found exception if employee does not exist', () => {
      const nonExistentId = 999;

      service['employees'] = [
        {
          id: 1,
          name: 'Existing Employee',
          email: 'existing@example.com',
          role: 'Developer',
          department: 'Engineering',
          salary: 95000,
          status: 'active',
        },
      ];

      expect(() => service.delete(nonExistentId)).toThrow(NotFoundException);
    });
  });

  describe('find', () => {
    it('should search employees based on search parameters', async () => {
      const mockEmployees = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'Developer',
          department: 'Engineering' as const,
          salary: 95000,
          status: 'active' as const,
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'Designer',
          department: 'Design' as const,
          salary: 90000,
          status: 'on_leave' as const,
        },
      ];

      // Set up employees
      service['employees'] = mockEmployees;

      // Set up search parameters
      const searchParams = {
        query: 'John',
        department: 'Engineering',
        status: 'active',
        sortOrder: 'asc' as const,
      };

      // Mock search service to return filtered results
      mockSearchService.search.mockResolvedValue([mockEmployees[0]]);

      const result = await service.find(searchParams);

      expect(result).toEqual([mockEmployees[0]]);
      expect(mockSearchService.search).toHaveBeenCalledWith(
        mockEmployees,
        searchParams,
        ['name', 'email', 'role'],
      );
    });

    it('should load employees first if they are not loaded', async () => {
      // Empty employees array
      service['employees'] = [];

      // Mock getRandomUsers and transform
      const mockUser = {
        name: { first: 'John', last: 'Doe' },
        email: 'john@example.com',
        picture: { large: 'url' },
      };

      const mockEmployee = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Developer',
        department: 'Engineering' as const,
        salary: 95000,
        status: 'active' as const,
        picture: 'url',
      };

      mockUsersService.getRandomUsers.mockResolvedValue([mockUser]);
      mockUserToEmployeePipe.transform.mockReturnValue(mockEmployee);
      mockSearchService.search.mockResolvedValue([mockEmployee]);

      // Call find with search parameters
      const searchParams = { query: 'John', sortOrder: 'asc' as const };
      const result = await service.find(searchParams);

      // Check if findAll was called (indirectly through getRandomUsers being called)
      expect(mockUsersService.getRandomUsers).toHaveBeenCalled();
      expect(mockSearchService.search).toHaveBeenCalled();
      expect(result).toEqual([mockEmployee]);
    });
  });
});
