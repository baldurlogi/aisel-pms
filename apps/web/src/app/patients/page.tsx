'use client';

import type { Patient } from '../../../../../libs/dtos/patient.schema';
import { PatientsDrawer } from '@/components/PatientsDrawer';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api } from '@/lib/api';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function PatientsList() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, error } = useQuery<Patient[]>({
    queryKey: ['patients', debouncedSearch],
    queryFn: () =>
      api.get<Patient[]>(`/patients${debouncedSearch ? `?search=${debouncedSearch}` : ''}`),
  });

  if (isLoading) return <div>Loading patients...</div>;

  if (error instanceof Error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Patients</h1>
      <Input
        placeholder="Search patients..."
        value={search}
        onChange={e => {
          const newValue = e.target.value;
          setSearch(newValue);
          const params = new URLSearchParams(window.location.search);
          if (newValue) {
            params.set('search', newValue);
          } else {
            params.delete('search');
          }
          router.replace(`?${params.toString()}`);
        }}
        className="max-w-sm mb-4"
      />
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Date of Birth</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.length > 0 ? (
              data.map(patient => (
                <TableRow
                  key={patient.id}
                  onClick={() => {
                    setSelectedPatient(patient);
                    setDrawerOpen(true);
                  }}
                  className="cursor-pointer hover:bg-muted"
                >
                  <TableCell>{patient.firstName}</TableCell>
                  <TableCell>{patient.lastName}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.phoneNumber || '-'}</TableCell>
                  <TableCell>{new Date(patient.dob).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 italic text-muted-foreground">
                  No patient{search.trim() ? `s matching “${search}”` : 's'} found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PatientsDrawer
        patient={selectedPatient}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
