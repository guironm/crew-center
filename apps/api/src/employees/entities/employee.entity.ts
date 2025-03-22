import { Column, Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import type { EmployeeStatus } from '@repo/schemas';
import { Department } from '../../departments/entities/department.entity';

@Entity('employees')
export class EmployeeEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('text')
  name!: string;

  @Column('text')
  email!: string;

  @Column('text')
  role!: string;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'departmentId' })
  department!: Department;

  @Column('uuid')
  departmentId!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  salary!: number;

  @Column('text', { nullable: true })
  picture?: string;

  @Column('timestamp', { nullable: true })
  hireDate?: Date;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'on_leave'],
    default: 'active',
  })
  status!: EmployeeStatus;
}
