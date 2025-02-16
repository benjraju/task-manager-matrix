'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFocus, type FocusSession } from '@/lib/contexts/FocusContext';
import { useUnifiedTask } from '@/lib/contexts/UnifiedTaskContext';
import { Task } from '@/lib/types/task';
import { formatTime } from '@/lib/utils/timeUtils';
import { cn } from '@/lib/utils';

export default function FocusMode() {
  const {
    currentSession,
    isActive,
    currentMode,
    timeRemaining,
    settings,
    updateSettings,
    startSession,
    endSession,
    pauseSession,
    resumeSession,
    recordInterruption,
    addSessionNote,
    setSessionMood,
    stats,
    todaysSessions,
  } = useFocus();

  const { tasks } = useUnifiedTask();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [note, setNote] = useState('');

  const handleStartFocus = () => {
    if (selectedTask) {
      startSession(selectedTask);
    }
  };

  const handleEndFocus = (completed: boolean) => {
    endSession(completed);
  };

  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatSessionTime = (session: FocusSession) => {
    if (!session.startTime) return 'Invalid time';
    
    const startTime = new Date(session.startTime);
    const timeStr = startTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const dateStr = startTime.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric' 
    });
    
    return `${timeStr}, ${dateStr}`;
  };

  const formatDuration = (minutes: number) => {
    if (!minutes) return '0s';
    
    // Convert to seconds for more precise calculations
    const totalSeconds = Math.round(minutes * 60);
    
    if (totalSeconds < 60) {
      return `${totalSeconds}s`;
    }
    
    const hours = Math.floor(totalSeconds / 3600);
    const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return seconds > 0 
        ? `${hours}h ${remainingMinutes}m ${seconds}s`
        : remainingMinutes > 0 
          ? `${hours}h ${remainingMinutes}m`
          : `${hours}h`;
    }
    
    return seconds > 0 
      ? `${remainingMinutes}m ${seconds}s`
      : `${remainingMinutes}m`;
  };

  return (
    <div className="bg-black/50 backdrop-blur-lg rounded-xl border border-[#78A892]/20 p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        {/* Timer and Controls */}
        <div className="space-y-4 sm:space-y-6">
          <div className="text-center">
            <motion.h2
              className="text-4xl sm:text-6xl font-mono mb-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {formatTimeRemaining()}
            </motion.h2>
            <p className="text-sm sm:text-base text-[#78A892]/80 capitalize">
              {currentMode.replace('_', ' ')} Mode
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            {!currentSession ? (
              <div className="space-y-4">
                <select
                  value={selectedTask?.id || ''}
                  onChange={(e) => {
                    const task = tasks.find(t => t.id === e.target.value);
                    setSelectedTask(task || null);
                  }}
                  className="w-full bg-black/50 border border-[#78A892]/20 rounded-lg p-4 font-mono"
                >
                  <option value="">Select a task to focus on...</option>
                  {tasks.map(task => (
                    <option key={task.id} value={task.id}>
                      {task.title}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleStartFocus}
                  disabled={!selectedTask}
                  className={cn(
                    "w-full border rounded-lg p-4 font-mono",
                    selectedTask
                      ? "bg-[#78A892]/10 hover:bg-[#78A892]/20 border-[#78A892]/20"
                      : "bg-gray-800/50 border-gray-800 cursor-not-allowed"
                  )}
                >
                  Enter the Matrix
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {isActive ? (
                  <button
                    onClick={pauseSession}
                    className="w-full bg-[#78A892]/10 hover:bg-[#78A892]/20 border 
                             border-[#78A892]/20 rounded-lg p-4 font-mono"
                  >
                    Pause
                  </button>
                ) : (
                  <button
                    onClick={resumeSession}
                    className="w-full bg-[#78A892]/10 hover:bg-[#78A892]/20 border 
                             border-[#78A892]/20 rounded-lg p-4 font-mono"
                  >
                    Resume
                  </button>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleEndFocus(true)}
                    className="bg-green-500/10 hover:bg-green-500/20 border 
                             border-green-500/20 rounded-lg p-4 font-mono"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => handleEndFocus(false)}
                    className="bg-red-500/10 hover:bg-red-500/20 border 
                             border-red-500/20 rounded-lg p-4 font-mono"
                  >
                    Abandon
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settings and Session Controls */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-mono">Environment</h3>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-[#78A892] hover:text-[#78A892]/80"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6 overflow-hidden"
              >
                <div className="space-y-2">
                  <label className="text-sm font-mono text-[#78A892]/80">
                    Focus Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.focusDuration}
                    onChange={(e) => updateSettings({ focusDuration: parseInt(e.target.value) })}
                    className="w-full bg-black/50 border border-[#78A892]/20 rounded-lg p-3 font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-mono text-[#78A892]/80">
                    Short Break Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.shortBreakDuration}
                    onChange={(e) => updateSettings({ shortBreakDuration: parseInt(e.target.value) })}
                    className="w-full bg-black/50 border border-[#78A892]/20 rounded-lg p-3 font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-mono text-[#78A892]/80">
                    Long Break Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.longBreakDuration}
                    onChange={(e) => updateSettings({ longBreakDuration: parseInt(e.target.value) })}
                    className="w-full bg-black/50 border border-[#78A892]/20 rounded-lg p-3 font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-mono text-[#78A892]/80">
                    Sessions until Long Break
                  </label>
                  <input
                    type="number"
                    value={settings.sessionsUntilLongBreak}
                    onChange={(e) => updateSettings({ sessionsUntilLongBreak: parseInt(e.target.value) })}
                    className="w-full bg-black/50 border border-[#78A892]/20 rounded-lg p-3 font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-mono text-[#78A892]/80">
                    Auto-start breaks
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.autoStartBreaks}
                      onChange={(e) => updateSettings({ autoStartBreaks: e.target.checked })}
                      className="form-checkbox bg-black/50 border border-[#78A892]/20 rounded"
                    />
                    <span className="text-sm font-mono">
                      Automatically start break timer
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {currentSession && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-mono text-[#78A892]/80">
                  Session Notes
                </label>
                <textarea
                  value={note}
                  onChange={(e) => {
                    setNote(e.target.value);
                    addSessionNote(e.target.value);
                  }}
                  placeholder="Add notes about this focus session..."
                  className="w-full bg-black/50 border border-[#78A892]/20 rounded-lg p-3 font-mono h-24"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-mono text-[#78A892]/80">
                  Session Mood
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['productive', 'neutral', 'distracted'].map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setSessionMood(mood as any)}
                      className={cn(
                        "p-2 rounded-lg border font-mono text-sm",
                        currentSession.mood === mood
                          ? "bg-[#78A892]/20 border-[#78A892]"
                          : "border-[#78A892]/20 hover:bg-[#78A892]/10"
                      )}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => recordInterruption()}
                className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 border 
                         border-yellow-500/20 rounded-lg p-3 font-mono text-sm"
              >
                Record Interruption
              </button>
            </div>
          )}
        </div>
      </div>

      {todaysSessions.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-mono mb-4">Recent Sessions</h3>
          <div className="space-y-2">
            {todaysSessions.map(session => (
              <div 
                key={session.id}
                className="bg-black/30 p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <div className="font-mono">{session.taskTitle}</div>
                  <div className="text-sm text-[#78A892]/80">
                    {formatSessionTime(session)}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="font-mono">
                    {formatDuration(session.actualTimeSpent)}
                  </div>
                  {session.completed && (
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 