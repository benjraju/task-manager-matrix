import { Task, TaskWithTimeInfo } from '../types/task';

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`);

  return parts.join(' ');
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};

export const enrichTaskWithTimeInfo = (task: Task): TaskWithTimeInfo => {
  return {
    ...task,
    formattedTimeSpent: formatTime(task.totalTimeSpent),
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