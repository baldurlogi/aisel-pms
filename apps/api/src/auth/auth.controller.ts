import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

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

  @Post('refresh')
  async refresh(@Req() req) {
    const refreshToken = req.cookies?.refresh_token;
    const userId = req.cookies?.user_id;

    if (!refreshToken || !userId) {
      throw new UnauthorizedException('Missing refresh credentials');
    }

    return await this.authService.refresh(userId, refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() req, // injected request with user info from JwtAuthGuard
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user?.id; // JwtAuthGuard attaches the user object

    console.log('🔒 Logging out user:', userId);

    if (!userId) {
      throw new BadRequestException('User ID is required for logout');
    }

    await this.authService.logout(userId);

    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { message: 'Logged out' };
  }
}
