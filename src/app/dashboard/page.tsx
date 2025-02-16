'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import AddTaskForm from '@/app/components/AddTaskForm';
import TaskGrid from '@/app/components/TaskGrid';
import CompletedTasks from '@/app/components/CompletedTasks';
import TaskCalendar from '@/app/components/TaskCalendar';
import Link from 'next/link';
import { useTaskData } from '@/lib/contexts/TaskDataContext';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { tasks } = useTaskData();
  const router = useRouter();
  const activeTasks = tasks.filter(task => task.status !== 'completed');

  const handleSignOut = async () => {
    await signOut();
    router.push('/signin');
  };

  if (!user) {
    router.push('/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-[#78A892]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 font-mono">Matrix Task System</h1>
              <p className="text-[#78A892]/80 font-mono">
                Control the system. Manage your reality.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                href="/focus"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#78A892] text-black font-mono 
                         hover:bg-[#5C8B75] transition-all duration-300 hover:scale-105"
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Enter Focus Mode
              </Link>
              <Link
                href="/oracle"
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
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Oracle
              </Link>
              <Link
                href="/analytics"
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Analytics
              </Link>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-6 py-3 rounded-xl border border-[#78A892]/20 
                         text-[#78A892] font-mono hover:bg-[#78A892]/10 transition-all duration-300
                         hover:border-[#78A892]/40"
              >
                Sign Out
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-[#78A892]/80 font-mono">
            <span className="px-4 py-2 rounded-lg bg-[#78A892]/10 border border-[#78A892]/20">
              {activeTasks.length} Active Tasks
            </span>
            <span className="px-4 py-2">
              {user.email}
            </span>
          </div>
        </motion.div>

        {/* Add Task Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-black/50 rounded-xl p-6 border border-[#78A892]/20">
            <AddTaskForm />
          </div>
        </motion.div>

        {/* Task Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-black/50 rounded-xl border border-[#78A892]/20">
            <TaskGrid />
          </div>
        </motion.div>

        {/* Bottom Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="bg-black/50 p-6 rounded-xl border border-[#78A892]/20">
            <CompletedTasks tasks={tasks} />
          </div>
          <div className="bg-black/50 p-6 rounded-xl border border-[#78A892]/20">
            <TaskCalendar tasks={tasks} />
          </div>
        </motion.div>
      </div>
    </div>
  );
} 