import { Injectable } from '@nestjs/common';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '@repo/schemas';
import { EmployeeEntity } from '../entities/employee.entity';
import { DeepPartial } from 'typeorm';

@Injectable()
export class EmployeeEntityMapper {
  /**
   * Converts a database entity to a domain model
   */
  toDomain(entity: EmployeeEntity): Employee {
    return {
      ...entity,
      departmentId: entity.departmentId,
      department: entity.department
        ? {
            id: entity.department.id,
            name: entity.department.name,
            description: entity.department.description,
          }
        : undefined,
      // Ensure salary is always a number
      salary:
        typeof entity.salary === 'string'
          ? parseFloat(entity.salary)
          : entity.salary,
      // Ensure hireDate is a Date object if present
      hireDate: entity.hireDate ? new Date(entity.hireDate) : undefined,
    } as Employee;
  }

  /**
   * Converts multiple database entities to domain models
   */
  toDomainList(entities: EmployeeEntity[]): Employee[] {
    return entities.map((entity) => this.toDomain(entity));
  }

  /**
   * Converts a domain model to a response object without ID
   */
  toResponseWithoutId(employee: Employee): Omit<Employee, 'id'> {
    const { id, ...employeeWithoutId } = employee;
    return employeeWithoutId;
  }

  /**
   * Converts multiple domain models to response objects without IDs
   */
  toResponseListWithoutId(employees: Employee[]): Omit<Employee, 'id'>[] {
    return employees.map((employee) => this.toResponseWithoutId(employee));
  }

  /**
   * Converts a CreateEmployeeDto to an entity
   */
  createDtoToEntity(dto: CreateEmployeeDto): DeepPartial<EmployeeEntity> {
    // Handle null values for picture by converting to undefined
    return {
      ...dto,
      picture: dto.picture === null ? undefined : dto.picture,
      departmentId: dto.departmentId,
      hireDate: dto.hireDate ? new Date(dto.hireDate) : undefined,
    };
  }

  /**
   * Converts an UpdateEmployeeDto to a partial entity
   */
  updateDtoToEntity(dto: UpdateEmployeeDto): DeepPartial<EmployeeEntity> {
    return {
      ...dto,
      picture: dto.picture === null ? undefined : dto.picture,
      departmentId: dto.departmentId,
      hireDate: dto.hireDate ? new Date(dto.hireDate) : undefined,
    };
  }

  /**
   * Converts a domain model to an entity for persistence
   */
  domainToEntity(model: Employee): DeepPartial<EmployeeEntity> {
    return {
      ...model,
      picture: model.picture === null ? undefined : model.picture,
      departmentId: model.departmentId,
      hireDate: model.hireDate ? new Date(model.hireDate) : undefined,
    };
  }
}
