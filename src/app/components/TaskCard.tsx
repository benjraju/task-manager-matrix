'use client';

import React, { useCallback } from 'react';
import { Task, TaskStatus } from '@/lib/types/task';
import { useTask } from '@/lib/contexts/TaskContext';
import { useTimer } from '@/lib/hooks/useTimer';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { updateTask, deleteTask, restoreTask } = useTask();

  const handleTick = useCallback((currentTime: number) => {
    updateTask(task.id, { totalTimeSpent: currentTime });
  }, [task.id, updateTask]);

  const { formattedTime } = useTimer({
    initialTime: task.totalTimeSpent,
    isRunning: task.isTracking,
    onTick: handleTick
  });

  const toggleStatus = () => {
    const newStatus: TaskStatus = task.status === 'not_started' 
      ? 'in_progress' 
      : task.status === 'in_progress' 
        ? 'completed' 
        : 'not_started';
    
    updateTask(task.id, { 
      status: newStatus,
      ...(newStatus === 'completed' ? { completedAt: new Date(), isTracking: false } : {}),
      ...(newStatus === 'in_progress' && task.status === 'not_started' ? { startedAt: new Date() } : {})
    });
  };

  const toggleTracking = () => {
    if (task.status === 'completed') return;
    
    if (!task.isTracking && task.status === 'not_started') {
      updateTask(task.id, {
        isTracking: true,
        status: 'in_progress' as const,
        startedAt: new Date()
      });
    } else {
      updateTask(task.id, { 
        isTracking: !task.isTracking
      });
    }
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  const handleRestore = () => {
    restoreTask(task.id);
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'not_started':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className={`
      bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 
      border border-gray-200 dark:border-gray-700
      ${task.isTracking ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
      ${task.status === 'completed' ? 'opacity-75' : ''}
      transition-all duration-200
      group
    `}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleStatus}
              className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              style={{
                background: task.status === 'completed' ? 'currentColor' : 'transparent',
                borderColor: task.status === 'completed' ? '#10B981' : undefined
              }}
            >
              {task.status === 'completed' && (
                <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <h3 className={`font-medium ${
              task.status === 'completed' 
                ? 'line-through text-gray-500 dark:text-gray-400' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {task.title}
            </h3>
          </div>
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 ml-7">
              {task.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {task.status === ('completed' as TaskStatus) ? (
            <button
              onClick={handleRestore}
              className="p-1.5 rounded-md text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20"
              title="Restore task"
            >
              ↩️
            </button>
          ) : (
            <button
              onClick={toggleTracking}
              className={`p-1.5 rounded-md ${
                task.isTracking
                  ? 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50'
                  : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
              }`}
              disabled={task.status === 'completed'}
              title={task.isTracking ? 'Pause tracking' : 'Start tracking'}
            >
              {task.isTracking ? '⏸' : '▶️'}
            </button>
          )}
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className={`px-2 py-1 rounded-md ${getStatusColor()}`}>
          {task.status.replace('_', ' ')}
        </span>
        <span className="text-gray-500 dark:text-gray-400 tabular-nums" title="Time spent">
          ⏱ {formattedTime}
        </span>
      </div>
    </div>
  );
} 