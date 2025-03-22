import {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  ApiSearchParams,
} from '@repo/schemas';
import { BaseRepository } from '../../shared/repositories/base-repository.interface';

/**
 * Interface for employee repositories
 * This ensures that both in-memory and TypeORM implementations
 * follow the same contract
 */
export interface IEmployeeRepository
  extends BaseRepository<
    Employee,
    string,
    CreateEmployeeDto,
    UpdateEmployeeDto
  > {
  /**
   * Find an employee by email
   */
  findByEmail(email: string): Promise<Employee | null>;
  findWithFilters(filters: Partial<ApiSearchParams>): Promise<Employee[]>;
  addMany(employees: Employee[]): Promise<void>;
  countByStatus(status?: string): Promise<number>;
  countUniqueDepartments(): Promise<number>;
}

/**
 * Token for employee repository injection
 */
export const EMPLOYEE_REPOSITORY = 'EMPLOYEE_REPOSITORY';
