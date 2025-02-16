'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { type FocusSession } from '@/lib/contexts/FocusContext';
import { format } from 'date-fns';

interface FocusStatsProps {
  sessions: FocusSession[];
}

const formatTimeDisplay = (minutes: number): string => {
  if (!minutes) return '0s';
  
  // Convert to seconds for more precise calculations
  const totalSeconds = Math.round(minutes * 60);
  
  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }
  
  const hours = Math.floor(totalSeconds / 3600);
  const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return seconds > 0 
      ? `${hours}h ${remainingMinutes}m ${seconds}s`
      : remainingMinutes > 0 
        ? `${hours}h ${remainingMinutes}m`
        : `${hours}h`;
  }
  
  return seconds > 0 
    ? `${remainingMinutes}m ${seconds}s`
    : `${remainingMinutes}m`;
};

const formatSessionDateTime = (date: Date): string => {
  try {
    return format(date, 'MMM d, yyyy h:mm a');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

export default function FocusStats({ sessions }: FocusStatsProps) {
  // Get today's sessions
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todaysSessions = sessions
    .filter(session => {
      try {
        const sessionDate = new Date(session.startTime);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === today.getTime();
      } catch (error) {
        console.error('Error comparing dates:', error);
        return false;
      }
    })
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  // Calculate total minutes from completed sessions
  const completedSessions = sessions.filter(s => s.completed);
  const totalMinutes = completedSessions.reduce((acc, session) => 
    acc + (session.actualTimeSpent || 0), 0);

  // Calculate average session length from completed sessions
  const averageSessionLength = completedSessions.length > 0
    ? Math.round(totalMinutes / completedSessions.length)
    : 0;

  const stats = [
    {
      label: 'Total Focus Time',
      value: formatTimeDisplay(totalMinutes),
      color: 'text-blue-400',
    },
    {
      label: 'Sessions Today',
      value: todaysSessions.length,
      color: 'text-green-400',
    },
    {
      label: 'Avg. Session Length',
      value: formatTimeDisplay(averageSessionLength),
      color: 'text-pink-400',
    },
    {
      label: 'Completed Sessions',
      value: completedSessions.length,
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black/30 p-4 rounded-lg border border-[#78A892]/10"
          >
            <div className={`text-2xl font-bold mb-1 ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-sm text-[#78A892]/60 font-mono">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {todaysSessions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium">Recent Sessions</h2>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {todaysSessions.map((session, index) => (
              <li key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {session.taskTitle || 'Untitled Session'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatSessionDateTime(new Date(session.startTime))}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatTimeDisplay(session.actualTimeSpent || 0)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {session.completed ? 'Completed' : 'Incomplete'}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 