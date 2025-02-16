'use client';

import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useTaskData } from '@/lib/contexts/TaskDataContext';
import { Priority, Task } from '@/lib/types/task';
import TaskCard from '@/app/components/TaskCard';
import TaskItem from '@/app/components/TaskItem';

const priorityLabels: Record<Priority, { title: string; description: string }> = {
  'urgent-important': {
    title: 'Urgent & Important',
    description: 'Do these tasks first'
  },
  'not-urgent-important': {
    title: 'Not Urgent & Important',
    description: 'Schedule these tasks'
  },
  'urgent-not-important': {
    title: 'Urgent & Not Important',
    description: 'Delegate these tasks if possible'
  },
  'not-urgent-not-important': {
    title: 'Not Urgent & Not Important',
    description: 'Eliminate these tasks if possible'
  }
};

export default function TaskGrid() {
  const { tasks } = useTaskData();

  // Filter tasks by their quadrant
  const urgentImportant = tasks.filter(task => 
    task.priority === 'urgent-important' &&
    task.status !== 'completed'
  );
  const notUrgentImportant = tasks.filter(task => 
    task.priority === 'not-urgent-important' &&
    task.status !== 'completed'
  );
  const urgentNotImportant = tasks.filter(task => 
    task.priority === 'urgent-not-important' &&
    task.status !== 'completed'
  );
  const notUrgentNotImportant = tasks.filter(task => 
    task.priority === 'not-urgent-not-important' &&
    task.status !== 'completed'
  );

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-white mb-4 sm:mb-6">Eisenhower Matrix</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Urgent & Important */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="absolute inset-0 bg-[url('/patterns/circuit-board.svg')] opacity-5" />
          <div className="relative">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-blue-300">{priorityLabels['urgent-important'].title}</h3>
              <p className="text-sm text-blue-200/80">{priorityLabels['urgent-important'].description}</p>
            </div>
            <div className="space-y-4">
              {urgentImportant.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
              {urgentImportant.length === 0 && (
                <p className="text-blue-200/60 text-sm">No tasks in this quadrant</p>
              )}
            </div>
          </div>
        </div>

        {/* Not Urgent & Important */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#047857] to-[#065F46] rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="absolute inset-0 bg-[url('/patterns/circuit-board.svg')] opacity-5" />
          <div className="relative">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-emerald-300">{priorityLabels['not-urgent-important'].title}</h3>
              <p className="text-sm text-emerald-200/80">{priorityLabels['not-urgent-important'].description}</p>
            </div>
            <div className="space-y-4">
              {notUrgentImportant.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
              {notUrgentImportant.length === 0 && (
                <p className="text-emerald-200/60 text-sm">No tasks in this quadrant</p>
              )}
            </div>
          </div>
        </div>

        {/* Urgent & Not Important */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#9D174D] to-[#831843] rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="absolute inset-0 bg-[url('/patterns/circuit-board.svg')] opacity-5" />
          <div className="relative">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-pink-300">{priorityLabels['urgent-not-important'].title}</h3>
              <p className="text-sm text-pink-200/80">{priorityLabels['urgent-not-important'].description}</p>
            </div>
            <div className="space-y-4">
              {urgentNotImportant.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
              {urgentNotImportant.length === 0 && (
                <p className="text-pink-200/60 text-sm">No tasks in this quadrant</p>
              )}
            </div>
          </div>
        </div>

        {/* Not Urgent & Not Important */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="absolute inset-0 bg-[url('/patterns/circuit-board.svg')] opacity-5" />
          <div className="relative">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-purple-300">{priorityLabels['not-urgent-not-important'].title}</h3>
              <p className="text-sm text-purple-200/80">{priorityLabels['not-urgent-not-important'].description}</p>
            </div>
            <div className="space-y-4">
              {notUrgentNotImportant.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
              {notUrgentNotImportant.length === 0 && (
                <p className="text-purple-200/60 text-sm">No tasks in this quadrant</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 