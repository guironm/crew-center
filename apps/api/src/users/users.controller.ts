import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RandomUser } from './schemas/random-user.schema';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('random')
  @ApiOperation({ summary: 'Get random users' })
  @ApiQuery({
    name: 'count',
    required: false,
    type: Number,
    description: 'Number of users to fetch (default: 10)',
  })
  @ApiResponse({ status: 200, description: 'Returns an array of random users' })
  async getRandomUsers(
    @Query('count', new DefaultValuePipe(10), ParseIntPipe) count: number,
  ): Promise<RandomUser[]> {
    return this.usersService.getRandomUsers(count);
  }
}
