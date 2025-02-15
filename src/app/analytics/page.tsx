'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import TaskAnalytics from '@/app/components/TaskAnalytics';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push('/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-[#78A892]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 font-mono">Matrix Analytics</h1>
              <p className="text-[#78A892]/80 font-mono">
                See through the code. Analyze your patterns.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link
                href="/dashboard"
                className="inline-flex items-center px-6 py-3 rounded-xl border border-[#78A892]/20 
                         text-[#78A892] font-mono hover:bg-[#78A892]/10 transition-all duration-300
                         hover:border-[#78A892]/40 hover:scale-105"
              >
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                  />
                </svg>
                Return to Tasks
              </Link>
            </motion.div>
          </div>

          <div className="flex items-center gap-4 text-[#78A892]/80 font-mono">
            <span className="px-4 py-2">
              {user.email}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-black/50 rounded-xl border border-[#78A892]/20">
            <TaskAnalytics />
          </div>
        </motion.div>
      </div>
    </div>
  );
} 