import { Injectable } from '@nestjs/common';
import { CreatePatientDto, UpdatePatientDto } from 'libs/dtos/patient.schema';
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
        phoneNumber: phoneNumber ?? null,
      },
    });
  }

  async findAll(search?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const where = search?.trim()
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [patients, total] = await Promise.all([
      this.prisma.patient.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.patient.count({ where }),
    ]);

    return {
      data: patients,
      total,
    };
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
