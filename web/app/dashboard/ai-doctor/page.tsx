'use client';

import { useState } from 'react';
import { 
  VideoCameraIcon,
  MicrophoneIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  HeartIcon,
  AcademicCapIcon,
  EyeIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { MedicalRecordsButton } from '@/components/MedicalRecordsButton';

interface AIDoctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  languages: string[];
  availability: 'available' | 'busy' | 'offline';
  avatar: string;
  description: string;
  consultationTypes: ('video' | 'voice' | 'phone' | 'chat')[];
}

const aiDoctors: AIDoctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    specialty: 'General Health Specialist',
    experience: '10+ years',
    languages: ['English', 'Mandarin', 'Spanish'],
    availability: 'available',
    avatar: '👩‍⚕️',
    description: 'Primary care consultation and symptom analysis for comprehensive health management.',
    consultationTypes: ['video', 'voice', 'phone', 'chat']
  },
  {
    id: '2',
    name: 'Dr. Michael Rodriguez',
    specialty: 'Cardiology AI',
    experience: '15+ years',
    languages: ['English', 'Spanish', 'Portuguese'],
    availability: 'available',
    avatar: '👨‍⚕️',
    description: 'Heart health monitoring and cardiovascular consultation with advanced AI diagnostics.',
    consultationTypes: ['video', 'voice', 'phone', 'chat']
  },
  {
    id: '3',
    name: 'Dr. Emily Johnson',
    specialty: 'Mental Health AI',
    experience: '12+ years',
    languages: ['English', 'French'],
    availability: 'available',
    avatar: '👩‍⚕️',
    description: 'Psychological counseling and mental wellness support with AI-powered insights.',
    consultationTypes: ['video', 'voice', 'chat']
  },
  {
    id: '4',
    name: 'Dr. David Kim',
    specialty: 'Dermatology AI',
    experience: '8+ years',
    languages: ['English', 'Korean', 'Japanese'],
    availability: 'available',
    avatar: '👨‍⚕️',
    description: 'Skin condition analysis and treatment recommendations using advanced AI imaging.',
    consultationTypes: ['video', 'phone', 'chat']
  },
  {
    id: '5',
    name: 'Dr. Maria Santos',
    specialty: 'Dental Health AI',
    experience: '14+ years',
    languages: ['English', 'Spanish', 'Portuguese'],
    availability: 'available',
    avatar: '👩‍⚕️',
    description: 'Oral health assessment and dental care guidance with AI-powered diagnostics.',
    consultationTypes: ['video', 'voice', 'phone', 'chat']
  },
  {
    id: '6',
    name: 'Dr. James Wilson',
    specialty: 'Endocrinology AI',
    experience: '18+ years',
    languages: ['English'],
    availability: 'busy',
    avatar: '👨‍⚕️',
    description: 'Diabetes management and hormonal disorder consultation with personalized AI insights.',
    consultationTypes: ['video', 'voice', 'chat']
  },
  {
    id: '7',
    name: 'Dr. Lisa Zhang',
    specialty: 'Ophthalmology AI',
    experience: '11+ years',
    languages: ['English', 'Mandarin'],
    availability: 'available',
    avatar: '👩‍⚕️',
    description: 'Eye health assessment and vision care with AI-powered retinal analysis.',
    consultationTypes: ['video', 'phone', 'chat']
  },
  {
    id: '8',
    name: 'Dr. Ahmed Hassan',
    specialty: 'Pulmonology AI',
    experience: '16+ years',
    languages: ['English', 'Arabic'],
    availability: 'available',
    avatar: '👨‍⚕️',
    description: 'Respiratory health and lung function analysis using advanced AI algorithms.',
    consultationTypes: ['video', 'voice', 'phone', 'chat']
  },
  {
    id: '9',
    name: 'Dr. Rachel Green',
    specialty: 'Neurology AI',
    experience: '20+ years',
    languages: ['English', 'German'],
    availability: 'available',
    avatar: '👩‍⚕️',
    description: 'Brain and nervous system disorder consultation with AI-assisted diagnostics.',
    consultationTypes: ['video', 'voice']
  },
  {
    id: '10',
    name: 'Dr. Robert Taylor',
    specialty: 'Orthopedics AI',
    experience: '13+ years',
    languages: ['English'],
    availability: 'available',
    avatar: '👨‍⚕️',
    description: 'Bone, joint, and musculoskeletal health assessment with AI imaging analysis.',
    consultationTypes: ['video', 'phone']
  },
  {
    id: '11',
    name: 'Dr. Anna Petrov',
    specialty: 'Pediatrics AI',
    experience: '9+ years',
    languages: ['English', 'Russian'],
    availability: 'available',
    avatar: '👩‍⚕️',
    description: 'Specialized child health and development monitoring with age-appropriate AI tools.',
    consultationTypes: ['video', 'voice', 'phone']
  },
  {
    id: '12',
    name: 'Dr. Carlos Mendez',
    specialty: 'Gastroenterology AI',
    experience: '17+ years',
    languages: ['English', 'Spanish'],
    availability: 'busy',
    avatar: '👨‍⚕️',
    description: 'Digestive system health and nutrition guidance with AI-powered analysis.',
    consultationTypes: ['video', 'voice']
  },
  {
    id: '13',
    name: 'Dr. Jennifer Liu',
    specialty: 'Oncology AI',
    experience: '22+ years',
    languages: ['English', 'Mandarin'],
    availability: 'available',
    avatar: '👩‍⚕️',
    description: 'Cancer screening and treatment support with advanced AI diagnostic tools.',
    consultationTypes: ['video', 'voice', 'phone']
  },
  {
    id: '14',
    name: 'Dr. Priya Sharma',
    specialty: 'Reproductive Health AI',
    experience: '14+ years',
    languages: ['English', 'Hindi'],
    availability: 'available',
    avatar: '👩‍⚕️',
    description: 'Gynecology, fertility, and reproductive wellness with AI-assisted care planning.',
    consultationTypes: ['video', 'voice']
  },
  {
    id: '15',
    name: 'Dr. Thomas Brown',
    specialty: 'Urology AI',
    experience: '19+ years',
    languages: ['English'],
    availability: 'available',
    avatar: '👨‍⚕️',
    description: 'Urinary and male reproductive health consultation with AI diagnostic support.',
    consultationTypes: ['video', 'phone']
  },
  {
    id: '16',
    name: 'Dr. Sophie Martin',
    specialty: 'Emergency Medicine AI',
    experience: '12+ years',
    languages: ['English', 'French'],
    availability: 'available',
    avatar: '👩‍⚕️',
    description: 'Urgent care assessment and triage with rapid AI-powered emergency protocols.',
    consultationTypes: ['video', 'voice', 'phone']
  }
];

