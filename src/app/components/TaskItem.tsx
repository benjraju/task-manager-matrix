'use client';

import { useState } from 'react';
import { Task, TaskStatus } from '@/lib/types/task';
import { useTaskData } from '@/lib/contexts/TaskDataContext';
import { useTaskTracking } from '@/lib/contexts/TaskTrackingContext';
import { formatTaskDuration } from '@/lib/utils/taskUtils';

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const { updateTask, deleteTask } = useTaskData();
  const { startTracking, stopTracking, getTrackedTime } = useTaskTracking();
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed':
        return 'bg-emerald-500';
      case 'in_progress':
        return 'bg-blue-500';
      default:
        return 'bg-gray-400';
    }
  };

  const handleStatusToggle = () => {
    const newStatus = task.status === 'completed' 
      ? 'not_started'
      : task.status === 'not_started'
      ? 'in_progress'
      : 'completed';
    
    // Stop tracking if task is completed or being uncompleted
    if (task.isTracking || newStatus === 'completed') {
      stopTracking(task.id);
    }
    
    // Get the current tracked time before updating
    const currentTimeSpent = getTrackedTime(task);
    
    updateTask(task.id, {
      status: newStatus,
      ...(newStatus === 'completed' ? { 
        completedAt: new Date(),
        isTracking: false,
        totalTimeSpent: currentTimeSpent // Preserve the total time spent
      } : {}),
      ...(newStatus === 'in_progress' && task.status === 'not_started' ? { 
        startedAt: new Date() 
      } : {})
    });
  };

  const handleTimerToggle = () => {
    if (task.status === 'completed') return;

    if (task.isTracking) {
      stopTracking(task.id);
    } else {
      // If starting timer on a not_started task, also change status to in_progress
      if (task.status === 'not_started') {
        updateTask(task.id, {
          status: 'in_progress',
          startedAt: new Date()
        });
      }
      startTracking(task);
    }
  };

  return (
    <div 
      className="group relative bg-[#1E293B] backdrop-blur-sm rounded-lg border border-white/10 p-4 
                 transition-all duration-300 hover:bg-[#1E293B]/80 hover:border-white/20 hover:shadow-lg
                 hover:shadow-white/5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={handleStatusToggle}
          className={`mt-1.5 h-4 w-4 rounded-full border-2 border-white/30 flex-shrink-0
                     transition-colors duration-300 hover:border-white/60
                     ${getStatusColor()}`}
        />
        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={`text-white font-medium truncate ${task.status === 'completed' ? 'line-through opacity-50' : ''}`}>
              {task.title}
            </h4>
            <div className="flex items-center gap-1 ml-4">
              <button
                onClick={handleTimerToggle}
                disabled={task.status === 'completed'}
                className={`p-1.5 rounded-full transition-colors duration-300
                           ${task.isTracking 
                             ? 'bg-emerald-500/30 text-emerald-300 hover:bg-emerald-500/40' 
                             : task.status === 'completed'
                               ? 'bg-white/5 text-white/30 cursor-not-allowed opacity-50'
                               : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                aria-label={task.isTracking ? "Stop timer" : "Start timer"}
                title={task.status === 'completed' ? "Cannot track completed task" : (task.isTracking ? "Stop timer" : "Start timer")}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {task.isTracking ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1.5 rounded-full bg-white/10 text-white/70 hover:bg-red-500/30 hover:text-red-300 transition-colors duration-300"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          {task.description && (
            <p className={`mt-1 text-sm text-white/80 line-clamp-2 ${task.status === 'completed' ? 'line-through opacity-50' : ''}`}>
              {task.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className={`${task.isTracking ? 'text-emerald-400' : 'text-white/60'}`}>
              {formatTaskDuration(getTrackedTime(task))}
              {task.isTracking && (
                <span className="ml-1 animate-pulse">●</span>
              )}
            </span>
            {task.status === 'completed' && task.completedAt && (
              <span className="text-white/40">
                Completed {new Date(task.completedAt).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Playful hover effect */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 
                   transition-transform duration-1000 ease-in-out rounded-lg
                   ${isHovered ? 'translate-x-full' : '-translate-x-full'}`}
      />
    </div>
  );
} 