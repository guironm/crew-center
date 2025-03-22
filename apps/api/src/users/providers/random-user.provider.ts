import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUserProvider } from './user-provider.interface';
import { RandomUser, randomUserSchema } from '../schemas/random-user.schema';
import axios from 'axios';
import { config } from '../../config/env';
import { v4 as uuidv4 } from 'uuid';

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
export class RandomUserProvider implements IUserProvider {
  private readonly apiUrl: string;

  constructor() {
    this.apiUrl = config.RANDOM_USER_API_URL;
  }

  async getUsers(count: number = 10): Promise<RandomUser[]> {
    try {
      const response = await axios.get<RandomUserApiResponse>(
        `${this.apiUrl}?results=${count}`,
      );

      // Parse and validate the users with Zod schema
      return response.data.results
        .map((user) => {
          try {
            // Add UUID to each user
            const userWithId = {
              ...user,
              id: uuidv4(),
            };
            return randomUserSchema.parse(userWithId);
          } catch {
            // Skip invalid users
            return null;
          }
        })
        .filter((user): user is RandomUser => user !== null);
    } catch {
      throw new HttpException(
        `Failed to fetch users from random user API`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
