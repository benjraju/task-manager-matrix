import { Task, TaskWithTimeInfo } from '../types/task';

export const formatTaskDuration = (seconds: number): string => {
  if (!seconds) return '0s';
  
  // Convert to whole numbers
  seconds = Math.round(seconds);
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0 && hours === 0) parts.push(`${remainingSeconds}s`);

  // If we have no parts (all zeros), return "0s"
  return parts.length > 0 ? parts.join(' ') : '0s';
};

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(dateObj);
};

export const enrichTaskWithTimeInfo = (task: Task): TaskWithTimeInfo => {
  return {
    ...task,
    formattedTimeSpent: formatTaskDuration(task.totalTimeSpent),
    formattedCreatedAt: formatDate(task.createdAt),
  };
};

export const getEisenhowerQuadrant = (priority: Task['priority']): string => {
  const quadrants = {
    'urgent-important': 'Do First',
    'not-urgent-important': 'Schedule',
    'urgent-not-important': 'Delegate',
    'not-urgent-not-important': 'Don\'t Do',
  };
  return quadrants[priority];
};

export const getTaskProgress = (task: Task): number => {
  if (task.status === 'completed') return 100;
  if (task.status === 'not_started') return 0;
  // For in_progress tasks, you could implement more sophisticated progress tracking
  return 50;
};

export const sortTasksByPriority = (tasks: Task[]): Task[] => {
  const priorityOrder = {
    'urgent-important': 0,
    'not-urgent-important': 1,
    'urgent-not-important': 2,
    'not-urgent-not-important': 3
  };

  return [...tasks].sort((a, b) => 
    priorityOrder[a.priority] - priorityOrder[b.priority]
  );
};

export const filterActiveTasks = (tasks: Task[]): Task[] => {
  return tasks.filter(task => task.status !== 'completed');
};

export const filterCompletedTasks = (tasks: Task[]): Task[] => {
  return tasks.filter(task => task.status === 'completed');
}; 