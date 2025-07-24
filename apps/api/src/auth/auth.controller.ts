import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get()
  findAll() {
    return 'This is the Auth endpoint';
  }
}
