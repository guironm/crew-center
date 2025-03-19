import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { NotFoundException } from '@nestjs/common';
import { Department } from './entities/department.entity';

describe('DepartmentsController', () => {
  let controller: DepartmentsController;
  let service: DepartmentsService;

  const mockDepartments: Department[] = [
    {
      id: 1,
      name: 'Engineering',
      description: 'Software development and infrastructure',
    },
    {
      id: 2,
      name: 'Marketing',
      description: 'Marketing, communications, and brand management',
    },
  ];

  const mockDepartmentsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentsController],
      providers: [
        { provide: DepartmentsService, useValue: mockDepartmentsService },
      ],
    }).compile();

    controller = module.get<DepartmentsController>(DepartmentsController);
    service = module.get<DepartmentsService>(DepartmentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all departments', () => {
      mockDepartmentsService.findAll.mockReturnValue(mockDepartments);

      const result = controller.findAll();

      expect(result).toBe(mockDepartments);
      expect(mockDepartmentsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single department', () => {
      const departmentId = 1;
      mockDepartmentsService.findOne.mockReturnValue(mockDepartments[0]);

      const result = controller.findOne(departmentId);

      expect(result).toBe(mockDepartments[0]);
      expect(mockDepartmentsService.findOne).toHaveBeenCalledWith(departmentId);
    });

    it('should pass through exceptions from the service', () => {
      const departmentId = 999;
      mockDepartmentsService.findOne.mockImplementation(() => {
        throw new NotFoundException(`Department with ID ${departmentId} not found`);
      });

      expect(() => controller.findOne(departmentId)).toThrow(NotFoundException);
      expect(() => controller.findOne(departmentId)).toThrow(
        `Department with ID ${departmentId} not found`
      );
      expect(mockDepartmentsService.findOne).toHaveBeenCalledWith(departmentId);
    });
  });

  describe('search', () => {
    it('should search departments with provided params', () => {
      const query = 'Engineering';
      const sortBy = 'name';
      const sortOrder = 'asc' as const;

      const searchParams = {
        query,
        sortBy,
        sortOrder,
      };

      mockDepartmentsService.find.mockReturnValue([mockDepartments[0]]);

      const result = controller.search(query, sortBy, sortOrder);

      expect(result).toEqual([mockDepartments[0]]);
      expect(mockDepartmentsService.find).toHaveBeenCalledWith(searchParams);
    });

    it('should handle empty search params', () => {
      // When no query parameter is specified but sortOrder is
      mockDepartmentsService.find.mockReturnValue(mockDepartments);

      const result = controller.search(undefined, undefined, 'asc');

      expect(result).toEqual(mockDepartments);
      expect(mockDepartmentsService.find).toHaveBeenCalledWith({
        query: undefined,
        sortBy: undefined,
        sortOrder: 'asc',
      });
    });

    it('should use default sort order when none is provided', () => {
      mockDepartmentsService.find.mockReturnValue(mockDepartments);

      // Call without specifying sortOrder
      const result = controller.search('test', 'name', undefined);

      // Should use 'asc' as default
      expect(mockDepartmentsService.find).toHaveBeenCalledWith({
        query: 'test',
        sortBy: 'name',
        sortOrder: 'asc',
      });
    });
  });
}); 