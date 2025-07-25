'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserDropdown from '@/components/ui/UserDropdown';
import { 
  HomeIcon, 
  UserIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  QuestionMarkCircleIcon,
  HeartIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    description: 'Overview and analytics'
  },
  {
    name: 'Patient Records',
    href: '/dashboard/patients',
    icon: UserIcon,
    description: 'Manage patient information'
  },
  {
    name: 'Medical Reports',
    href: '/dashboard/reports',
    icon: DocumentTextIcon,
    description: 'View and generate reports'
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: ChartBarIcon,
    description: 'Data insights and trends'
  },
  {
    name: 'AI Assistant',
    href: '/dashboard/ai-assistant',
    icon: HeartIcon,
    description: 'Medical AI assistance'
  },
  {
    name: 'Help & Support',
    href: '/dashboard/help',
    icon: QuestionMarkCircleIcon,
    description: 'Get help and support'
  }
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { userProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay - only show on mobile when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        w-64 shadow-lg h-screen flex flex-col
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        lg:relative lg:transform-none lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-background border-r border-border
      `}>
        {/* Logo/Brand */}
        <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800">
          <h1 className="text-xl font-bold text-white">MediQuestAI</h1>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden text-white hover:text-white/80 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {userProfile?.role ? userProfile.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {userProfile?.facilityName || 'Healthcare Professional'}
            </p>
          </div>
        </div>
      </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${
                isActive
                  ? 'bg-primary/10 text-primary border-r-2 border-primary'
                  : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                }`}
              />
              <div className="flex-1">
                <div className="text-sm font-medium">{item.name}</div>
                {item.description && (
                  <div className="text-xs text-muted-foreground mt-0.5 hidden sm:block">{item.description}</div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

        {/* Footer - User Dropdown and Theme Toggle */}
        <div className="px-4 py-4 border-t border-border space-y-3">
          <UserDropdown />
          
          {/* Theme Toggle Section */}
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Theme</span>
              <div className="flex items-center space-x-1">
                {['light', 'dark', 'system'].map((themeOption) => {
                  const isActive = theme === themeOption;
                  
                  return (
                    <button
                      key={themeOption}
                      onClick={() => setTheme(themeOption)}
                      className={`p-1.5 rounded-md text-xs transition-colors ${
                        isActive 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
                      }`}
                      title={`Switch to ${themeOption} theme`}
                    >
                      {themeOption === 'light' && '☀️'}
                      {themeOption === 'dark' && '🌙'}
                      {themeOption === 'system' && '💻'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}