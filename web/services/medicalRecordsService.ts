import { MedicalFile } from '@/types/medicalRecords';

export class MedicalRecordsService {
  private static instance: MedicalRecordsService;
  
  static getInstance(): MedicalRecordsService {
    if (!MedicalRecordsService.instance) {
      MedicalRecordsService.instance = new MedicalRecordsService();
    }
    return MedicalRecordsService.instance;
  }

  async uploadFiles(files: MedicalFile[], userId: string, context?: string): Promise<boolean> {
    try {
      // In a real implementation, you would upload to your backend/cloud storage
      // For now, we'll simulate the upload and store in localStorage
      
      const existingRecords = this.getUserMedicalRecords(userId);
      const newRecords = files.map(file => ({
        ...file,
        uploadedAt: new Date(),
        context: context || 'general',
        userId
      }));

      const updatedRecords = [...existingRecords, ...newRecords];
      localStorage.setItem(`medical_records_${userId}`, JSON.stringify(updatedRecords));

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Error uploading medical records:', error);
      return false;
    }
  }

  getUserMedicalRecords(userId: string): MedicalFile[] {
    try {
      const records = localStorage.getItem(`medical_records_${userId}`);
      return records ? JSON.parse(records) : [];
    } catch (error) {
      console.error('Error retrieving medical records:', error);
      return [];
    }
  }

  getMedicalRecordsByContext(userId: string, context: string): MedicalFile[] {
    const allRecords = this.getUserMedicalRecords(userId);
    return allRecords.filter(record => record.context === context);
  }

  deleteMedicalRecord(userId: string, recordId: string): boolean {
    try {
      const records = this.getUserMedicalRecords(userId);
      const updatedRecords = records.filter(record => record.id !== recordId);
      localStorage.setItem(`medical_records_${userId}`, JSON.stringify(updatedRecords));
      return true;
    } catch (error) {
      console.error('Error deleting medical record:', error);
      return false;
    }
  }

  async processFileForAI(file: MedicalFile): Promise<any> {
    // This would integrate with your AI service to extract relevant information
    // from medical documents, images, etc.
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        extractedText: 'Sample extracted medical information...',
        insights: ['Blood pressure readings detected', 'Medication list identified'],
        confidence: 0.85
      };
    } catch (error) {
      console.error('Error processing file for AI:', error);
      return null;
    }
  }

  getFileTypeStats(userId: string): Record<string, number> {
    const records = this.getUserMedicalRecords(userId);
    const stats: Record<string, number> = {
      image: 0,
      video: 0,
      document: 0,
      audio: 0
    };

    records.forEach(record => {
      stats[record.category] = (stats[record.category] || 0) + 1;
    });

    return stats;
  }

  getTotalStorageUsed(userId: string): number {
    const records = this.getUserMedicalRecords(userId);
    return records.reduce((total, record) => total + record.size, 0);
  }
}