'use client';

import { useState } from 'react';
import { Priority, TaskStatus } from '@/lib/types/task';
import { useTaskData } from '@/lib/contexts/TaskDataContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { TASK_PRIORITIES, PRIORITY_LABELS } from '@/lib/constants/taskConstants';

export default function AddTaskForm() {
  const { addTask } = useTaskData();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('urgent-important');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && user) {
      addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        status: 'not_started' as TaskStatus,
        totalTimeSpent: 0,
        isTracking: false,
        startedAt: undefined,
        completedAt: undefined,
        userId: user.uid,
      });
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
          className="w-full p-4 text-left text-[#78A892]/60 border-2 border-dashed border-[#78A892]/20 
                   rounded-lg hover:border-[#78A892]/40 transition-colors font-mono"
        >
          + Add new task...
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-[#1a1d1b] rounded-xl border border-[#78A892]/20 p-6">
          <div className="mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full p-2 bg-black/50 border border-[#78A892]/20 rounded-lg text-[#78A892] 
                       placeholder-[#78A892]/40 focus:border-[#78A892] outline-none font-mono"
              autoFocus
            />
          </div>
          
          <div className="mb-4">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full p-2 bg-black/50 border border-[#78A892]/20 rounded-lg text-[#78A892] 
                       placeholder-[#78A892]/40 focus:border-[#78A892] outline-none resize-none h-24 font-mono"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#78A892]/80 mb-2 font-mono">
              Priority (Eisenhower Matrix)
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full p-2 bg-black/50 border border-[#78A892]/20 rounded-lg text-[#78A892] 
                       focus:border-[#78A892] outline-none font-mono"
            >
              {Object.entries(TASK_PRIORITIES).map(([key, value]) => (
                <option key={key} value={value}>
                  {PRIORITY_LABELS[value]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-6 py-3 text-[#78A892] hover:bg-[#78A892]/10 rounded-lg transition-colors font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#78A892] text-black rounded-lg hover:bg-[#5C8B75] transition-colors font-mono"
            >
              Add Task
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 