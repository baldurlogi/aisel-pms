import { Test, TestingModule } from '@nestjs/testing';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { PrismaService } from '../prisma/prisma.service';

describe('PatientsService', () => {
  let service: PatientsService;

  const mockPrismaService = {
    patient: {
      create: jest.fn().mockImplementation(({ data }) =>
        Promise.resolve({
          id: 1,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create() should return created patient data', async () => {
    const dto: CreatePatientDto = {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      phoneNumber: '+15551234567',
      dob: '1990-05-20',
    };

    const result = await service.create(dto);
    expect(result).toMatchObject({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      phoneNumber: '+15551234567',
      dob: new Date('1990-05-20'),
    });
  });
});
