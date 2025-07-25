'use client';

import { useState } from 'react';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { MedicalRecordsUploadModal } from '@/components/MedicalRecordsUploadModal';
import { MedicalFile, MedicalHistoryForm } from '@/types/medicalRecords';

interface MedicalRecordsButtonProps {
  context?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onUploadComplete?: (files: MedicalFile[], medicalHistory?: MedicalHistoryForm) => void;
  children?: React.ReactNode;
}

export function MedicalRecordsButton({
  context = 'general',
  variant = 'outline',
  size = 'md',
  className,
  onUploadComplete,
  children
}: MedicalRecordsButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUploadComplete = (files: MedicalFile[], medicalHistory?: MedicalHistoryForm) => {
    onUploadComplete?.(files, medicalHistory);
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsModalOpen(true)}
      >
        <DocumentArrowUpIcon className="w-4 h-4 mr-2" />
        {children || 'Upload Medical Records'}
      </Button>

      <MedicalRecordsUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        context={context}
        onUploadComplete={handleUploadComplete}
      />
    </>
  );
}