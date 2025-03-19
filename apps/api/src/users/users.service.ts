import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { RandomUser, randomUserSchema } from './schemas/random-user.schema';

interface RandomUserApiResponse {
  results: any[];
  info: {
    seed: string;
    results: number;
    page: number;
    version: string;
  };
}

@Injectable()
export class UsersService {
  private readonly apiUrl = 'https://randomuser.me/api/';

  async getRandomUsers(count: number = 10): Promise<RandomUser[]> {
    try {
      const response = await axios.get<RandomUserApiResponse>(
        `${this.apiUrl}?results=${count}`,
      );

      // Parse and validate the users with Zod schema
      return response.data.results
        .map((user) => {
          try {
            return randomUserSchema.parse(user);
          } catch {
            // Skip invalid users
            return null;
          }
        })
        .filter((user): user is RandomUser => user !== null);
    } catch {
      throw new HttpException(
        'Failed to fetch random users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
