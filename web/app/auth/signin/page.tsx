'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle, signInWithICP } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string };
      if (firebaseError.code === 'auth/user-not-found') {
        setError('No account found with this email. Please sign up first or check your email address.');
      } else if (firebaseError.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again or reset your password.');
      } else if (firebaseError.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(firebaseError.message || 'An error occurred during sign in.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleICPSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithICP();
      router.push('/dashboard');
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </Link>
        </div>
        
        <div className="lg:animate-fade-in-up">
          <section className="flex min-w-96 flex-col items-center justify-center">
            <span className="text-xl text-center lg:text-2xl text-foreground">Welcome back</span>
            <span className="text-primary/50 text-center mt-2 mb-5">Let&apos;s continue your learning journey.</span>
            
            <form className="flex w-full flex-col" onSubmit={handleSubmit}>
              {error && (
                <Alert variant="error" className="mb-6">
                  {error}
                </Alert>
              )}

              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" version="1.1" x="0px" y="0px" viewBox="0 0 48 48" enableBackground="new 0 0 48 48" className="flex-shrink-0" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
                      c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
                      c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
                      C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
                      c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
                      c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                  </svg>
                  <span>Continue with Google</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleICPSignIn}
                  disabled={loading}
                >
                  <svg className="flex-shrink-0" height="1em" width="1em" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  <span>Continue with ICP</span>
                </Button>
              </div>

              <div className="flex items-center w-full my-4">
                <div className="border-t border-primary/20 flex-grow"></div>
                <span className="text-center lg:text-sm text-xs text-primary/40 mx-2">or continue with</span>
                <div className="border-t border-primary/20 flex-grow"></div>
              </div>

              <div className="space-y-2">
                <div className="relative w-full">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 mb-4"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative w-full">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    showPasswordToggle={true}
                  />
                </div>
              </div>

              <a className="w-full text-right" href="/auth/forgot-password">
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 underline-offset-4 hover:underline h-10 mr-auto text-xs w-fit mt-.5 p-0 text-right text-primary/50 hover:text-primary/70" type="button">
                  Forgot password?
                </button>
              </a>

              <div className="flex mt-3 w-full justify-center">
                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  size="lg"
                  className="mb-4"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </div>
            </form>

            <div className="text-primary/50 mb-6 text-md">
              Don&apos;t have an account? <Link className="mr-1 text-primary/80 underline hover:text-primary" href="/auth/signup">Sign up</Link>
            </div>
          </section>
        </div>
      </div>
    </AuthGuard>
  );
}