'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';

export default function Dashboard() {
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Welcome, {user?.displayName || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to your Dashboard!
                </h2>
                <p className="text-gray-600 mb-6">
                  You have successfully signed in to your account.
                </p>
                
                <div className="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">User Information</h3>
                  <div className="space-y-2 text-left">
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Display Name:</strong> {user?.displayName || 'Not set'}</p>
                    <p><strong>Role:</strong> {userProfile?.role ? userProfile.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not set'}</p>
                    {userProfile?.facilityName && (
                      <p><strong>Facility:</strong> {userProfile.facilityName}</p>
                    )}
                    {userProfile?.licenseNumber && (
                      <p><strong>License Number:</strong> {userProfile.licenseNumber}</p>
                    )}
                    {userProfile?.specialization && (
                      <p><strong>Specialization:</strong> {userProfile.specialization}</p>
                    )}
                    <p><strong>Email Verified:</strong> {user?.emailVerified ? 'Yes' : 'No'}</p>
                    <p><strong>Account Created:</strong> {user?.metadata.creationTime}</p>
                    <p><strong>Last Sign In:</strong> {user?.metadata.lastSignInTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}