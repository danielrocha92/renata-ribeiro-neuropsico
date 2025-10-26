'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

const AdminPrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/login');
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default AdminPrivateRoute;
