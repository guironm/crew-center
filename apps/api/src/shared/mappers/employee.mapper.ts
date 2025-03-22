import { Injectable } from '@nestjs/common';
import {
  Employee,
  EmployeeResponseDto,
  employeeResponseSchema,
} from '@repo/schemas';

/**
 * Handles mapping between Employee domain objects and their responseDTO representations
 */
@Injectable()
export class EmployeeMapper {
  /**
   * Maps an Employee domain object to its response DTO
   * @param employee The employee entity to map
   * @returns The mapped EmployeeResponseDto
   */
  toResponseDto(employee: Employee): EmployeeResponseDto {
    // Pre-process the employee data to handle Date conversion
    const processedData = {
      ...employee,
      hireDate: employee.hireDate ? employee.hireDate.toISOString() : undefined,
    };

    // Use Zod schema to validate and transform the data
    return employeeResponseSchema.parse(processedData);
  }

  /**
   * Maps a collection of Employee domain objects to response DTOs
   * @param employees The employee entities to map
   * @returns Array of mapped EmployeeResponseDto objects
   */
  toResponseDtoList(employees: Employee[]): EmployeeResponseDto[] {
    return employees.map((employee) => this.toResponseDto(employee));
  }
}
