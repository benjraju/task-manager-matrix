'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus } from '@/lib/types/task';
import { useTask } from '@/lib/contexts/TaskContext';

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const { updateTask, deleteTask, restoreTask } = useTask();
  const [isHovered, setIsHovered] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(task.totalTimeSpent || 0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const startTimer = useCallback(() => {
    if (timerInterval) return; // Don't start if already running
    
    const interval = setInterval(() => {
      setElapsedTime(prev => {
        const newTime = prev + 1;
        // Update task in context every minute to avoid too frequent updates
        if (newTime % 60 === 0) {
          updateTask(task.id, { ...task, totalTimeSpent: newTime });
        }
        return newTime;
      });
    }, 1000);
    
    setTimerInterval(interval);
    updateTask(task.id, { ...task, isTracking: true });
  }, [task.id, timerInterval, updateTask]);

  const stopTimer = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
      // Save the final time when stopping
      updateTask(task.id, { 
        ...task, 
        isTracking: false,
        totalTimeSpent: elapsedTime 
      });
    }
  }, [timerInterval, task, elapsedTime, updateTask]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  // Start/stop timer based on isTracking
  useEffect(() => {
    if (task.isTracking && !timerInterval) {
      startTimer();
    } else if (!task.isTracking && timerInterval) {
      stopTimer();
    }
  }, [task.isTracking, timerInterval, startTimer, stopTimer]);

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
    
    // Stop timer if task is completed
    if (newStatus === 'completed' && timerInterval) {
      stopTimer();
    }
    
    const updates: Partial<Task> = {
      status: newStatus,
      ...(newStatus === 'completed' ? { 
        completedAt: new Date(),
        isTracking: false 
      } : {}),
      ...(newStatus === 'in_progress' && task.status === 'not_started' ? { 
        startedAt: new Date() 
      } : {})
    };
    
    updateTask(task.id, updates);
  };

  const handleTimerToggle = () => {
    if (task.status === 'completed') return; // Don't allow timer for completed tasks
    
    const updates: Partial<Task> = {
      isTracking: !task.isTracking
    };

    // If starting timer on a not_started task, also change status to in_progress
    if (!task.isTracking && task.status === 'not_started') {
      updates.status = 'in_progress';
      updates.startedAt = new Date();
    }
    
    updateTask(task.id, updates);
  };

  const handleRestore = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Restore clicked for task:', task.id);
    try {
      await restoreTask(task.id);
      console.log('Task restored successfully');
    } catch (error) {
      console.error('Failed to restore task:', error);
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
              {task.status === ('completed' as TaskStatus) ? (
                <button
                  onClick={handleRestore}
                  type="button"
                  className="p-1.5 rounded-full bg-yellow-500/30 text-yellow-300 hover:bg-yellow-500/40 transition-colors duration-300 cursor-pointer"
                  title="Restore task"
                >
                  ↩️
                </button>
              ) : (
                <button
                  onClick={handleTimerToggle}
                  disabled={task.status === ('completed' as TaskStatus)}
                  className={`p-1.5 rounded-full transition-colors duration-300
                             ${task.isTracking 
                               ? 'bg-emerald-500/30 text-emerald-300 hover:bg-emerald-500/40' 
                               : task.status === ('completed' as TaskStatus)
                                 ? 'bg-white/5 text-white/30 cursor-not-allowed'
                                 : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {task.isTracking ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                </button>
              )}
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
              {formatTime(elapsedTime)}
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