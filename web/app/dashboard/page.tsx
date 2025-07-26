'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { roleConfig } from '@/config/navigation';
import { 
  CameraIcon,
  HeartIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  BeakerIcon,
  PhoneIcon,
  MapPinIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  CogIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { CalorieTrackingModal } from '@/components/CalorieTrackingModal';
import { MedicalRecordsUploadModal } from '@/components/MedicalRecordsUploadModal';

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href?: string;
  gradient: string;
  comingSoon?: boolean;
  onClick?: () => void;
}

export default function Dashboard() {
  const { userProfile } = useAuth();
  const [isCalorieModalOpen, setIsCalorieModalOpen] = useState(false);
  const [isMedicalRecordsModalOpen, setIsMedicalRecordsModalOpen] = useState(false);
  const [medicalRecordsContext, setMedicalRecordsContext] = useState('general');
  
  // Get role-specific configuration
  const currentRoleConfig = userProfile?.role ? roleConfig[userProfile.role] : null;

  // Define feature cards for each role
  const individualFeatures: FeatureCard[] = [
    {
      title: 'Track Calories',
      description: 'Upload or take pictures of your food to get instant calorie information and nutritional analysis',
      icon: CameraIcon,
      href: '#',
      gradient: 'from-green-400 to-blue-500',
      onClick: () => setIsCalorieModalOpen(true)
    },
    {
      title: 'Get Detailed Exercise Plan',
      description: 'Receive personalized gym plans and professional coaching tailored to your fitness goals',
      icon: HeartIcon,
      href: '/dashboard/exercise-plan',
      gradient: 'from-purple-400 to-pink-500',
      comingSoon: true
    },
    {
      title: 'AI Doctor Consultation',
      description: 'Get 24/7 access to specialized AI doctors for instant health guidance and symptom analysis',
      icon: UserGroupIcon,
      href: '/dashboard/ai-doctor',
      gradient: 'from-blue-400 to-indigo-600'
    },
    {
      title: 'Health Monitoring',
      description: 'Track vital signs, symptoms, and overall health metrics with comprehensive analytics',
      icon: ChartBarIcon,
      href: '/dashboard/health-monitoring',
      gradient: 'from-red-400 to-orange-500',
      comingSoon: true
    },
    {
      title: 'Medical Records',
      description: 'Upload and manage your medical history, test results, images, and documents for AI personalization',
      icon: DocumentTextIcon,
      onClick: () => {
        setMedicalRecordsContext('individual');
        setIsMedicalRecordsModalOpen(true);
      },
      gradient: 'from-teal-400 to-cyan-500'
    },
    {
      title: 'Book Consultations',
      description: 'Schedule appointments with healthcare professionals and manage your consultation history',
      icon: CalendarIcon,
      href: '/dashboard/consultations',
      gradient: 'from-yellow-400 to-orange-500',
      comingSoon: true
    },
    {
      title: 'Food & Diet Planning',
      description: 'Comprehensive nutrition guidance with video walkthroughs, in-depth food preparation explanations, audio analysis, and interactive chat support for personalized dietary planning',
      icon: SparklesIcon,
      href: '/dashboard/food-diet-planning',
      gradient: 'from-emerald-400 to-green-500'
    }
  ];

  const doctorFeatures: FeatureCard[] = [
    {
      title: 'Patient Management',
      description: 'Upload patient consultation videos, medical documents, and records for comprehensive care',
      icon: UserGroupIcon,
      onClick: () => {
        setMedicalRecordsContext('healthcare_professional');
        setIsMedicalRecordsModalOpen(true);
      },
      gradient: 'from-blue-400 to-indigo-600'
    },
    {
      title: 'AI Diagnostic Assistant',
      description: 'Advanced AI-powered diagnostic tools and clinical decision support systems',
      icon: BeakerIcon,
      href: '/dashboard/ai-assistant',
      gradient: 'from-purple-400 to-pink-500',
      comingSoon: true
    },
    {
      title: 'Medical Reports',
      description: 'Generate comprehensive medical reports and documentation with AI assistance',
      icon: DocumentTextIcon,
      href: '/dashboard/reports',
      gradient: 'from-green-400 to-blue-500'
    },
    {
      title: 'Appointment Management',
      description: 'Schedule, manage, and track patient appointments with integrated calendar system',
      icon: CalendarIcon,
      href: '/dashboard/appointments',
      gradient: 'from-red-400 to-orange-500',
      comingSoon: true
    },
    {
      title: 'Clinical Analytics',
      description: 'Advanced analytics for patient outcomes, treatment effectiveness, and practice insights',
      icon: ChartBarIcon,
      href: '/dashboard/analytics',
      gradient: 'from-teal-400 to-cyan-500',
      comingSoon: true
    },
    {
      title: 'Telemedicine Hub',
      description: 'Conduct secure video consultations and remote patient monitoring',
      icon: PhoneIcon,
      href: '/dashboard/telemedicine',
      gradient: 'from-yellow-400 to-orange-500',
      comingSoon: true
    }
  ];

  const facilityFeatures: FeatureCard[] = [
    {
      title: 'Facility Overview',
      description: 'Real-time dashboard for facility operations, capacity management, and resource allocation',
      icon: BuildingOfficeIcon,
      href: '/dashboard/facility',
      gradient: 'from-blue-400 to-indigo-600',
      comingSoon: true
    },
    {
      title: 'Staff Management',
      description: 'Manage healthcare professionals, schedules, and departmental coordination',
      icon: UserGroupIcon,
      href: '/dashboard/staff',
      gradient: 'from-purple-400 to-pink-500',
      comingSoon: true
    },
    {
      title: 'Department Analytics',
      description: 'Comprehensive analytics for each department with performance metrics and insights',
      icon: ChartBarIcon,
      href: '/dashboard/department-reports',
      gradient: 'from-green-400 to-blue-500',
      comingSoon: true
    },
    {
      title: 'Patient Flow Management',
      description: 'Optimize patient flow, reduce wait times, and improve facility efficiency',
      icon: MapPinIcon,
      href: '/dashboard/patient-flow',
      gradient: 'from-red-400 to-orange-500',
      comingSoon: true
    },
    {
      title: 'Quality Assurance',
      description: 'Monitor care quality, compliance standards, and accreditation requirements',
      icon: ShieldCheckIcon,
      href: '/dashboard/quality-assurance',
      gradient: 'from-teal-400 to-cyan-500',
      comingSoon: true
    },
    {
      title: 'Training & Education',
      description: 'Staff training programs, continuing education, and professional development tracking',
      icon: AcademicCapIcon,
      href: '/dashboard/training',
      gradient: 'from-yellow-400 to-orange-500',
      comingSoon: true
    }
  ];

  // Get features based on user role
  const getFeatures = (): FeatureCard[] => {
    switch (userProfile?.role) {
      case 'individual':
        return individualFeatures;
      case 'healthcare_professional':
        return doctorFeatures;
      case 'medical_facility':
        return facilityFeatures;
      default:
        return [];
    }
  };

  const features = getFeatures();

  return (
    <div className="w-full max-w-full space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      {currentRoleConfig && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {currentRoleConfig.welcomeTitle}
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
            {currentRoleConfig.welcomeDescription}
          </p>
        </div>
      )}

      {/* Feature Cards Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {features.map((feature, index) => (
          <div key={index} className="group relative w-full">
            {feature.comingSoon ? (
              <div className="relative w-full bg-card border border-border rounded-lg p-4 sm:p-5 hover:shadow-md transition-all duration-200 opacity-80">
                <div className="absolute top-3 right-3">
                  <span className="bg-amber-50 text-amber-700 text-xs font-medium px-2 py-1 rounded-md border border-amber-200">
                    Soon
                  </span>
                </div>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 shadow-sm`}>
                  <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-2 break-words">{feature.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed break-words">{feature.description}</p>
              </div>
            ) : feature.onClick ? (
              <button onClick={feature.onClick} className="w-full text-left">
                <div className="relative w-full bg-card border border-border rounded-lg p-4 sm:p-5 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer group">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 shadow-sm group-hover:shadow-md transition-shadow`}>
                    <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors break-words">{feature.title}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed break-words">{feature.description}</p>
                </div>
              </button>
            ) : feature.href ? (
              <Link href={feature.href} className="block w-full">
                <div className="relative w-full bg-card border border-border rounded-lg p-4 sm:p-5 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer group">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 shadow-sm group-hover:shadow-md transition-shadow`}>
                    <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors break-words">{feature.title}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed break-words">{feature.description}</p>
                </div>
              </Link>
            ) : null}
          </div>
        ))}
      </div>

      {/* Quick Access Section */}
      <div className="w-full bg-card border border-border rounded-lg p-4">
        <h2 className="text-base sm:text-lg font-semibold text-card-foreground mb-3">Quick Access</h2>
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
          <Link href="/dashboard/settings" className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors">
            <CogIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-card-foreground">Settings</span>
          </Link>
          <Link href="/dashboard/notifications" className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors">
            <DocumentTextIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-card-foreground">Notifications</span>
          </Link>
          <Link href="/dashboard/help" className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors">
            <HeartIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-card-foreground">Help</span>
          </Link>
          <Link href="/dashboard/analytics" className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors">
            <ChartBarIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-card-foreground">Analytics</span>
          </Link>
          <button 
            onClick={() => {
              setMedicalRecordsContext('quick-access');
              setIsMedicalRecordsModalOpen(true);
            }}
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors w-full text-left"
          >
            <DocumentTextIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-card-foreground">Upload Records</span>
          </button>
        </div>
      </div>

      {/* Calorie Tracking Modal */}
      <CalorieTrackingModal 
        isOpen={isCalorieModalOpen}
        onClose={() => setIsCalorieModalOpen(false)}
      />

      {/* Medical Records Upload Modal */}
      <MedicalRecordsUploadModal
        isOpen={isMedicalRecordsModalOpen}
        onClose={() => setIsMedicalRecordsModalOpen(false)}
        context={medicalRecordsContext}
        onUploadComplete={(files, medicalHistory) => {
          console.log('Uploaded files:', files);
          console.log('Medical history:', medicalHistory);
          // Here you can handle the uploaded files and medical history
          // e.g., save to database, process with AI, etc.
        }}
      />
    </div>
  );
}