'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTask } from '@/lib/contexts/TaskContext';
import { Task } from '@/lib/types/task';
import Link from 'next/link';
import MatrixRain from '@/app/components/MatrixRain';

const FOCUS_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60;  // 5 minutes in seconds

export default function FocusTimer() {
  const { tasks, updateTask } = useTask();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [lastSavedTime, setLastSavedTime] = useState(0);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const saveTaskProgress = useCallback(async (task: Task, time: number) => {
    if (time === lastSavedTime) return; // Prevent unnecessary saves
    
    await updateTask(task.id, {
      ...task,
      isTracking: false,
      totalTimeSpent: (task.totalTimeSpent || 0) + (time - lastSavedTime)
    });
    setLastSavedTime(time);
  }, [updateTask, lastSavedTime]);

  const clearTimer = useCallback(() => {
    setIsRunning(false);
    setStartTime(null);
  }, []);

  const handleTimerComplete = useCallback(() => {
    clearTimer();
    const audio = new Audio('/sounds/timer-complete.mp3');
    audio.play().catch(() => {});

    if (!isBreak) {
      setIsBreak(true);
      setTimeLeft(BREAK_TIME);
    } else {
      setIsBreak(false);
      setTimeLeft(FOCUS_TIME);
    }
  }, [clearTimer, isBreak]);

  const startTimer = useCallback(() => {
    if (!selectedTask) return;

    setIsRunning(true);
    setStartTime(Date.now());

    if (!isBreak) {
      updateTask(selectedTask.id, {
        ...selectedTask,
        isTracking: true,
        status: 'in_progress'
      });
    }
  }, [selectedTask, isBreak, updateTask]);

  const pauseTimer = useCallback(async () => {
    if (selectedTask && !isBreak && elapsedTime > lastSavedTime) {
      await saveTaskProgress(selectedTask, elapsedTime);
    }
    clearTimer();
  }, [selectedTask, isBreak, elapsedTime, lastSavedTime, clearTimer, saveTaskProgress]);

  const resetTimer = useCallback(async () => {
    if (selectedTask && !isBreak && elapsedTime > lastSavedTime) {
      await saveTaskProgress(selectedTask, elapsedTime);
    }
    clearTimer();
    setTimeLeft(isBreak ? BREAK_TIME : FOCUS_TIME);
    setElapsedTime(selectedTask?.totalTimeSpent || 0);
    setLastSavedTime(selectedTask?.totalTimeSpent || 0);
  }, [selectedTask, isBreak, elapsedTime, lastSavedTime, clearTimer, saveTaskProgress]);

  // Timer effect
  useEffect(() => {
    if (!isRunning || !startTime) return;

    const timerInterval = setInterval(() => {
      const now = Date.now();
      const secondsElapsed = Math.floor((now - startTime) / 1000);
      
      if (!isBreak) {
        setElapsedTime(prev => {
          const newElapsed = (selectedTask?.totalTimeSpent || 0) + secondsElapsed;
          // Auto-save progress every minute
          if (Math.floor(newElapsed / 60) > Math.floor(prev / 60)) {
            saveTaskProgress(selectedTask!, newElapsed);
          }
          return newElapsed;
        });
      }

      const newTimeLeft = (isBreak ? BREAK_TIME : FOCUS_TIME) - secondsElapsed;
      
      if (newTimeLeft <= 0) {
        handleTimerComplete();
        return;
      }
      
      setTimeLeft(newTimeLeft);
    }, 100); // Update more frequently for smoother countdown

    return () => clearInterval(timerInterval);
  }, [isRunning, startTime, isBreak, selectedTask, handleTimerComplete, saveTaskProgress]);

  // Cleanup on unmount or task change
  useEffect(() => {
    return () => {
      if (selectedTask && elapsedTime > lastSavedTime) {
        saveTaskProgress(selectedTask, elapsedTime);
      }
    };
  }, [selectedTask, elapsedTime, lastSavedTime, saveTaskProgress]);

  const handleTaskSelect = useCallback(async (task: Task) => {
    if (task.status === 'completed') return;

    // Save progress of current task if needed
    if (selectedTask && elapsedTime > lastSavedTime) {
      await saveTaskProgress(selectedTask, elapsedTime);
    }

    clearTimer();
    setSelectedTask(task);
    setTimeLeft(FOCUS_TIME);
    setElapsedTime(task.totalTimeSpent || 0);
    setLastSavedTime(task.totalTimeSpent || 0);
    setIsBreak(false);
  }, [selectedTask, elapsedTime, lastSavedTime, clearTimer, saveTaskProgress]);

  const completeTask = useCallback(async () => {
    if (!selectedTask) return;

    clearTimer();
    const finalTime = elapsedTime;

    try {
      const updates = {
        status: 'completed' as const,
        isTracking: false,
        totalTimeSpent: (selectedTask.totalTimeSpent || 0) + finalTime,
        completedAt: new Date()
      };

      await updateTask(selectedTask.id, updates);

      // Play completion sound
      const audio = new Audio('/sounds/task-complete.mp3');
      audio.play().catch(() => {});

      // Reset states
      setTimeLeft(FOCUS_TIME);
      setElapsedTime(0);
      setIsBreak(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Failed to complete task:', error);
      // Could add error notification here
    }
  }, [selectedTask, elapsedTime, clearTimer, updateTask]);

  return (
    <div className="relative min-h-screen bg-[#0F172A] overflow-hidden">
      {/* Matrix Rain Background */}
      <MatrixRain />
      
      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,168,146,0.3),rgba(15,23,42,0.9))]" />

      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Focus Timer</h1>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg border border-[#78A892]/20 text-[#E6EFE9] 
                       hover:bg-[#78A892]/20 transition-all duration-300"
            >
              Back to Tasks
            </Link>
          </div>

          {/* Task Selection */}
          <div className="bg-[#1E293B]/60 backdrop-blur-sm rounded-xl border border-[#78A892]/20 p-6 shadow-xl mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Select a Task to Focus On</h2>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {tasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => handleTaskSelect(task)}
                  disabled={task.status === 'completed'}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-300
                            ${task.status === 'completed' 
                              ? 'bg-[#1a1d1b]/20 border-white/5 text-white/40 cursor-not-allowed'
                              : selectedTask?.id === task.id
                                ? 'bg-[#78A892]/20 border-[#78A892] text-white'
                                : 'bg-[#1a1d1b]/40 border-white/10 text-white/80 hover:bg-[#1a1d1b]/60'
                            } border group relative overflow-hidden`}
                >
                  {/* Progress indicator for in-progress tasks */}
                  {task.status === 'in_progress' && (
                    <div 
                      className="absolute bottom-0 left-0 h-0.5 bg-[#78A892]"
                      style={{ width: `${Math.min(100, ((task.totalTimeSpent || 0) / (25 * 60)) * 100)}%` }}
                    />
                  )}
                  
                  <div className="flex items-center gap-3">
                    <div className={`flex-grow font-medium ${task.status === 'completed' ? 'line-through text-white/40' : ''}`}>
                      {task.title}
                      {task.status === 'completed' && (
                        <span className="ml-2 text-emerald-400/60">✓</span>
                      )}
                    </div>
                    {task.totalTimeSpent > 0 && (
                      <div className={`text-sm ${task.status === 'completed' ? 'text-emerald-400/60' : 'text-[#78A892]'}`}>
                        {formatTime(task.totalTimeSpent)}
                      </div>
                    )}
                  </div>
                  {task.description && (
                    <div className={`text-sm text-white/60 mt-1 ${task.status === 'completed' ? 'line-through text-white/40' : ''}`}>
                      {task.description}
                    </div>
                  )}
                </button>
              ))}
              {tasks.length === 0 && (
                <div className="text-white/60 text-center py-4">
                  No tasks available. Add some tasks to get started!
                </div>
              )}
            </div>
          </div>

          {/* Timer Display */}
          <div className="bg-[#1E293B]/60 backdrop-blur-sm rounded-xl border border-[#78A892]/20 p-8 shadow-xl text-center">
            {selectedTask ? (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedTask.title}</h2>
                  <div className="text-[#78A892]">{isBreak ? 'Break Time' : 'Focus Time'}</div>
                </div>
                
                <div className="text-8xl font-bold text-white mb-4 font-mono tracking-wider">
                  {formatTime(timeLeft)}
                </div>

                {!isBreak && (
                  <div className="text-[#78A892] mb-8">
                    Time Spent: {formatTime(elapsedTime)}
                  </div>
                )}

                <div className="flex flex-col items-center gap-4">
                  <div className="flex justify-center gap-4">
                    {!isRunning ? (
                      <button
                        onClick={startTimer}
                        className="px-8 py-4 bg-[#78A892] text-white rounded-lg font-semibold
                                 hover:bg-[#92B4A7] transition-colors duration-300
                                 shadow-lg shadow-[#78A892]/20 relative overflow-hidden group"
                      >
                        <span className="relative z-10">Start {isBreak ? 'Break' : 'Focus'}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                                      translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"/>
                      </button>
                    ) : (
                      <button
                        onClick={pauseTimer}
                        className="px-8 py-4 bg-[#9D174D] text-white rounded-lg font-semibold
                                 hover:bg-[#831843] transition-colors duration-300
                                 shadow-lg shadow-[#9D174D]/20"
                      >
                        Pause
                      </button>
                    )}
                    <button
                      onClick={resetTimer}
                      className="px-8 py-4 border border-[#78A892]/20 text-white rounded-lg font-semibold
                               hover:bg-[#78A892]/20 transition-colors duration-300
                               shadow-lg shadow-[#78A892]/10"
                    >
                      Reset
                    </button>
                  </div>

                  {!isBreak && (
                    <button
                      onClick={completeTask}
                      className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold
                               hover:bg-emerald-500 transition-colors duration-300
                               shadow-lg shadow-emerald-600/20 w-full max-w-md mt-4
                               flex items-center justify-center gap-2 group"
                    >
                      <span>Complete Task</span>
                      <span className="text-emerald-200 group-hover:scale-110 transition-transform">
                        ({formatTime(elapsedTime)})
                      </span>
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-white/60 py-12">
                {tasks.some(task => task.status === 'completed')
                  ? 'Task completed! Select another task to continue.'
                  : 'Select a task above to start focusing'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 