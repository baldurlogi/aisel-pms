import { z } from 'zod';
export declare const CreatePatientSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    phoneNumber: z.ZodOptional<z.ZodString>;
    dob: z.ZodString;
}, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
    phoneNumber?: string | undefined;
}, {
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
    phoneNumber?: string | undefined;
}>;
export type CreatePatientDto = z.infer<typeof CreatePatientSchema>;
export declare const UpdatePatientSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phoneNumber: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    dob: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    email?: string | undefined;
    phoneNumber?: string | undefined;
    dob?: string | undefined;
}, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    email?: string | undefined;
    phoneNumber?: string | undefined;
    dob?: string | undefined;
}>;
export type UpdatePatientDto = z.infer<typeof UpdatePatientSchema>;
export declare const PatientSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    phoneNumber: z.ZodOptional<z.ZodString>;
    dob: z.ZodString;
} & {
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
    id: string;
    phoneNumber?: string | undefined;
}, {
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
    id: string;
    phoneNumber?: string | undefined;
}>;
export type Patient = z.infer<typeof PatientSchema>;
