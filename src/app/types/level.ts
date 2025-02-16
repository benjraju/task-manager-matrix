export interface Level {
  number: number;
  title: string;
  requiredXP: number;
  unlockedFeatures?: string[];
}

export interface UserProgress {
  currentLevel: number;
  currentXP: number;
  totalTasksCompleted: number;
  totalFocusMinutes: number;
  streak: number;
}

export const LEVELS: Level[] = [
  {
    number: 1,
    title: "INITIATE",
    requiredXP: 0,
    unlockedFeatures: ["Basic Training"]
  },
  {
    number: 2,
    title: "OPERATOR",
    requiredXP: 100,
    unlockedFeatures: ["Task Insights"]
  },
  {
    number: 3,
    title: "AGENT",
    requiredXP: 300,
    unlockedFeatures: ["Advanced Training"]
  },
  {
    number: 4,
    title: "THE ONE",
    requiredXP: 1000,
    unlockedFeatures: ["Matrix Mastery"]
  }
]; 