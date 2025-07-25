'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import RoleSelection from '@/components/RoleSelection';
import { RoleSelectionData } from '@/types/user';

export default function RoleSelectionPage() {
  const { user, loading, needsRoleSelection, completeRoleSelection } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/signin');
      } else if (!needsRoleSelection) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, needsRoleSelection, router]);

  const handleRoleSelect = async (roleData: RoleSelectionData) => {
    await completeRoleSelection(roleData);
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || !needsRoleSelection) {
    return null;
  }

  return <RoleSelection onRoleSelect={handleRoleSelect} />;
}