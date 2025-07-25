'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import { Bars3Icon } from '@heroicons/react/24/outline';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  const handleSidebarWidthChange = useCallback((width: number) => {
    setSidebarWidth(width);
  }, []);

  return (
    <AuthGuard requireAuth={true}>
      <div className="h-screen bg-background flex overflow-hidden">
        {/* Desktop Sidebar - Only visible on lg+ screens */}
        <div className={`hidden lg:block flex-shrink-0 transition-all duration-300`} 
             style={{ width: isDesktop ? `${sidebarWidth}px` : '0px' }}>
          <Sidebar 
            isOpen={true} 
            onClose={() => setSidebarOpen(false)}
            onWidthChange={handleSidebarWidthChange}
          />
        </div>
        
        {/* Mobile Sidebar - Overlay only */}
        <div className="lg:hidden">
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)}
            onWidthChange={handleSidebarWidthChange}
          />
        </div>
        
        {/* Main Content - Full width on mobile, adjusted on desktop */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Navigation Bar */}
          <nav className="bg-background shadow-sm border-b border-border flex-shrink-0">
            <div className="w-full px-3 sm:px-4 lg:px-6 xl:px-8">
              <div className="flex justify-between h-14 sm:h-16">
                <div className="flex items-center min-w-0 flex-1">
                  {/* Mobile menu button */}
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden mr-2 sm:mr-3 p-2 text-muted-foreground hover:text-foreground transition-colors touch-target"
                    aria-label="Open menu"
                  >
                    <Bars3Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                  <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">Dashboard</h1>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                  <span className="text-muted-foreground text-sm sm:text-base hidden sm:block truncate max-w-48">
                    Welcome, {user?.displayName || user?.email}
                  </span>
                  <span className="text-muted-foreground text-sm sm:hidden truncate max-w-20">
                    {user?.displayName?.split(' ')[0] || user?.email?.split('@')[0]}
                  </span>
                </div>
              </div>
            </div>
          </nav>

          {/* Page Content - Scrollable and responsive */}
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="py-3 sm:py-4 lg:py-6">
              <div className="w-full max-w-full mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}