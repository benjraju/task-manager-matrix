export type Priority = 'urgent-important' | 'not-urgent-important' | 'urgent-not-important' | 'not-urgent-not-important';

export type TaskStatus = 'not_started' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  totalTimeSpent: number; // in seconds
  isTracking: boolean;
}

export interface TaskWithTimeInfo extends Task {
  formattedTimeSpent: string;
  formattedCreatedAt: string;
} 