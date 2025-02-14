'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import AddTaskForm from '@/app/components/AddTaskForm';
import TaskGrid from '@/app/components/TaskGrid';
import CompletedTasks from '@/app/components/CompletedTasks';
import TaskCalendar from '@/app/components/TaskCalendar';
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Task Manager
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {activeTasks.length} active tasks
            </span>
            <div className="flex items-center">
              <span className="mr-4 text-gray-600 dark:text-gray-300">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>

        <AddTaskForm />
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-8">
          <TaskGrid />
        </div>

        <div className="space-y-8">
          <CompletedTasks tasks={tasks} />
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <TaskCalendar tasks={tasks} />
          </div>
        </div>
      </div>
    </div>
  );
} 