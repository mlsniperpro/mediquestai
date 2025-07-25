import { 
  HomeIcon, 
  UserIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  QuestionMarkCircleIcon,
  HeartIcon,
  CogIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { UserRole } from '@/types/user';

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description?: string;
  roles: UserRole[]; // Which roles can see this item
  // Role-specific overrides
  roleSpecific?: {
    [key in UserRole]?: {
      name?: string;
      description?: string;
    };
  };
}

// All available navigation items
export const allNavigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    description: 'Overview and analytics',
    roles: ['individual', 'healthcare_professional', 'medical_facility']
  },
  
  // Individual User Items
  {
    name: 'My Health',
    href: '/dashboard/my-health',
    icon: HeartIcon,
    description: 'Personal health tracking',
    roles: ['individual']
  },
  {
    name: 'Consultations',
    href: '/dashboard/consultations',
    icon: CalendarIcon,
    description: 'Schedule and manage consultations',
    roles: ['individual']
  },
  {
    name: 'Medical Records',
    href: '/dashboard/medical-records',
    icon: DocumentTextIcon,
    description: 'View your medical history',
    roles: ['individual']
  },
  
  // Healthcare Professional Items
  {
    name: 'Patient Records',
    href: '/dashboard/patients',
    icon: UserIcon,
    description: 'Manage patient information',
    roles: ['healthcare_professional', 'medical_facility']
  },
  {
    name: 'Appointments',
    href: '/dashboard/appointments',
    icon: CalendarIcon,
    description: 'Manage patient appointments',
    roles: ['healthcare_professional', 'medical_facility']
  },
  {
    name: 'Medical Reports',
    href: '/dashboard/reports',
    icon: DocumentTextIcon,
    description: 'Generate and view reports',
    roles: ['healthcare_professional', 'medical_facility']
  },
  {
    name: 'AI Assistant',
    href: '/dashboard/ai-assistant',
    icon: HeartIcon,
    description: 'Medical AI assistance',
    roles: ['individual', 'healthcare_professional', 'medical_facility'],
    roleSpecific: {
      individual: {
        name: 'AI Doctor',
        description: 'Get AI-powered health guidance'
      },
      healthcare_professional: {
        name: 'AI Assistant',
        description: 'AI-powered diagnostic assistance'
      },
      medical_facility: {
        name: 'AI Assistant',
        description: 'AI-powered medical assistance'
      }
    }
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: ChartBarIcon,
    description: 'Data insights and trends',
    roles: ['individual', 'healthcare_professional', 'medical_facility']
  },
  
  // Medical Facility Items
  {
    name: 'Staff Management',
    href: '/dashboard/staff',
    icon: UserGroupIcon,
    description: 'Manage facility staff',
    roles: ['medical_facility']
  },
  {
    name: 'Facility Overview',
    href: '/dashboard/facility',
    icon: BuildingOfficeIcon,
    description: 'Facility operations overview',
    roles: ['medical_facility']
  },
  {
    name: 'Department Reports',
    href: '/dashboard/department-reports',
    icon: ClipboardDocumentListIcon,
    description: 'Department-wise analytics',
    roles: ['medical_facility']
  },
  
  // Common Items
  {
    name: 'Notifications',
    href: '/dashboard/notifications',
    icon: BellIcon,
    description: 'View notifications',
    roles: ['individual', 'healthcare_professional', 'medical_facility']
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: CogIcon,
    description: 'Account settings',
    roles: ['individual', 'healthcare_professional', 'medical_facility']
  },
  {
    name: 'Help & Support',
    href: '/dashboard/help',
    icon: QuestionMarkCircleIcon,
    description: 'Get help and support',
    roles: ['individual', 'healthcare_professional', 'medical_facility']
  }
];

// Function to get navigation items for a specific role
export function getNavigationItemsForRole(role: UserRole | undefined): NavigationItem[] {
  if (!role) return [];
  
  return allNavigationItems
    .filter(item => item.roles.includes(role))
    .map(item => {
      // Apply role-specific overrides if they exist
      if (item.roleSpecific && item.roleSpecific[role]) {
        const override = item.roleSpecific[role];
        return {
          ...item,
          name: override.name || item.name,
          description: override.description || item.description
        };
      }
      return item;
    });
}

// Role-specific welcome messages and descriptions
export const roleConfig = {
  individual: {
    welcomeTitle: 'Welcome to your Personal Health Dashboard',
    welcomeDescription: 'Track your health, manage consultations, and access your medical records.',
    dashboardTitle: 'Personal Health Dashboard'
  },
  healthcare_professional: {
    welcomeTitle: 'Welcome to your Professional Dashboard',
    welcomeDescription: 'Manage patients, access AI-powered diagnostic tools, and generate medical reports.',
    dashboardTitle: 'Healthcare Professional Dashboard'
  },
  medical_facility: {
    welcomeTitle: 'Welcome to your Facility Management Dashboard',
    welcomeDescription: 'Oversee facility operations, manage staff, and access comprehensive analytics.',
    dashboardTitle: 'Medical Facility Dashboard'
  }
};