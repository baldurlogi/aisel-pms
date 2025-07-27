'use client';

import PatientsList from '@/components/PatientsList';
import TableSkeleton from '@/components/TableSkeleton';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function PatientsPage() {
  return (
    <Suspense fallback={<TableSkeleton rows={6} columns={5} />}>
      <PatientsList />
    </Suspense>
  );
}
