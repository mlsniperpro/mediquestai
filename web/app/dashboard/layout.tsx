'use client';

import { useState } from 'react';
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

  return (
    <AuthGuard requireAuth={true}>
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        {/* Sidebar - Single component handling both desktop and mobile */}
        <div className="lg:w-64 lg:flex-shrink-0">
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
          {/* Top Navigation Bar */}
          <nav className="bg-white shadow-sm border-b flex-shrink-0">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  {/* Mobile menu button */}
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden mr-3 text-gray-600 hover:text-gray-900"
                  >
                    <Bars3Icon className="h-6 w-6" />
                  </button>
                  <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <span className="text-gray-700 text-sm sm:text-base hidden sm:block">
                    Welcome, {user?.displayName || user?.email}
                  </span>
                  <span className="text-gray-700 text-sm sm:hidden">
                    {user?.displayName?.split(' ')[0] || user?.email?.split('@')[0]}
                  </span>
                  {/* Note: Logout is now handled in the sidebar dropdown */}
                </div>
              </div>
            </div>
          </nav>

          {/* Page Content - Scrollable */}
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="py-4 sm:py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}