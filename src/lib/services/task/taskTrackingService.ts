import { Task } from '@/lib/types/task';
import { TaskService } from './taskService';

export class TaskTrackingService {
  private taskService: TaskService;
  private trackingIntervals: Map<string, NodeJS.Timeout>;
  private lastUpdateTimes: Map<string, number>;
  private accumulatedTime: Map<string, number>;

  constructor() {
    this.taskService = new TaskService();
    this.trackingIntervals = new Map();
    this.lastUpdateTimes = new Map();
    this.accumulatedTime = new Map();
  }

  async startTracking(task: Task): Promise<void> {
    if (this.trackingIntervals.has(task.id) || task.status === 'completed') {
      return; // Already tracking or task is completed
    }

    try {
      // First update the task to set isTracking to true
      await this.taskService.updateTask(task.id, {
        isTracking: true,
        startedAt: new Date(),
        status: task.status === 'not_started' ? 'in_progress' : task.status
      });

      this.lastUpdateTimes.set(task.id, Date.now());
      this.accumulatedTime.set(task.id, task.totalTimeSpent || 0);

      const intervalId = setInterval(async () => {
        try {
          const lastUpdate = this.lastUpdateTimes.get(task.id) || Date.now();
          const now = Date.now();
          const timeDiff = Math.floor((now - lastUpdate) / 1000);
          const currentAccumulated = this.accumulatedTime.get(task.id) || 0;

          // Check if task has been completed while tracking
          const currentTask = await this.taskService.getTask(task.id);
          if (currentTask?.status === 'completed') {
            this.stopTracking(task.id);
            return;
          }

          if (timeDiff > 0) {
            this.lastUpdateTimes.set(task.id, now);
            const newTotal = currentAccumulated + timeDiff;
            this.accumulatedTime.set(task.id, newTotal);

            // Update less frequently to avoid too many Firestore writes
            if (timeDiff >= 5) { // Update every 5 seconds
              await this.taskService.updateTask(task.id, {
                totalTimeSpent: newTotal
              });
            }
          }
        } catch (error) {
          console.error('Error updating task time:', error);
          // Don't stop tracking on error, just log it
        }
      }, 1000);

      this.trackingIntervals.set(task.id, intervalId);
    } catch (error) {
      console.error('Error starting task tracking:', error);
      throw error;
    }
  }

  async stopTracking(taskId: string): Promise<void> {
    const intervalId = this.trackingIntervals.get(taskId);
    if (intervalId) {
      clearInterval(intervalId);
      this.trackingIntervals.delete(taskId);
      
      try {
        // Calculate the final time including any unsaved time
        const lastUpdate = this.lastUpdateTimes.get(taskId) || Date.now();
        const baseTime = this.accumulatedTime.get(taskId) || 0;
        const additionalTime = Math.floor((Date.now() - lastUpdate) / 1000);
        const finalTime = baseTime + additionalTime;
        
        // Update the task one final time
        await this.taskService.updateTask(taskId, {
          isTracking: false,
          totalTimeSpent: finalTime
        });

        // Clean up our maps
        this.lastUpdateTimes.delete(taskId);
        this.accumulatedTime.delete(taskId);
      } catch (error) {
        console.error('Error stopping task tracking:', error);
        throw error;
      }
    }
  }

  getTrackedTime(taskId: string): number {
    const baseTime = this.accumulatedTime.get(taskId) || 0;
    const lastUpdate = this.lastUpdateTimes.get(taskId);
    
    if (!lastUpdate) {
      return baseTime;
    }

    const now = Date.now();
    const additionalTime = Math.floor((now - lastUpdate) / 1000);
    return baseTime + additionalTime;
  }

  async cleanup(): Promise<void> {
    // Clean up all intervals and ensure final times are saved
    const taskIds = Array.from(this.trackingIntervals.keys());
    for (const taskId of taskIds) {
      await this.stopTracking(taskId);
    }
  }
} 