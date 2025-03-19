import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsService } from './departments.service';
import { SearchService } from '../search/search.service';
import { NotFoundException } from '@nestjs/common';
import { ApiSearchParams } from '@repo/schemas';

describe('DepartmentsService', () => {
  let service: DepartmentsService;
  let searchService: SearchService;

  const mockSearchService = {
    search: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentsService,
        { provide: SearchService, useValue: mockSearchService },
      ],
    }).compile();

    service = module.get<DepartmentsService>(DepartmentsService);
    searchService = module.get<SearchService>(SearchService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all departments', () => {
      const result = service.findAll();

      // Should return all 7 departments
      expect(result).toBeDefined();
      expect(result.length).toBe(7);

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
    it('should return a department when valid ID is provided', () => {
      const result = service.findOne(1);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.name).toBe('Engineering');
    });

    it('should throw NotFoundException when invalid ID is provided', () => {
      expect(() => service.findOne(999)).toThrow(NotFoundException);
      expect(() => service.findOne(999)).toThrow(
        'Department with ID 999 not found',
      );
    });
  });

  describe('findByName', () => {
    it('should return a department when valid name is provided', () => {
      const result = service.findByName('Engineering');

      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
      expect(result?.name).toBe('Engineering');
    });

    it('should handle case-insensitive search', () => {
      // Test with lowercase
      const result1 = service.findByName('engineering');
      expect(result1).toBeDefined();
      expect(result1?.name).toBe('Engineering');

      // Test with mixed case
      const result2 = service.findByName('EnGiNeErInG');
      expect(result2).toBeDefined();
      expect(result2?.name).toBe('Engineering');
    });

    it('should return undefined when department name does not exist', () => {
      const result = service.findByName('NonExistent');
      expect(result).toBeUndefined();
    });
  });

  describe('find', () => {
    it('should call SearchService with correct parameters', () => {
      // Mock data for departments
      const mockDepartments = [
        {
          id: 1,
          name: 'Engineering',
          description: 'Software development and infrastructure',
        },
      ];

      // Mock the search service to return the filtered results
      mockSearchService.search.mockReturnValue(mockDepartments);

      // Set up search parameters
      const searchParams: ApiSearchParams = {
        query: 'Engineering',
        sortOrder: 'asc' as const,
      };

      const result = service.find(searchParams);

      expect(result).toEqual(mockDepartments);
      expect(mockSearchService.search).toHaveBeenCalledWith(
        service['departments'], // Private departments array
        searchParams,
        ['name', 'description'], // Fields to search
      );
    });

    it('should filter departments based on search query', () => {
      // Search for 'eng' should return Engineering department
      mockSearchService.search.mockImplementation((items, params) => {
        if (params.query === 'eng') {
          return items.filter(
            (item) =>
              item.name.toLowerCase().includes('eng') ||
              item.description.toLowerCase().includes('eng'),
          );
        }
        return items;
      });

      const result = service.find({ query: 'eng', sortOrder: 'asc' });

      expect(result.length).toBeGreaterThan(0);
      expect(result.some((dept) => dept.name === 'Engineering')).toBe(true);
    });
  });
});
