import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { Department } from '@repo/schemas';
import { v4 as uuidv4 } from 'uuid';

describe('DepartmentsController', () => {
  let controller: DepartmentsController;

  // Define fixed UUIDs for consistent testing
  const departmentIds = {
    engineering: '9e8bd2f6-fd77-4ad2-b619-7fef2d95852a',
    marketing: 'c83e381a-7f9e-4a69-b58e-9d6e4efda990',
  };

  const mockDepartments: Department[] = [
    {
      id: departmentIds.engineering,
      name: 'Engineering',
      description: 'Software development and infrastructure',
    },
    {
      id: departmentIds.marketing,
      name: 'Marketing',
      description: 'Marketing, communications, and brand management',
    },
  ];

  const mockDepartmentsService = {
    findAll: jest.fn().mockResolvedValue(mockDepartments),
    findOne: jest.fn().mockResolvedValue(mockDepartments[0]),
    find: jest.fn().mockResolvedValue(mockDepartments),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentsController],
      providers: [
        { provide: DepartmentsService, useValue: mockDepartmentsService },
      ],
    }).compile();

    controller = module.get<DepartmentsController>(DepartmentsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all departments', async () => {
      mockDepartmentsService.findAll.mockResolvedValue(mockDepartments);

      const result = await controller.findAll();

      expect(result).toEqual(mockDepartments);
      expect(mockDepartmentsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single department', async () => {
      const departmentId = departmentIds.engineering;
      mockDepartmentsService.findOne.mockResolvedValue(mockDepartments[0]);

      const result = await controller.findOne(departmentId);

      expect(result).toEqual(mockDepartments[0]);
      expect(mockDepartmentsService.findOne).toHaveBeenCalledWith(departmentId);
    });
  });

  describe('search', () => {
    it('should search departments with provided params', async () => {
      const query = 'Engineering';
      const sortBy = 'name';
      const sortOrder = 'asc';

      const searchParams = {
        query,
        sortBy,
        sortOrder,
      };

      mockDepartmentsService.find.mockResolvedValue([mockDepartments[0]]);

      const result = await controller.search(query, sortBy, sortOrder);

      expect(result).toEqual([mockDepartments[0]]);
      expect(mockDepartmentsService.find).toHaveBeenCalledWith(searchParams);
    });

    it('should handle empty search params', async () => {
      // When no query parameter is specified but sortOrder is
      mockDepartmentsService.find.mockResolvedValue(mockDepartments);

      const result = await controller.search(undefined, undefined, 'asc');

      expect(result).toEqual(mockDepartments);
      expect(mockDepartmentsService.find).toHaveBeenCalledWith({
        query: undefined,
        sortBy: undefined,
        sortOrder: 'asc',
      });
    });

    it('should use default sort order when none is provided', async () => {
      mockDepartmentsService.find.mockResolvedValue(mockDepartments);

      // Call without specifying sortOrder
      const result = await controller.search('test', 'name', undefined);

      // Should use 'asc' as default
      expect(mockDepartmentsService.find).toHaveBeenCalledWith({
        query: 'test',
        sortBy: 'name',
        sortOrder: 'asc',
      });
    });
  });
});
