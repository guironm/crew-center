import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsService } from './departments.service';
import { NotFoundException } from '@nestjs/common';
import { ApiSearchParams } from '@repo/schemas';

describe('DepartmentsService', () => {
  let service: DepartmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepartmentsService],
    }).compile();

    service = module.get<DepartmentsService>(DepartmentsService);
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
    it('should filter departments based on search query', () => {
      // Search for 'eng' should return Engineering department
      const result = service.find({ query: 'eng', sortOrder: 'asc' });

      expect(result.length).toBeGreaterThan(0);
      expect(result.some((dept) => dept.name === 'Engineering')).toBe(true);
    });

    it('should sort departments correctly', () => {
      // Sort by name in ascending order
      const result1 = service.find({ sortBy: 'name', sortOrder: 'asc' });
      expect(result1[0]?.name).toBe('Design'); // Design should be first alphabetically

      // Sort by name in descending order
      const result2 = service.find({ sortBy: 'name', sortOrder: 'desc' });
      expect(result2[0]?.name).toBe('Sales'); // Sales should be first in reverse alphabetical order
    });

    it('should return all departments when no query is provided', () => {
      const result = service.find({ sortOrder: 'asc' });
      expect(result.length).toBe(7); // All departments should be returned
    });

    it('should return empty array when no matches found', () => {
      const result = service.find({
        query: 'xyz123nonexistent',
        sortOrder: 'asc',
      });
      expect(result.length).toBe(0);
    });
  });
});
