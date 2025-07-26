import { z } from 'zod';

export const CreatePatientSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  dob: z.string(), // or z.date() depending on usage
});

export type CreatePatientDto = z.infer<typeof CreatePatientSchema>;

export const UpdatePatientSchema = CreatePatientSchema.partial();

export type UpdatePatientDto = z.infer<typeof UpdatePatientSchema>;

export const PatientSchema = CreatePatientSchema.extend({
  id: z.string(),
});

export type Patient = z.infer<typeof PatientSchema>;
