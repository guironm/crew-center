import { NotFoundException } from '@nestjs/common';
import { BaseRepository, QueryParams } from './base-repository.interface';

/**
 * Base in-memory repository that implements common operations
 */
export abstract class BaseInMemoryRepository<T, ID, CreateDTO, UpdateDTO>
  implements BaseRepository<T, ID, CreateDTO, UpdateDTO>
{
  protected items: T[] = [];

  /**
   * Get entity ID field name (override in derived classes)
   */
  protected abstract get idField(): keyof T;

  /**
   * Generate a new ID (override in derived classes)
   */
  protected abstract generateId(): ID;

  /**
   * Map create DTO to entity (override in derived classes)
   */
  protected abstract mapToEntity(createDto: CreateDTO, id: ID): T;

  /**
   * Find all entities
   */
  async findAll(): Promise<T[]> {
    return [...this.items];
  }

  /**
   * Find one entity by ID
   */
  async findOne(id: ID): Promise<T | null> {
    const item = this.items.find((item) => item[this.idField] === id);
    return item || null;
  }

  /**
   * Create a new entity
   */
  async create(createDto: CreateDTO): Promise<T> {
    const id = this.generateId();
    const newItem = this.mapToEntity(createDto, id);

    this.items.push(newItem);
    return newItem;
  }

  /**
   * Update an existing entity
   */
  async update(id: ID, updateDto: UpdateDTO): Promise<T> {
    const index = this.items.findIndex((item) => item[this.idField] === id);

    if (index === -1) {
      throw new NotFoundException(`Entity with ID ${String(id)} not found`);
    }

    const existingItem = this.items[index];
    // Cast through unknown to safely merge the objects
    const updatedItem = {
      ...existingItem,
      ...(updateDto as unknown as Partial<T>),
    } as T;

    this.items[index] = updatedItem;
    return updatedItem;
  }

  /**
   * Delete an entity by ID
   */
  async delete(id: ID): Promise<void> {
    const index = this.items.findIndex((item) => item[this.idField] === id);

    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  /**
   * Find many entities with filtering
   */
  async findMany(queryParams: QueryParams<T>): Promise<T[]> {
    let results = [...this.items];

    // Apply text search if provided
    if (queryParams.textSearch) {
      results = this.applyTextSearch(
        results,
        queryParams.textSearch.query,
        queryParams.textSearch.fields,
      );
    }

    // Apply filters if provided
    if (queryParams.filters) {
      results = this.applyFilters(results, queryParams.filters);
    }

    // Apply sorting if provided
    if (queryParams.sort) {
      results = this.applySorting(
        results,
        queryParams.sort.field,
        queryParams.sort.order,
      );
    }

    return results;
  }

  /**
   * Apply text search filter to items
   */
  protected applyTextSearch<U>(
    items: U[],
    query: string,
    fields: (keyof U)[],
  ): U[] {
    const normalizedQuery = query.toLowerCase().trim();

    return items.filter((item) =>
      fields.some((field) => {
        const value = item[field];
        return (
          typeof value === 'string' &&
          value.toLowerCase().includes(normalizedQuery)
        );
      }),
    );
  }

  /**
   * Apply filters to items
   */
  protected applyFilters<U>(
    items: U[],
    filters: Partial<Record<keyof U, any>>,
  ): U[] {
    return items.filter((item) =>
      Object.entries(filters).every(([key, value]) => {
        const itemValue = item[key as keyof U];

        // Handle case insensitive string comparison
        if (typeof itemValue === 'string' && typeof value === 'string') {
          return itemValue.toLowerCase() === value.toLowerCase();
        }

        // Direct comparison for non-string values
        return itemValue === value;
      }),
    );
  }

  /**
   * Apply sorting to items
   */
  protected applySorting<U>(
    items: U[],
    field: keyof U,
    order: 'asc' | 'desc',
  ): U[] {
    const sortMultiplier = order === 'desc' ? -1 : 1;

    return [...items].sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];

      // Handle null or undefined values
      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return -1 * sortMultiplier;
      if (valueB == null) return 1 * sortMultiplier;

      // String comparison
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB) * sortMultiplier;
      }

      // Number comparison
      if (valueA < valueB) return -1 * sortMultiplier;
      if (valueA > valueB) return 1 * sortMultiplier;

      return 0;
    });
  }

  /**
   * Add multiple entities
   */
  async addMany(items: T[]): Promise<void> {
    this.items.push(...items);
  }
}
