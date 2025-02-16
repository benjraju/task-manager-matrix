import { Task, CreateTaskDTO, UpdateTaskDTO } from '@/lib/types/task';
import { addTask as fbAddTask, updateTask as fbUpdateTask, deleteTask as fbDeleteTask } from '@/lib/firebase/firebaseUtils';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

export class TaskService {
  async createTask(task: CreateTaskDTO): Promise<Task> {
    try {
      // Create base task data with required fields
      const baseTask: Omit<Task, 'id'> = {
        title: task.title,
        priority: task.priority,
        status: task.status,
        description: task.description,
        startedAt: task.startedAt,
        completedAt: task.completedAt,
        totalTimeSpent: 0,
        isTracking: false,
        createdAt: new Date()
      };

      const { id, error } = await fbAddTask(baseTask);
      
      if (error) throw new Error(error);
      if (!id) throw new Error('Failed to create task');
      
      return {
        ...baseTask,
        id,
      };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create task');
    }
  }

  async updateTask(taskId: string, updates: UpdateTaskDTO): Promise<Task> {
    try {
      const { error } = await fbUpdateTask(taskId, updates);
      if (error) throw new Error(error);
      
      return {
        ...updates,
        id: taskId
      } as Task;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update task');
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      const { error } = await fbDeleteTask(taskId);
      if (error) throw new Error(error);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete task');
    }
  }

  async getTask(taskId: string): Promise<Task | null> {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const taskSnap = await getDoc(taskRef);
      
      if (!taskSnap.exists()) {
        return null;
      }

      const data = taskSnap.data();
      const startedDate = data.startedAt?.toDate();
      const completedDate = data.completedAt?.toDate();
      
      return {
        ...data,
        id: taskSnap.id,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        startedAt: startedDate ? startedDate.toISOString() : undefined,
        completedAt: completedDate ? completedDate.toISOString() : undefined,
        status: data.status || 'not_started',
        totalTimeSpent: data.totalTimeSpent || 0,
        isTracking: data.isTracking || false
      } as Task;
    } catch (err) {
      console.error('Error getting task:', err);
      return null;
    }
  }
} 