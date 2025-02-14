'use client';

import { useEffect, useMemo } from 'react';
import { useTask } from '@/lib/contexts/TaskContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const priorityColors = {
  'urgent-important': {
    bg: 'from-[#1E3A8A] to-[#1E40AF]',
    text: 'text-blue-300',
    chart: 'rgba(30, 58, 138, 0.8)'
  },
  'not-urgent-important': {
    bg: 'from-[#047857] to-[#065F46]',
    text: 'text-emerald-300',
    chart: 'rgba(4, 120, 87, 0.8)'
  },
  'urgent-not-important': {
    bg: 'from-[#9D174D] to-[#831843]',
    text: 'text-pink-300',
    chart: 'rgba(157, 23, 77, 0.8)'
  },
  'not-urgent-not-important': {
    bg: 'from-[#7C3AED] to-[#6D28D9]',
    text: 'text-purple-300',
    chart: 'rgba(124, 58, 237, 0.8)'
  }
};

const priorityLabels = {
  'urgent-important': 'Urgent & Important',
  'not-urgent-important': 'Not Urgent & Important',
  'urgent-not-important': 'Urgent & Not Important',
  'not-urgent-not-important': 'Not Urgent & Not Important'
};

export default function TaskAnalytics() {
  const { tasks } = useTask();

  // Calculate weekly stats
  const weeklyStats = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const completedTasks = tasks.filter(task => 
      task.status === 'completed' && 
      task.completedAt && 
      new Date(task.completedAt) >= oneWeekAgo
    );

    // Initialize category times with all priority types
    const categoryTimes = Object.keys(priorityLabels).reduce((acc, priority) => {
      acc[priority] = 0;
      return acc;
    }, {} as Record<string, number>);

    const dailyCompletions = Array(7).fill(0);
    const dailyTimeSpent = Array(7).fill(0);

    completedTasks.forEach(task => {
      // Add to category times using totalTimeSpent
      categoryTimes[task.priority] += task.totalTimeSpent || 0;

      // Add to daily completions and time spent
      if (task.completedAt) {
        const completedDate = new Date(task.completedAt);
        const dayIndex = 6 - Math.floor((now.getTime() - completedDate.getTime()) / (24 * 60 * 60 * 1000));
        if (dayIndex >= 0 && dayIndex < 7) {
          dailyCompletions[dayIndex]++;
          dailyTimeSpent[dayIndex] += task.totalTimeSpent || 0;
        }
      }
    });

    return {
      categoryTimes,
      dailyCompletions,
      dailyTimeSpent,
      totalCompleted: completedTasks.length,
      averageTimePerTask: completedTasks.length > 0 
        ? completedTasks.reduce((acc, task) => acc + (task.totalTimeSpent || 0), 0) / completedTasks.length 
        : 0
    };
  }, [tasks]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m`;
    }
    return '0m';
  };

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: weeklyStats.dailyCompletions,
        backgroundColor: 'rgba(120, 168, 146, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderRadius: 4,
        order: 1
      },
      {
        label: 'Time Spent',
        data: weeklyStats.dailyTimeSpent.map(seconds => Math.round(seconds / 60)), // Convert to minutes
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderRadius: 4,
        type: 'bar' as const,
        yAxisID: 'y1',
        order: 2
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#E6EFE9',
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      title: {
        display: true,
        text: 'Weekly Task Completion & Time Spent',
        color: '#E6EFE9',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        backgroundColor: '#1E293B',
        titleColor: '#E6EFE9',
        bodyColor: '#E6EFE9',
        borderColor: 'rgba(120, 168, 146, 0.2)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (label === 'Time Spent') {
              if (value >= 60) {
                const hours = Math.floor(value / 60);
                const minutes = value % 60;
                return `${label}: ${hours}h ${minutes}m`;
              }
              return `${label}: ${value}m`;
            }
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Tasks Completed',
          color: '#E6EFE9'
        },
        ticks: {
          stepSize: 1,
          color: '#E6EFE9',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        }
      },
      y1: {
        beginAtZero: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Time Spent (minutes)',
          color: '#E6EFE9'
        },
        ticks: {
          color: '#E6EFE9',
          callback: function(value: any) {
            if (value >= 60) {
              const hours = Math.floor(value / 60);
              const minutes = value % 60;
              return `${hours}h ${minutes}m`;
            }
            return `${value}m`;
          }
        },
        grid: {
          display: false,
        }
      },
      x: {
        ticks: {
          color: '#E6EFE9',
        },
        grid: {
          display: false,
        }
      }
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(weeklyStats.categoryTimes).map(([priority, time]) => (
          <div 
            key={priority}
            className={`relative overflow-hidden bg-gradient-to-br ${priorityColors[priority as keyof typeof priorityColors].bg} 
                       rounded-xl p-6 shadow-lg border border-white/10 hover:border-white/20 transition-colors`}
          >
            <div className="absolute inset-0 bg-[url('/patterns/circuit-board.svg')] opacity-5" />
            <div className="relative">
              <h3 className={`text-sm font-medium ${priorityColors[priority as keyof typeof priorityColors].text} mb-2`}>
                {priorityLabels[priority as keyof typeof priorityLabels]}
              </h3>
              <p className="text-2xl font-bold text-white">
                {formatTime(time)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#1E293B]/40 backdrop-blur-sm rounded-xl border border-[#78A892]/20 p-6 shadow-xl">
        <Bar data={chartData} options={chartOptions} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1E293B]/40 backdrop-blur-sm rounded-xl border border-[#78A892]/20 p-6 shadow-xl">
          <h3 className="text-sm font-medium text-[#E6EFE9]/80 mb-2">Total Tasks Completed</h3>
          <p className="text-3xl font-bold text-white">{weeklyStats.totalCompleted}</p>
        </div>
        <div className="bg-[#1E293B]/40 backdrop-blur-sm rounded-xl border border-[#78A892]/20 p-6 shadow-xl">
          <h3 className="text-sm font-medium text-[#E6EFE9]/80 mb-2">Average Time per Task</h3>
          <p className="text-3xl font-bold text-white">
            {formatTime(weeklyStats.averageTimePerTask)}
          </p>
        </div>
      </div>
    </div>
  );
} 