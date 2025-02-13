'use client';

import { Task } from '@/lib/types/task';
import TaskCard from './TaskCard';
import { format } from 'date-fns';
import { useTask } from '@/lib/contexts/TaskContext';

interface CompletedTasksProps {
  tasks: Task[];
  onUpdateTask: (updatedTask: Task) => void;
}

export default function CompletedTasks({ tasks, onUpdateTask }: CompletedTasksProps) {
  const { clearCompletedTasks } = useTask();
  const completedTasks = tasks.filter(task => task.status === 'completed' && task.completedAt);

  const moveToInProgress = (task: Task) => {
    onUpdateTask({
      ...task,
      status: 'in_progress',
      completedAt: undefined
    });
  };

  // Group tasks by completion date
  const groupedTasks = completedTasks.reduce((groups, task) => {
    if (!task.completedAt) return groups;
    const date = format(new Date(task.completedAt), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {} as Record<string, Task[]>);

  // Sort dates in reverse chronological order
  const sortedDates = Object.keys(groupedTasks).sort((a, b) => b.localeCompare(a));

  if (completedTasks.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Completed Tasks</h2>
        <button
          onClick={clearCompletedTasks}
          className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
        >
          Clear History
        </button>
      </div>
      <div className="space-y-6">
        {sortedDates.map(date => (
          <div key={date} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
              {format(new Date(date), 'MMMM d, yyyy')}
            </h3>
            <div className="space-y-2">
              {groupedTasks[date].map(task => (
                <div key={task.id} className="group relative">
                  <TaskCard
                    task={task}
                    onUpdateTask={onUpdateTask}
                  />
                  <button
                    onClick={() => moveToInProgress(task)}
                    className="absolute top-2 right-2 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Move to In Progress
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 