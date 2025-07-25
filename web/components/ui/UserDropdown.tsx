'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  CogIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const themeOptions = [
    { value: 'light', label: 'Light', icon: SunIcon },
    { value: 'dark', label: 'Dark', icon: MoonIcon },
    { value: 'system', label: 'System', icon: ComputerDesktopIcon },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Email Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm text-foreground hover:bg-primary/5 rounded-md transition-colors duration-150"
      >
        <div className="flex items-center space-x-2 min-w-0">
          <UserCircleIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="truncate text-xs">{user?.email}</span>
        </div>
        {isOpen ? (
          <ChevronUpIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="py-1">
            {/* Settings */}
            <Link
              href="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-primary/5 transition-colors duration-150"
            >
              <CogIcon className="h-4 w-4 mr-3 text-muted-foreground" />
              Settings
            </Link>

            {/* Theme Submenu */}
            <div className="border-t border-border">
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Theme
              </div>
              {themeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setTheme(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center px-3 py-2 text-sm transition-colors duration-150 ${
                      theme === option.value
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-primary/5'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3 text-muted-foreground" />
                    {option.label}
                    {theme === option.value && (
                      <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Logout */}
            <div className="border-t border-border">
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors duration-150"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3 text-destructive" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}