'use client';

import { useState } from 'react';
import { UserRole, RoleSelectionData } from '@/types/user';

interface RoleSelectionProps {
  onRoleSelect: (roleData: RoleSelectionData) => Promise<void>;
  loading?: boolean;
}

export default function RoleSelection({ onRoleSelect, loading = false }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [facilityName, setFacilityName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedRole) {
      setError('Please select a user role');
      return;
    }

    if (selectedRole === 'healthcare_professional' && !licenseNumber.trim()) {
      setError('License number is required for healthcare professionals');
      return;
    }

    if (selectedRole === 'medical_facility' && !facilityName.trim()) {
      setError('Facility name is required for medical facilities');
      return;
    }

    const roleData: RoleSelectionData = {
      role: selectedRole,
    };

    if (selectedRole === 'healthcare_professional') {
      roleData.licenseNumber = licenseNumber.trim();
      if (specialization.trim()) {
        roleData.specialization = specialization.trim();
      }
    }

    if (selectedRole === 'medical_facility') {
      roleData.facilityName = facilityName.trim();
    }

    try {
      await onRoleSelect(roleData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Select Your Role
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please select your role to complete your account setup
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                User Role *
              </label>
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="role"
                    value="individual"
                    checked={selectedRole === 'individual'}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">Individual User</div>
                    <div className="text-sm text-gray-500">Personal health management and consultation</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="role"
                    value="healthcare_professional"
                    checked={selectedRole === 'healthcare_professional'}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">Healthcare Professional</div>
                    <div className="text-sm text-gray-500">Enhanced diagnostic tools and patient management</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="role"
                    value="medical_facility"
                    checked={selectedRole === 'medical_facility'}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">Medical Facility</div>
                    <div className="text-sm text-gray-500">Institutional access with multi-user management</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Healthcare Professional Fields */}
            {selectedRole === 'healthcare_professional' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                    License Number *
                  </label>
                  <input
                    id="licenseNumber"
                    name="licenseNumber"
                    type="text"
                    required
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your medical license number"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                    Specialization (Optional)
                  </label>
                  <input
                    id="specialization"
                    name="specialization"
                    type="text"
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g., Cardiology, Dermatology"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Medical Facility Fields */}
            {selectedRole === 'medical_facility' && (
              <div>
                <label htmlFor="facilityName" className="block text-sm font-medium text-gray-700">
                  Facility Name *
                </label>
                <input
                  id="facilityName"
                  name="facilityName"
                  type="text"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your facility name"
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Setting up your account...' : 'Complete Setup'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}