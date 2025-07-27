'use client';

import type { Patient } from '../../../../../libs/dtos/patient.schema';
import { PatientForm } from '@/components/PatientForm';
import { PatientsDrawer } from '@/components/PatientsDrawer';
import TableSkeleton from '@/components/TableSkeleton';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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

  const [open, setOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(search, 300);

  const { theme, toggle } = useTheme();

  const { data, isLoading, error, refetch } = useQuery<Patient[]>({
    queryKey: ['patients', debouncedSearch],
    queryFn: () =>
      api.get<Patient[]>(`/patients${debouncedSearch ? `?search=${debouncedSearch}` : ''}`),
  });

  if (isLoading) return <TableSkeleton rows={6} columns={5} />;

  if (error instanceof Error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold mb-4">Patients</h1>
          <Button
            onClick={toggle}
            variant="outline"
            className="text-sm px-3 py-2 rounded mg-muted bg-primary text-white dark:hover:bg-gray-200 dark:hover:text-zinc-900"
          >
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </Button>
        </div>
        <div className="flex justify-between items-center mb-4">
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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                aria-haspopup="dialog"
                variant="outline"
                className="bg-primary text-white rounded-full px-4 py-2 text-sm font-medium shadow dark:hover:bg-gray-200 dark:hover:text-zinc-900 transition"
                onClick={() => setOpen(true)}
              >
                + Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Patient</DialogTitle>
              </DialogHeader>
              <PatientForm
                onSubmit={async data => {
                  await api.post('/patients', data);
                  setOpen(false);
                  await refetch(); // from react-query
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="overflow-x-auto">
          <Table className="hidden md:table w-full">
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

          {/* Cards – visible only on mobile */}
          {data && data.length > 0 ? (
            <div className="block md:hidden space-y-4">
              {data.map(patient => (
                <div
                  key={patient.id}
                  onClick={() => {
                    setSelectedPatient(patient);
                    setDrawerOpen(true);
                  }}
                  className="p-4 border rounded-lg shadow cursor-pointer bg-white hover:bg-muted dark:bg-zinc-900"
                >
                  <h2 className="font-semibold">
                    {patient.firstName} {patient.lastName}
                  </h2>
                  <p className="text-sm text-muted-foreground">{patient.email}</p>
                  <p className="text-sm">{patient.phoneNumber || '-'}</p>
                  <p className="text-sm">{new Date(patient.dob).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="md:hidden text-center py-8 italic text-muted-foreground">
              No patient{search.trim() ? `s matching “${search}”` : 's'} found.
            </p>
          )}

          <PatientsDrawer
            patient={selectedPatient}
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            refetch={refetch}
          />
        </div>
      </div>
    </>
  );
}
