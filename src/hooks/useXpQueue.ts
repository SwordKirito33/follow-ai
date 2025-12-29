import { useState, useEffect, useRef } from 'react';
import type { XpSource } from '@/lib/gamification';

interface QueuedXpEvent {
  gained: number;
  sources: XpSource[];
  timestamp: number;
  refType?: string;
  refId?: string;
  prevXp: number;
  newXp: number;
}

const MERGE_WINDOW_MS = 800;
const PROCESS_DELAY_MS = 2200;

export function useXpQueue() {
  const [queue, setQueue] = useState<QueuedXpEvent[]>([]);
  const [current, setCurrent] = useState<QueuedXpEvent | null>(null);
  const processingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleXpEarned = (e: CustomEvent) => {
      const { gained, source, refType, refId, prevXp, newXp } = e.detail;
      
      setQueue(prev => {
        const now = Date.now();
        const recent = prev.filter(q => now - q.timestamp < MERGE_WINDOW_MS);
        
        if (recent.length > 0) {
          // Merge with most recent event
          const lastRecent = recent[recent.length - 1];
          const merged: QueuedXpEvent = {
            gained: recent.reduce((sum, q) => sum + q.gained, 0) + gained,
            sources: [...new Set([...lastRecent.sources, source].filter(Boolean))],
            timestamp: lastRecent.timestamp,
            refType: refType || lastRecent.refType,
            refId: refId || lastRecent.refId,
            prevXp: lastRecent.prevXp,
            newXp: newXp,
          };
          
          return [...prev.filter(q => now - q.timestamp >= MERGE_WINDOW_MS), merged];
        }
        
        // New event
        return [...prev, {
          gained,
          sources: source ? [source] : [],
          timestamp: now,
          refType,
          refId,
          prevXp: prevXp ?? 0,
          newXp: newXp ?? 0,
        }];
      });
    };

    window.addEventListener('xp:earned', handleXpEarned as EventListener);
    return () => window.removeEventListener('xp:earned', handleXpEarned as EventListener);
  }, []);

  // Process queue sequentially
  useEffect(() => {
    if (processingRef.current || queue.length === 0) return;

    const processNext = () => {
      if (queue.length === 0) {
        processingRef.current = false;
        return;
      }

      processingRef.current = true;
      const [next, ...rest] = queue;
      setQueue(rest);
      setCurrent(next);

      timeoutRef.current = setTimeout(() => {
        setCurrent(null);
        processingRef.current = false;
        // Process next after delay
        setTimeout(processNext, 100);
      }, PROCESS_DELAY_MS);
    };

    processNext();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [queue]);

  return { current, queue };
}

