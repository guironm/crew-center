/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsService } from './departments.service';
import { NotFoundException } from '@nestjs/common';
import { ApiSearchParams } from '@repo/schemas';
import { DEPARTMENT_REPOSITORY } from './repositories/department-repository.interface';
import { Department } from './entities/department.entity';
import { DepartmentQueryBuilderService } from './query-builder.service';
import { v4 as uuidv4 } from 'uuid';

describe('DepartmentsService', () => {
  let service: DepartmentsService;

  // Define fixed UUIDs for consistent testing
  const departmentIds = {
    engineering: '9e8bd2f6-fd77-4ad2-b619-7fef2d95852a',
    marketing: 'c83e381a-7f9e-4a69-b58e-9d6e4efda990',
    sales: 'f348e4b9-15b0-4fff-9b8c-02747a3b85ae',
    finance: '5d9c58cc-65c9-4464-ae25-c661f55fdbe0',
    hr: '91ed748a-1b2a-4c13-91a6-1b59c97dc2c5',
    design: '4ce325fb-99f6-43e2-a0ef-59a912c91918',
    product: '2a1a4fd0-61c9-478a-9a3f-0f8df9b3ba93',
  };

  // Define mock departments that match what would be seeded
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
    {
      id: departmentIds.sales,
      name: 'Sales',
      description: 'Client acquisition and account management',
    },
    {
      id: departmentIds.finance,
      name: 'Finance',
      description: 'Financial operations and accounting',
    },
    {
      id: departmentIds.hr,
      name: 'HR',
      description: 'Human resources and talent management',
    },
    {
      id: departmentIds.design,
      name: 'Design',
      description: 'User experience and product design',
    },
    {
      id: departmentIds.product,
      name: 'Product',
      description: 'Product management and strategy',
    },
  ];

  // Mock the repository
  const mockDepartmentRepository = {
    findAll: jest.fn().mockResolvedValue(mockDepartments),
    findOne: jest.fn().mockImplementation((id: string) => {
      const dept = mockDepartments.find((d) => d.id === id);
      return Promise.resolve(dept || null);
    }),
    findByName: jest.fn().mockImplementation((name: string) => {
      const dept = mockDepartments.find(
        (d) => d.name.toLowerCase() === name.toLowerCase(),
      );
      return Promise.resolve(dept || null);
    }),
    findMany: jest.fn().mockImplementation((queryParams) => {
      let depts = [...mockDepartments];

      // Apply text search
      if (queryParams.textSearch) {
        const query = queryParams.textSearch.query.toLowerCase();
        depts = depts.filter(
          (d) =>
            d.name.toLowerCase().includes(query) ||
            d.description.toLowerCase().includes(query),
        );
      }

      // Apply sorting
      if (queryParams.sort) {
        depts.sort((a, b) => {
          const field = queryParams.sort.field as keyof Department;
          const aVal = a[field];
          const bVal = b[field];

          if (typeof aVal === 'string' && typeof bVal === 'string') {
            return queryParams.sort.order === 'asc'
              ? aVal.localeCompare(bVal)
              : bVal.localeCompare(aVal);
          }

          return 0;
        });
      }

      return Promise.resolve(depts);
    }),
  };

  // Mock the query builder
  const mockQueryBuilder = {
    buildQueryParams: jest.fn().mockImplementation((searchParams) => {
      const params: any = {};

      if (searchParams.query) {
        params.textSearch = {
          query: searchParams.query,
          fields: ['name', 'description'],
        };
      }

      if (searchParams.sortBy) {
        params.sort = {
          field: searchParams.sortBy,
          order: searchParams.sortOrder || 'asc',
        };
      }

      return params;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentsService,
        {
          provide: DEPARTMENT_REPOSITORY,
          useValue: mockDepartmentRepository,
        },
        {
          provide: DepartmentQueryBuilderService,
          useValue: mockQueryBuilder,
        },
      ],
    }).compile();

    service = module.get<DepartmentsService>(DepartmentsService);

    // Reset mock implementations for each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all departments', async () => {
      const result = await service.findAll();

      // Should return all 7 departments
      expect(result).toBeDefined();
      expect(result.length).toBe(7);
      expect(mockDepartmentRepository.findAll).toHaveBeenCalled();

      // Validate that all required departments are present
      const departmentNames = result.map((dept) => dept.name);
      expect(departmentNames).toContain('Engineering');
      expect(departmentNames).toContain('Marketing');
      expect(departmentNames).toContain('Sales');
      expect(departmentNames).toContain('Finance');
      expect(departmentNames).toContain('HR');
      expect(departmentNames).toContain('Design');
      expect(departmentNames).toContain('Product');
    });
  });

  describe('findOne', () => {
    it('should return a department when valid ID is provided', async () => {
      const result = await service.findOne(departmentIds.engineering);

      expect(result).toBeDefined();
      expect(result.id).toBe(departmentIds.engineering);
      expect(result.name).toBe('Engineering');
      expect(mockDepartmentRepository.findOne).toHaveBeenCalledWith(
        departmentIds.engineering,
      );
    });

    it('should throw NotFoundException when invalid ID is provided', async () => {
      const invalidId = uuidv4();
      mockDepartmentRepository.findOne.mockResolvedValueOnce(null);

      try {
        await service.findOne(invalidId);
        // If we reach this point, the test should fail
        fail('Expected service.findOne to throw NotFoundException');
      } catch (error: any) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`Department with ID ${invalidId} not found`);
      }

      expect(mockDepartmentRepository.findOne).toHaveBeenCalledWith(invalidId);
    });
  });

  describe('findByName', () => {
    it('should return a department when valid name is provided', async () => {
      const result = await service.findByName('Engineering');

      expect(result).toBeDefined();
      expect(result?.id).toBe(departmentIds.engineering);
      expect(result?.name).toBe('Engineering');
      expect(mockDepartmentRepository.findByName).toHaveBeenCalledWith(
        'Engineering',
      );
    });

    it('should handle case-insensitive search', async () => {
      // Test with lowercase
      const result1 = await service.findByName('engineering');
      expect(result1).toBeDefined();
      expect(result1?.name).toBe('Engineering');
      expect(mockDepartmentRepository.findByName).toHaveBeenCalledWith(
        'engineering',
      );

      // Test with mixed case
      const result2 = await service.findByName('EnGiNeErInG');
      expect(result2).toBeDefined();
      expect(result2?.name).toBe('Engineering');
      expect(mockDepartmentRepository.findByName).toHaveBeenCalledWith(
        'EnGiNeErInG',
      );
    });

    it('should return undefined when department name does not exist', async () => {
      mockDepartmentRepository.findByName.mockResolvedValueOnce(null);

      const result = await service.findByName('NonExistent');
      expect(result).toBeNull();
      expect(mockDepartmentRepository.findByName).toHaveBeenCalledWith(
        'NonExistent',
      );
    });
  });

  describe('find', () => {
    it('should filter departments based on search query', async () => {
      // Search for 'eng' should return Engineering department
      const searchParams: ApiSearchParams = {
        query: 'eng',
        sortOrder: 'asc' as const,
      };
      const queryParams = {
        textSearch: { query: 'eng', fields: ['name', 'description'] },
      };

      const result = await service.find(searchParams);

      expect(result.length).toBeGreaterThan(0);
      expect(result.some((dept) => dept.name === 'Engineering')).toBe(true);
      expect(mockQueryBuilder.buildQueryParams).toHaveBeenCalledWith(
        searchParams,
      );
      expect(mockDepartmentRepository.findMany).toHaveBeenCalledWith(
        queryParams,
      );
    });

    it('should sort departments correctly', async () => {
      // Sort by name in ascending order
      const ascParams = { sortBy: 'name', sortOrder: 'asc' as const };
      const ascQueryParams = { sort: { field: 'name', order: 'asc' } };

      const result1 = await service.find(ascParams);
      expect(result1[0]?.name).toBe('Design'); // Design should be first alphabetically
      expect(mockQueryBuilder.buildQueryParams).toHaveBeenCalledWith(ascParams);
      expect(mockDepartmentRepository.findMany).toHaveBeenCalledWith(
        ascQueryParams,
      );

      // Sort by name in descending order
      const descParams = { sortBy: 'name', sortOrder: 'desc' as const };
      const descQueryParams = { sort: { field: 'name', order: 'desc' } };

      const result2 = await service.find(descParams);
      expect(result2[0]?.name).toBe('Sales'); // Sales should be first in reverse alphabetical order
      expect(mockQueryBuilder.buildQueryParams).toHaveBeenCalledWith(
        descParams,
      );
      expect(mockDepartmentRepository.findMany).toHaveBeenCalledWith(
        descQueryParams,
      );
    });

    it('should return all departments when no query is provided', async () => {
      const params = { sortOrder: 'asc' as const };
      const result = await service.find(params);

      expect(result.length).toBe(7); // All departments should be returned
      expect(mockQueryBuilder.buildQueryParams).toHaveBeenCalledWith(params);
      expect(mockDepartmentRepository.findMany).toHaveBeenCalled();
    });

    it('should return empty array when no matches found', async () => {
      const searchParams = {
        query: 'xyz123nonexistent',
        sortOrder: 'asc' as const,
      };
      mockDepartmentRepository.findMany.mockResolvedValueOnce([]);

      const result = await service.find(searchParams);
      expect(result.length).toBe(0);
      expect(mockQueryBuilder.buildQueryParams).toHaveBeenCalledWith(
        searchParams,
      );
      expect(mockDepartmentRepository.findMany).toHaveBeenCalled();
    });
  });
});
