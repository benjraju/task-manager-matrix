'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Task, Priority } from '../types/task';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  moveTask: (taskId: string, newPriority: Priority) => void;
  deleteTask: (taskId: string) => void;
  getTasksByPriority: (priority: Priority) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);
        return parsed.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          startedAt: task.startedAt ? new Date(task.startedAt) : undefined,
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
          isTracking: false, // Reset tracking state on load
          totalTimeSpent: task.totalTimeSpent || 0,
        }));
      }
    }
    return [];
  });

  // Reference to store the last update time for each task
  const lastUpdateTimeRef = useRef<Record<string, number>>({});

  // Update localStorage when tasks change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Handle time tracking with more precise timing
  useEffect(() => {
    const trackingTasks = tasks.filter(task => task.isTracking);
    if (trackingTasks.length === 0) return;

    // Initialize last update time for new tracking tasks
    trackingTasks.forEach(task => {
      if (!lastUpdateTimeRef.current[task.id]) {
        lastUpdateTimeRef.current[task.id] = Date.now();
      }
    });

    const intervalId = setInterval(() => {
      const now = Date.now();

      setTasks(currentTasks => 
        currentTasks.map(task => {
          if (task.isTracking) {
            const lastUpdate = lastUpdateTimeRef.current[task.id] || now;
            const timeDiff = Math.floor((now - lastUpdate) / 1000);
            
            if (timeDiff > 0) {
              lastUpdateTimeRef.current[task.id] = now;
              return {
                ...task,
                totalTimeSpent: task.totalTimeSpent + timeDiff
              };
            }
          }
          return task;
        })
      );
    }, 1000);

    return () => {
      clearInterval(intervalId);
      // Clean up last update times for tasks that are no longer tracking
      Object.keys(lastUpdateTimeRef.current).forEach(taskId => {
        if (!trackingTasks.some(task => task.id === taskId)) {
          delete lastUpdateTimeRef.current[taskId];
        }
      });
    };
  }, [tasks]);

  const addTask = useCallback((task: Task) => {
    setTasks(prev => [...prev, {
      ...task,
      totalTimeSpent: 0,
      isTracking: false
    }]);
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, ...updates };
        
        // Handle status changes
        if (updates.status) {
          if (updates.status === 'completed' && task.status !== 'completed') {
            updatedTask.completedAt = new Date();
            updatedTask.isTracking = false;
            delete lastUpdateTimeRef.current[task.id];
          } else if (updates.status === 'in_progress' && task.status === 'not_started') {
            updatedTask.startedAt = updatedTask.startedAt || new Date();
          }
        }

        // Handle tracking changes
        if ('isTracking' in updates) {
          if (updates.isTracking) {
            lastUpdateTimeRef.current[task.id] = Date.now();
          } else {
            delete lastUpdateTimeRef.current[task.id];
          }
        }
        
        return updatedTask;
      }
      return task;
    }));
  }, []);

  const moveTask = useCallback((taskId: string, newPriority: Priority) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, priority: newPriority } : task
    ));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    delete lastUpdateTimeRef.current[taskId];
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  const getTasksByPriority = useCallback((priority: Priority) => {
    return tasks.filter(task => task.priority === priority);
  }, [tasks]);

  const value = {
    tasks,
    addTask,
    updateTask,
    moveTask,
    deleteTask,
    getTasksByPriority,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
} 