import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Employee, CreateEmployeeDto } from '@repo/schemas';

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
});
