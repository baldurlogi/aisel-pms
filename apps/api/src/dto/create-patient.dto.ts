import { IsString, IsEmail, IsDateString, Length } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @Length(1, 50)
  firstName: string;

  @IsString()
  @Length(1, 50)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 20)
  phoneNumber: string;

  @IsDateString()
  dob: string;
}
