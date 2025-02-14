'use client';

import React, { useMemo } from 'react';
import { Task } from '@/lib/types/task';

interface TaskCalendarProps {
  tasks: Task[];
}

export default function TaskCalendar({ tasks }: TaskCalendarProps) {
  const today = new Date();
  
  // Get the calendar data for the current month
  const calendarData = useMemo(() => {
    const year = today.getFullYear();
    const month = today.getMonth();
    
    // Get first day of the month
    const firstDay = new Date(year, month, 1);
    // Get last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Create array of all days in the month
    const days: Date[] = [];
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }

    // Group tasks by date
    const tasksByDate = tasks.reduce((acc, task) => {
      const dateKey = task.createdAt.toDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

    return { days, tasksByDate };
  }, [tasks]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getCompletedTasksForDate = (date: Date) => {
    const dateKey = date.toDateString();
    return calendarData.tasksByDate[dateKey]?.filter(task => task.status === 'completed') || [];
  };

  const formatTime = (seconds: number) => {
    if (seconds === 0) return '';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const calendarDays = useMemo(() => {
    // Calendar generation logic
  }, [today]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {today.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
            Completed Tasks
          </span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
        {/* Week days header */}
        {weekDays.map(day => (
          <div
            key={day}
            className="bg-gray-100 dark:bg-gray-800 p-2 text-center text-sm font-medium text-gray-600 dark:text-gray-300"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarData.days.map((date, index) => {
          const completedTasks = getCompletedTasksForDate(date);
          const isToday = date.toDateString() === today.toDateString();
          const hasCompletedTasks = completedTasks.length > 0;

          return (
            <div
              key={date.toISOString()}
              className={`
                min-h-[100px] bg-white dark:bg-gray-800 p-2
                ${isToday ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
              `}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${
                  isToday
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {date.getDate()}
                </span>
                {hasCompletedTasks && (
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </div>
              
              {hasCompletedTasks && (
                <div className="space-y-1">
                  {completedTasks.map(task => (
                    <div
                      key={task.id}
                      className="group relative text-xs bg-green-50 dark:bg-green-900/20 rounded p-1"
                    >
                      <div className="truncate text-green-700 dark:text-green-300">
                        {task.title}
                      </div>
                      {/* Tooltip */}
                      <div className="invisible group-hover:visible absolute z-10 w-48 p-2 mt-1 text-xs bg-gray-900 text-white rounded-lg shadow-lg left-0">
                        <div className="font-medium">{task.title}</div>
                        {task.description && (
                          <div className="text-gray-300 mt-1">{task.description}</div>
                        )}
                        <div className="mt-1 text-gray-300">
                          Time spent: {formatTime(task.totalTimeSpent)}
                        </div>
                        <div className="text-gray-300">
                          Completed: {task.completedAt?.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 