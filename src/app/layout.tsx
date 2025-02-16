import './globals.css';
import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { UnifiedTaskProvider } from '@/lib/contexts/UnifiedTaskContext';
import { FocusProvider } from '@/lib/contexts/FocusContext';
import { TaskDataProvider } from '@/lib/contexts/TaskDataContext';
import { TaskTrackingProvider } from '@/lib/contexts/TaskTrackingContext';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';

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
          <TaskDataProvider>
            <TaskTrackingProvider>
              <UnifiedTaskProvider>
                <FocusProvider>
                  {children}
                  <Toaster 
                    position="top-right"
                    toastOptions={{
                      style: {
                        background: '#1a1a1a',
                        color: '#78A892',
                        border: '1px solid rgba(120, 168, 146, 0.2)',
                      },
                    }}
                  />
                </FocusProvider>
              </UnifiedTaskProvider>
            </TaskTrackingProvider>
          </TaskDataProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
