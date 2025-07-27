import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// Create mocks for dependencies
const mockAuthService = {
  login: jest.fn(),
  // mock other methods if used in tests
};

const mockJwtService = {
  sign: jest.fn(),
  // mock other methods if needed
};

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
  },
  // add other Prisma methods if used
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: 'JwtService', useValue: mockJwtService },
        { provide: 'PrismaService', useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // add your tests here, e.g.
  // it('should call login method', async () => {
  //   const dto = { email: 'test@example.com', password: 'password' };
  //   await controller.login(dto);
  //   expect(mockAuthService.login).toHaveBeenCalledWith(dto);
  // });
});
