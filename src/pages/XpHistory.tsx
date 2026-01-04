import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { listXpEvents, type XpEvent } from '@/lib/xp-service';
import { getGamificationConfig, getSourceMeta } from '@/lib/gamification';
import { Calendar, TrendingUp, Award } from 'lucide-react';

const XpHistory: React.FC = () => {
  const { t, language } = useLanguage();
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
      setError(t('xpHistoryPage.loginRequired'));
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
    const locale = language === 'zh' ? 'zh-CN' : language === 'ja' ? 'ja-JP' : language === 'ko' ? 'ko-KR' : 'en-US';
    return new Intl.DateTimeFormat(locale, {
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
          <div className="w-16 h-16 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center max-w-md mx-auto p-8">
          <h2 className="text-3xl font-black gradient-text mb-4">{t('xpHistoryPage.pleaseLogin')}</h2>
          <p className="text-gray-400 mb-6">
            {t('xpHistoryPage.loginRequired')}
          </p>
        </div>
      </div>
    );
  }

  const totalXp = (user.profile as any)?.total_xp ?? 0;
  const currentXp = (user.profile as any)?.xp ?? 0;

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-transparent"></div>
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-slideDown">
          <h1 className="text-4xl sm:text-5xl font-black gradient-text mb-4 tracking-tight">
            {t('xpHistoryPage.title')}
          </h1>
          <p className="text-xl text-gray-400 font-medium mb-6">
            {t('xpHistoryPage.subtitle')}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-primary-cyan" />
                <span className="text-sm text-gray-400">{t('xpHistoryPage.totalXp')}</span>
              </div>
              <div className="text-2xl font-bold text-white">{totalXp.toLocaleString()}</div>
            </div>
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award size={20} className="text-primary-purple" />
                <span className="text-sm text-gray-400">{t('xpHistoryPage.currentLevelXp')}</span>
              </div>
              <div className="text-2xl font-bold text-white">{currentXp.toLocaleString()}</div>
            </div>
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={20} className="text-accent-green" />
                <span className="text-sm text-gray-400">{t('xpHistoryPage.totalEvents')}</span>
              </div>
              <div className="text-2xl font-bold text-white">{events.length}</div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
            <p className="text-red-400">{t('xpHistoryPage.error')}: {error}</p>
          </div>
        )}

        {/* Events List */}
        {loading && events.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">{t('xpHistoryPage.loading')}</p>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <Award size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-lg text-gray-400 mb-2">{t('xpHistoryPage.noEvents')}</p>
            <p className="text-sm text-gray-400">
              {t('xpHistoryPage.noEventsDesc')}
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
                        isPositive ? 'bg-accent-green/20 text-accent-green' : 'bg-red-900/30 text-red-400'
                      }`}>
                        {sourceMeta.emoji || (isPositive ? '➕' : '➖')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-white">
                            {isPositive ? '+' : ''}{event.amount} XP
                          </span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-400">{sourceMeta.label}</span>
                        </div>
                        {event.reason && (
                          <p className="text-sm text-gray-400 mb-1">{event.reason}</p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-400">
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
                  className="px-6 py-3 bg-gradient-to-r from-primary-cyan to-primary-blue text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t('common.loading') : t('xpHistoryPage.loadMore')}
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
