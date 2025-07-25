'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { user, loading, needsRoleSelection } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.push('/auth/signin');
      } else if (requireAuth && user && needsRoleSelection) {
        router.push('/role-selection');
      } else if (!requireAuth && user && !needsRoleSelection) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, requireAuth, needsRoleSelection, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null;
  }

  if (requireAuth && user && needsRoleSelection) {
    return null;
  }

  if (!requireAuth && user && !needsRoleSelection) {
    return null;
  }

  return <>{children}</>;
}