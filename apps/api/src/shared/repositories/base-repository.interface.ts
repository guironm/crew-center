/**
 * Generic query parameters for repository operations
 */
export interface QueryParams<T> {
  filters?: Partial<Record<keyof T, any>>;
  textSearch?: {
    query: string;
    fields: (keyof T)[];
  };
  sort?: {
    field: keyof T;
    order: 'asc' | 'desc';
  };
}

/**
 * Base repository interface with common data operations
 */
export interface BaseRepository<T, ID, CreateDTO, UpdateDTO> {
  /**
   * Find all entities
   */
  findAll(): Promise<T[]>;

  /**
   * Find entities with filtering, sorting, and text search
   */
  findMany(queryParams: QueryParams<T>): Promise<T[]>;

  /**
   * Find one entity by its ID
   */
  findOne(id: ID): Promise<T | null>;

  /**
   * Create a new entity
   */
  create(createDto: CreateDTO): Promise<T>;

  /**
   * Update an existing entity
   */
  update(id: ID, updateDto: UpdateDTO): Promise<T>;

  /**
   * Delete an entity by ID
   */
  delete(id: ID): Promise<void>;

  /**
   * Count all entities
   */
  count(): Promise<number>;

  /**
   * Count entities with filtering
   */
  countWithFilter(filters?: Partial<Record<keyof T, any>>): Promise<number>;
}
