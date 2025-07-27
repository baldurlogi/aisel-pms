import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt module
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  // Mock JwtService with a dummy sign method
  const mockJwtService = {
    sign: jest.fn(() => 'signed-token'),
  };

  // Mock PrismaService with dummy user methods
  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // clear mocks after each test
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data if password matches', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashed-password',
        role: 'USER',
      };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      // Access the mocked compare method and set resolved value
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      const result = await service.validateUser(
        'missing@example.com',
        'password',
      );
      expect(result).toBeNull();
    });

    it('should return null if password mismatch', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashed-password',
        role: 'USER',
      };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(
        'test@example.com',
        'wrong-password',
      );
      expect(result).toBeNull();
    });
  });
});
