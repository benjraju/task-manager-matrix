'use client';

import { useMemo, useState, useEffect } from 'react';
import { Task } from '@/lib/types/task';
import { format, eachDayOfInterval, isSameDay, startOfWeek, getDay, startOfYear, endOfYear, parseISO } from 'date-fns';

interface TaskCalendarProps {
  tasks: Task[];
}

interface DayData {
  date: Date;
  tasks: Task[];
  totalTime: number;
}

export default function TaskCalendar({ tasks }: TaskCalendarProps) {
  const [mounted, setMounted] = useState(false);
  const year = new Date().getFullYear();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate data for the current year
  const calendarData = useMemo(() => {
    const startDate = startOfWeek(startOfYear(new Date(year, 0, 1)));
    const endDate = endOfYear(new Date(year, 11, 31));
    const daysArray = eachDayOfInterval({ start: startDate, end: endDate });

    // Group days by week
    const weeks: DayData[][] = [];
    let currentWeek: DayData[] = [];

    daysArray.forEach((date) => {
      const dayTasks = tasks.filter((task) => {
        if (!task.completedAt) return false;
        // Ensure we're working with Date objects
        const taskDate = typeof task.completedAt === 'string' 
          ? parseISO(task.completedAt)
          : task.completedAt;
        return task.status === 'completed' && isSameDay(taskDate, date);
      });

      const totalTime = dayTasks.reduce((acc, task) => acc + task.totalTimeSpent, 0);

      const dayData: DayData = {
        date,
        tasks: dayTasks,
        totalTime,
      };

      currentWeek.push(dayData);

      if (getDay(date) === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    // Push the last week if it's not complete
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  }, [tasks, year]);

  // Get month labels
  const monthLabels = useMemo(() => {
    const labels: { month: string; index: number }[] = [];
    calendarData.forEach((week, weekIndex) => {
      const firstDayOfWeek = week[0].date;
      if (weekIndex === 0 || format(firstDayOfWeek, 'MMM') !== format(calendarData[weekIndex - 1][0].date, 'MMM')) {
        labels.push({
          month: format(firstDayOfWeek, 'MMM'),
          index: weekIndex,
        });
      }
    });
    return labels;
  }, [calendarData]);

  // Function to get the intensity class based on the total time spent
  const getIntensityClass = (day: DayData) => {
    // If there are completed tasks, show at least the minimum intensity
    if (day.tasks.length > 0) {
      return 'bg-green-200 dark:bg-green-800';
    }
    return 'bg-gray-100 dark:bg-gray-700';
  };

  // Format seconds to hours and minutes
  const formatTime = (seconds: number) => {
    if (seconds === 0) return '0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`);
    return parts.join(' ');
  };

  // Function to check if a date is in the future
  const isFutureDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  return (
    <div className={`w-full p-4 overflow-x-auto transition-opacity duration-200 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Task Calendar</h2>
      
      {/* Month labels */}
      <div className="flex">
        {monthLabels.map((label, index) => (
          <div
            key={index}
            className="text-xs text-gray-500 dark:text-gray-400"
            style={{
              position: 'relative',
              left: `${label.index * 16}px`,
              marginRight: '4px',
            }}
          >
            {label.month}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex gap-1 mt-2">
        {calendarData.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className="group relative"
              >
                <div
                  className={`w-4 h-4 rounded-sm ${
                    isFutureDate(day.date)
                      ? 'bg-gray-50 dark:bg-gray-800 cursor-not-allowed'
                      : `cursor-pointer ${getIntensityClass(day)}`
                  }`}
                  title={format(day.date, 'EEEE, MMMM d, yyyy')}
                />
                
                {/* Tooltip */}
                {!isFutureDate(day.date) && day.tasks.length > 0 && mounted && (
                  <div className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white p-2 rounded-md text-sm w-64 -translate-y-full left-6 mt-1">
                    <p className="font-semibold">{format(day.date, 'EEEE, MMMM d, yyyy')}</p>
                    <p className="text-xs mb-2">{day.tasks.length} tasks completed</p>
                    <div className="space-y-1">
                      {day.tasks.map((task) => (
                        <div key={task.id} className="text-xs">
                          <span className="font-medium">{task.title}</span>
                          <span className="text-gray-300 ml-1">({formatTime(task.totalTimeSpent)})</span>
                        </div>
                      ))}
                      <div className="text-xs font-semibold mt-1 pt-1 border-t border-gray-700">
                        Total: {formatTime(day.totalTime)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <span>No tasks</span>
        <div className="w-4 h-4 rounded-sm bg-gray-100 dark:bg-gray-700" />
        <span>Completed tasks</span>
        <div className="w-4 h-4 rounded-sm bg-green-200 dark:bg-green-800" />
      </div>
    </div>
  );
} 