'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { 
  CameraIcon, 
  PhotoIcon, 
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { storage } from '@/config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/contexts/AuthContext';
import { generateFakeCalorieData, saveFoodRecord, FoodRecord } from '@/services/foodTrackingService';

interface CalorieTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CalorieTrackingModal({ isOpen, onClose }: CalorieTrackingModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [calorieData, setCalorieData] = useState<Omit<FoodRecord, 'id' | 'userId' | 'imageUrl' | 'createdAt'> | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user, userProfile } = useAuth();

  // Cleanup camera stream when modal closes
  useEffect(() => {
    if (!isOpen && stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraOpen(false);
    }
  }, [isOpen, stream]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setUploadStatus('idle');
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const enumerateCameras = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(videoDevices);
      
      // Set default camera (prefer back camera if available)
      if (videoDevices.length > 0 && !selectedCameraId) {
        const backCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear') ||
          device.label.toLowerCase().includes('environment')
        );
        setSelectedCameraId(backCamera?.deviceId || videoDevices[0].deviceId);
      }
    } catch (error) {
      console.error('Error enumerating cameras:', error);
    }
  }, [selectedCameraId]);

  // Set video source when stream is available
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Enumerate cameras when modal opens
  useEffect(() => {
    if (isOpen && availableCameras.length === 0) {
      enumerateCameras();
    }
  }, [isOpen, availableCameras.length, enumerateCameras]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = useCallback(async (cameraId?: string) => {
    setIsCameraLoading(true);
    
    // Enumerate cameras first if not done already
    if (availableCameras.length === 0) {
      await enumerateCameras();
    }
    
    try {
      console.log('Requesting camera access...');
      const constraints: MediaStreamConstraints = {
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      // Use specific camera if provided, otherwise use selected camera or fallback
      if (cameraId || selectedCameraId) {
        (constraints.video as MediaTrackConstraints).deviceId = { exact: cameraId || selectedCameraId };
      } else {
        // Fallback to facingMode if no specific camera selected
        (constraints.video as MediaTrackConstraints).facingMode = 'environment';
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log('Camera access granted, setting stream...');
      setStream(mediaStream);
      setIsCameraOpen(true);
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      // Fallback to file input if camera access fails
      alert('Camera access denied or not available. Please use the gallery option instead.');
    } finally {
      setIsCameraLoading(false);
    }
  }, [availableCameras.length, enumerateCameras, selectedCameraId]);

  const switchCamera = useCallback(async (newCameraId: string) => {
    // Stop current stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    setSelectedCameraId(newCameraId);
    
    // Start new camera
    await startCamera(newCameraId);
  }, [stream, startCamera]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
    setIsCameraLoading(false);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
        handleFileSelect(file);
        stopCamera();
      }
    }, 'image/jpeg', 0.8);
  }, [stopCamera]);

  const handleCameraCapture = () => {
    startCamera();
  };

  const handleGallerySelect = () => {
    fileInputRef.current?.click();
  };

  const uploadImage = async () => {
    if (!selectedFile || !userProfile || !user) return;

    setIsUploading(true);
    setUploadStatus('idle');

    try {
      // Create a unique filename
      const timestamp = Date.now();
      const fileName = `calorie-tracking/${user.uid}/${timestamp}-${selectedFile.name}`;
      
      // Create storage reference
      const storageRef = ref(storage, fileName);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, selectedFile);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      setUploadedImageUrl(downloadURL);
      
      // Generate fake calorie data
      const fakeData = generateFakeCalorieData();
      setCalorieData(fakeData);
      
      // Save food record to Firestore
      const foodRecord: Omit<FoodRecord, 'id'> = {
        userId: user.uid,
        imageUrl: downloadURL,
        createdAt: new Date(),
        ...fakeData
      };
      
      await saveFoodRecord(foodRecord);
      setUploadStatus('success');
      
      console.log('Food record saved successfully:', foodRecord);
      
    } catch (error) {
      console.error('Error uploading image or saving record:', error);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const resetModal = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadedImageUrl(null);
    setUploadStatus('idle');
    setIsUploading(false);
    setCalorieData(null);
    stopCamera();
    
    // Reset camera state
    setAvailableCameras([]);
    setSelectedCameraId('');
    
    // Clear file inputs
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleStartOver = () => {
    resetModal();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      title="Track Your Calories"
      size="lg"
    >
      <div className="p-6">
        {uploadStatus === 'success' && calorieData ? (
          // Success State with Calorie Information
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Analysis Complete!
              </h3>
              <p className="text-muted-foreground">
                Here&apos;s the nutritional information for your food.
              </p>
            </div>

            {uploadedImageUrl && (
              <div className="max-w-md mx-auto">
                <Image 
                  src={uploadedImageUrl} 
                  alt="Analyzed food" 
                  width={448}
                  height={192}
                  className="w-full h-48 object-cover rounded-lg border border-border mb-4"
                />
              </div>
            )}

            {/* Food Information */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="text-center mb-4">
                <h4 className="text-xl font-bold text-green-700 dark:text-green-300">{calorieData.foodName}</h4>
                <p className="text-sm text-green-600 dark:text-green-400">Serving: {calorieData.servingSize}</p>
                <p className="text-xs text-green-500 dark:text-green-500">Confidence: {calorieData.confidence}%</p>
              </div>
              
              {/* Main Calorie Display */}
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full text-white font-bold text-xl shadow-lg">
                  {calorieData.calories}
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">Calories</p>
              </div>

              {/* Macronutrients Grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{calorieData.protein}g</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Protein</div>
                </div>
                <div className="text-center bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{calorieData.carbs}g</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Carbs</div>
                </div>
                <div className="text-center bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{calorieData.fat}g</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Fat</div>
                </div>
              </div>

              {/* Additional Nutrients */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Fiber:</span>
                  <span className="font-medium">{calorieData.fiber}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Sugar:</span>
                  <span className="font-medium">{calorieData.sugar}g</span>
                </div>
                <div className="flex justify-between col-span-2">
                  <span className="text-gray-600 dark:text-gray-400">Sodium:</span>
                  <span className="font-medium">{calorieData.sodium}mg</span>
                </div>
              </div>

              {/* Meal Type Badge */}
              {calorieData.mealType && (
                <div className="mt-3 text-center">
                  <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full capitalize">
                    {calorieData.mealType}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-center">
              <Button 
                onClick={resetModal} 
                variant="outline"
              >
                Track Another Food
              </Button>
              <Button 
                onClick={onClose}
              >
                Done
              </Button>
            </div>
          </div>
        ) : uploadStatus === 'error' ? (
          // Error State
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Upload Failed
              </h3>
              <p className="text-muted-foreground">
                There was an error uploading your image. Please try again.
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <Button onClick={handleStartOver} variant="outline">
                Try Again
              </Button>
              <Button onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        ) : isCameraLoading ? (
          // Camera Loading State
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Starting Camera...
              </h3>
              <p className="text-muted-foreground">
                Please allow camera access when prompted.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={stopCamera} 
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : isCameraOpen ? (
          // Camera Interface
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Take Your Photo
              </h3>
              <p className="text-muted-foreground">
                Position your food in the camera view and tap capture when ready.
              </p>
            </div>

            <div className="relative max-w-md mx-auto">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={() => {
                  console.log('Video metadata loaded, dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
                  if (videoRef.current) {
                    videoRef.current.play().catch(console.error);
                  }
                }}
                onError={(e) => {
                  console.error('Video error:', e);
                }}
                onCanPlay={() => {
                  console.log('Video can play');
                }}
                className="w-full h-64 object-cover rounded-lg border border-border bg-gray-100"
              />
              
              {/* Camera overlay */}
              <div className="absolute inset-0 border-2 border-dashed border-white/50 rounded-lg pointer-events-none" />
              
              {/* Camera switch button - only show if multiple cameras available */}
              {availableCameras.length > 1 && (
                <button
                  onClick={() => {
                    const currentIndex = availableCameras.findIndex(cam => cam.deviceId === selectedCameraId);
                    const nextIndex = (currentIndex + 1) % availableCameras.length;
                    const nextCamera = availableCameras[nextIndex];
                    switchCamera(nextCamera.deviceId);
                  }}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  title="Switch Camera"
                >
                  <ArrowPathIcon className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Camera selection dropdown - show if multiple cameras */}
            {availableCameras.length > 1 && (
              <div className="max-w-md mx-auto">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Camera Selection:
                </label>
                <select
                  value={selectedCameraId}
                  onChange={(e) => switchCamera(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availableCameras.map((camera, index) => (
                    <option key={camera.deviceId} value={camera.deviceId}>
                      {camera.label || `Camera ${index + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button 
                onClick={stopCamera} 
                variant="outline"
              >
                <XMarkIcon className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={capturePhoto}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <CameraIcon className="w-4 h-4 mr-2" />
                Capture Photo
              </Button>
            </div>

            {/* Hidden canvas for photo capture */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        ) : selectedFile ? (
          // Preview and Upload State
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Preview Your Food Image
              </h3>
              <p className="text-muted-foreground">
                Make sure the image clearly shows your food for accurate calorie tracking.
              </p>
            </div>

            {previewUrl && (
              <div className="max-w-md mx-auto">
                <Image 
                  src={previewUrl} 
                  alt="Food preview" 
                  width={448}
                  height={256}
                  className="w-full h-64 object-cover rounded-lg border border-border"
                />
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button 
                onClick={handleStartOver} 
                variant="outline"
                disabled={isUploading}
              >
                Choose Different Image
              </Button>
              <Button 
                onClick={uploadImage}
                loading={isUploading}
                disabled={isUploading}
              >
                <CloudArrowUpIcon className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload & Analyze'}
              </Button>
            </div>
          </div>
        ) : (
          // Initial Selection State
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                How would you like to add your food image?
              </h3>
              <p className="text-muted-foreground">
                Take a photo or upload an existing image to get instant calorie information.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Camera Option */}
              <button
                onClick={handleCameraCapture}
                className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto group-hover:shadow-lg transition-shadow">
                    <CameraIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Take Photo</h4>
                    <p className="text-sm text-muted-foreground">
                      Use your camera to capture your meal
                    </p>
                  </div>
                </div>
              </button>

              {/* Gallery Option */}
              <button
                onClick={handleGallerySelect}
                className="group relative bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto group-hover:shadow-lg transition-shadow">
                    <PhotoIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Choose from Gallery</h4>
                    <p className="text-sm text-muted-foreground">
                      Select an existing photo from your device
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Supported formats: JPG, PNG, WEBP (max 10MB)
              </p>
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
    </Modal>
  );
}