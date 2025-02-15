'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTask } from './TaskContext';
import { Task } from '@/lib/types/task';

interface FocusSession {
  taskId: string;
  taskTitle: string;
  duration: number;
  date: Date;
  completed: boolean;
}

interface FocusContextType {
  sessions: FocusSession[];
  currentSession: FocusSession | null;
  startSession: (task: Task) => void;
  endSession: (completed: boolean) => void;
  isInSession: boolean;
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export function FocusProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);
  const { updateTask } = useTask();

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('focusSessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  // Save sessions to localStorage when they change
  useEffect(() => {
    localStorage.setItem('focusSessions', JSON.stringify(sessions));
  }, [sessions]);

  const startSession = (task: Task) => {
    const newSession: FocusSession = {
      taskId: task.id,
      taskTitle: task.title,
      duration: 0,
      date: new Date(),
      completed: false,
    };
    setCurrentSession(newSession);
  };

  const endSession = (completed: boolean) => {
    if (currentSession) {
      const endedSession = {
        ...currentSession,
        completed,
        duration: 25, // Standard Pomodoro session length
      };
      setSessions(prev => [endedSession, ...prev]);
      setCurrentSession(null);

      // If the session was completed, update the task status
      if (completed) {
        updateTask(currentSession.taskId, { status: 'completed' });
      }
    }
  };

  return (
    <FocusContext.Provider
      value={{
        sessions,
        currentSession,
        startSession,
        endSession,
        isInSession: currentSession !== null,
      }}
    >
      {children}
    </FocusContext.Provider>
  );
}

export function useFocus() {
  const context = useContext(FocusContext);
  if (context === undefined) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return context;
} 