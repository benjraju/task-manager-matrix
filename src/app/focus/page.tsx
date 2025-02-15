'use client';

import React from 'react';
import FocusMode from '@/app/components/FocusMode';
import FocusStats from '@/app/components/FocusStats';
import { useFocus } from '@/lib/contexts/FocusContext';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function FocusPage() {
  const { sessions } = useFocus();

  return (
    <div className="min-h-screen bg-black text-[#78A892]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-2 font-mono">Matrix Focus System</h1>
            <p className="text-[#78A892]/80 font-mono">
              Enter the zone. Complete your mission. One task at a time.
            </p>
          </motion.div>
          
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

        <div className="space-y-8">
          <FocusMode />
          <FocusStats sessions={sessions} />
        </div>
      </div>
    </div>
  );
} 