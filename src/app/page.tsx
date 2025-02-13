'use client';

import { useTask } from '@/lib/contexts/TaskContext';
import AddTaskForm from '@/app/components/AddTaskForm';
import TaskGrid from '@/app/components/TaskGrid';
import CompletedTasks from '@/app/components/CompletedTasks';
import TaskCalendar from '@/app/components/TaskCalendar';

export default function Home() {
  const { tasks } = useTask();
  const activeTasks = tasks.filter(task => task.status !== 'completed');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Task Manager
          </h1>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {activeTasks.length} active tasks
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
