export interface MedicalFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  file?: File;
  category: 'image' | 'video' | 'document' | 'audio';
  uploadedAt: Date;
  context?: string;
  userId?: string;
  tags?: string[];
  description?: string;
  aiProcessed?: boolean;
  aiInsights?: {
    extractedText?: string;
    insights?: string[];
    confidence?: number;
    medicalEntities?: string[];
  };
}

export interface MedicalHistoryForm {
  allergies: string;
  currentMedications: string;
  chronicConditions: string;
  previousSurgeries: string;
  familyHistory: string;
  lifestyle: {
    smoking: 'never' | 'former' | 'current' | '';
    alcohol: 'never' | 'occasional' | 'regular' | 'heavy' | '';
    exercise: 'none' | 'light' | 'moderate' | 'heavy' | '';
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  additionalNotes: string;
}

export interface MedicalRecordsUploadOptions {
  context: string;
  allowedTypes?: ('image' | 'video' | 'document' | 'audio')[];
  maxFileSize?: number;
  maxFiles?: number;
  autoProcess?: boolean;
}

export interface MedicalRecordsStats {
  totalFiles: number;
  totalSize: number;
  filesByType: Record<string, number>;
  recentUploads: MedicalFile[];
  aiProcessedCount: number;
}

export interface UploadProgress {
  fileId: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}