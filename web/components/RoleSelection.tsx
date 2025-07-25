'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserRole, RoleSelectionData } from '@/types/user';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';

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
    <div className="h-full mt-12 md:mt-24 text-center w-full flex items-center flex-col justify-center min-h-screen bg-background">
      <div className="mb-6">
        <Link href="/" className="w-fit">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg className="h-5 w-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </Link>
      </div>
      
      <div className="lg:animate-fade-in-up">
        <section className="flex min-w-96 flex-col items-center justify-center">
          <span className="text-xl text-center lg:text-2xl text-foreground">Select Your Role</span>
          <span className="text-primary/50 text-center mt-2 mb-5">Please select your role to complete your account setup</span>
          
          <form className="flex w-full flex-col" onSubmit={handleSubmit}>
            {error && (
              <Alert variant="error" className="mb-6">
                {error}
              </Alert>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  User Role *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-primary/10 rounded-lg cursor-pointer hover:bg-primary/5 transition-colors">
                    <input
                      type="radio"
                      name="role"
                      value="individual"
                      checked={selectedRole === 'individual'}
                      onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                      className="h-4 w-4 text-primary focus:ring-primary border-primary/20"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-foreground">Individual User</div>
                      <div className="text-sm text-muted-foreground">Personal health management and consultation</div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-primary/10 rounded-lg cursor-pointer hover:bg-primary/5 transition-colors">
                    <input
                      type="radio"
                      name="role"
                      value="healthcare_professional"
                      checked={selectedRole === 'healthcare_professional'}
                      onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                      className="h-4 w-4 text-primary focus:ring-primary border-primary/20"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-foreground">Healthcare Professional</div>
                      <div className="text-sm text-muted-foreground">Enhanced diagnostic tools and patient management</div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-primary/10 rounded-lg cursor-pointer hover:bg-primary/5 transition-colors">
                    <input
                      type="radio"
                      name="role"
                      value="medical_facility"
                      checked={selectedRole === 'medical_facility'}
                      onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                      className="h-4 w-4 text-primary focus:ring-primary border-primary/20"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-foreground">Medical Facility</div>
                      <div className="text-sm text-muted-foreground">Institutional access with multi-user management</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Healthcare Professional Fields */}
              {selectedRole === 'healthcare_professional' && (
                <div className="space-y-4">
                  <Input
                    id="licenseNumber"
                    name="licenseNumber"
                    type="text"
                    required
                    placeholder="Enter your medical license number"
                    label="License Number *"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                  />
                  <Input
                    id="specialization"
                    name="specialization"
                    type="text"
                    placeholder="e.g., Cardiology, Dermatology"
                    label="Specialization (Optional)"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                  />
                </div>
              )}

              {/* Medical Facility Fields */}
              {selectedRole === 'medical_facility' && (
                <Input
                  id="facilityName"
                  name="facilityName"
                  type="text"
                  required
                  placeholder="Enter your facility name"
                  label="Facility Name *"
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                />
              )}
            </div>

            <div className="flex mt-3 w-full justify-center">
              <Button
                type="submit"
                fullWidth
                loading={loading}
                size="lg"
                className="mb-4"
                disabled={loading}
              >
                {loading ? 'Setting up your account...' : 'Complete Setup'}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}