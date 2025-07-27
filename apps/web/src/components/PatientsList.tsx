'use client';

import type { Patient } from '../../../../libs/dtos/patient.schema';
import TableSkeleton from '@/components/TableSkeleton';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function PatientsList() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useQuery<Patient[]>({
    queryKey: ['patients', page, limit],
    queryFn: () => api.get<Patient[]>('/patients', { page, limit }),
  });

  if (isLoading) return <TableSkeleton columns={5} rows={6} />;

  if (error instanceof Error) return <p className="text-red-500">Error: {error.message}</p>;

  if (!data) return <p>No patients found.</p>;

  return (
    <>
      <ul>
        {data.map(patient => (
          <li key={patient.id}>
            {patient.firstName} {patient.lastName}
          </li>
        ))}
      </ul>

      {/* Example pagination controls */}
      <div className="mt-4 flex justify-center space-x-4">
        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </>
  );
}
