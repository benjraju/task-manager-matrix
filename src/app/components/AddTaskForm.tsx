'use client';

import React, { useState } from 'react';
import { useTask } from '@/lib/contexts/TaskContext';
import { Priority, TaskStatus } from '@/lib/types/task';

export default function AddTaskForm() {
  const { addTask } = useTask();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('urgent-important');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim() || '',
      priority,
      status: 'not_started' as TaskStatus,
      createdAt: new Date(),
      totalTimeSpent: 0,
      isTracking: false,
    };

    addTask(newTask);
    setTitle('');
    setDescription('');
    setPriority('urgent-important');
  };

  const priorityLabels: Record<Priority, string> = {
    'urgent-important': 'Urgent & Important',
    'not-urgent-important': 'Not Urgent & Important',
    'urgent-not-important': 'Urgent & Not Important',
    'not-urgent-not-important': 'Not Urgent & Not Important'
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-[#E6EFE9] mb-1">
          Task Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 bg-[#1a1d1b]/60 text-[#E6EFE9] rounded-lg border border-[#78A892]/20
                   focus:border-[#78A892] focus:ring-2 focus:ring-[#78A892]/20 
                   placeholder-[#E6EFE9]/30 transition-all duration-300"
          placeholder="Enter task title"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-[#E6EFE9] mb-1">
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 bg-[#1a1d1b]/60 text-[#E6EFE9] rounded-lg border border-[#78A892]/20
                   focus:border-[#78A892] focus:ring-2 focus:ring-[#78A892]/20 
                   placeholder-[#E6EFE9]/30 transition-all duration-300"
          placeholder="Enter task description"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-[#E6EFE9] mb-1">
          Priority
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="w-full px-4 py-2 bg-[#1a1d1b]/60 text-[#E6EFE9] rounded-lg border border-[#78A892]/20
                   focus:border-[#78A892] focus:ring-2 focus:ring-[#78A892]/20 
                   transition-all duration-300"
          required
        >
          {Object.entries(priorityLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 bg-[#78A892] text-white rounded-lg font-semibold
                 hover:bg-[#92B4A7] transition-all duration-300 shadow-lg
                 focus:ring-2 focus:ring-[#78A892]/50 focus:ring-offset-2 focus:ring-offset-[#1a1d1b]"
      >
        Add Task
      </button>
    </form>
  );
} 