import './globals.css';
import type { Metadata } from 'next';
import { TaskProvider } from '@/lib/contexts/TaskContext';

export const metadata: Metadata = {
  title: 'Task Manager - Eisenhower Matrix',
  description: 'A task management app with time tracking and Eisenhower matrix prioritization',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TaskProvider>
          {children}
        </TaskProvider>
      </body>
    </html>
  );
}
