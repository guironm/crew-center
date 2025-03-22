import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RandomUserProvider } from './providers/random-user.provider';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'USER_PROVIDER',
      useClass: RandomUserProvider,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
