'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUnifiedTask } from './UnifiedTaskContext';
import { Task } from '@/lib/types/task';

type TimerMode = 'focus' | 'short_break' | 'long_break';

export interface FocusSession {
  id: string;
  taskId: string;
  taskTitle: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  completed: boolean;
  interruptions: number;
  notes?: string;
  mood?: 'productive' | 'neutral' | 'distracted';
  actualTimeSpent: number; // in minutes
}

interface FocusSettings {
  focusDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  autoStartBreaks: boolean;
  autoStartSessions: boolean;
}

interface FocusStats {
  totalSessions: number;
  totalFocusTime: number;
  completedTasks: number;
  currentStreak: number;
  longestStreak: number;
  averageSessionLength: number;
  mostProductiveTime: string;
  weeklyProgress: {
    date: string;
    sessions: number;
    focusTime: number;
  }[];
}

interface FocusContextType {
  // Session Management
  currentSession: FocusSession | null;
  sessions: FocusSession[];
  startSession: (task: Task) => void;
  endSession: (completed: boolean) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  addSessionNote: (note: string) => void;
  setSessionMood: (mood: FocusSession['mood']) => void;
  
  // Timer Management
  isActive: boolean;
  currentMode: TimerMode;
  timeRemaining: number;
  sessionsCompleted: number;
  skipBreak: () => void;
  resetTimer: () => void;
  
  // Settings
  settings: FocusSettings;
  updateSettings: (newSettings: Partial<FocusSettings>) => void;
  
  // Stats and Progress
  stats: FocusStats;
  todaysSessions: FocusSession[];
  currentStreak: number;
  
  // Interruption Handling
  recordInterruption: (reason?: string) => void;
  distractionList: string[];
  addDistraction: (distraction: string) => void;
}

