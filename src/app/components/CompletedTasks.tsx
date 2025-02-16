'use client';

import React from 'react';
import { Task, Priority } from '@/lib/types/task';
import TaskItem from './TaskItem';
import { formatTaskDuration } from '@/lib/utils/taskUtils';

const priorityLabels: Record<Priority, { title: string; color: string }> = {
  'urgent-important': {
    title: 'Urgent & Important',
    color: 'text-blue-300'
  },
  'not-urgent-important': {
    title: 'Not Urgent & Important',
    color: 'text-emerald-300'
  },
  'urgent-not-important': {
    title: 'Urgent & Not Important',
    color: 'text-pink-300'
  },
  'not-urgent-not-important': {
    title: 'Not Urgent & Not Important',
    color: 'text-purple-300'
  }
};

interface CompletedTasksProps {
  tasks: Task[];
}

export default function CompletedTasks({ tasks }: CompletedTasksProps) {
  const completedTasks = tasks.filter(task => task.status === 'completed');

  if (completedTasks.length === 0) {
    return null;
  }

  // Group tasks by completion date (most recent first)
  const groupedTasks = completedTasks.reduce((acc, task) => {
    const date = task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'Unknown';
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <div className="relative overflow-hidden bg-[#1E293B] backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#78A892]/20">
      <div className="absolute inset-0 bg-[url('/patterns/circuit-board.svg')] opacity-5" />
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            Completed Tasks
          </h2>
          <span className="text-sm text-white/60">
            {completedTasks.length} task{completedTasks.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="space-y-6">
          {Object.entries(groupedTasks).map(([date, tasks]) => (
            <div key={date} className="space-y-2">
              <h3 className="text-sm font-medium text-white/60">
                {date === new Date().toLocaleDateString() ? 'Today' : date}
              </h3>
              <div className="space-y-2">
                {tasks.map(task => (
                  <div key={task.id} className="relative">
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white/20" />
                    <div className="flex items-center justify-between p-4 bg-[#1E293B]/80 rounded-lg border border-white/10">
                      <div>
                        <h4 className="text-white line-through opacity-70">{task.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-white/40">
                          <span>{formatTaskDuration(task.totalTimeSpent || 0)}</span>
                          <span>•</span>
                          <span>Completed {new Date(task.completedAt || '').toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 