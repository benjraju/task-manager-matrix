'use client';

import React, { useState } from 'react';
import { useTask } from '@/lib/contexts/TaskContext';
import { Priority } from '@/lib/types/task';

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
      description: description.trim() || undefined,
      priority,
      status: 'not_started' as const,
      createdAt: new Date(),
      totalTimeSpent: 0,
      isTracking: false,
    };

    addTask(newTask);
    setTitle('');
    setDescription('');
    setPriority('urgent-important');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Task Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter task title"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter task description"
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="urgent-important">Urgent & Important</option>
            <option value="not-urgent-important">Not Urgent & Important</option>
            <option value="urgent-not-important">Urgent & Not Important</option>
            <option value="not-urgent-not-important">Not Urgent & Not Important</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Add Task
        </button>
      </div>
    </form>
  );
} 