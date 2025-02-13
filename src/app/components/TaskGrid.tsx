'use client';

import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useTask } from '@/lib/contexts/TaskContext';
import { Priority, Task } from '@/lib/types/task';
import TaskCard from '@/app/components/TaskCard';

const quadrants: { title: string; priority: Priority; description: string }[] = [
  { 
    title: 'Urgent & Important', 
    priority: 'urgent-important',
    description: 'Do these tasks first'
  },
  { 
    title: 'Not Urgent & Important', 
    priority: 'not-urgent-important',
    description: 'Schedule these tasks'
  },
  { 
    title: 'Urgent & Not Important', 
    priority: 'urgent-not-important',
    description: 'Delegate these tasks if possible'
  },
  { 
    title: 'Not Urgent & Not Important', 
    priority: 'not-urgent-not-important',
    description: 'Eliminate these tasks if possible'
  },
];

export default function TaskGrid() {
  const { getTasksByPriority, moveTask } = useTask();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceId = result.draggableId;
    const destinationPriority = result.destination.droppableId as Priority;

    moveTask(sourceId, destinationPriority);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Eisenhower Matrix
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {quadrants.map(({ title, priority, description }) => (
            <div
              key={priority}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {description}
                </p>
              </div>
              <Droppable droppableId={priority}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 min-h-[200px] rounded-lg p-4 ${
                      snapshot.isDraggingOver
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'bg-gray-50 dark:bg-gray-900/50'
                    }`}
                  >
                    {getTasksByPriority(priority).map((task: Task, index: number) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${
                              snapshot.isDragging ? 'ring-2 ring-blue-500' : ''
                            }`}
                          >
                            <TaskCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
} 