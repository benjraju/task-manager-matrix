'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import TaskAnalytics from '@/app/components/TaskAnalytics';
import Link from 'next/link';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push('/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0F172A] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,168,146,0.3),rgba(255,255,255,0))]">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-[#1E293B]/40 backdrop-blur-sm p-4 rounded-xl border border-[#78A892]/20 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h1 className="text-3xl font-bold text-white">
              Task Analytics
            </h1>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg border border-[#78A892]/20 text-[#E6EFE9] 
                       hover:bg-[#78A892]/20 transition-all duration-300"
            >
              Back to Tasks
            </Link>
          </div>
        </div>

        <TaskAnalytics />
      </div>
    </div>
  );
} 