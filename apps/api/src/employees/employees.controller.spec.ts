import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '@repo/schemas';

describe('EmployeesController', () => {
  let controller: EmployeesController;

  // Create mock employees
  const mockEmployees: Employee[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Software Engineer',
      department: 'Engineering',
      salary: 95000,
      status: 'active',
      hireDate: new Date('2021-01-15'),
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'Product Manager',
      department: 'Product',
      salary: 110000,
      status: 'active',
      hireDate: new Date('2020-08-10'),
    },
  ];

  // Mock the EmployeesService
  const mockEmployeesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [
        { provide: EmployeesService, useValue: mockEmployeesService },
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

      const result = await controller.findAll();

      expect(result.length).toBe(mockEmployees.length);
      expect(mockEmployeesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single employee', () => {
      const employeeId = 1;
      mockEmployeesService.findOne.mockReturnValue(mockEmployees[0]);

      const result = controller.findOne(employeeId);

      expect(result).toBeDefined();
      expect(result.id).toBe(employeeId);
      expect(mockEmployeesService.findOne).toHaveBeenCalledWith(employeeId);
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

      const newEmployee = {
        id: 3,
        ...createEmployeeDto,
        hireDate: new Date(),
      };

      mockEmployeesService.create.mockReturnValue(newEmployee);

      const result = controller.create(createEmployeeDto);

      expect(result).toBeDefined();
      expect(result.name).toBe(createEmployeeDto.name);
      expect(mockEmployeesService.create).toHaveBeenCalledWith(
        createEmployeeDto,
      );
    });
  });

  describe('update', () => {
    it('should update an employee', () => {
      const employeeId = 1;
      const updateEmployeeDto: UpdateEmployeeDto = {
        name: 'Updated Name',
        salary: 100000,
      };

      const updatedEmployee = {
        ...mockEmployees[0],
        name: 'Updated Name',
        salary: 100000,
      };

      mockEmployeesService.update.mockReturnValue(updatedEmployee);

      const result = controller.update(employeeId, updateEmployeeDto);

      expect(result).toBeDefined();
      expect(result.name).toBe(updateEmployeeDto.name);
      expect(result.salary).toBe(updateEmployeeDto.salary);
      expect(mockEmployeesService.update).toHaveBeenCalledWith(
        employeeId,
        updateEmployeeDto,
      );
    });
  });

  describe('delete', () => {
    it('should delete an employee', () => {
      const employeeId = 1;
      
      controller.delete(employeeId);
      
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
    });

    it('should handle empty search params', async () => {
      // When no params are provided, should use default sortOrder
      mockEmployeesService.find.mockResolvedValue(mockEmployees);

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
        sortOrder: 'asc',
      });
    });

    it('should search with a query parameter', async () => {
      // Mock a search with just a query parameter
      mockEmployeesService.find.mockResolvedValue([mockEmployees[0]]);

      await controller.search('John', undefined, undefined, undefined, 'asc');

      // Verify the service was called with the right parameters
      expect(mockEmployeesService.find).toHaveBeenCalledWith({
        query: 'John',
        sortOrder: 'asc',
      });
    });
  });
});
