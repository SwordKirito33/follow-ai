import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { listXpEvents, type XpEvent } from '@/lib/xp-service';

interface XPHistoryProps {
  userId: string;
  limit?: number;
}

const XPHistory: React.FC<XPHistoryProps> = ({ userId, limit = 50 }) => {
  const [events, setEvents] = useState<XpEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, [userId]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listXpEvents(userId, limit);
      setEvents(data);
    } catch (err: any) {
      console.error('Failed to load XP history:', err);
      setError(err.message || 'Failed to load XP history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getSourceLabel = (source: string) => {
    const labels: Record<string, string> = {
      task: 'Task Completion',
      bonus: 'Bonus',
      admin: 'Admin Adjustment',
      purchase: 'XP Purchase',
    };
    return labels[source] || source;
  };

  if (loading) {
    return (
      <div className="glass-card rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-black text-white mb-6 tracking-tight">XP History</h2>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading XP history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-black text-white mb-6 tracking-tight">XP History</h2>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl shadow-xl p-6">
      <h2 className="text-2xl font-black text-white mb-6 tracking-tight">XP History</h2>
      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-2">No XP events yet</p>
          <p className="text-sm text-gray-400">
            Complete tasks and activities to start earning XP!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => {
            const isPositive = event.amount > 0;
            const Icon = isPositive ? TrendingUp : TrendingDown;

            return (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 bg-slate-800/50/5 rounded-lg hover:bg-slate-800/50/10 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isPositive ? 'bg-accent-green/20 text-accent-green' : 'bg-red-100 text-red-600'
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-bold ${isPositive ? 'text-accent-green' : 'text-red-600'}`}>
                        {isPositive ? '+' : ''}{event.amount} XP
                      </span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-400">{getSourceLabel(event.source)}</span>
                    </div>
                    {event.reason && (
                      <p className="text-sm text-gray-400 mb-1">{event.reason}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar size={12} />
                      <span>{formatDate(event.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default XPHistory;

