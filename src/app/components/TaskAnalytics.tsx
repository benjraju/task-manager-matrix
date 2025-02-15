'use client';

import React from 'react';
import { useTask } from '@/lib/contexts/TaskContext';
import { Task } from '@/lib/types/task';
import { motion } from 'framer-motion';

export default function TaskAnalytics() {
  const { tasks } = useTask();

  // Calculate time spent per quadrant
  const quadrantTimes = {
    'urgent-important': calculateQuadrantTime(tasks, 'urgent-important'),
    'not-urgent-important': calculateQuadrantTime(tasks, 'not-urgent-important'),
    'urgent-not-important': calculateQuadrantTime(tasks, 'urgent-not-important'),
    'not-urgent-not-important': calculateQuadrantTime(tasks, 'not-urgent-not-important'),
  };

  // Calculate weekly stats
  const weeklyStats = calculateWeeklyStats(tasks);

  return (
    <div className="p-6 space-y-8 font-mono">
      {/* Quadrant Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <QuadrantCard
          title="Urgent & Important"
          time={quadrantTimes['urgent-important']}
          bgColor="from-[#1E3A8A] to-[#1E40AF]"
          delay={0}
        />
        <QuadrantCard
          title="Not Urgent & Important"
          time={quadrantTimes['not-urgent-important']}
          bgColor="from-[#047857] to-[#065F46]"
          delay={0.1}
        />
        <QuadrantCard
          title="Urgent & Not Important"
          time={quadrantTimes['urgent-not-important']}
          bgColor="from-[#9D174D] to-[#831843]"
          delay={0.2}
        />
        <QuadrantCard
          title="Not Urgent & Not Important"
          time={quadrantTimes['not-urgent-not-important']}
          bgColor="from-[#7C3AED] to-[#6D28D9]"
          delay={0.3}
        />
      </div>

      {/* Weekly Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-black/30 rounded-xl p-6 border border-[#78A892]/20"
      >
        <h3 className="text-xl font-bold mb-6 text-[#78A892]">Weekly Task Completion & Time Spent</h3>
        <div className="h-64 relative">
          <div className="absolute inset-0 flex items-end justify-between">
            {weeklyStats.map((day, index) => (
              <div key={day.name} className="w-1/7 h-full flex flex-col justify-end items-center">
                <div className="w-full px-1">
                  <div
                    className="w-full bg-[#78A892]/20 rounded-t"
                    style={{ height: `${(day.tasksCompleted / 10) * 100}%` }}
                  />
                </div>
                <div className="mt-2 text-sm text-[#78A892]/60">{day.name}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-black/30 p-6 rounded-xl border border-[#78A892]/20"
        >
          <h3 className="text-xl font-bold mb-4 text-[#78A892]">Total Tasks Completed</h3>
          <div className="text-4xl font-bold text-[#78A892]">
            {tasks.filter(task => task.status === 'completed').length}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-black/30 p-6 rounded-xl border border-[#78A892]/20"
        >
          <h3 className="text-xl font-bold mb-4 text-[#78A892]">Average Time per Task</h3>
          <div className="text-4xl font-bold text-[#78A892]">
            {calculateAverageTime(tasks)}m
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function QuadrantCard({ title, time, bgColor, delay }: { title: string; time: string; bgColor: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative overflow-hidden bg-gradient-to-br ${bgColor} rounded-xl p-6`}
    >
      <div className="absolute inset-0 bg-[url('/patterns/circuit-board.svg')] opacity-5" />
      <div className="relative">
        <h3 className="text-lg font-bold mb-2 text-white/90">{title}</h3>
        <div className="text-2xl font-bold text-white">{time}</div>
      </div>
    </motion.div>
  );
}

function calculateQuadrantTime(tasks: Task[], priority: Task['priority']): string {
  const totalMinutes = tasks
    .filter(task => task.priority === priority)
    .reduce((acc, task) => acc + (task.totalTimeSpent || 0), 0);
  
  if (totalMinutes === 0) return '0m';
  if (totalMinutes < 60) return `${totalMinutes}m`;
  return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
}

function calculateAverageTime(tasks: Task[]): number {
  const completedTasks = tasks.filter(task => task.status === 'completed');
  if (completedTasks.length === 0) return 0;
  
  const totalTime = completedTasks.reduce((acc, task) => acc + (task.totalTimeSpent || 0), 0);
  return Math.round(totalTime / completedTasks.length);
}

function calculateWeeklyStats(tasks: Task[]) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    name: day,
    tasksCompleted: Math.floor(Math.random() * 5), // Replace with actual data
    timeSpent: Math.floor(Math.random() * 120), // Replace with actual data
  }));
} 