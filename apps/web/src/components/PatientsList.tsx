'use client';

import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export default function PatientsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: () => api.get('/patients'),
  });

  if (isLoading) return <div>Loading patients...</div>;
  if (error instanceof Error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <ul>
      {data.map((p: any) => (
        <li key={p.id}>
          {p.firstName} {p.lastName}
        </li>
      ))}
    </ul>
  );
}
