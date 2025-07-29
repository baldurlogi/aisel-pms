import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Res,
  Req,
  UnauthorizedException,
  Logger,
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
  private readonly logger = new Logger(AuthController.name);

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
    this.logger.log('🔄 Refresh endpoint hit');
    this.logger.log('📥 Raw cookies:', req.headers.cookie);
    this.logger.log('🍪 Parsed cookies:', req.cookies);

    const refreshToken = req.cookies?.refresh_token;
    const userId = req.cookies?.user_id;

    this.logger.log(
      `🔍 Extracted - userId: ${userId}, refreshToken: ${refreshToken ? 'present' : 'missing'}`,
    );

    if (!refreshToken || !userId) {
      this.logger.warn('❌ Missing refresh credentials');
      throw new UnauthorizedException('Missing refresh credentials');
    }

    try {
      const result = await this.authService.refresh(userId, refreshToken);
      this.logger.log(`✅ Refresh successful for user: ${userId}`);
      return result;
    } catch (error) {
      this.logger.error(`❌ Refresh failed for user: ${userId}`, error);
      throw new UnauthorizedException('Invalid refresh token');
    }
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
      secure: false,
      sameSite: 'strict',
    });

    return { message: 'Logged out' };
  }
}
