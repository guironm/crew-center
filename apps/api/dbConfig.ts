import { EmployeeEntity } from 'src/employees/entities/employee.entity';
import { Department } from 'src/departments/entities/department.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js';

export const pgConfig: PostgresConnectionOptions = {
  type: 'postgres',
  //   url: 'postgresql://neondb_owner:npg_kfJaPgGm9C2X@ep-crimson-mode-a2y9priq-pooler.eu-central-1.aws.neon.tech/crewcenterdb?sslmode=require',
  synchronize: true,
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'crewcenter',
  entities: [EmployeeEntity, Department],
  //   migrations: ['__dirname+/migrations/*.js'],
};
