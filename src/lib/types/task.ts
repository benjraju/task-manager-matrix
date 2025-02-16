export type Priority = 'urgent-important' | 'not-urgent-important' | 'urgent-not-important' | 'not-urgent-not-important';

export type TaskStatus = 'not_started' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  createdAt: string;
  startedAt?: Date;
  completedAt?: Date;
  lastUpdated?: string;
  userId: string;
  category?: string;
  tags?: string[];
  timeEstimate?: number; // in minutes
  totalTimeSpent: number; // in minutes
  isTracking: boolean;
  dependencies?: string[]; // array of task IDs
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: string;
  };
  completionHistory?: {
    timestamp: string;
    duration: number;
  }[];
  metadata?: {
    eisenhowerQuadrant?: Priority;
    focusScore?: number; // 0-100
    difficulty?: 'easy' | 'medium' | 'hard';
    energy?: 'low' | 'medium' | 'high';
    context?: string[];
  };
}

export interface TaskWithTimeInfo extends Task {
  formattedTimeSpent: string;
  formattedCreatedAt: string;
}

// Only omit the id and createdAt as they are handled by the service
export type CreateTaskDTO = Omit<Task, 'id' | 'createdAt'>;
export type UpdateTaskDTO = Partial<Omit<Task, 'id' | 'createdAt'>>; 