const defaultSettings: FocusSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
  autoStartBreaks: false,
  autoStartSessions: false,
};

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export function FocusProvider({ children }: { children: React.ReactNode }) {
  // State Management
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [settings, setSettings] = useState<FocusSettings>(defaultSettings);
  const [isActive, setIsActive] = useState(false);
  const [currentMode, setCurrentMode] = useState<TimerMode>('focus');
  const [timeRemaining, setTimeRemaining] = useState(defaultSettings.focusDuration * 60);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [distractionList, setDistractionList] = useState<string[]>([]);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  
  const { updateTask } = useUnifiedTask();

  // Load saved data from localStorage with proper date parsing
  useEffect(() => {
    const savedSettings = localStorage.getItem('focusSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    const savedSessions = localStorage.getItem('focusSessions');
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions);
        // Convert date strings back to Date objects and ensure all required fields exist
        const sessionsWithDates = parsedSessions.map((session: FocusSession) => ({
          ...session,
          startTime: session.startTime ? new Date(session.startTime) : new Date(),
          endTime: session.endTime ? new Date(session.endTime) : undefined,
          actualTimeSpent: session.actualTimeSpent || 0,
          duration: session.duration || 0,
          completed: Boolean(session.completed),
          interruptions: session.interruptions || 0
        }));
        setSessions(sessionsWithDates);
      } catch (error) {
        console.error('Error parsing saved sessions:', error);
        setSessions([]);
      }
    }
  }, []);

  // Save data to localStorage with proper date handling
  useEffect(() => {
    localStorage.setItem('focusSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    try {
      // Ensure dates are properly formatted before saving
      const sessionsToSave = sessions.map(session => ({
        ...session,
        startTime: session.startTime.toISOString(),
        endTime: session.endTime ? session.endTime.toISOString() : undefined
      }));
      localStorage.setItem('focusSessions', JSON.stringify(sessionsToSave));
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  }, [sessions]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  // Timer logic
  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setTimerInterval(interval);
      
      return () => {
        clearInterval(interval);
        setTimerInterval(null);
      };
    } else if (!isActive && timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  }, [isActive, timeRemaining]);

  const handleTimerComplete = () => {
    // Clear any existing timer
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    if (currentMode === 'focus') {
      // Handle focus session completion
      if (currentSession) {
        const now = new Date();
        const completedSession = {
          ...currentSession,
          endTime: now,
          completed: true,
          duration: settings.focusDuration,
          actualTimeSpent: settings.focusDuration // Full duration since timer completed
        };
        
        setSessions(prev => [completedSession, ...prev]);
        
        // Update task
        updateTask(completedSession.taskId, {
          status: 'completed',
          completedAt: now,
          isTracking: false,
          totalTimeSpent: (currentSession.actualTimeSpent || 0) + settings.focusDuration,
          lastUpdated: now.toISOString()
        });
        
        setCurrentSession(null);
      }

      setSessionsCompleted(prev => prev + 1);
      
      // Determine next break type
      if (sessionsCompleted + 1 >= settings.sessionsUntilLongBreak) {
        setCurrentMode('long_break');
        setTimeRemaining(settings.longBreakDuration * 60);
        setSessionsCompleted(0);
      } else {
        setCurrentMode('short_break');
        setTimeRemaining(settings.shortBreakDuration * 60);
      }
    } else {
      // Handle break completion
      setCurrentMode('focus');
      setTimeRemaining(settings.focusDuration * 60);
    }

    // Handle auto-start settings
    setIsActive(
      (currentMode !== 'focus' && settings.autoStartSessions) ||
      (currentMode === 'focus' && settings.autoStartBreaks)
    );
  };

  // Helper functions
  const calculateStreak = () => {
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let currentDate = today;
    
    for (const session of [...sessions].reverse()) {
      const sessionDate = session.startTime.toISOString().split('T')[0];
      if (sessionDate === currentDate && session.completed) {
        streak++;
        currentDate = new Date(new Date(sessionDate).getTime() - 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateLongestStreak = () => {
    let currentStreak = 0;
    let longestStreak = 0;
    let lastDate: string | null = null;
    
    [...sessions]
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      .forEach(session => {
        const sessionDate = session.startTime.toISOString().split('T')[0];
        
        if (!lastDate) {
          currentStreak = 1;
        } else {
          const dayDiff = Math.floor(
            (new Date(sessionDate).getTime() - new Date(lastDate).getTime()) / (24 * 60 * 60 * 1000)
          );
          
          if (dayDiff === 1 && session.completed) {
            currentStreak++;
          } else {
            currentStreak = 1;
          }
        }
        
        longestStreak = Math.max(longestStreak, currentStreak);
        lastDate = sessionDate;
      });
    
    return longestStreak;
  };

  const calculateMostProductiveTime = () => {
    const hourCounts = new Array(24).fill(0);
    
    sessions.forEach(session => {
      const hour = new Date(session.startTime).getHours();
      hourCounts[hour]++;
    });
    
    const maxHour = hourCounts.indexOf(Math.max(...hourCounts));
    return `${maxHour}:00 - ${maxHour + 1}:00`;
  };

  // Calculate stats with proper time handling
  const stats: FocusStats = React.useMemo(() => {
    const completed = sessions.filter(s => s.completed);
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const weeklyProgress = sessions
      .filter(s => {
        const sessionDate = new Date(s.startTime).toISOString().split('T')[0];
        return sessionDate >= weekAgo;
      })
      .reduce((acc, session) => {
        const date = new Date(session.startTime).toISOString().split('T')[0];
        const existing = acc.find(d => d.date === date);
        if (existing) {
          existing.sessions += 1;
          existing.focusTime += session.actualTimeSpent;
        } else {
          acc.push({ 
            date, 
            sessions: 1, 
            focusTime: session.actualTimeSpent 
          });
        }
        return acc;
      }, [] as FocusStats['weeklyProgress']);

    return {
      totalSessions: sessions.length,
      totalFocusTime: sessions.reduce((acc, s) => acc + (s.actualTimeSpent || 0), 0),
      completedTasks: completed.length,
      currentStreak: calculateStreak(),
      longestStreak: calculateLongestStreak(),
      averageSessionLength: completed.length > 0 
        ? completed.reduce((acc, s) => acc + (s.actualTimeSpent || 0), 0) / completed.length 
        : 0,
      mostProductiveTime: calculateMostProductiveTime(),
      weeklyProgress,
    };
  }, [sessions]);

  const startSession = (task: Task) => {
    // Clear any existing timer
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    const newSession: FocusSession = {
      id: Math.random().toString(36).substr(2, 9),
      taskId: task.id,
      taskTitle: task.title,
      startTime: new Date(),
      duration: settings.focusDuration,
      completed: false,
      interruptions: 0,
      actualTimeSpent: 0,
    };
    
    setCurrentSession(newSession);
    setCurrentMode('focus');
    setTimeRemaining(settings.focusDuration * 60);
    setIsActive(true);

    // Update task in UnifiedTask context
    updateTask(task.id, {
      startedAt: new Date(),
      status: 'in_progress',
      isTracking: true
    });
  };

  const endSession = async (completed: boolean) => {
    // Clear timer
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    if (currentSession) {
      const now = new Date();
      // Calculate actual time spent in minutes, preserving decimal points for seconds
      const timeSpentInMinutes = (settings.focusDuration * 60 - timeRemaining) / 60;
      
      const endedSession = {
        ...currentSession,
        endTime: now,
        completed,
        duration: settings.focusDuration,
        actualTimeSpent: timeSpentInMinutes
      };
      
      setSessions(prev => [endedSession, ...prev]);
      
      // Update task with accumulated time
      await updateTask(endedSession.taskId, {
        status: completed ? 'completed' : 'in_progress',
        completedAt: completed ? now : undefined,
        isTracking: false,
        totalTimeSpent: (currentSession.actualTimeSpent || 0) + timeSpentInMinutes,
        lastUpdated: now.toISOString()
      });

      setCurrentSession(null);
      setIsActive(false);
      
      // Reset timer state
      setCurrentMode('focus');
      setTimeRemaining(settings.focusDuration * 60);
    }
  };

  const pauseSession = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setIsActive(false);
  };

  const resumeSession = () => {
    setIsActive(true);
  };

  const skipBreak = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setCurrentMode('focus');
    setTimeRemaining(settings.focusDuration * 60);
    setIsActive(settings.autoStartSessions);
  };

  const resetTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setTimeRemaining(
      currentMode === 'focus'
        ? settings.focusDuration * 60
        : currentMode === 'short_break'
        ? settings.shortBreakDuration * 60
        : settings.longBreakDuration * 60
    );
    setIsActive(false);
  };

  const value: FocusContextType = {
    // Session Management
    currentSession,
    sessions,
    startSession,
    endSession,
    pauseSession,
    resumeSession,
    addSessionNote: (note) => {
      if (currentSession) {
        setCurrentSession(prev => prev ? { ...prev, notes: note } : null);
      }
    },
    setSessionMood: (mood) => {
      if (currentSession) {
        setCurrentSession(prev => prev ? { ...prev, mood } : null);
      }
    },
    
    // Timer Management
    isActive,
    currentMode,
    timeRemaining,
    sessionsCompleted,
    skipBreak,
    resetTimer,
    
    // Settings
    settings,
    updateSettings: (newSettings) => {
      setSettings(prev => ({ ...prev, ...newSettings }));
    },
    
    // Stats and Progress
    stats,
    todaysSessions: sessions.filter(
      s => s.startTime.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
    ),
    currentStreak: stats.currentStreak,
    
    // Interruption Handling
    recordInterruption: (reason) => {
      if (currentSession) {
        setCurrentSession(prev => 
          prev ? { ...prev, interruptions: prev.interruptions + 1 } : null
        );
        if (reason) {
          setDistractionList(prev => [...prev, reason]);
        }
      }
    },
    distractionList,
    addDistraction: (distraction) => {
      setDistractionList(prev => [...prev, distraction]);
    },
  };

  return (
    <FocusContext.Provider value={value}>
      {children}
    </FocusContext.Provider>
  );
}

export function useFocus() {
  const context = useContext(FocusContext);
  if (context === undefined) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return context;
} 