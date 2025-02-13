'use client';

import { useState, useEffect } from 'react';

interface UseTimerProps {
  initialTime: number;
  isRunning: boolean;
  onTick?: (currentTime: number) => void;
}

export function useTimer({ initialTime, isRunning, onTick }: UseTimerProps) {
  const [elapsedTime, setElapsedTime] = useState(initialTime);

  useEffect(() => {
    setElapsedTime(initialTime);
  }, [initialTime]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1;
          onTick?.(newTime);
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, onTick]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  return {
    elapsedTime,
    formattedTime: formatTime(elapsedTime)
  };
} 