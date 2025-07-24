import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('protected')
  getProtected() {
    return { message: 'You accessed a protected route!' };
  }

  @Post('login')
  login(@Body() body: { email: string }) {
    const payload = { email: body.email, sub: 'user-id-123', role: 'USER' };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
