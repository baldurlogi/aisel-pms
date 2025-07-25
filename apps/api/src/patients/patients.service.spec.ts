// apps/api/src/patients/patients.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { PrismaService } from '../prisma/prisma.service';

describe('PatientsService', () => {
  let service: PatientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatientsService, PrismaService],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create() should return the expected string', () => {
    const dto: CreatePatientDto = {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      phoneNumber: '+15551234567',
      dob: '1990-05-20',
    };

    const result = service.create(dto);
    expect(result).toContain('adds a new patient');
  });
});
