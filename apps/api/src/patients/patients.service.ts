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

  findOne(id: number) {
    return `This action returns a #${id} patient`;
  }

  update(id: number, updatePatientDto: UpdatePatientDto) {
    console.log('Updating patient with id:', id, 'and data:', updatePatientDto);
    return `This action updates a #${id} patient`;
  }

  remove(id: number) {
    return `This action removes a #${id} patient`;
  }
}
