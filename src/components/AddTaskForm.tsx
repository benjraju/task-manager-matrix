'use client';

import { useState } from 'react';
import { Priority } from '@/lib/types/task';
import { useTask } from '@/lib/contexts/TaskContext';

export default function AddTaskForm() {
  const { addTask } = useTask();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('urgent-important');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addTask(title.trim(), description.trim() || undefined, priority);
      setTitle('');
      setDescription('');
      setIsOpen(false);
    }
  };

  return (
    <div className="mb-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full p-4 text-left text-gray-600 dark:text-gray-300 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
        >
          + Add new task...
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:border-blue-500 dark:focus:border-blue-400 outline-none"
              autoFocus
            />
          </div>
          
          <div className="mb-4">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:border-blue-500 dark:focus:border-blue-400 outline-none resize-none h-24"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority (Eisenhower Matrix)
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:border-blue-500 dark:focus:border-blue-400 outline-none"
            >
              <option value="urgent-important">Urgent & Important (Do First)</option>
              <option value="not-urgent-important">Not Urgent & Important (Schedule)</option>
              <option value="urgent-not-important">Urgent & Not Important (Delegate)</option>
              <option value="not-urgent-not-important">Not Urgent & Not Important (Don&apos;t Do)</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Add Task
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 