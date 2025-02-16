"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { Task, Priority, TaskStatus, CreateTaskDTO, UpdateTaskDTO } from '../types/task';
import { useAuth } from './AuthContext';
import { useTaskData } from './TaskDataContext';
import { debounce } from 'lodash';

interface TaskValidationError {
  field: string;
  message: string;
}

interface UnifiedTaskContextType {
  // Task Management
  tasks: Task[];
  addTask: (taskData: CreateTaskDTO) => Promise<void>;
  updateTask: (taskId: string, updates: UpdateTaskDTO) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  moveTask: (taskId: string, newPriority: Priority) => Promise<void>;
  clearCompletedTasks: () => Promise<void>;
  restoreTask: (taskId: string) => Promise<void>;
  
  // Time Tracking
  isTracking: boolean;
  currentTaskId: string | null;
  elapsedTime: number;
  predictedDuration: number | null;
  startTracking: (taskId: string) => void;
  stopTracking: () => void;
  pauseTracking: () => void;
  resumeTracking: () => void;
  
  // Task Filtering and Stats
  getTasksByPriority: (priority: Priority) => Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTaskStats: () => {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    averageCompletionTime: number;
  };
  
  // Status
  loading: boolean;
  error: string | null;
  validationErrors: TaskValidationError[];
}

const UnifiedTaskContext = createContext<UnifiedTaskContextType | undefined>(undefined);

export function UnifiedTaskProvider({ children }: { children: React.ReactNode }) {
  const { tasks, addTask: addTaskData, updateTask: updateTaskData, deleteTask: deleteTaskData, loading, error: taskError } = useTaskData();
  const [validationErrors, setValidationErrors] = useState<TaskValidationError[]>([]);
  
  // Time tracking state
  const [isTracking, setIsTracking] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [predictedDuration, setPredictedDuration] = useState<number | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  
  const { user } = useAuth();

  // Validation function
  const validateTask = useCallback((task: Partial<Task>): TaskValidationError[] => {
    const errors: TaskValidationError[] = [];
    
    if (task.title && task.title.length < 3) {
      errors.push({ field: 'title', message: 'Title must be at least 3 characters long' });
    }
    
    if (task.timeEstimate && task.timeEstimate <= 0) {
      errors.push({ field: 'timeEstimate', message: 'Time estimate must be positive' });
    }
    
    if (task.dueDate && new Date(task.dueDate) < new Date()) {
      errors.push({ field: 'dueDate', message: 'Due date cannot be in the past' });
    }
    
    return errors;
  }, []);

  const addTask = useCallback(async (taskData: CreateTaskDTO) => {
    const errors = validateTask(taskData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      throw new Error('Validation failed');
    }

    try {
      await addTaskData(taskData);
      setValidationErrors([]);
    } catch (err) {
      throw err;
    }
  }, [addTaskData, validateTask]);

  const updateTask = useCallback(async (taskId: string, updates: UpdateTaskDTO) => {
    try {
      await updateTaskData(taskId, updates);
    } catch (err) {
      throw err;
    }
  }, [updateTaskData]);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      await deleteTaskData(taskId);
    } catch (err) {
      throw err;
    }
  }, [deleteTaskData]);

  const moveTask = useCallback(async (taskId: string, newPriority: Priority) => {
    try {
      await updateTaskData(taskId, { priority: newPriority });
    } catch (err) {
      throw err;
    }
  }, [updateTaskData]);

  const clearCompletedTasks = useCallback(async () => {
    try {
      const completedTasks = tasks.filter(task => task.status === 'completed');
      await Promise.all(completedTasks.map(task => deleteTaskData(task.id)));
    } catch (err) {
      throw err;
    }
  }, [tasks, deleteTaskData]);

  const restoreTask = useCallback(async (taskId: string) => {
    try {
      const updates = {
        status: 'not_started' as TaskStatus,
        isTracking: false,
        totalTimeSpent: 0,
        startedAt: undefined,
        completedAt: undefined
      };

      await updateTaskData(taskId, updates);
    } catch (err) {
      throw err;
    }
  }, [updateTaskData]);

  // Time Tracking Functions
  const startTracking = useCallback((taskId: string) => {
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
      if (currentTask) {
        updateTaskData(currentTask.id, { 
          totalTimeSpent: (currentTask.totalTimeSpent || 0) + 1 
        });
      }
    }, 1000);
    
    setIntervalId(id);
  }, [tasks, updateTaskData]);

  const stopTracking = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    setIsTracking(false);
    setCurrentTaskId(null);
    setElapsedTime(0);
    setPredictedDuration(null);
  }, [intervalId]);

  const pauseTracking = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    setIsTracking(false);
  }, [intervalId]);

  const resumeTracking = useCallback(() => {
    if (currentTaskId) {
      setIsTracking(true);
      const id = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      setIntervalId(id);
    }
  }, [currentTaskId]);

  // Task Filtering Functions
  const getTasksByPriority = useCallback((priority: Priority) => {
    return tasks.filter(task => task.priority === priority);
  }, [tasks]);

  const getTasksByStatus = useCallback((status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  // Memoized task stats
  const taskStats = useMemo(() => ({
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    inProgressTasks: tasks.filter(t => t.status === 'in_progress').length,
    averageCompletionTime: tasks
      .filter(t => t.status === 'completed' && t.totalTimeSpent)
      .reduce((acc, t) => acc + (t.totalTimeSpent || 0), 0) / 
      tasks.filter(t => t.status === 'completed').length || 0
  }), [tasks]);

  const value = {
    // Task Management
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    clearCompletedTasks,
    restoreTask,
    
    // Time Tracking
    isTracking,
    currentTaskId,
    elapsedTime,
    predictedDuration,
    startTracking,
    stopTracking,
    pauseTracking,
    resumeTracking,
    
    // Task Filtering and Stats
    getTasksByPriority,
    getTasksByStatus,
    getTaskStats: () => taskStats,
    
    // Status
    loading,
    error: taskError,
    validationErrors
  };

  return (
    <UnifiedTaskContext.Provider value={value}>
      {children}
    </UnifiedTaskContext.Provider>
  );
}

export function useUnifiedTask() {
  const context = useContext(UnifiedTaskContext);
  if (context === undefined) {
    throw new Error('useUnifiedTask must be used within a UnifiedTaskProvider');
  }
  return context;
} 