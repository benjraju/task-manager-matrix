'use client';

import { Task } from '@/lib/types/task';
import TaskCard from './TaskCard';

interface EisenhowerMatrixProps {
  tasks: Task[];
  onUpdateTask: (updatedTask: Task) => void;
}

export default function EisenhowerMatrix({ tasks, onUpdateTask }: EisenhowerMatrixProps) {
  const getTasksByPriority = (priority: Task['priority']) => {
    return tasks.filter(task => 
      task.priority === priority && 
      task.status !== 'completed'
    );
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Urgent & Important */}
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 text-red-800 dark:text-red-200">Do First</h2>
        <div className="space-y-2">
          {getTasksByPriority('urgent-important').map(task => (
            <TaskCard key={task.id} task={task} onUpdateTask={onUpdateTask} />
          ))}
        </div>
      </div>

      {/* Not Urgent & Important */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 text-yellow-800 dark:text-yellow-200">Schedule</h2>
        <div className="space-y-2">
          {getTasksByPriority('not-urgent-important').map(task => (
            <TaskCard key={task.id} task={task} onUpdateTask={onUpdateTask} />
          ))}
        </div>
      </div>

      {/* Urgent & Not Important */}
      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 text-orange-800 dark:text-orange-200">Delegate</h2>
        <div className="space-y-2">
          {getTasksByPriority('urgent-not-important').map(task => (
            <TaskCard key={task.id} task={task} onUpdateTask={onUpdateTask} />
          ))}
        </div>
      </div>

      {/* Not Urgent & Not Important */}
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 text-green-800 dark:text-green-200">Don't Do</h2>
        <div className="space-y-2">
          {getTasksByPriority('not-urgent-not-important').map(task => (
            <TaskCard key={task.id} task={task} onUpdateTask={onUpdateTask} />
          ))}
        </div>
      </div>
    </div>
  );
} 