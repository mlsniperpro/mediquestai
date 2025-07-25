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
        {/* Resizable Sidebar */}
        <div 
          className="lg:flex-shrink-0 hidden lg:block" 
          style={{ width: `${sidebarWidth}px` }}
        >
          <Sidebar 
            isOpen={true} 
            onClose={() => setSidebarOpen(false)}
            onWidthChange={handleSidebarWidthChange}
          />
        </div>
        
        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)}
            onWidthChange={handleSidebarWidthChange}
          />
        </div>
        
        {/* Main Content - Automatically adjusts to sidebar width */}
        <div 
          className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out lg:ml-0"
          style={{ 
            width: isDesktop ? `calc(100vw - ${sidebarWidth}px)` : '100%'
          }}
        >
          {/* Top Navigation Bar */}
          <nav className="bg-background shadow-sm border-b border-border flex-shrink-0">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  {/* Mobile menu button */}
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden mr-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Bars3Icon className="h-6 w-6" />
                  </button>
                  <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <span className="text-muted-foreground text-sm sm:text-base hidden sm:block">
                    Welcome, {user?.displayName || user?.email}
                  </span>
                  <span className="text-muted-foreground text-sm sm:hidden">
                    {user?.displayName?.split(' ')[0] || user?.email?.split('@')[0]}
                  </span>
                </div>
              </div>
            </div>
          </nav>

          {/* Page Content - Scrollable and responsive */}
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="py-4 sm:py-6">
              <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}