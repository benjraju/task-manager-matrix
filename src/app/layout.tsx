import './globals.css';
import type { Metadata } from 'next';
import { TaskProvider } from '@/lib/contexts/TaskContext';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Task Manager - Eisenhower Matrix',
  description: 'A task management app with time tracking and Eisenhower matrix prioritization',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <TaskProvider>
            {children}
          </TaskProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
