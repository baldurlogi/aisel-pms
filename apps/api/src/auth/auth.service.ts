import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { User, Role } from '@prisma/client';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async storeHashedRefreshToken(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hash },
    });
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<{ id: string; email: string; role: Role } | null> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      this.logger.warn(`User not found with email: ${email}`);
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('❌ Password mismatch for user:', email);
      return null;
    }

    this.logger.log(`✅ Validated user: ${email}`);
    return { id: user.id, email: user.email, role: user.role };
  }

  async refresh(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.refreshToken) {
      throw new ForbiddenException('No refresh token found');
    }

    const isValid = await bcrypt.compare(token, user.refreshToken);
    if (!isValid) {
      throw new ForbiddenException('Invalid refresh token');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const newAccessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.storeHashedRefreshToken(user.id, newRefreshToken);

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      user_id: user.id,
    };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async login(
    dto: LoginDto,
  ): Promise<{ access_token: string; refresh_token: string; user_id: string }> {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role };

    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.storeHashedRefreshToken(user.id, refresh_token);

    return {
      access_token,
      refresh_token,
      user_id: user.id,
    };
  }
}
