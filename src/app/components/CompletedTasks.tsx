'use client';

import React from 'react';
import { Task } from '@/lib/types/task';
import TaskCard from './TaskCard';

interface CompletedTasksProps {
  tasks: Task[];
}

export default function CompletedTasks({ tasks }: CompletedTasksProps) {
  const completedTasks = tasks.filter(task => task.status === 'completed');

  if (completedTasks.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Completed Tasks
      </h2>
      <div className="space-y-2">
        {completedTasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
} 