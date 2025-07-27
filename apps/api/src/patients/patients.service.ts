import { Injectable } from '@nestjs/common';
import {
  CreatePatientDto,
  UpdatePatientDto,
} from '../../../../libs/dtos/patient.schema';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPatientDto: CreatePatientDto) {
    console.log('Creating patient with data:', createPatientDto);
    const { dob, phoneNumber, ...rest } = createPatientDto;
    return this.prisma.patient.create({
      data: {
        ...rest,
        dob: new Date(dob),
        ...(phoneNumber !== undefined ? { phoneNumber } : {}),
      },
    });
  }

  findAll(search?: string) {
    const trimmed = search?.trim();

    if (trimmed) {
      return this.prisma.patient.findMany({
        where: {
          OR: [
            { firstName: { contains: trimmed, mode: 'insensitive' } },
            { lastName: { contains: trimmed, mode: 'insensitive' } },
            { email: { contains: trimmed, mode: 'insensitive' } },
          ],
        },
      });
    }
    return this.prisma.patient.findMany(); // no filter
  }

  findOne(id: string) {
    return this.prisma.patient.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdatePatientDto) {
    const { dob, ...rest } = dto;

    return this.prisma.patient.update({
      where: { id },
      data: {
        ...rest,
        ...(dob ? { dob: new Date(dob) } : {}),
      },
    });
  }

  remove(id: string) {
    return this.prisma.patient.delete({ where: { id } });
  }
}
