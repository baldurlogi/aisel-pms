import { IsString, IsEmail, IsDateString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePatientDto {
  @ApiProperty({ example: 'Alice' })
  @IsString()
  @Length(1, 50)
  firstName!: string;

  @ApiProperty({ example: 'Smith' })
  @IsString()
  @Length(1, 50)
  lastName!: string;

  @ApiProperty({ example: 'alice@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @Length(8, 20)
  phoneNumber?: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsDateString()
  dob!: string;
}
