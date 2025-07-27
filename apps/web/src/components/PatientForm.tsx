'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreatePatientDto, CreatePatientSchema } from 'libs/dtos/patient.schema';
import { useForm } from 'react-hook-form';

type Props = {
  onSubmit: (data: CreatePatientDto) => void;
  defaultValues?: Partial<CreatePatientDto>;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
};

export function PatientForm({ onSubmit, isLoading, defaultValues, mode = 'create' }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePatientDto>({
    resolver: zodResolver(CreatePatientSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register('firstName')} placeholder="First name" />
      {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}

      <Input {...register('lastName')} placeholder="Last name" />
      {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}

      <Input {...register('email')} placeholder="Email" type="email" />
      {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}

      <Input {...register('phoneNumber')} placeholder="Phone (optional)" />
      {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>}

      <Input {...register('dob')} placeholder="Date of birth" type="date" />
      {errors.dob && <p className="text-sm text-red-500">{errors.dob.message}</p>}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Create Patient'}
      </Button>
    </form>
  );
}
