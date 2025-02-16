'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../types/task';
import { useAuth } from './AuthContext';
import { TaskService } from '../services/task/taskService';
import { getUserTasks } from '../firebase/firebaseUtils';

interface TaskDataContextType {
  tasks: Task[];
  addTask: (taskData: CreateTaskDTO) => Promise<void>;
  updateTask: (taskId: string, updates: UpdateTaskDTO) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const TaskDataContext = createContext<TaskDataContextType | undefined>(undefined);

export function TaskDataProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const taskService = new TaskService();

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

  const addTask = useCallback(async (taskData: CreateTaskDTO) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (taskId: string, updates: UpdateTaskDTO) => {
    try {
      await taskService.updateTask(taskId, updates);
      setTasks(prev => prev.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      ));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    }
  }, []);

  return (
    <TaskDataContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        loading,
        error
      }}
    >
      {children}
    </TaskDataContext.Provider>
  );
}

export const useTaskData = () => {
  const context = useContext(TaskDataContext);
  if (context === undefined) {
    throw new Error('useTaskData must be used within a TaskDataProvider');
  }
  return context;
}; 