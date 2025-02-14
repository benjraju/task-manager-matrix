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

    trackingTasks.forEach(task => {
      if (!lastUpdateTimeRef.current[task.id]) {
        lastUpdateTimeRef.current[task.id] = Date.now();
      }
    });

    const intervalId = setInterval(async () => {
      const now = Date.now();

      for (const task of tasks) {
        if (task.isTracking) {
          const lastUpdate = lastUpdateTimeRef.current[task.id] || now;
          const timeDiff = Math.floor((now - lastUpdate) / 1000);
          
          if (timeDiff > 0) {
            lastUpdateTimeRef.current[task.id] = now;
            const updatedTask = {
              ...task,
              totalTimeSpent: task.totalTimeSpent + timeDiff
            };
            await updateTask(task.id, { totalTimeSpent: updatedTask.totalTimeSpent });
          }
        }
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
      Object.keys(lastUpdateTimeRef.current).forEach(taskId => {
        if (!trackingTasks.some(task => task.id === taskId)) {
          delete lastUpdateTimeRef.current[taskId];
        }
      });
    };
  }, [tasks]);

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

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    try {
      const { error } = await fbUpdateTask(taskId, updates);
      
      if (error) {
        setError(error);
        return;
      }

      setTasks(prev => prev.map(task => {
        if (task.id === taskId) {
          const updatedTask = { ...task, ...updates };
          
          if (updates.status) {
            if (updates.status === 'completed' && task.status !== 'completed') {
              updatedTask.completedAt = new Date();
              updatedTask.isTracking = false;
              delete lastUpdateTimeRef.current[task.id];
            } else if (updates.status === 'in_progress' && task.status === 'not_started') {
              updatedTask.startedAt = updatedTask.startedAt || new Date();
            }
          }

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
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  }, []);

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

  const value = {
    tasks,
    addTask,
    updateTask,
    moveTask,
    deleteTask,
    clearCompletedTasks,
    getTasksByPriority,
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