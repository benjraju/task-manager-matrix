"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useTaskData } from './TaskDataContext';
import { Task } from '@/lib/types/task';

interface TimeBoxingContextType {
  isTracking: boolean;
  currentTaskId: string | null;
  elapsedTime: number;
  predictedDuration: number | null;
  startTracking: (taskId: string) => void;
  stopTracking: () => void;
  pauseTracking: () => void;
  resumeTracking: () => void;
}

const TimeBoxingContext = createContext<TimeBoxingContextType | undefined>(undefined);

export function TimeBoxingProvider({ children }: { children: ReactNode }) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [predictedDuration, setPredictedDuration] = useState<number | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  
  const { user } = useAuth();
  const { tasks } = useTaskData();

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const startTracking = (taskId: string) => {
    setCurrentTaskId(taskId);
    setIsTracking(true);
    setElapsedTime(0);
    
    // Predict duration based on similar tasks
    const currentTask = tasks.find(t => t.id === taskId);
    if (currentTask) {
      const similarTasks = tasks.filter(t => 
        t.status === 'completed' && 
        t.priority === currentTask.priority
      );
      
      if (similarTasks.length > 0) {
        const avgDuration = similarTasks.reduce((acc, task) => {
          if (task.completedAt && task.startedAt) {
            return acc + (task.completedAt.getTime() - task.startedAt.getTime());
          }
          return acc;
        }, 0) / similarTasks.length;
        
        setPredictedDuration(avgDuration);
      }
    }

    const id = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    setIntervalId(id);
  };

  const stopTracking = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    setIsTracking(false);
    setCurrentTaskId(null);
    setElapsedTime(0);
    setPredictedDuration(null);
  };

  const pauseTracking = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    setIsTracking(false);
  };

  const resumeTracking = () => {
    if (currentTaskId) {
      setIsTracking(true);
      const id = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      setIntervalId(id);
    }
  };

  return (
    <TimeBoxingContext.Provider
      value={{
        isTracking,
        currentTaskId,
        elapsedTime,
        predictedDuration,
        startTracking,
        stopTracking,
        pauseTracking,
        resumeTracking,
      }}
    >
      {children}
    </TimeBoxingContext.Provider>
  );
}

export function useTimeBoxing() {
  const context = useContext(TimeBoxingContext);
  if (context === undefined) {
    throw new Error('useTimeBoxing must be used within a TimeBoxingProvider');
  }
  return context;
} 