'use client';

import React from 'react';
import { Task } from '@/lib/types/task';
import { useTaskData } from '@/lib/contexts/TaskDataContext';
import { useTaskTracking } from '@/lib/contexts/TaskTrackingContext';
import { PRIORITY_COLORS } from '@/lib/constants/taskConstants';
import { formatTaskDuration } from '@/lib/utils/taskUtils';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { updateTask, deleteTask } = useTaskData();
  const { startTracking, stopTracking, getTrackedTime } = useTaskTracking();

  const handleToggleTracking = () => {
    if (task.isTracking) {
      stopTracking(task.id);
    } else {
      startTracking(task);
    }
  };

  const handleStatusChange = (newStatus: Task['status']) => {
    updateTask(task.id, { status: newStatus });
  };

  const priorityColors = PRIORITY_COLORS[task.priority];

  return (
    <div className={`${priorityColors.bg} ${priorityColors.darkBg} p-4 rounded-lg shadow-sm`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className={`${priorityColors.text} ${priorityColors.darkText} font-semibold`}>
          {task.title}
        </h3>
        <button
          onClick={() => deleteTask(task.id)}
          className="text-gray-500 hover:text-red-500"
        >
          ×
        </button>
      </div>
      {task.description && (
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
          {task.description}
        </p>
      )}
      <div className="flex justify-between items-center mt-2">
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value as Task['status'])}
          className="text-sm bg-transparent border rounded px-2 py-1"
        >
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {formatTaskDuration(getTrackedTime(task))}
          </span>
          <button
            onClick={handleToggleTracking}
            className={`px-2 py-1 text-sm rounded ${
              task.isTracking
                ? 'bg-red-500 text-white'
                : 'bg-green-500 text-white'
            }`}
          >
            {task.isTracking ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>
    </div>
  );
} 