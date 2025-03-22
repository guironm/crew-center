import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Department {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;
}
