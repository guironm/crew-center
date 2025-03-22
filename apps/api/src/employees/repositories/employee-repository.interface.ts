import {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  ApiSearchParams,
} from '@repo/schemas';
import { BaseRepository } from '../../shared/repositories/base-repository.interface';

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
}
