'use client';

import React, { useMemo, useState } from 'react';
import { Task } from '@/lib/types/task';

interface TaskCalendarProps {
  tasks: Task[];
}

export default function TaskCalendar({ tasks }: TaskCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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
      if (!task.createdAt) return acc;
      const dateKey = new Date(task.createdAt).toDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

    return { days, tasksByDate };
  }, [tasks, today]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getCompletedTasksForDate = (date: Date) => {
    const dateKey = date.toDateString();
    return calendarData.tasksByDate[dateKey]?.filter(task => task.status === 'completed') || [];
  };

  const formatTime = (seconds: number) => {
    if (!seconds) return 'No time tracked';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {today.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex items-center gap-3">
            <span className="flex items-center text-sm text-[#E6EFE9]/80">
              <span className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></span>
              Completed Tasks
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {/* Week days header */}
          {weekDays.map(day => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-[#E6EFE9]/60"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarData.days.map((date) => {
            const completedTasks = getCompletedTasksForDate(date);
            const isToday = date.toDateString() === today.toDateString();
            const hasCompletedTasks = completedTasks.length > 0;

            return (
              <div
                key={date.toISOString()}
                className={`
                  relative min-h-[100px] bg-[#1E293B]/40 rounded-lg p-2 border
                  transition-all duration-300 cursor-pointer
                  ${isToday ? 'border-[#78A892]' : 'border-white/5'}
                  hover:border-[#78A892]/50 hover:bg-[#1E293B]/60
                `}
                onClick={() => hasCompletedTasks && setSelectedDate(date)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${
                    isToday
                      ? 'text-[#78A892]'
                      : 'text-white'
                  }`}>
                    {date.getDate()}
                  </span>
                  {hasCompletedTasks && (
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  )}
                </div>
                
                {hasCompletedTasks && (
                  <div className="space-y-1">
                    <div className="text-xs bg-emerald-500/10 text-emerald-300 rounded p-1.5">
                      <div className="truncate font-medium">
                        {completedTasks[0].title}
                      </div>
                    </div>
                    {completedTasks.length > 1 && (
                      <div className="text-[10px] text-[#E6EFE9]/40 text-center">
                        +{completedTasks.length - 1} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for selected date */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1E293B] rounded-xl border border-[#78A892]/20 shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-[#78A892]/10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  {formatDate(selectedDate)}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDate(null);
                  }}
                  className="text-[#E6EFE9]/60 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {getCompletedTasksForDate(selectedDate).map(task => (
                  <div
                    key={task.id}
                    className="bg-[#1a1d1b]/40 rounded-lg p-4 border border-[#78A892]/10
                             hover:border-[#78A892]/20 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-white">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="mt-2 text-[#E6EFE9]/80 text-sm">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <span className="ml-4 px-2 py-1 bg-emerald-500/10 text-emerald-300 rounded text-xs">
                        {formatTime(task.totalTimeSpent)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-xs text-[#E6EFE9]/60">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Completed at {task.completedAt ? new Date(task.completedAt).toLocaleTimeString() : 'Unknown'}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 