import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { listXpEvents, type XpEvent } from '@/lib/xp-service';
import { getGamificationConfig, getSourceMeta } from '@/lib/gamification';
import { Calendar, TrendingUp, Award } from 'lucide-react';

const XpHistory: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [events, setEvents] = useState<XpEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<any>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 20;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setError('Please log in to view your XP history');
      setLoading(false);
      return;
    }

    if (user) {
      loadConfig();
      loadHistory();
    }
  }, [user, isAuthenticated, authLoading, page]);

  const loadConfig = async () => {
    try {
      const cfg = await getGamificationConfig();
      setConfig(cfg);
    } catch (err) {
      console.error('Failed to load gamification config:', err);
    }
  };

  const loadHistory = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const data = await listXpEvents(user.id, pageSize);
      
      if (page === 0) {
        setEvents(data);
      } else {
        setEvents(prev => [...prev, ...data]);
      }

      setHasMore(data.length === pageSize);
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-blue-50/20 to-purple-50/20">
        <div className="text-center max-w-md mx-auto p-8">
          <h2 className="text-3xl font-black gradient-text mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your XP history.
          </p>
        </div>
      </div>
    );
  }

  const totalXp = (user.profile as any)?.total_xp ?? 0;      // Cumulative total
  const currentXp = (user.profile as any)?.xp ?? 0;          // Progress in current level

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/20 to-purple-50/20"></div>
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-slideDown">
          <h1 className="text-4xl sm:text-5xl font-black gradient-text mb-4 tracking-tight">
            XP History
          </h1>
          <p className="text-xl text-gray-600 font-medium mb-6">
            Track all your XP gains and achievements
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-blue-600" />
                <span className="text-sm text-gray-600">Total XP</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalXp.toLocaleString()}</div>
            </div>
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award size={20} className="text-purple-600" />
                <span className="text-sm text-gray-600">Current Level XP</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{currentXp.toLocaleString()}</div>
            </div>
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={20} className="text-green-600" />
                <span className="text-sm text-gray-600">Total Events</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{events.length}</div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}

        {/* Events List */}
        {loading && events.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading XP history...</p>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <Award size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-lg text-gray-600 mb-2">No XP events yet</p>
            <p className="text-sm text-gray-500">
              Complete tasks and activities to start earning XP!
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {events.map((event) => {
                const sourceMeta = config ? getSourceMeta(event.source, config.xp_sources) : { label: event.source, emoji: '' };
                const isPositive = event.amount > 0;

                return (
                  <div
                    key={event.id}
                    className="glass-card rounded-xl p-6 flex items-center justify-between hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                        isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {sourceMeta.emoji || (isPositive ? '➕' : '➖')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900">
                            {isPositive ? '+' : ''}{event.amount} XP
                          </span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-600">{sourceMeta.label}</span>
                        </div>
                        {event.reason && (
                          <p className="text-sm text-gray-600 mb-1">{event.reason}</p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar size={14} />
                          <span>{formatDate(event.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default XpHistory;

