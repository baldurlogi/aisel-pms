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
import { ApiTags, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('protected')
  @ApiResponse({
    status: 200,
    description: 'Access to protected route granted',
  })
  getProtected() {
    return { message: 'You accessed a protected route!' };
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login success' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    console.log('🔐 Attempting to log in with:', dto);
    return await this.authService.login(dto);
  }

  @Post('refresh')
  @ApiResponse({ status: 200, description: 'Refreshed JWT tokens' })
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
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User logged out' })
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    const userId = req.user?.id;
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
