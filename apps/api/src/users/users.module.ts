import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AdminController } from './users.controller';

@Module({
  providers: [UsersService],
  controllers: [AdminController],
})
export class UsersModule {}
