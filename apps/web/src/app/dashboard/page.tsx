'use client';

import PatientsList from '@/components/PatientsList';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthProvider';

export default function DashboardPage() {
  const { logout } = useAuth();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1>Welcome to the Dashboard!</h1>
      <PatientsList />
      <Button type="submit" onClick={logout}>
        Logout
      </Button>
    </main>
  );
}
