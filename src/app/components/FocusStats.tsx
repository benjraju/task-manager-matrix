'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FocusSession {
  taskId: string;
  taskTitle: string;
  duration: number;
  date: Date;
  completed: boolean;
}

interface FocusStatsProps {
  sessions: FocusSession[];
}

export default function FocusStats({ sessions }: FocusStatsProps) {
  // Calculate stats
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.completed).length;
  const totalMinutes = sessions.reduce((acc, session) => acc + session.duration, 0);
  const averageSessionLength = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

  // Get today's sessions
  const today = new Date();
  const todaySessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    return (
      sessionDate.getDate() === today.getDate() &&
      sessionDate.getMonth() === today.getMonth() &&
      sessionDate.getFullYear() === today.getFullYear()
    );
  });

  const stats = [
    {
      label: 'Total Focus Time',
      value: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`,
      color: 'text-blue-400',
    },
    {
      label: 'Sessions Today',
      value: todaySessions.length,
      color: 'text-green-400',
    },
    {
      label: 'Completion Rate',
      value: `${totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0}%`,
      color: 'text-purple-400',
    },
    {
      label: 'Avg. Session Length',
      value: `${averageSessionLength}m`,
      color: 'text-pink-400',
    },
  ];

  return (
    <div className="bg-black/50 rounded-xl p-6 border border-[#78A892]/20">
      <h3 className="text-xl font-bold mb-6 font-mono text-[#78A892]">Focus Statistics</h3>
      
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

      {/* Recent Sessions */}
      <div className="mt-8">
        <h4 className="text-lg font-bold mb-4 font-mono text-[#78A892]">Recent Sessions</h4>
        <div className="space-y-3">
          {sessions.slice(0, 5).map((session, index) => (
            <motion.div
              key={`${session.taskId}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/30 p-3 rounded-lg border border-[#78A892]/10 flex justify-between items-center"
            >
              <div>
                <div className="font-mono text-[#78A892]">{session.taskTitle}</div>
                <div className="text-sm text-[#78A892]/60 font-mono">
                  {new Date(session.date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-[#78A892]/80 font-mono">{session.duration}m</span>
                {session.completed && (
                  <span className="text-green-400">✓</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 