import { AppService } from './app.service';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

@Controller()
export class DebugController {
  @Get('debug/env')
  debugEnv() {
    return {
      JWT_SECRET_defined: !!process.env.JWT_SECRET,
      // optionally: length to be extra sure
      JWT_SECRET_length: process.env.JWT_SECRET?.length ?? 0,
    };
  }
}
