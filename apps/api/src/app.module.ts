import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from 'config/app.config';
import { AdminController } from './users/users.controller';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    UsersModule,
    AuthModule,
    PatientsModule,
  ],
  controllers: [AppController, AdminController],
  providers: [AppService],
})
export class AppModule {}
