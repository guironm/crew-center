import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { RandomUser } from './schemas/random-user.schema';
import type { IUserProvider } from './providers/user-provider.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_PROVIDER')
    private readonly userProvider: IUserProvider,
  ) {}

  async getRandomUsers(count: number = 10): Promise<RandomUser[]> {
    try {
      return await this.userProvider.getUsers(count);
    } catch {
      throw new HttpException(
        'Failed to fetch random users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
