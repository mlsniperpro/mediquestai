'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { 
  UserIcon, 
  ShieldCheckIcon, 
  BellIcon, 
  CogIcon,
  KeyIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

export default function Settings() {
  const { user, userProfile } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [specialization, setSpecialization] = useState('');

  useEffect(() => {
    setDisplayName(user?.displayName || '');
    setFacilityName(userProfile?.facilityName || '');
    setLicenseNumber(userProfile?.licenseNumber || '');
    setSpecialization(userProfile?.specialization || '');
  }, [user, userProfile]);

  const handleSaveChanges = () => {
    // TODO: Implement save functionality
    console.log('Saving changes...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-card-foreground mb-4">
            Account Settings
          </h2>
          <p className="text-muted-foreground">
            Manage your account preferences, profile information, and security settings.
          </p>
        </div>
      </div>

      {/* User Information Card */}
      <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center mb-4">
            <UserIcon className="w-5 h-5 text-muted-foreground mr-2" />
            <h3 className="text-lg font-medium text-card-foreground">User Information</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm text-card-foreground bg-accent/50 p-2 rounded">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Display Name</label>
                <p className="text-sm text-card-foreground bg-accent/50 p-2 rounded">{user?.displayName || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Role</label>
                <p className="text-sm text-card-foreground bg-accent/50 p-2 rounded">
                  {userProfile?.role ? userProfile.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not set'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email Verified</label>
                <p className="text-sm text-card-foreground bg-accent/50 p-2 rounded">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    user?.emailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user?.emailVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {userProfile?.facilityName && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Facility</label>
                  <p className="text-sm text-card-foreground bg-accent/50 p-2 rounded">{userProfile.facilityName}</p>
                </div>
              )}
              {userProfile?.licenseNumber && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">License Number</label>
                  <p className="text-sm text-card-foreground bg-accent/50 p-2 rounded">{userProfile.licenseNumber}</p>
                </div>
              )}
              {userProfile?.specialization && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Specialization</label>
                  <p className="text-sm text-card-foreground bg-accent/50 p-2 rounded">{userProfile.specialization}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Account Created</label>
                <p className="text-sm text-card-foreground bg-accent/50 p-2 rounded">
                  {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Sign In</label>
                <p className="text-sm text-card-foreground bg-accent/50 p-2 rounded">
                  {user?.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Profile Information */}
      <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center mb-4">
            <CogIcon className="w-5 h-5 text-muted-foreground mr-2" />
            <h3 className="text-lg font-medium text-card-foreground">Profile Settings</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 border border-border rounded-md shadow-sm bg-accent/50 text-muted-foreground cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary bg-background text-card-foreground"
                placeholder="Enter your display name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Role</label>
              <input
                type="text"
                value={userProfile?.role ? userProfile.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : ''}
                disabled
                className="w-full px-3 py-2 border border-border rounded-md shadow-sm bg-accent/50 text-muted-foreground cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-1">Role cannot be changed</p>
            </div>
            {(userProfile?.role === 'medical_facility' || userProfile?.role === 'healthcare_professional') && (
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Facility Name</label>
                <input
                  type="text"
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary bg-background text-card-foreground"
                  placeholder="Enter facility name"
                />
              </div>
            )}
            {userProfile?.role === 'healthcare_professional' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">License Number</label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary bg-background text-card-foreground"
                    placeholder="Enter license number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Specialization</label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary bg-background text-card-foreground"
                    placeholder="Enter your specialization"
                  />
                </div>
              </>
            )}
          </div>
          <div className="mt-6">
            <Button onClick={handleSaveChanges} variant="primary">
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center mb-4">
            <ShieldCheckIcon className="w-5 h-5 text-muted-foreground mr-2" />
            <h3 className="text-lg font-medium text-card-foreground">Security Settings</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center">
                <KeyIcon className="w-5 h-5 text-muted-foreground mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-card-foreground">Change Password</h4>
                  <p className="text-sm text-muted-foreground">Update your account password</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center">
                <EyeIcon className="w-5 h-5 text-muted-foreground mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-card-foreground">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center mb-4">
            <BellIcon className="w-5 h-5 text-muted-foreground mr-2" />
            <h3 className="text-lg font-medium text-card-foreground">Notification Preferences</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-card-foreground">Email Notifications</h4>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-card-foreground">SMS Notifications</h4>
                <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-card-foreground">Push Notifications</h4>
                <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}