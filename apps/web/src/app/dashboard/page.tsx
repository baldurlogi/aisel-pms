'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthProvider';

export default function DashboardPage() {
  const { logout } = useAuth();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1>Welcome to the Dashboard!</h1>
      <Button type="submit" className="w-full" onClick={logout}>
        Logout
      </Button>
    </main>
  );
}
