'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
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
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
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

interface ResizableSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onWidthChange?: (width: number) => void;
}

export default function ResizableSidebar({ isOpen = true, onClose, onWidthChange }: ResizableSidebarProps) {
  const { userProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  
  const [width, setWidth] = useState(280); // Default width - wider than before
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

  const minWidth = 200;
  const maxWidth = 400;
  const collapsedWidth = 64;

  // Handle mouse resize
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const newWidth = e.clientX;
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setWidth(newWidth);
      onWidthChange?.(newWidth);
    }
  }, [isResizing, onWidthChange]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    const newWidth = !isCollapsed ? collapsedWidth : 280;
    setWidth(newWidth);
    onWidthChange?.(newWidth);
  };

  const currentWidth = isCollapsed ? collapsedWidth : width;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`
          shadow-lg h-screen flex flex-col relative
          fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out
          lg:relative lg:transform-none lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          bg-background border-r border-border
        `}
        style={{ width: `${currentWidth}px` }}
      >
        {/* Logo/Brand */}
        <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-white truncate">MediQuestAI</h1>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mx-auto">
              <HeartIcon className="h-5 w-5 text-white" />
            </div>
          )}
          
          {/* Desktop collapse button */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex text-white hover:text-white/80 transition-colors p-1 rounded"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-5 w-5" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5" />
            )}
          </button>
          
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden text-white hover:text-white/80 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* User Info */}
        {!isCollapsed && (
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
        )}

        {/* Collapsed User Avatar */}
        {isCollapsed && (
          <div className="px-2 py-4 border-b border-border flex justify-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-primary" />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-3 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${
                  isActive
                    ? 'bg-primary/10 text-primary border-r-2 border-primary'
                    : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon
                  className={`${isCollapsed ? 'mx-auto' : 'mr-3'} h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  }`}
                />
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</div>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`${isCollapsed ? 'px-2' : 'px-4'} py-4 border-t border-border space-y-3`}>
          {!isCollapsed && <UserDropdown />}
          
          {/* Theme Toggle Section */}
          <div className={`${!isCollapsed ? 'pt-2 border-t border-border' : ''}`}>
            {!isCollapsed && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Theme</span>
              </div>
            )}
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-1'}`}>
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
                    } ${isCollapsed ? 'mb-1' : ''}`}
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

        {/* Resize Handle - Desktop only */}
        {!isCollapsed && (
          <div
            ref={resizeHandleRef}
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-primary/20 transition-colors hidden lg:block group"
            onMouseDown={handleMouseDown}
          >
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-border group-hover:bg-primary/40 rounded-l transition-colors" />
          </div>
        )}
      </div>
    </>
  );
}