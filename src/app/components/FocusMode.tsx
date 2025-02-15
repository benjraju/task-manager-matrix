'use client';

import React, { useState, useEffect } from 'react';
import { useTask } from '@/lib/contexts/TaskContext';
import { Task } from '@/lib/types/task';
import { motion, AnimatePresence } from 'framer-motion';

export default function FocusMode() {
  const { tasks } = useTask();
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [showCompleteButton, setShowCompleteButton] = useState(false);

  // Get high-priority tasks
  const highPriorityTasks = tasks.filter(
    task => task.priority === 'urgent-important' && task.status !== 'completed'
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            setShowCompleteButton(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startFocus = (task: Task) => {
    setFocusTask(task);
    setTimeRemaining(25 * 60);
    setIsTimerActive(true);
    setShowCompleteButton(false);
  };

  const resetTimer = () => {
    setTimeRemaining(25 * 60);
    setIsTimerActive(false);
    setShowCompleteButton(false);
  };

  return (
    <div className="min-h-screen bg-black/95 text-[#78A892] p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-2 font-mono">Focus Mode</h2>
          <p className="text-[#78A892]/80 font-mono">
            Clear your mind. Focus on one task at a time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Task Selection Panel */}
          <div className="bg-black/50 rounded-xl p-6 border border-[#78A892]/20">
            <h3 className="text-xl font-bold mb-4 font-mono">Priority Tasks</h3>
            <div className="space-y-4">
              {highPriorityTasks.map(task => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-lg border border-[#78A892]/20 cursor-pointer transition-all
                    ${focusTask?.id === task.id ? 'bg-[#78A892]/20' : 'hover:bg-[#78A892]/10'}`}
                  onClick={() => startFocus(task)}
                >
                  <h4 className="font-mono font-bold">{task.title}</h4>
                  <p className="text-sm text-[#78A892]/60 font-mono">{task.description}</p>
                </motion.div>
              ))}
              {highPriorityTasks.length === 0 && (
                <p className="text-[#78A892]/60 font-mono">No priority tasks available</p>
              )}
            </div>
          </div>

          {/* Focus Timer Panel */}
          <div className="bg-black/50 rounded-xl p-6 border border-[#78A892]/20">
            <h3 className="text-xl font-bold mb-4 font-mono">Focus Timer</h3>
            {focusTask ? (
              <div className="text-center">
                <h4 className="font-mono font-bold mb-2">{focusTask.title}</h4>
                <div className="text-6xl font-mono mb-6 text-[#78A892]">
                  {formatTime(timeRemaining)}
                </div>
                <div className="space-x-4">
                  {!isTimerActive && !showCompleteButton && (
                    <button
                      onClick={() => setIsTimerActive(true)}
                      className="bg-[#78A892] text-black px-6 py-2 rounded-lg font-mono hover:bg-[#5C8B75] transition-colors"
                    >
                      Start Focus
                    </button>
                  )}
                  {isTimerActive && (
                    <button
                      onClick={() => setIsTimerActive(false)}
                      className="bg-[#78A892] text-black px-6 py-2 rounded-lg font-mono hover:bg-[#5C8B75] transition-colors"
                    >
                      Pause
                    </button>
                  )}
                  <button
                    onClick={resetTimer}
                    className="border border-[#78A892] px-6 py-2 rounded-lg font-mono hover:bg-[#78A892]/10 transition-colors"
                  >
                    Reset
                  </button>
                </div>
                {showCompleteButton && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    <button
                      className="bg-green-600 text-white px-6 py-2 rounded-lg font-mono hover:bg-green-700 transition-colors"
                      onClick={() => {
                        // Handle task completion
                        setFocusTask(null);
                        setShowCompleteButton(false);
                      }}
                    >
                      Complete Task
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="text-center text-[#78A892]/60 font-mono">
                <p>Select a task to start focusing</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 