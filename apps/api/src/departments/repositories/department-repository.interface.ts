import { Department } from '../entities/department.entity';
import { BaseRepository } from '../../shared/repositories/base-repository.interface';
import { CreateDepartmentDto, UpdateDepartmentDto } from '@repo/schemas';

/**
 * Interface for department repositories
 * This ensures that both in-memory and TypeORM implementations
 * follow the same contract
 */
export interface IDepartmentRepository
  extends BaseRepository<
    Department,
    string,
    CreateDepartmentDto,
    UpdateDepartmentDto
  > {
  /**
   * Find a department by name (case-insensitive)
   */
  findByName(name: string): Promise<Department | null>;
}

/**
 * Token for department repository injection
 */
export const DEPARTMENT_REPOSITORY = 'DEPARTMENT_REPOSITORY';
