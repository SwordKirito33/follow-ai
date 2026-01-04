import React, { useState } from 'react';

// =====================================================
// 安全日志组件
// 任务: 138. 创建安全日志系统
// =====================================================

interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'password_change' | 'email_change' | '2fa_enable' | '2fa_disable' | 'device_revoke' | 'suspicious';
  description: string;
  ip: string;
  location?: string;
  device?: string;
  success: boolean;
  timestamp: Date;
}

interface SecurityLogProps {
  events: SecurityEvent[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

export const SecurityLog: React.FC<SecurityLogProps> = ({
  events,
  onLoadMore,
  hasMore = false,
  isLoading = false
}) => {
  const [filter, setFilter] = useState<SecurityEvent['type'] | 'all'>('all');

  const getEventIcon = (type: SecurityEvent['type'], success: boolean) => {
    if (!success) {
      return (
        <div className="p-2 rounded-full bg-destructive/10 text-destructive">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      );
    }

    switch (type) {
      case 'login':
        return (
          <div className="p-2 rounded-full bg-green-500/10 text-green-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
        );
      case 'logout':
        return (
          <div className="p-2 rounded-full bg-muted text-muted-foreground">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
        );
      case 'password_change':
        return (
          <div className="p-2 rounded-full bg-blue-500/10 text-blue-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
        );
      case '2fa_enable':
      case '2fa_disable':
        return (
          <div className={`p-2 rounded-full ${type === '2fa_enable' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        );
      case 'suspicious':
        return (
          <div className="p-2 rounded-full bg-destructive/10 text-destructive">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-full bg-muted text-muted-foreground">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getEventLabel = (type: SecurityEvent['type']) => {
    const labels: Record<SecurityEvent['type'], string> = {
      login: '登录',
      logout: '登出',
      password_change: '密码修改',
      email_change: '邮箱修改',
      '2fa_enable': '启用 2FA',
      '2fa_disable': '禁用 2FA',
      device_revoke: '设备登出',
      suspicious: '可疑活动'
    };
    return labels[type];
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes} 分钟前`;
    if (hours < 24) return `${hours} 小时前`;
    if (days < 7) return `${days} 天前`;
    return date.toLocaleString();
  };

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => e.type === filter);

  const filterOptions: { value: SecurityEvent['type'] | 'all'; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'login', label: '登录' },
    { value: 'logout', label: '登出' },
    { value: 'password_change', label: '密码修改' },
    { value: '2fa_enable', label: '2FA' },
    { value: 'suspicious', label: '可疑活动' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">安全日志</h3>
          <p className="text-sm text-muted-foreground">查看您账户的安全活动记录</p>
        </div>
      </div>

      {/* 筛选器 */}
      <div className="flex gap-2 flex-wrap">
        {filterOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`
              px-3 py-1.5 text-sm rounded-full transition-colors
              ${filter === option.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* 事件列表 */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            暂无安全日志
          </div>
        ) : (
          filteredEvents.map(event => (
            <div
              key={event.id}
              className={`
                p-4 rounded-lg border transition-colors
                ${!event.success ? 'border-destructive/50 bg-destructive/5' : 'border-border'}
              `}
            >
              <div className="flex items-start gap-4">
                {getEventIcon(event.type, event.success)}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {getEventLabel(event.type)}
                    </span>
                    {!event.success && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-destructive text-destructive-foreground rounded-full">
                        失败
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location || event.ip}
                    </span>
                    {event.device && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {event.device}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatTimestamp(event.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 加载更多 */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-4 py-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            {isLoading ? '加载中...' : '加载更多'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SecurityLog;
