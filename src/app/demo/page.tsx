'use client';

import { useRouter } from 'next/navigation';

export default function Demo() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#E6EFE9] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#2A3B31]">
            Quick Demo
          </h2>
          <p className="mt-4 text-lg text-[#4A5D53]">
            See how our task matrix helps you prioritize and manage your time effectively.
          </p>
        </div>
        
        <div className="mt-8">
          {/* Add your demo content here */}
          <p className="text-[#4A5D53]">Demo content coming soon...</p>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => router.push('/signin')}
            className="bg-[#78A892] hover:bg-[#5C8B75] text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
          >
            Try It Yourself
          </button>
          <button
            onClick={() => router.push('/')}
            className="text-[#2A3B31] hover:text-[#78A892] font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover:bg-[#78A892]/10"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
} 