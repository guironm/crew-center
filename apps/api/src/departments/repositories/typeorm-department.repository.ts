import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Department } from '../entities/department.entity';
import { IDepartmentRepository } from './department-repository.interface';
import { QueryParams } from '../../shared/repositories/base-repository.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateDepartmentDto, UpdateDepartmentDto } from '@repo/schemas';

@Injectable()
export class TypeOrmDepartmentRepository implements IDepartmentRepository {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find();
  }

  async findOne(id: string): Promise<Department | null> {
    const department = await this.departmentRepository.findOne({
      where: { id },
    });
    return department || null;
  }

  async findByName(name: string): Promise<Department | null> {
    const department = await this.departmentRepository.findOne({
      where: { name: Like(`%${name}%`) },
    });
    return department || null;
  }

  async create(createDto: CreateDepartmentDto): Promise<Department> {
    const department = this.departmentRepository.create({
      id: uuidv4(),
      ...createDto,
    });
    return this.departmentRepository.save(department);
  }

  async update(
    id: string,
    updateDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const department = await this.findOne(id);
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    const updatedDepartment = { ...department, ...updateDto };
    return this.departmentRepository.save(updatedDepartment);
  }

  async delete(id: string): Promise<void> {
    await this.departmentRepository.delete(id);
  }

  async findMany(queryParams: QueryParams<Department>): Promise<Department[]> {
    // Implement query builder logic for filters
    const queryBuilder =
      this.departmentRepository.createQueryBuilder('department');

    // Apply text search if provided
    if (queryParams.textSearch) {
      const fields = queryParams.textSearch.fields as string[];
      const searchConditions = fields
        .map((field) => `department.${field} ILIKE :query`)
        .join(' OR ');

      queryBuilder.andWhere(`(${searchConditions})`, {
        query: `%${queryParams.textSearch.query}%`,
      });
    }

    // Apply filters if provided
    if (queryParams.filters) {
      Object.entries(queryParams.filters).forEach(([key, value]) => {
        queryBuilder.andWhere(`department.${key} = :${key}`, { [key]: value });
      });
    }

    // Apply sorting if provided
    if (queryParams.sort) {
      const order = queryParams.sort.order.toUpperCase() as 'ASC' | 'DESC';
      queryBuilder.orderBy(
        `department.${queryParams.sort.field as string}`,
        order,
      );
    }

    return queryBuilder.getMany();
  }
}
