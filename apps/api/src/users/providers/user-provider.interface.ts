import { RandomUser } from '../schemas/random-user.schema';

export interface IUserProvider {
  getUsers(count: number): Promise<RandomUser[]>;
}
