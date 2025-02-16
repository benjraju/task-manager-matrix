'use client';

import React from 'react';
import { useTaskData } from '@/lib/contexts/TaskDataContext';
import { Task } from '@/lib/types/task';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TaskAnalytics() {
  const { tasks } = useTaskData();

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
  const notStartedTasks = tasks.filter(task => task.status === 'not_started').length;

  // Calculate priority distribution
  const urgentImportant = tasks.filter(task => task.priority === 'urgent-important').length;
  const notUrgentImportant = tasks.filter(task => task.priority === 'not-urgent-important').length;
  const urgentNotImportant = tasks.filter(task => task.priority === 'urgent-not-important').length;
  const notUrgentNotImportant = tasks.filter(task => task.priority === 'not-urgent-not-important').length;

  // Calculate total time spent
  const totalTimeSpent = tasks.reduce((total, task) => total + task.totalTimeSpent, 0);
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const statusData = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [
      {
        data: [completedTasks, inProgressTasks, notStartedTasks],
        backgroundColor: [
          'rgba(120, 168, 146, 0.8)',
          'rgba(92, 139, 117, 0.8)',
          'rgba(64, 110, 88, 0.8)',
        ],
        borderColor: [
          'rgba(120, 168, 146, 1)',
          'rgba(92, 139, 117, 1)',
          'rgba(64, 110, 88, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const priorityData = {
    labels: [
      'Urgent & Important',
      'Not Urgent & Important',
      'Urgent & Not Important',
      'Not Urgent & Not Important',
    ],
    datasets: [
      {
        data: [urgentImportant, notUrgentImportant, urgentNotImportant, notUrgentNotImportant],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#78A892',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-black text-[#78A892] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 font-mono">Task Analytics</h1>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1a1d1b] p-6 rounded-xl border border-[#78A892]/20">
            <h3 className="text-lg font-mono mb-2">Total Tasks</h3>
            <p className="text-3xl font-bold">{totalTasks}</p>
          </div>
          <div className="bg-[#1a1d1b] p-6 rounded-xl border border-[#78A892]/20">
            <h3 className="text-lg font-mono mb-2">Completed</h3>
            <p className="text-3xl font-bold">{completedTasks}</p>
          </div>
          <div className="bg-[#1a1d1b] p-6 rounded-xl border border-[#78A892]/20">
            <h3 className="text-lg font-mono mb-2">In Progress</h3>
            <p className="text-3xl font-bold">{inProgressTasks}</p>
          </div>
          <div className="bg-[#1a1d1b] p-6 rounded-xl border border-[#78A892]/20">
            <h3 className="text-lg font-mono mb-2">Total Time</h3>
            <p className="text-3xl font-bold">{formatTime(totalTimeSpent)}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#1a1d1b] p-6 rounded-xl border border-[#78A892]/20">
            <h3 className="text-xl font-mono mb-6 text-center">Task Status Distribution</h3>
            <div className="w-full max-w-md mx-auto">
              <Pie data={statusData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-[#1a1d1b] p-6 rounded-xl border border-[#78A892]/20">
            <h3 className="text-xl font-mono mb-6 text-center">Priority Distribution</h3>
            <div className="w-full max-w-md mx-auto">
              <Pie data={priorityData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 