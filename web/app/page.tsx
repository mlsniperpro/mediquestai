'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading, needsRoleSelection } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (needsRoleSelection) {
        router.push('/role-selection');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, loading, needsRoleSelection, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 text-center lg:pt-32">
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
            Welcome to{' '}
            <span className="relative whitespace-nowrap text-indigo-600">
              <span className="relative">MediQuestAI</span>
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
            A secure authentication system powered by Firebase. Sign in to access your personalized dashboard
            and explore our features.
          </p>
          <div className="mt-10 flex justify-center gap-x-6">
            <Link
              href="/auth/signin"
              className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-800 focus-visible:outline-indigo-600"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="group inline-flex ring-1 items-center justify-center rounded-full py-2 px-4 text-sm focus:outline-none ring-slate-200 text-slate-700 hover:text-slate-900 hover:ring-slate-300 active:bg-slate-100 active:text-slate-600 focus-visible:outline-indigo-600 focus-visible:ring-slate-300"
            >
              Create Account
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-slate-900">Secure Authentication</h3>
              <p className="mt-2 text-sm text-slate-600">
                Firebase-powered authentication with email/password and Google OAuth support.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-slate-900">User Management</h3>
              <p className="mt-2 text-sm text-slate-600">
                Complete user profile management with password reset and account verification.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-slate-900">Fast & Responsive</h3>
              <p className="mt-2 text-sm text-slate-600">
                Built with Next.js and Tailwind CSS for optimal performance and user experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
