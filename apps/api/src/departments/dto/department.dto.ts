import { ApiProperty } from '@nestjs/swagger';

export class DepartmentDto {
  @ApiProperty({
    description: 'Department ID',
    type: Number,
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'Department name',
    type: String,
    example: 'Engineering',
  })
  name!: string;

  @ApiProperty({
    description: 'Department description',
    type: String,
    example: 'Software development and infrastructure',
  })
  description!: string;
}

export class CreateDepartmentDto {
  @ApiProperty({
    description: 'Department name',
    type: String,
    example: 'Engineering',
  })
  name!: string;

  @ApiProperty({
    description: 'Department description',
    type: String,
    example: 'Software development and infrastructure',
  })
  description!: string;
}

export class UpdateDepartmentDto {
  @ApiProperty({
    description: 'Department name',
    type: String,
    example: 'Engineering',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Department description',
    type: String,
    example: 'Software development and infrastructure',
    required: false,
  })
  description?: string;
}
