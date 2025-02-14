'use client';

import { useRouter } from 'next/navigation';

export default function Demo() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6EFE9] to-[#D8E6DD] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-[#78A892]/20 hover-lift">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-[#2A3B31] tracking-tight">
            Quick Demo
          </h2>
          <p className="mt-4 text-lg text-[#4A5D53] max-w-2xl mx-auto leading-relaxed">
            See how our task matrix helps you prioritize and manage your time effectively.
          </p>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="feature-container magical-hover">
            <h3 className="text-xl font-semibold text-[#2A3B31] mb-4">Eisenhower Matrix</h3>
            <p className="text-[#4A5D53]">Organize tasks based on urgency and importance.</p>
          </div>
          <div className="feature-container magical-hover">
            <h3 className="text-xl font-semibold text-[#2A3B31] mb-4">Time Tracking</h3>
            <p className="text-[#4A5D53]">Monitor time spent on each task category.</p>
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-6">
          <button
            onClick={() => router.push('/signin')}
            className="zelda-button group"
          >
            <span className="relative z-10 flex items-center gap-2">
              Try It Yourself
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          <button
            onClick={() => router.push('/')}
            className="text-[#2A3B31] hover:text-[#78A892] font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover:bg-[#78A892]/10 border-2 border-transparent hover:border-[#78A892]/20"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
} 