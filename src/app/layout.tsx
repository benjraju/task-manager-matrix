import './globals.css';
import type { Metadata, Viewport } from 'next';
import { TaskProvider } from '@/lib/contexts/TaskContext';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { FocusProvider } from '@/lib/contexts/FocusContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Matrix Task Manager',
  description: 'A Matrix-themed task management system',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
            <FocusProvider>
              {children}
            </FocusProvider>
          </TaskProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
