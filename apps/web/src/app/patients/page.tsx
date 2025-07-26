'use client';

import type { Patient } from '../../../../../libs/dtos/patient.schema';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export default function PatientsList() {
  const { data, isLoading, error } = useQuery<Patient[]>({
    queryKey: ['patients'],
    queryFn: () => api.get<Patient[]>('/patients'),
  });

  if (isLoading) return <div>Loading patients...</div>;

  if (error instanceof Error) return <p className="text-red-500">Error: {error.message}</p>;

  if (!data || data.length === 0) return <p>No patients found.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Patients</h1>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>DOB</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(patient => (
              <TableRow key={patient.id}>
                <TableCell>{patient.firstName}</TableCell>
                <TableCell>{patient.lastName}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.phoneNumber || '-'}</TableCell>
                <TableCell>{new Date(patient.dob).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
