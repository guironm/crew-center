import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  ApiSearchParams,
} from '@repo/schemas';
import { IEmployeeRepository } from './employee-repository.interface';
import { EmployeeEntity } from '../entities/employee.entity';
import { QueryParams } from '../../shared/repositories/base-repository.interface';
import { EmployeeEntityMapper } from '../mappers/employee-entity.mapper';

@Injectable()
export class TypeOrmEmployeeRepository implements IEmployeeRepository {
  constructor(
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,
    private readonly mapper: EmployeeEntityMapper,
  ) {}

  async findAll(): Promise<Employee[]> {
    const entities = await this.employeeRepository.find({
      relations: ['department'],
    });
    return this.mapper.toDomainList(entities);
  }

  async findOne(id: string): Promise<Employee | null> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['department'],
    });
    if (!employee) return null;

    return this.mapper.toDomain(employee);
  }

  async findByEmail(email: string): Promise<Employee | null> {
    const employee = await this.employeeRepository.findOne({
      where: { email },
      relations: ['department'],
    });
    if (!employee) return null;

    return this.mapper.toDomain(employee);
  }

  async create(createDto: CreateEmployeeDto): Promise<Employee> {
    const entityData = this.mapper.createDtoToEntity(createDto);
    const newEmployee = this.employeeRepository.create(entityData);
    await this.employeeRepository.save(newEmployee);

    // Reload with department relation
    const savedEmployee = await this.findOne(newEmployee.id);
    return savedEmployee!;
  }

  async update(id: string, updateDto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    const entityData = this.mapper.updateDtoToEntity(updateDto);
    const updatedEntity = await this.employeeRepository.preload({
      id,
      ...entityData,
    });

    if (!updatedEntity) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    await this.employeeRepository.save(updatedEntity);

    // Reload with department relation
    const savedEmployee = await this.findOne(id);
    return savedEmployee!;
  }

  async delete(id: string): Promise<void> {
    await this.employeeRepository.delete(id);
  }

  async addMany(employees: Employee[]): Promise<void> {
    const entitiesToSave = employees.map((emp) =>
      this.employeeRepository.create(this.mapper.domainToEntity(emp)),
    );
    await this.employeeRepository.save(entitiesToSave);
  }

  async findWithFilters(
    filters: Partial<ApiSearchParams>,
  ): Promise<Employee[]> {
    const queryBuilder = this.employeeRepository.createQueryBuilder('employee');
    queryBuilder.leftJoinAndSelect('employee.department', 'department');

    // Apply text search if provided
    if (filters.query) {
      queryBuilder.andWhere(
        '(employee.name ILIKE :query OR employee.email ILIKE :query OR employee.role ILIKE :query)',
        { query: `%${filters.query}%` },
      );
    }

    // Apply department filter if provided
    if (filters.department) {
      queryBuilder.andWhere('department.name = :departmentName', {
        departmentName: filters.department,
      });
    }

    // Apply status filter if provided
    if (filters.status) {
      queryBuilder.andWhere('employee.status = :status', {
        status: filters.status,
      });
    }

    // Apply sorting if provided
    if (filters.sortBy) {
      const order = (filters.sortOrder || 'asc').toUpperCase() as
        | 'ASC'
        | 'DESC';
      queryBuilder.orderBy(`employee.${filters.sortBy}`, order);
    }

    const entities = await queryBuilder.getMany();
    return this.mapper.toDomainList(entities);
  }

  async findMany(queryParams: QueryParams<Employee>): Promise<Employee[]> {
    // Create query builder
    const queryBuilder = this.employeeRepository.createQueryBuilder('employee');
    queryBuilder.leftJoinAndSelect('employee.department', 'department');

    // Apply text search if provided
    if (queryParams.textSearch) {
      const fields = queryParams.textSearch.fields as string[];
      const searchConditions = fields
        .map((field) => `employee.${field} ILIKE :query`)
        .join(' OR ');

      queryBuilder.andWhere(`(${searchConditions})`, {
        query: `%${queryParams.textSearch.query}%`,
      });
    }

    // Apply filters if provided
    if (queryParams.filters) {
      Object.entries(queryParams.filters).forEach(([key, value]) => {
        if (key === 'departmentId') {
          queryBuilder.andWhere('employee.departmentId = :departmentId', {
            departmentId: value,
          });
        } else {
          queryBuilder.andWhere(`employee.${key} = :${key}`, { [key]: value });
        }
      });
    }

    // Apply sorting if provided
    if (queryParams.sort) {
      const order = queryParams.sort.order.toUpperCase() as 'ASC' | 'DESC';
      queryBuilder.orderBy(
        `employee.${queryParams.sort.field as string}`,
        order,
      );
    }

    const entities = await queryBuilder.getMany();
    return this.mapper.toDomainList(entities);
  }
}
