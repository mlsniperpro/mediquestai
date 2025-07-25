'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  XMarkIcon,
  CloudArrowUpIcon,
  CameraIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  PhotoIcon,
  MicrophoneIcon,
  StopIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface MedicalFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  file?: File;
  category: 'image' | 'video' | 'document' | 'audio';
  uploadedAt: Date;
}

interface MedicalHistoryForm {
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

interface MedicalRecordsUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string; // e.g., 'ai-doctor', 'analytics', 'consultation'
  onUploadComplete?: (files: MedicalFile[], medicalHistory?: MedicalHistoryForm) => void;
}

export function MedicalRecordsUploadModal({ 
  isOpen, 
  onClose, 
  context = 'general',
  onUploadComplete 
}: MedicalRecordsUploadModalProps) {
  const [uploadedFiles, setUploadedFiles] = useState<MedicalFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState<'audio' | 'video' | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [showMedicalForm, setShowMedicalForm] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [availableMicrophones, setAvailableMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>('');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryForm>({
    allergies: '',
    currentMedications: '',
    chronicConditions: '',
    previousSurgeries: '',
    familyHistory: '',
    lifestyle: {
      smoking: '',
      alcohol: '',
      exercise: ''
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    additionalNotes: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const acceptedFileTypes = {
    image: '.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg',
    video: '.mp4,.avi,.mov,.wmv,.flv,.webm,.mkv',
    document: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf',
    audio: '.mp3,.wav,.aac,.ogg,.m4a'
  };

  const getContextMessage = () => {
    switch (context) {
      case 'ai-doctor':
        return 'Upload your medical records to help our AI provide more accurate diagnoses and personalized recommendations.';
      case 'analytics':
        return 'Share your medical history to get comprehensive health analytics and insights tailored to your condition.';
      case 'consultation':
        return 'Upload relevant medical documents to help your doctor better understand your medical history.';
      default:
        return 'Upload your medical records to personalize your experience and preserve your medical history across the app.';
    }
  };

  const generateFileId = () => Math.random().toString(36).substr(2, 9);

  // Detect available cameras and microphones
  const detectDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      const microphones = devices.filter(device => device.kind === 'audioinput');
      
      setAvailableCameras(cameras);
      setAvailableMicrophones(microphones);
      
      // Set default devices
      if (cameras.length > 0 && !selectedCamera) {
        setSelectedCamera(cameras[0].deviceId);
      }
      if (microphones.length > 0 && !selectedMicrophone) {
        setSelectedMicrophone(microphones[0].deviceId);
      }
    } catch (error) {
      console.error('Error detecting devices:', error);
    }
  }, [selectedCamera, selectedMicrophone]);

  // Initialize camera stream
  const startCamera = useCallback(async () => {
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: selectedCamera ? { deviceId: { exact: selectedCamera } } : true,
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      
      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream;
        cameraVideoRef.current.play();
      }
    } catch (error) {
      console.error('Error starting camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  }, [selectedCamera, cameraStream]);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    if (cameraVideoRef.current) {
      cameraVideoRef.current.srcObject = null;
    }
    setShowCamera(false);
  }, [cameraStream]);

  // Take photo
  const takePhoto = useCallback(() => {
    if (!cameraVideoRef.current || !canvasRef.current) return;

    const video = cameraVideoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], `photo-${Date.now()}.jpg`, {
        type: 'image/jpeg'
      });

      const newFile: MedicalFile = {
        id: generateFileId(),
        name: file.name,
        type: file.type,
        size: file.size,
        file,
        url: URL.createObjectURL(file),
        category: 'image',
        uploadedAt: new Date()
      };

      setUploadedFiles(prev => [...prev, newFile]);
      
      // Show success feedback
      const flashDiv = document.createElement('div');
      flashDiv.style.position = 'fixed';
      flashDiv.style.top = '0';
      flashDiv.style.left = '0';
      flashDiv.style.width = '100%';
      flashDiv.style.height = '100%';
      flashDiv.style.backgroundColor = 'white';
      flashDiv.style.opacity = '0.8';
      flashDiv.style.zIndex = '9999';
      flashDiv.style.pointerEvents = 'none';
      document.body.appendChild(flashDiv);
      
      setTimeout(() => {
        document.body.removeChild(flashDiv);
      }, 200);
      
    }, 'image/jpeg', 0.9);
  }, []);

  // Initialize devices on modal open
  useEffect(() => {
    if (isOpen) {
      detectDevices();
    }
  }, [isOpen, detectDevices]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Update camera when device selection changes
  useEffect(() => {
    if (showCamera && selectedCamera) {
      startCamera();
    }
  }, [selectedCamera, showCamera, startCamera]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileCategory = (file: File): MedicalFile['category'] => {
    const type = file.type.toLowerCase();
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      const newFile: MedicalFile = {
        id: generateFileId(),
        name: file.name,
        type: file.type,
        size: file.size,
        file,
        url: URL.createObjectURL(file),
        category: getFileCategory(file),
        uploadedAt: new Date()
      };

      setUploadedFiles(prev => [...prev, newFile]);
    });
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const startRecording = async (type: 'audio' | 'video') => {
    try {
      const constraints = type === 'video' 
        ? { 
            video: selectedCamera ? { deviceId: { exact: selectedCamera } } : true, 
            audio: selectedMicrophone ? { deviceId: { exact: selectedMicrophone } } : true 
          }
        : { 
            audio: selectedMicrophone ? { deviceId: { exact: selectedMicrophone } } : true 
          };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (type === 'video' && videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { 
          type: type === 'video' ? 'video/webm' : 'audio/webm' 
        });
        const file = new File([blob], `recorded-${type}-${Date.now()}.webm`, {
          type: blob.type
        });

        const newFile: MedicalFile = {
          id: generateFileId(),
          name: file.name,
          type: file.type,
          size: file.size,
          file,
          url: URL.createObjectURL(file),
          category: type === 'video' ? 'video' : 'audio',
          uploadedAt: new Date()
        };

        setUploadedFiles(prev => [...prev, newFile]);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };

      setMediaRecorder(recorder);
      setRecordingType(type);
      setIsRecording(true);
      setRecordingTime(0);
      
      recorder.start();

      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access camera/microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
    
    setIsRecording(false);
    setRecordingType(null);
    setMediaRecorder(null);
    setRecordingTime(0);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.url) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const handleUpload = async () => {
    // Here you would implement the actual upload logic
    // For now, we'll just call the callback
    onUploadComplete?.(uploadedFiles, medicalHistory);
    
    // Show success message
    const hasFiles = uploadedFiles.length > 0;
    const hasHistory = Object.values(medicalHistory).some(value => 
      typeof value === 'string' ? value.trim() : 
      typeof value === 'object' ? Object.values(value).some(v => typeof v === 'string' && v.trim()) : false
    );
    
    if (hasFiles && hasHistory) {
      alert(`Successfully uploaded ${uploadedFiles.length} files and medical history!`);
    } else if (hasFiles) {
      alert(`Successfully uploaded ${uploadedFiles.length} files to your medical records!`);
    } else if (hasHistory) {
      alert('Successfully saved your medical history information!');
    }
    
    // Clear files and close modal
    uploadedFiles.forEach(file => {
      if (file.url) URL.revokeObjectURL(file.url);
    });
    setUploadedFiles([]);
    setMedicalHistory({
      allergies: '',
      currentMedications: '',
      chronicConditions: '',
      previousSurgeries: '',
      familyHistory: '',
      lifestyle: { smoking: '', alcohol: '', exercise: '' },
      emergencyContact: { name: '', relationship: '', phone: '' },
      additionalNotes: ''
    });
    setShowMedicalForm(false);
    
    // Stop camera if active
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
    
    onClose();
  };

  const updateMedicalHistory = (field: string, value: string | MedicalHistoryForm['lifestyle'] | MedicalHistoryForm['emergencyContact']) => {
    setMedicalHistory(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateLifestyle = (field: string, value: string) => {
    setMedicalHistory(prev => ({
      ...prev,
      lifestyle: {
        ...prev.lifestyle,
        [field]: value
      }
    }));
  };

  const updateEmergencyContact = (field: string, value: string) => {
    setMedicalHistory(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      }
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFileIcon = (category: MedicalFile['category']) => {
    switch (category) {
      case 'image': return PhotoIcon;
      case 'video': return VideoCameraIcon;
      case 'audio': return MicrophoneIcon;
      default: return DocumentTextIcon;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Upload Medical Records
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {getContextMessage()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setShowMedicalForm(false)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              !showMedicalForm
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Upload Files
          </button>
          <button
            onClick={() => setShowMedicalForm(true)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              showMedicalForm
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Medical History (Optional)
          </button>
        </div>

        {!showMedicalForm ? (
          <>
            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
          <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Drop files here or click to upload
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Support for images, videos, documents (PDF, Word, Excel), and audio files
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
            >
              <DocumentTextIcon className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
            
            <Button
              onClick={() => {
                setShowCamera(true);
                startCamera();
              }}
              variant="outline"
              size="sm"
              disabled={isRecording}
            >
              <CameraIcon className="w-4 h-4 mr-2" />
              Take Photo
            </Button>
            
            <Button
              onClick={() => startRecording('video')}
              variant="outline"
              size="sm"
              disabled={isRecording}
            >
              <VideoCameraIcon className="w-4 h-4 mr-2" />
              Record Video
            </Button>
            
            <Button
              onClick={() => startRecording('audio')}
              variant="outline"
              size="sm"
              disabled={isRecording}
            >
              <MicrophoneIcon className="w-4 h-4 mr-2" />
              Record Audio
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={Object.values(acceptedFileTypes).join(',')}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>
        {/* Device Selection */}
        {(availableCameras.length > 1 || availableMicrophones.length > 1) && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Device Selection</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableCameras.length > 1 && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Camera
                  </label>
                  <select
                    value={selectedCamera}
                    onChange={(e) => setSelectedCamera(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    {availableCameras.map((camera) => (
                      <option key={camera.deviceId} value={camera.deviceId}>
                        {camera.label || `Camera ${camera.deviceId.slice(0, 8)}...`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {availableMicrophones.length > 1 && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Microphone
                  </label>
                  <select
                    value={selectedMicrophone}
                    onChange={(e) => setSelectedMicrophone(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    {availableMicrophones.map((mic) => (
                      <option key={mic.deviceId} value={mic.deviceId}>
                        {mic.label || `Microphone ${mic.deviceId.slice(0, 8)}...`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}
        </>
        ) : (
          /* Medical History Form */
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Optional:</strong> Providing your medical history helps our AI give you more personalized and accurate health insights across the app.
              </p>
            </div>

            {/* Basic Medical Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Known Allergies
                </label>
                <textarea
                  value={medicalHistory.allergies}
                  onChange={(e) => updateMedicalHistory('allergies', e.target.value)}
                  placeholder="e.g., Penicillin, Peanuts, Latex..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Medications
                </label>
                <textarea
                  value={medicalHistory.currentMedications}
                  onChange={(e) => updateMedicalHistory('currentMedications', e.target.value)}
                  placeholder="e.g., Lisinopril 10mg daily, Metformin 500mg twice daily..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chronic Conditions
                </label>
                <textarea
                  value={medicalHistory.chronicConditions}
                  onChange={(e) => updateMedicalHistory('chronicConditions', e.target.value)}
                  placeholder="e.g., Diabetes Type 2, Hypertension, Asthma..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Previous Surgeries
                </label>
                <textarea
                  value={medicalHistory.previousSurgeries}
                  onChange={(e) => updateMedicalHistory('previousSurgeries', e.target.value)}
                  placeholder="e.g., Appendectomy (2018), Knee replacement (2020)..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>

            {/* Family History */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Family Medical History
              </label>
              <textarea
                value={medicalHistory.familyHistory}
                onChange={(e) => updateMedicalHistory('familyHistory', e.target.value)}
                placeholder="e.g., Father: Heart disease, Mother: Diabetes, Grandmother: Breast cancer..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Lifestyle Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Lifestyle Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Smoking Status
                  </label>
                  <select
                    value={medicalHistory.lifestyle.smoking}
                    onChange={(e) => updateLifestyle('smoking', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    <option value="never">Never smoked</option>
                    <option value="former">Former smoker</option>
                    <option value="current">Current smoker</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Alcohol Consumption
                  </label>
                  <select
                    value={medicalHistory.lifestyle.alcohol}
                    onChange={(e) => updateLifestyle('alcohol', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    <option value="never">Never</option>
                    <option value="occasional">Occasional</option>
                    <option value="regular">Regular</option>
                    <option value="heavy">Heavy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Exercise Level
                  </label>
                  <select
                    value={medicalHistory.lifestyle.exercise}
                    onChange={(e) => updateLifestyle('exercise', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    <option value="none">No exercise</option>
                    <option value="light">Light (1-2 times/week)</option>
                    <option value="moderate">Moderate (3-4 times/week)</option>
                    <option value="heavy">Heavy (5+ times/week)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={medicalHistory.emergencyContact.name}
                    onChange={(e) => updateEmergencyContact('name', e.target.value)}
                    placeholder="Emergency contact name"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={medicalHistory.emergencyContact.relationship}
                    onChange={(e) => updateEmergencyContact('relationship', e.target.value)}
                    placeholder="e.g., Spouse, Parent, Sibling"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={medicalHistory.emergencyContact.phone}
                    onChange={(e) => updateEmergencyContact('phone', e.target.value)}
                    placeholder="Emergency contact phone"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Notes
              </label>
              <textarea
                value={medicalHistory.additionalNotes}
                onChange={(e) => updateMedicalHistory('additionalNotes', e.target.value)}
                placeholder="Any other relevant medical information, symptoms, or concerns you'd like to share..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>
          </div>
        )}

        {/* Camera Interface */}
        {showCamera && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Camera</h4>
              <Button
                onClick={stopCamera}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <XMarkIcon className="w-4 h-4 mr-1" />
                Close Camera
              </Button>
            </div>
            
            <div className="relative bg-black rounded-lg overflow-hidden mb-3">
              <video
                ref={cameraVideoRef}
                className="w-full max-h-80 object-cover"
                autoPlay
                muted
                playsInline
              />
              
              {/* Camera overlay with capture button */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <Button
                  onClick={takePhoto}
                  className="bg-white/90 hover:bg-white text-gray-900 rounded-full w-16 h-16 p-0 shadow-lg"
                >
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-white rounded-full"></div>
                  </div>
                </Button>
              </div>
              
              {/* Camera info overlay */}
              <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs">
                {availableCameras.find(cam => cam.deviceId === selectedCamera)?.label || 'Camera'}
              </div>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Position your medical document, prescription, or area of concern in the frame and tap the capture button
            </p>
          </div>
        )}

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Recording Interface */}
        {isRecording && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-700 dark:text-red-300 font-medium">
                  Recording {recordingType} - {formatTime(recordingTime)}
                </span>
              </div>
              <Button
                onClick={stopRecording}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <StopIcon className="w-4 h-4 mr-2" />
                Stop Recording
              </Button>
            </div>
            
            {recordingType === 'video' && (
              <video
                ref={videoRef}
                className="w-full max-w-md mx-auto mt-3 rounded-lg"
                muted
              />
            )}
          </div>
        )}

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
              Uploaded Files ({uploadedFiles.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {uploadedFiles.map((file) => {
                const IconComponent = getFileIcon(file.category);
                return (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <IconComponent className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)} • {file.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {file.url && (file.category === 'image' || file.category === 'video') && (
                        <button
                          onClick={() => window.open(file.url, '_blank')}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Your medical records are encrypted and stored securely
          </p>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={uploadedFiles.length === 0 && !Object.values(medicalHistory).some(value => 
                typeof value === 'string' ? value.trim() : 
                typeof value === 'object' ? Object.values(value).some(v => typeof v === 'string' && v.trim()) : false
              )}
            >
              {showMedicalForm ? 'Save Information' : `Upload ${uploadedFiles.length > 0 ? `(${uploadedFiles.length})` : ''}`}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}