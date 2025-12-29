/**
 * XP Queue System
 * Merges multiple XP events that happen close together to avoid UI spam
 */

export interface QueuedXpEvent {
  userId: string;
  deltaXp: number;
  timestamp: number;
  source: string;
}

class XpQueue {
  private queue: Map<string, QueuedXpEvent[]> = new Map();
  private flushTimer: NodeJS.Timeout | null = null;
  private readonly FLUSH_DELAY_MS = 500; // Merge events within 500ms
  private readonly MAX_QUEUE_SIZE = 10;

  /**
   * Add XP event to queue
   */
  enqueue(userId: string, deltaXp: number, source: string): void {
    const userQueue = this.queue.get(userId) || [];
    
    // Add new event
    userQueue.push({
      userId,
      deltaXp,
      timestamp: Date.now(),
      source,
    });

    // Limit queue size
    if (userQueue.length > this.MAX_QUEUE_SIZE) {
      userQueue.shift(); // Remove oldest
    }

    this.queue.set(userId, userQueue);

    // Schedule flush
    this.scheduleFlush();
  }

  /**
   * Schedule a flush of the queue
   */
  private scheduleFlush(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
    }

    this.flushTimer = setTimeout(() => {
      this.flush();
    }, this.FLUSH_DELAY_MS);
  }

  /**
   * Flush all queued events and dispatch merged events
   */
  flush(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    // Process each user's queue
    for (const [userId, events] of this.queue.entries()) {
      if (events.length === 0) continue;

      // Merge events
      const totalDeltaXp = events.reduce((sum, e) => sum + e.deltaXp, 0);
      const sources = [...new Set(events.map(e => e.source))];
      const oldestTimestamp = Math.min(...events.map(e => e.timestamp));

      // Dispatch merged event
      window.dispatchEvent(
        new CustomEvent('xp-gained-merged', {
          detail: {
            userId,
            totalDeltaXp,
            sources,
            eventCount: events.length,
            timestamp: oldestTimestamp,
          },
        })
      );

      // Clear this user's queue
      this.queue.set(userId, []);
    }

    // Clean up empty queues
    for (const [userId, events] of this.queue.entries()) {
      if (events.length === 0) {
        this.queue.delete(userId);
      }
    }
  }

  /**
   * Get current queue state (for debugging)
   */
  getQueueState(): Record<string, QueuedXpEvent[]> {
    const state: Record<string, QueuedXpEvent[]> = {};
    for (const [userId, events] of this.queue.entries()) {
      state[userId] = [...events];
    }
    return state;
  }

  /**
   * Clear all queues
   */
  clear(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    this.queue.clear();
  }
}

// Singleton instance
export const xpQueue = new XpQueue();

