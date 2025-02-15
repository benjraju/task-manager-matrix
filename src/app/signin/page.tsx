'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SignIn() {
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { user, error: signInError } = await signIn(email, password);
    
    if (signInError) {
      setError(signInError);
      setIsLoading(false);
      return;
    }

    if (user) {
      router.push('/dashboard');
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');

    const { user, error: googleError } = await signInWithGoogle();
    
    if (googleError) {
      setError(googleError);
      setIsLoading(false);
      return;
    }

    if (user) {
      router.push('/dashboard');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-black/30 p-8 rounded-xl border border-[#78A892]/20"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold font-mono text-[#78A892]">
            Access the Matrix
          </h2>
          <p className="mt-2 text-center text-sm font-mono text-[#78A892]/80">
            Or{' '}
            <Link href="/signup" className="font-medium text-[#78A892] hover:text-[#5C8B75] underline">
              create a new identity
            </Link>
          </p>
        </div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/20 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg font-mono text-sm"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </motion.div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-xl shadow-sm space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border bg-black/50 border-[#78A892]/20 
                         placeholder-[#78A892]/50 text-[#78A892] rounded-xl focus:outline-none focus:ring-1 
                         focus:ring-[#78A892] focus:border-[#78A892] transition-colors font-mono text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-4 py-3 border bg-black/50 border-[#78A892]/20 
                         placeholder-[#78A892]/50 text-[#78A892] rounded-xl focus:outline-none focus:ring-1 
                         focus:ring-[#78A892] focus:border-[#78A892] transition-colors font-mono text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-mono 
                       rounded-xl text-black bg-[#78A892] hover:bg-[#5C8B75] focus:outline-none focus:ring-2 
                       focus:ring-offset-2 focus:ring-[#78A892] transition-all duration-300 disabled:opacity-50
                       hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? 'Connecting...' : 'Connect'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#78A892]/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-[#78A892]/60 font-mono">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 border border-[#78A892]/20 
                       shadow-sm text-sm font-mono rounded-xl text-[#78A892] bg-black/30 
                       hover:bg-[#78A892]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 
                       focus:ring-[#78A892] disabled:opacity-50 transition-all duration-300
                       hover:border-[#78A892]/40 hover:scale-[1.02]"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.607,1.972-2.101,3.467-4.26,3.467c-2.624,0-4.747-2.124-4.747-4.747s2.124-4.747,4.747-4.747c1.123,0,2.178,0.391,3.004,1.096l1.817-1.817C16.944,6.41,14.911,5.657,12.545,5.657C8.449,5.657,5,9.106,5,13.203s3.449,7.546,7.545,7.546c6.281,0,7.855-5.803,7.227-8.972h-7.227V12.151z"
                  fill="currentColor"
                />
              </svg>
              {isLoading ? 'Connecting...' : 'Connect with Google'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 