const specialties = [
  { name: 'General Health Specialist', icon: HeartIcon, gradient: 'from-red-400 to-orange-500' },
  { name: 'Dermatology AI', icon: EyeIcon, gradient: 'from-blue-400 to-indigo-600' },
  { name: 'Dental Health AI', icon: HeartIcon, gradient: 'from-green-400 to-emerald-500' },
  { name: 'Cardiology AI', icon: HeartIcon, gradient: 'from-pink-400 to-red-500' },
  { name: 'Endocrinology AI', icon: AcademicCapIcon, gradient: 'from-purple-400 to-pink-500' },
  { name: 'Ophthalmology AI', icon: EyeIcon, gradient: 'from-cyan-400 to-blue-500' },
  { name: 'Pulmonology AI', icon: HeartIcon, gradient: 'from-teal-400 to-cyan-500' },
  { name: 'Neurology AI', icon: AcademicCapIcon, gradient: 'from-indigo-400 to-purple-500' },
  { name: 'Orthopedics AI', icon: HeartIcon, gradient: 'from-orange-400 to-red-500' },
  { name: 'Pediatrics AI', icon: HeartIcon, gradient: 'from-yellow-400 to-orange-500' },
  { name: 'Gastroenterology AI', icon: HeartIcon, gradient: 'from-lime-400 to-green-500' },
  { name: 'Oncology AI', icon: AcademicCapIcon, gradient: 'from-rose-400 to-pink-500' },
  { name: 'Mental Health AI', icon: AcademicCapIcon, gradient: 'from-violet-400 to-purple-500' },
  { name: 'Reproductive Health AI', icon: HeartIcon, gradient: 'from-pink-400 to-rose-500' },
  { name: 'Urology AI', icon: HeartIcon, gradient: 'from-blue-400 to-cyan-500' },
  { name: 'Emergency Medicine AI', icon: HeartIcon, gradient: 'from-red-500 to-orange-600' },
];

