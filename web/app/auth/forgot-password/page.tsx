'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await resetPassword(email);
      setMessage('Check your email for password reset instructions');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard requireAuth={false}>
      <div className="h-full mt-12 md:mt-24 text-center w-full flex items-center flex-col justify-center min-h-screen bg-background">
        <div className="mb-6">
          <Link href="/" className="w-fit">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
              </svg>
            </div>
          </Link>
        </div>
        
        <div className="lg:animate-fade-in-up">
          <section className="flex min-w-96 flex-col items-center justify-center">
            <span className="text-xl text-center lg:text-2xl text-foreground">Reset your password</span>
            <span className="text-primary/50 text-center mt-2 mb-5">Enter your email address and we&apos;ll send you a link to reset your password.</span>
            
            <form className="flex w-full flex-col" onSubmit={handleSubmit}>
              {error && (
                <Alert variant="error" className="mb-6">
                  {error}
                </Alert>
              )}
              {message && (
                <Alert variant="success" className="mb-6">
                  {message}
                </Alert>
              )}

              <div className="space-y-2">
                <div className="relative w-full">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 mb-4"
                  />
                </div>
              </div>

              <div className="flex mt-3 w-full justify-center">
                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  size="lg"
                  className="mb-4"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send reset email'}
                </Button>
              </div>
            </form>

            <div className="text-primary/50 mb-6 text-md">
              <Link className="mr-1 text-primary/80 underline hover:text-primary inline-flex items-center" href="/auth/signin">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to sign in
              </Link>
            </div>
          </section>
        </div>
      </div>
    </AuthGuard>
  );
}