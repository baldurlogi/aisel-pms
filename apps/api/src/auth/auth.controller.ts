import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtected() {
    return { message: 'You accessed a protected route!' };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    console.log('🔐 Attempting to log in with:', dto);
    return await this.authService.login(dto);
  }
}
