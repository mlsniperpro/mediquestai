import { useState, useCallback } from 'react';
import { MedicalFile } from '@/types/medicalRecords';
import { MedicalRecordsService } from '@/services/medicalRecordsService';
import { useAuth } from '@/contexts/AuthContext';

export function useMedicalRecords() {
  const { user } = useAuth();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadContext, setUploadContext] = useState('general');
  const [isUploading, setIsUploading] = useState(false);
  
  const medicalRecordsService = MedicalRecordsService.getInstance();

  const openUploadModal = useCallback((context: string = 'general') => {
    setUploadContext(context);
    setIsUploadModalOpen(true);
  }, []);

  const closeUploadModal = useCallback(() => {
    setIsUploadModalOpen(false);
  }, []);

  const handleUploadComplete = useCallback(async (files: MedicalFile[]) => {
    if (!user?.uid) return;
    
    setIsUploading(true);
    try {
      const success = await medicalRecordsService.uploadFiles(files, user.uid, uploadContext);
      if (success) {
        // You can add success notification here
        console.log('Medical records uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading medical records:', error);
    } finally {
      setIsUploading(false);
    }
  }, [user?.uid, uploadContext, medicalRecordsService]);

  const getUserRecords = useCallback(() => {
    if (!user?.uid) return [];
    return medicalRecordsService.getUserMedicalRecords(user.uid);
  }, [user?.uid, medicalRecordsService]);

  const getRecordsByContext = useCallback((context: string) => {
    if (!user?.uid) return [];
    return medicalRecordsService.getMedicalRecordsByContext(user.uid, context);
  }, [user?.uid, medicalRecordsService]);

  const deleteRecord = useCallback((recordId: string) => {
    if (!user?.uid) return false;
    return medicalRecordsService.deleteMedicalRecord(user.uid, recordId);
  }, [user?.uid, medicalRecordsService]);

  const getStats = useCallback(() => {
    if (!user?.uid) return { totalFiles: 0, totalSize: 0, filesByType: {}, recentUploads: [], aiProcessedCount: 0 };
    
    const records = getUserRecords();
    const filesByType = medicalRecordsService.getFileTypeStats(user.uid);
    const totalSize = medicalRecordsService.getTotalStorageUsed(user.uid);
    const recentUploads = records
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      .slice(0, 5);
    
    return {
      totalFiles: records.length,
      totalSize,
      filesByType,
      recentUploads,
      aiProcessedCount: records.filter(r => r.aiProcessed).length
    };
  }, [user?.uid, getUserRecords, medicalRecordsService]);

  return {
    isUploadModalOpen,
    uploadContext,
    isUploading,
    openUploadModal,
    closeUploadModal,
    handleUploadComplete,
    getUserRecords,
    getRecordsByContext,
    deleteRecord,
    getStats
  };
}