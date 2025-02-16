import { Priority, TaskStatus } from '../types/task';

export const TASK_PRIORITIES: Record<string, Priority> = {
  URGENT_IMPORTANT: 'urgent-important',
  NOT_URGENT_IMPORTANT: 'not-urgent-important',
  URGENT_NOT_IMPORTANT: 'urgent-not-important',
  NOT_URGENT_NOT_IMPORTANT: 'not-urgent-not-important'
} as const;

export const TASK_STATUSES: Record<string, TaskStatus> = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
} as const;

export const PRIORITY_LABELS: Record<Priority, string> = {
  'urgent-important': 'Do First',
  'not-urgent-important': 'Schedule',
  'urgent-not-important': 'Delegate',
  'not-urgent-not-important': 'Don\'t Do'
} as const;

export const PRIORITY_COLORS: Record<Priority, { bg: string; text: string; darkBg: string; darkText: string }> = {
  'urgent-important': {
    bg: 'bg-red-50',
    text: 'text-red-800',
    darkBg: 'dark:bg-red-900/20',
    darkText: 'dark:text-red-200'
  },
  'not-urgent-important': {
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    darkBg: 'dark:bg-yellow-900/20',
    darkText: 'dark:text-yellow-200'
  },
  'urgent-not-important': {
    bg: 'bg-orange-50',
    text: 'text-orange-800',
    darkBg: 'dark:bg-orange-900/20',
    darkText: 'dark:text-orange-200'
  },
  'not-urgent-not-important': {
    bg: 'bg-green-50',
    text: 'text-green-800',
    darkBg: 'dark:bg-green-900/20',
    darkText: 'dark:text-green-200'
  }
} as const;

export const STATUS_LABELS: Record<TaskStatus, string> = {
  'not_started': 'Not Started',
  'in_progress': 'In Progress',
  'completed': 'Completed'
} as const; 