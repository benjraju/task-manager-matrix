'use client';

import { useState } from 'react';
import { Task } from '@/lib/types/task';
import { getEisenhowerQuadrant } from '@/lib/utils/taskUtils';
import { formatTime } from '@/lib/utils/timeUtils';
import { PlayIcon, PauseIcon, CheckIcon, PencilIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onUpdateTask: (updatedTask: Task) => void;
}

export default function TaskCard({ task, onUpdateTask }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const toggleTimeTracking = () => {
    onUpdateTask({
      ...task,
      isTracking: !task.isTracking,
      startedAt: !task.isTracking ? new Date() : task.startedAt,
      status: task.status === 'not_started' ? 'in_progress' : task.status,
    });
  };

  const completeTask = () => {
    let finalTime = task.totalTimeSpent;
    if (task.isTracking && task.startedAt) {
      const now = new Date();
      const additionalTime = Math.floor((now.getTime() - task.startedAt.getTime()) / 1000);
      finalTime += additionalTime;
    }

    onUpdateTask({
      ...task,
      status: 'completed',
      isTracking: false,
      completedAt: new Date(),
      totalTimeSpent: finalTime,
    });
  };

  const handleTitleSubmit = () => {
    if (title.trim() !== '') {
      onUpdateTask({
        ...task,
        title,
      });
    } else {
      setTitle(task.title);
    }
    setIsEditing(false);
  };

  const handleDescriptionSubmit = () => {
    onUpdateTask({
      ...task,
      description: description.trim() || undefined,
    });
    setIsEditingDescription(false);
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 mb-3 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none px-1 py-0.5"
              autoFocus
            />
          ) : (
            <h3
              onClick={() => setIsEditing(true)}
              className="text-lg font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:text-blue-500"
            >
              {task.title}
            </h3>
          )}
          <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span className={`
              px-2 py-1 rounded-full text-xs
              ${task.priority === 'urgent-important' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
              ${task.priority === 'not-urgent-important' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
              ${task.priority === 'urgent-not-important' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : ''}
              ${task.priority === 'not-urgent-not-important' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
            `}>
              {getEisenhowerQuadrant(task.priority)}
            </span>
            <span>•</span>
            <span>{formatTime(task.totalTimeSpent)}</span>
            {task.status === 'completed' && task.completedAt && (
              <>
                <span>•</span>
                <span>Completed {format(task.completedAt, 'MMM d, h:mm a')}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {task.status !== 'completed' && (
            <>
              <button
                onClick={toggleTimeTracking}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                title={task.isTracking ? 'Pause' : 'Start'}
              >
                {task.isTracking ? (
                  <PauseIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <PlayIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
              <button
                onClick={completeTask}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Complete"
              >
                <CheckIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="mt-2 relative">
        {isEditingDescription ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionSubmit}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleDescriptionSubmit()}
            className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:border-blue-500 outline-none px-3 py-2 min-h-[80px] resize-none"
            placeholder="Add a description..."
            autoFocus
          />
        ) : (
          <div
            className="group/description cursor-pointer"
            onClick={() => setIsEditingDescription(true)}
          >
            {task.description ? (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {task.description}
              </p>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                Add a description...
              </p>
            )}
            <PencilIcon className="w-4 h-4 text-gray-400 absolute top-0 right-0 opacity-0 group-hover/description:opacity-100 transition-opacity" />
          </div>
        )}
      </div>
    </div>
  );
} 