'use client';

import React, { createContext, useContext, useEffect, useCallback, useRef, useState } from 'react';
import { Task } from '../types/task';
import { TaskTrackingService } from '../services/task/taskTrackingService';
import { useTaskData } from './TaskDataContext';

interface TaskTrackingContextType {
  startTracking: (task: Task) => void;
  stopTracking: (taskId: string) => void;
  getTrackedTime: (task: Task) => number;
}

const TaskTrackingContext = createContext<TaskTrackingContextType | undefined>(undefined);

export function TaskTrackingProvider({ children }: { children: React.ReactNode }) {
  const trackingServiceRef = useRef<TaskTrackingService>(new TaskTrackingService());
  const [, forceUpdate] = useState({});
  const { tasks } = useTaskData();

  // Force a re-render every second to update timers
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate({});
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cleanup tracking intervals when unmounting
  useEffect(() => {
    return () => {
      trackingServiceRef.current.cleanup();
    };
  }, []);

  // Resume tracking for tasks that were being tracked
  useEffect(() => {
    tasks.forEach(task => {
      if (task.isTracking) {
        trackingServiceRef.current.startTracking(task);
      }
    });
  }, [tasks]);

  const startTracking = useCallback((task: Task) => {
    trackingServiceRef.current.startTracking(task);
  }, []);

  const stopTracking = useCallback((taskId: string) => {
    trackingServiceRef.current.stopTracking(taskId);
  }, []);

  const getTrackedTime = useCallback((task: Task) => {
    return trackingServiceRef.current.getTrackedTime(task.id);
  }, []);

  return (
    <TaskTrackingContext.Provider
      value={{
        startTracking,
        stopTracking,
        getTrackedTime
      }}
    >
      {children}
    </TaskTrackingContext.Provider>
  );
}

export const useTaskTracking = () => {
  const context = useContext(TaskTrackingContext);
  if (context === undefined) {
    throw new Error('useTaskTracking must be used within a TaskTrackingProvider');
  }
  return context;
}; 