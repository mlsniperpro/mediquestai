'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { user, userProfile } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-card-foreground mb-4">
            Welcome to your Dashboard!
          </h2>
          <p className="text-muted-foreground mb-6">
            You have successfully signed in to your account. Use the sidebar to navigate through different sections.
          </p>
        </div>
      </div>

      {/* User Information Card */}
      <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-card-foreground mb-4">User Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm text-card-foreground">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Display Name</label>
                <p className="text-sm text-card-foreground">{user?.displayName || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Role</label>
                <p className="text-sm text-card-foreground">
                  {userProfile?.role ? userProfile.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not set'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email Verified</label>
                <p className="text-sm text-card-foreground">{user?.emailVerified ? 'Yes' : 'No'}</p>
              </div>
            </div>
            <div className="space-y-3">
              {userProfile?.facilityName && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Facility</label>
                  <p className="text-sm text-card-foreground">{userProfile.facilityName}</p>
                </div>
              )}
              {userProfile?.licenseNumber && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">License Number</label>
                  <p className="text-sm text-card-foreground">{userProfile.licenseNumber}</p>
                </div>
              )}
              {userProfile?.specialization && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Specialization</label>
                  <p className="text-sm text-card-foreground">{userProfile.specialization}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Account Created</label>
                <p className="text-sm text-card-foreground">{user?.metadata.creationTime}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Sign In</label>
                <p className="text-sm text-card-foreground">{user?.metadata.lastSignInTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-card-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors">
              <h4 className="font-medium text-card-foreground">View Patients</h4>
              <p className="text-sm text-muted-foreground mt-1">Manage patient records and information</p>
            </div>
            <div className="border border-border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors">
              <h4 className="font-medium text-card-foreground">Generate Report</h4>
              <p className="text-sm text-muted-foreground mt-1">Create medical reports and documentation</p>
            </div>
            <div className="border border-border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors">
              <h4 className="font-medium text-card-foreground">AI Assistant</h4>
              <p className="text-sm text-muted-foreground mt-1">Get AI-powered medical assistance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}