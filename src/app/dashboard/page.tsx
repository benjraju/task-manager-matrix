'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import AddTaskForm from '@/app/components/AddTaskForm';
import TaskGrid from '@/app/components/TaskGrid';
import CompletedTasks from '@/app/components/CompletedTasks';
import TaskCalendar from '@/app/components/TaskCalendar';
import Link from 'next/link';
import { useTask } from '@/lib/contexts/TaskContext';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { tasks } = useTask();
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
    <div className="min-h-screen bg-[#0F172A] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,168,146,0.3),rgba(255,255,255,0))]">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-[#1E293B]/40 backdrop-blur-sm p-4 rounded-2xl border border-[#78A892]/20 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h1 className="text-3xl font-bold text-[#E6EFE9]">
              Task Matrix
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link 
                href="/focus"
                className="px-4 py-2 rounded-lg bg-[#78A892] text-white hover:bg-[#92B4A7] transition-all duration-300"
              >
                Focus Mode
              </Link>
              <Link 
                href="/analytics"
                className="px-4 py-2 rounded-lg bg-[#78A892]/20 text-[#78A892] hover:bg-[#78A892]/30 transition-all duration-300"
              >
                View Analytics
              </Link>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#78A892]/20 text-[#78A892] border border-[#78A892]/20">
                {activeTasks.length} active tasks
              </span>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <span className="text-sm text-[#E6EFE9]/70">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded-lg border border-[#78A892]/20 text-[#E6EFE9] 
                           hover:bg-[#78A892]/20 transition-all duration-300"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1E293B]/40 backdrop-blur-sm p-6 rounded-2xl border border-[#78A892]/20 shadow-xl">
          <AddTaskForm />
        </div>
        
        <div className="bg-[#1E293B]/40 backdrop-blur-sm rounded-2xl border border-[#78A892]/20 shadow-xl">
          <TaskGrid />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#1E293B]/40 backdrop-blur-sm p-6 rounded-2xl border border-[#78A892]/20 shadow-xl">
            <CompletedTasks tasks={tasks} />
          </div>
          <div className="bg-[#1E293B]/40 backdrop-blur-sm p-6 rounded-2xl border border-[#78A892]/20 shadow-xl">
            <TaskCalendar tasks={tasks} />
          </div>
        </div>
      </div>
    </div>
  );
} 