'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Task, Priority } from '../types/task';
import { useAuth } from './AuthContext';
import { addTask as fbAddTask, updateTask as fbUpdateTask, deleteTask as fbDeleteTask, getUserTasks } from '../firebase/firebaseUtils';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  moveTask: (taskId: string, newPriority: Priority) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  clearCompletedTasks: () => Promise<void>;
  getTasksByPriority: (priority: Priority) => Task[];
  restoreTask: (taskId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const lastUpdateTimeRef = React.useRef<Record<string, number>>({});

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    try {
      // First find the existing task
      const existingTask = tasks.find(t => t.id === taskId);
      if (!existingTask) {
        console.error('Task not found:', taskId);
        return;
      }

      // Prepare the updates with status-specific changes
      const finalUpdates = { ...updates };
      
      if (updates.status) {
        if (updates.status === 'completed' && existingTask.status !== 'completed') {
          finalUpdates.completedAt = new Date();
          finalUpdates.isTracking = false;
          delete lastUpdateTimeRef.current[taskId];
        } else if (updates.status === 'in_progress' && existingTask.status === 'not_started') {
          finalUpdates.startedAt = existingTask.startedAt || new Date();
        }
      }

      if ('isTracking' in updates) {
        if (updates.isTracking) {
          lastUpdateTimeRef.current[taskId] = Date.now();
        } else {
          delete lastUpdateTimeRef.current[taskId];
        }
      }

      const { error } = await fbUpdateTask(taskId, finalUpdates);
      
      if (error) {
        console.error('Firebase update error:', error);
        setError(error);
        return;
      }

      setTasks(prev => prev.map(task =>
        task.id === taskId ? { ...task, ...finalUpdates } : task
      ));
      setError(null);
    } catch (err) {
      console.error('Update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  }, [tasks]);

  // Fetch tasks when user changes
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) {
        setTasks([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { tasks: userTasks, error } = await getUserTasks(user.uid);
        if (error) {
          setError(error);
        } else {
          setTasks(userTasks);
          setError(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  // Handle time tracking
  useEffect(() => {
    const trackingTasks = tasks.filter(task => task.isTracking);
    if (trackingTasks.length === 0) return;

    // Store the current time for each tracking task
    const currentTime = Date.now();
    trackingTasks.forEach(task => {
      if (!lastUpdateTimeRef.current[task.id]) {
        lastUpdateTimeRef.current[task.id] = currentTime;
      }
    });

    const intervalId = setInterval(async () => {
      const now = Date.now();

      for (const task of trackingTasks) {
        if (task.isTracking) {
          const lastUpdate = lastUpdateTimeRef.current[task.id] || now;
          const timeDiff = Math.floor((now - lastUpdate) / 1000);
          
          if (timeDiff > 0) {
            lastUpdateTimeRef.current[task.id] = now;
            await updateTask(task.id, { 
              totalTimeSpent: task.totalTimeSpent + timeDiff 
            });
          }
        }
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
      // Clean up tracking tasks that are no longer being tracked
      const currentTrackingIds = new Set(trackingTasks.map(t => t.id));
      Object.keys(lastUpdateTimeRef.current).forEach(taskId => {
        if (!currentTrackingIds.has(taskId)) {
          delete lastUpdateTimeRef.current[taskId];
        }
      });
    };
  }, [tasks, updateTask]);

  const addTask = useCallback(async (task: Task) => {
    if (!user) return;
    
    try {
      const { id, error } = await fbAddTask({
        ...task,
        totalTimeSpent: 0,
        isTracking: false
      });
      
      if (error) {
        setError(error);
        return;
      }
      
      if (id) {
        setTasks(prev => [...prev, { ...task, id, totalTimeSpent: 0, isTracking: false }]);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
    }
  }, [user]);

  const moveTask = useCallback(async (taskId: string, newPriority: Priority) => {
    try {
      const { error } = await fbUpdateTask(taskId, { priority: newPriority });
      
      if (error) {
        setError(error);
        return;
      }

      setTasks(prev => prev.map(task =>
        task.id === taskId ? { ...task, priority: newPriority } : task
      ));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move task');
    }
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      const { error } = await fbDeleteTask(taskId);
      
      if (error) {
        setError(error);
        return;
      }

      delete lastUpdateTimeRef.current[taskId];
      setTasks(prev => prev.filter(task => task.id !== taskId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  }, []);

  const getTasksByPriority = useCallback((priority: Priority) => {
    return tasks.filter(task => task.priority === priority);
  }, [tasks]);

  const clearCompletedTasks = useCallback(async () => {
    try {
      const completedTasks = tasks.filter(task => task.status === 'completed');
      const deletePromises = completedTasks.map(task => fbDeleteTask(task.id));
      await Promise.all(deletePromises);
      setTasks(prev => prev.filter(task => task.status !== 'completed'));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear completed tasks');
    }
  }, [tasks]);

  const restoreTask = useCallback(async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        console.error('Task not found:', taskId);
        return;
      }

      // Create a clean update object that resets the task to its initial state
      const { completedAt, startedAt, isTracking, status, totalTimeSpent, ...baseTask } = task;
      const updates = {
        ...baseTask,
        status: 'not_started' as const,
        isTracking: false,
        totalTimeSpent: 0,
        createdAt: new Date().toISOString() // Convert Date to ISO string format
      };

      console.log('Restoring task with updates:', updates);
      const { error } = await fbUpdateTask(taskId, updates);
      
      if (error) {
        console.error('Firebase update error:', error);
        setError(error);
        return;
      }

      setTasks(prev => prev.map(t =>
        t.id === taskId ? { 
          ...updates, 
          completedAt: undefined, 
          startedAt: undefined
        } : t
      ));
      console.log('Task restored successfully');
      setError(null);
    } catch (err) {
      console.error('Restore error:', err);
      setError(err instanceof Error ? err.message : 'Failed to restore task');
    }
  }, [tasks]);

  const value = {
    tasks,
    addTask,
    updateTask,
    moveTask,
    deleteTask,
    clearCompletedTasks,
    getTasksByPriority,
    restoreTask,
    loading,
    error,
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