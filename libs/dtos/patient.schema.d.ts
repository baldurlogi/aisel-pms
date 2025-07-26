import { z } from 'zod';

export declare const CreatePatientSchema: z.ZodObject<
  {
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    phoneNumber: z.ZodOptional<z.ZodString>;
    dob: z.ZodString;
  },
  z.core.$strip
>;
export type CreatePatientDto = z.infer<typeof CreatePatientSchema>;
export declare const UpdatePatientSchema: z.ZodObject<
  {
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phoneNumber: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    dob: z.ZodOptional<z.ZodString>;
  },
  z.core.$strip
>;
export type UpdatePatientDto = z.infer<typeof UpdatePatientSchema>;
export declare const PatientSchema: z.ZodObject<
  {
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    phoneNumber: z.ZodOptional<z.ZodString>;
    dob: z.ZodString;
    id: z.ZodString;
  },
  z.core.$strip
>;
export type Patient = z.infer<typeof PatientSchema>;
