'use client';

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
  CogIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  gradient: string;
  comingSoon?: boolean;
}

export default function Dashboard() {
  const { userProfile } = useAuth();
  
  // Get role-specific configuration
  const currentRoleConfig = userProfile?.role ? roleConfig[userProfile.role] : null;

  // Define feature cards for each role
  const individualFeatures: FeatureCard[] = [
    {
      title: 'Track Calories',
      description: 'Upload or take pictures of your food to get instant calorie information and nutritional analysis',
      icon: CameraIcon,
      href: '/dashboard/calorie-tracker',
      gradient: 'from-green-400 to-blue-500',
      comingSoon: true
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
      gradient: 'from-blue-400 to-indigo-600',
      comingSoon: true
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
      description: 'Securely store and manage your medical history, lab results, and prescriptions',
      icon: DocumentTextIcon,
      href: '/dashboard/medical-records',
      gradient: 'from-teal-400 to-cyan-500',
      comingSoon: true
    },
    {
      title: 'Book Consultations',
      description: 'Schedule appointments with healthcare professionals and manage your consultation history',
      icon: CalendarIcon,
      href: '/dashboard/consultations',
      gradient: 'from-yellow-400 to-orange-500',
      comingSoon: true
    }
  ];

  const doctorFeatures: FeatureCard[] = [
    {
      title: 'Patient Management',
      description: 'Comprehensive patient records, treatment history, and care coordination tools',
      icon: UserGroupIcon,
      href: '/dashboard/patients',
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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-card-foreground mb-4">
          {currentRoleConfig?.welcomeTitle || 'Welcome to MediQuest AI'}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {currentRoleConfig?.welcomeDescription || 'Your comprehensive AI-powered healthcare platform'}
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="group relative">
            {feature.comingSoon ? (
              <div className="relative bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 opacity-75">
                <div className="absolute top-4 right-4">
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Coming Soon
                  </span>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ) : (
              <Link href={feature.href}>
                <div className="relative bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent group-hover:from-blue-50/10 group-hover:to-purple-50/10 rounded-xl transition-all duration-300"></div>
                </div>
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Quick Access Section */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-card-foreground mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/dashboard/settings" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors">
            <CogIcon className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-card-foreground">Settings</span>
          </Link>
          <Link href="/dashboard/notifications" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors">
            <DocumentTextIcon className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-card-foreground">Notifications</span>
          </Link>
          <Link href="/dashboard/help" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors">
            <HeartIcon className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-card-foreground">Help & Support</span>
          </Link>
          <Link href="/dashboard/analytics" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors">
            <ChartBarIcon className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-card-foreground">Analytics</span>
          </Link>
        </div>
      </div>
    </div>
  );
}