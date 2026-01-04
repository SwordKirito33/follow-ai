import React, { useState } from 'react';

// =====================================================
// 设备管理组件
// 任务: 137. 添加登录设备管理
// =====================================================

interface Device {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  ip: string;
  location?: string;
  lastActive: Date;
  isCurrent: boolean;
}

interface DeviceManagerProps {
  devices: Device[];
  onRevokeDevice: (deviceId: string) => Promise<void>;
  onRevokeAllOther: () => Promise<void>;
}

export const DeviceManager: React.FC<DeviceManagerProps> = ({
  devices,
  onRevokeDevice,
  onRevokeAllOther
}) => {
  const [revoking, setRevoking] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'mobile':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'tablet':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes} 分钟前`;
    if (hours < 24) return `${hours} 小时前`;
    if (days < 7) return `${days} 天前`;
    return date.toLocaleDateString();
  };

  const handleRevoke = async (deviceId: string) => {
    setRevoking(deviceId);
    try {
      await onRevokeDevice(deviceId);
    } finally {
      setRevoking(null);
      setShowConfirm(null);
    }
  };

  const handleRevokeAll = async () => {
    setRevoking('all');
    try {
      await onRevokeAllOther();
    } finally {
      setRevoking(null);
      setShowConfirm(null);
    }
  };

  const otherDevices = devices.filter(d => !d.isCurrent);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">登录设备</h3>
          <p className="text-sm text-muted-foreground">管理您账户的登录设备</p>
        </div>
        {otherDevices.length > 0 && (
          <button
            onClick={() => setShowConfirm('all')}
            className="text-sm text-destructive hover:text-destructive/80 transition-colors"
          >
            登出所有其他设备
          </button>
        )}
      </div>

      <div className="space-y-4">
        {devices.map(device => (
          <div
            key={device.id}
            className={`
              p-4 rounded-lg border transition-colors
              ${device.isCurrent ? 'border-primary bg-primary/5' : 'border-border'}
            `}
          >
            <div className="flex items-start gap-4">
              <div className={`
                p-2 rounded-lg
                ${device.isCurrent ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}
              `}>
                {getDeviceIcon(device.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{device.name}</span>
                  {device.isCurrent && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                      当前设备
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {device.browser} · {device.os}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {device.location || device.ip}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatLastActive(device.lastActive)}
                  </span>
                </div>
              </div>

              {!device.isCurrent && (
                <button
                  onClick={() => setShowConfirm(device.id)}
                  disabled={revoking === device.id}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  {revoking === device.id ? (
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 确认对话框 */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-sm w-full mx-4">
            <h4 className="text-lg font-semibold text-foreground mb-2">
              {showConfirm === 'all' ? '登出所有其他设备？' : '登出此设备？'}
            </h4>
            <p className="text-muted-foreground mb-6">
              {showConfirm === 'all'
                ? '这将登出除当前设备外的所有设备。'
                : '此设备将被登出，需要重新登录才能访问。'
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(null)}
                className="flex-1 py-2 px-4 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => showConfirm === 'all' ? handleRevokeAll() : handleRevoke(showConfirm)}
                disabled={!!revoking}
                className="flex-1 py-2 px-4 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
              >
                {revoking ? '处理中...' : '确认登出'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManager;