export default function AIDoctorPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<AIDoctor | null>(null);

  const filteredDoctors = selectedSpecialty 
    ? aiDoctors.filter(doctor => doctor.specialty === selectedSpecialty)
    : aiDoctors;

  const handleConsultation = (doctor: AIDoctor, type: 'video' | 'voice' | 'phone' | 'chat') => {
    alert(`Starting ${type} consultation with ${doctor.name}. This feature will be implemented soon!`);
  };

  if (selectedDoctor) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <Button
            variant="outline"
            onClick={() => setSelectedDoctor(null)}
            className="flex items-center gap-2 w-fit touch-manipulation"
            size="sm"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="hidden xs:inline">Back to Doctors</span>
            <span className="xs:hidden">Back</span>
          </Button>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-card-foreground leading-tight">
              Consultation with {selectedDoctor.name}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Choose your preferred consultation method
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Doctor Info */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{selectedDoctor.avatar}</div>
                <h2 className="text-xl font-bold text-card-foreground mb-2">{selectedDoctor.name}</h2>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">{selectedDoctor.specialty}</p>
                <p className="text-sm text-muted-foreground mb-4">{selectedDoctor.experience} experience</p>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  selectedDoctor.availability === 'available' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : selectedDoctor.availability === 'busy'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    selectedDoctor.availability === 'available' ? 'bg-green-500' :
                    selectedDoctor.availability === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`} />
                  {selectedDoctor.availability === 'available' ? 'Available Now' :
                   selectedDoctor.availability === 'busy' ? 'Busy' : 'Offline'}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-card-foreground mb-2">About</h3>
                  <p className="text-sm text-muted-foreground">{selectedDoctor.description}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-card-foreground mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoctor.languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full border border-blue-200 dark:border-blue-800"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Consultation Options */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-card border border-border rounded-lg p-4 sm:p-5 lg:p-6">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-card-foreground mb-4 lg:mb-6">
                Choose Your Consultation Type
              </h2>
              
              <div className="space-y-4">
                {/* Video Call */}
                {selectedDoctor.consultationTypes.includes('video') && (
                  <div className="group bg-card border border-border rounded-lg p-4 lg:p-6 hover:shadow-md hover:border-primary/20 transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <VideoCameraIcon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base lg:text-lg font-semibold text-card-foreground mb-1">Video Call</h3>
                          <p className="text-sm text-muted-foreground mb-2">Face-to-face consultation with screen sharing</p>
                          <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-xs lg:text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <ClockIcon className="w-3 h-3 lg:w-4 lg:h-4" />
                              <span>15-30 min</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircleIcon className="w-3 h-3 lg:w-4 lg:h-4 text-green-500" />
                              <span>HD Quality</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleConsultation(selectedDoctor, 'video')}
                        disabled={selectedDoctor.availability !== 'available'}
                        className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-sm lg:text-base px-4 lg:px-6"
                      >
                        Start Video Call
                      </Button>
                    </div>
                  </div>
                )}

                {/* Voice Call */}
                {selectedDoctor.consultationTypes.includes('voice') && (
                  <div className="group bg-card border border-border rounded-lg p-4 lg:p-6 hover:shadow-md hover:border-primary/20 transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MicrophoneIcon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base lg:text-lg font-semibold text-card-foreground mb-1">Voice Call</h3>
                          <p className="text-sm text-muted-foreground mb-2">Audio-only consultation for privacy and convenience</p>
                          <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-xs lg:text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <ClockIcon className="w-3 h-3 lg:w-4 lg:h-4" />
                              <span>10-25 min</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircleIcon className="w-3 h-3 lg:w-4 lg:h-4 text-green-500" />
                              <span>Crystal Clear</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleConsultation(selectedDoctor, 'voice')}
                        disabled={selectedDoctor.availability !== 'available'}
                        className="bg-green-600 hover:bg-green-700 w-full sm:w-auto text-sm lg:text-base px-4 lg:px-6"
                      >
                        Start Voice Call
                      </Button>
                    </div>
                  </div>
                )}

                {/* Phone Call */}
                {selectedDoctor.consultationTypes.includes('phone') && (
                  <div className="group bg-card border border-border rounded-lg p-4 lg:p-6 hover:shadow-md hover:border-primary/20 transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <PhoneIcon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base lg:text-lg font-semibold text-card-foreground mb-1">Telephone Call</h3>
                          <p className="text-sm text-muted-foreground mb-2">Traditional phone call to your number</p>
                          <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-xs lg:text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <ClockIcon className="w-3 h-3 lg:w-4 lg:h-4" />
                              <span>10-20 min</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircleIcon className="w-3 h-3 lg:w-4 lg:h-4 text-green-500" />
                              <span>Reliable</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleConsultation(selectedDoctor, 'phone')}
                        disabled={selectedDoctor.availability !== 'available'}
                        className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto text-sm lg:text-base px-4 lg:px-6"
                      >
                        Request Call
                      </Button>
                    </div>
                  </div>
                )}

                {/* Chat */}
                {selectedDoctor.consultationTypes.includes('chat') && (
                  <div className="group bg-card border border-border rounded-lg p-4 lg:p-6 hover:shadow-md hover:border-primary/20 transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-400 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ChatBubbleLeftRightIcon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base lg:text-lg font-semibold text-card-foreground mb-1">Chat Consultation</h3>
                          <p className="text-sm text-muted-foreground mb-2">Text-based consultation with instant AI responses</p>
                          <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-xs lg:text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <ClockIcon className="w-3 h-3 lg:w-4 lg:h-4" />
                              <span>5-15 min</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircleIcon className="w-3 h-3 lg:w-4 lg:h-4 text-green-500" />
                              <span>Instant Response</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleConsultation(selectedDoctor, 'chat')}
                        disabled={selectedDoctor.availability !== 'available'}
                        className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto text-sm lg:text-base px-4 lg:px-6"
                      >
                        Start Chat
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {selectedDoctor.availability !== 'available' && (
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-yellow-800 dark:text-yellow-200 text-center">
                    {selectedDoctor.name} is currently {selectedDoctor.availability}. 
                    You can schedule an appointment or try another available doctor.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl lg:text-2xl font-bold text-card-foreground mb-2">AI Doctor Consultation</h1>
            <p className="text-sm lg:text-base text-muted-foreground">
              Get instant access to specialized AI doctors available 24/7 for your health concerns
            </p>
          </div>
          <div className="flex-shrink-0">
            <MedicalRecordsButton
              context="ai-doctor"
              variant="outline"
              size="sm"
              className="bg-white/50 hover:bg-white/80 border-blue-300"
              onUploadComplete={(files, medicalHistory) => {
                console.log('Medical records uploaded for AI Doctor:', files);
                console.log('Medical history for AI Doctor:', medicalHistory);
                // Here you can process the uploaded files and medical history for better AI consultation
              }}
            >
              Upload Medical Records
            </MedicalRecordsButton>
          </div>
        </div>
      </div>

      {/* Specialty Filter */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-5 lg:p-6">
        <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-card-foreground mb-3 sm:mb-4">
          Choose a Specialty
        </h2>
        <div className="flex flex-wrap gap-2 sm:gap-2.5 lg:gap-3">
          <button
            onClick={() => setSelectedSpecialty(null)}
            className={`px-3 lg:px-4 py-2 rounded-lg border transition-colors text-sm lg:text-base ${
              selectedSpecialty === null
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-card-foreground border-border hover:bg-accent'
            }`}
          >
            All Specialties
          </button>
          {specialties.map((specialty) => {
            const IconComponent = specialty.icon;
            return (
              <button
                key={specialty.name}
                onClick={() => setSelectedSpecialty(specialty.name)}
                className={`flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 rounded-lg border transition-colors text-sm lg:text-base ${
                  selectedSpecialty === specialty.name
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-card-foreground border-border hover:bg-accent'
                }`}
              >
                <div className={`w-3 h-3 lg:w-4 lg:h-4 rounded bg-gradient-to-br ${specialty.gradient} flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className="w-2 h-2 lg:w-3 lg:h-3 text-white" />
                </div>
                <span className="truncate">{specialty.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="group bg-card border border-border rounded-lg p-4 lg:p-5 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer"
            onClick={() => setSelectedDoctor(doctor)}
          >
            <div className="text-center mb-4">
              <div className="text-2xl lg:text-3xl mb-3">{doctor.avatar}</div>
              <h3 className="text-base lg:text-lg font-semibold text-card-foreground mb-1 line-clamp-1">{doctor.name}</h3>
              <p className="text-sm lg:text-base text-blue-600 dark:text-blue-400 font-medium mb-2 line-clamp-1">{doctor.specialty}</p>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                doctor.availability === 'available' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : doctor.availability === 'busy'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-1 ${
                  doctor.availability === 'available' ? 'bg-green-500' :
                  doctor.availability === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
                }`} />
                {doctor.availability === 'available' ? 'Available' :
                 doctor.availability === 'busy' ? 'Busy' : 'Offline'}
              </div>
            </div>

            <p className="text-xs lg:text-sm text-muted-foreground mb-3 lg:mb-4 text-center line-clamp-2">{doctor.description}</p>

            <div className="flex justify-center gap-1 lg:gap-2 mb-3 lg:mb-4">
              {doctor.consultationTypes.map((type) => (
                <div
                  key={type}
                  className="flex items-center justify-center w-6 h-6 lg:w-8 lg:h-8 bg-accent rounded-full"
                  title={`${type} consultation available`}
                >
                  {type === 'video' && <VideoCameraIcon className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600" />}
                  {type === 'voice' && <MicrophoneIcon className="w-3 h-3 lg:w-4 lg:h-4 text-green-600" />}
                  {type === 'phone' && <PhoneIcon className="w-3 h-3 lg:w-4 lg:h-4 text-purple-600" />}
                  {type === 'chat' && <ChatBubbleLeftRightIcon className="w-3 h-3 lg:w-4 lg:h-4 text-orange-600" />}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs lg:text-sm text-muted-foreground">{doctor.experience}</span>
              <ChevronRightIcon className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-5 lg:p-6">
        <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-card-foreground mb-4 sm:mb-5 lg:mb-6 text-center">
          Why Choose Our AI Doctors?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          <div className="text-center">
            <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-3 lg:mb-4">
              <ClockIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 lg:w-6 lg:h-6 text-white" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-card-foreground mb-2 leading-tight">24/7 Availability</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Get medical advice anytime, anywhere</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-3 lg:mb-4">
              <CheckCircleIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 lg:w-6 lg:h-6 text-white" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-card-foreground mb-2 leading-tight">Instant Response</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">No waiting rooms or long appointments</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-3 lg:mb-4">
              <VideoCameraIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 lg:w-6 lg:h-6 text-white" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-card-foreground mb-2 leading-tight">Multiple Options</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Video, voice, phone, or chat consultations</p>
          </div>
        </div>
      </div>
    </div>
  );
}