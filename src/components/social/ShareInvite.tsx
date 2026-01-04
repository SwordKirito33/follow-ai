import React, { useState, useEffect } from 'react';

// =====================================================
// 分享和邀请组件
// 任务: 181-190 分享相关任务
// =====================================================

// =====================================================
// 分享按钮组件
// =====================================================

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  platforms?: Array<'twitter' | 'facebook' | 'linkedin' | 'weibo' | 'wechat' | 'copy'>;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  url,
  title,
  description = '',
  image,
  platforms = ['twitter', 'facebook', 'linkedin', 'weibo', 'wechat', 'copy']
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrls: Record<string, string> = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    weibo: `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  };

  const handleShare = (platform: string) => {
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else if (platform === 'wechat') {
      // 显示二维码
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setShowMenu(false);
  };

  const platformIcons: Record<string, React.ReactNode> = {
    twitter: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    facebook: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    weibo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.601.622.263.82.972.442 1.592zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.313-.361-.177-.586.138-.227.436-.346.672-.24.239.09.315.36.194.573zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.64 4.318-.341 5.132-2.179.8-1.793-.201-3.642-2.161-4.149zm7.563-1.224c-.346-.105-.579-.18-.405-.649.381-1.017.422-1.896-.002-2.521-.791-1.163-2.958-1.102-5.453-.034 0 0-.782.344-.582-.279.382-1.209.324-2.221-.27-2.806-1.349-1.33-4.937.047-8.013 3.074-2.303 2.269-3.637 4.679-3.637 6.768 0 3.998 5.127 6.434 10.147 6.434 6.583 0 10.964-3.829 10.964-6.871 0-1.838-1.55-2.881-2.749-3.116zm2.293-2.87c-.476-.592-1.182-.87-1.974-.87-.257 0-.519.032-.782.097-.351.086-.56.432-.474.771.086.34.431.547.772.464.127-.032.253-.048.372-.048.417 0 .77.141.99.396.186.217.262.512.213.832-.063.42.225.812.645.875.419.063.812-.225.875-.645.103-.674-.058-1.32-.637-1.872z"/>
      </svg>
    ),
    wechat: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z"/>
      </svg>
    ),
    copy: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  };

  const platformNames: Record<string, string> = {
    twitter: 'X (Twitter)',
    facebook: 'Facebook',
    linkedin: 'LinkedIn',
    weibo: '微博',
    wechat: '微信',
    copy: copied ? '已复制!' : '复制链接',
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 py-2 px-4 rounded-lg border border-border hover:bg-muted transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span>分享</span>
      </button>

      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-background rounded-lg border border-border shadow-lg z-50">
            {platforms.map(platform => (
              <button
                key={platform}
                onClick={() => handleShare(platform)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <span className="text-muted-foreground">{platformIcons[platform]}</span>
                <span className="text-foreground">{platformNames[platform]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// =====================================================
// 邀请系统组件
// =====================================================

interface InviteSystemProps {
  inviteCode: string;
  inviteUrl: string;
  rewards: {
    inviter: number;
    invitee: number;
  };
  stats: {
    totalInvites: number;
    successfulInvites: number;
    pendingInvites: number;
    totalEarned: number;
  };
  invitedUsers: Array<{
    id: string;
    name: string;
    avatar?: string;
    joinedAt: Date;
    status: 'pending' | 'completed';
    reward?: number;
  }>;
}

export const InviteSystem: React.FC<InviteSystemProps> = ({
  inviteCode,
  inviteUrl,
  rewards,
  stats,
  invitedUsers
}) => {
  const [copied, setCopied] = useState<'code' | 'url' | null>(null);

  const handleCopy = (type: 'code' | 'url') => {
    navigator.clipboard.writeText(type === 'code' ? inviteCode : inviteUrl);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* 邀请奖励说明 */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl p-6">
        <h3 className="text-xl font-bold text-foreground mb-4">邀请好友，共享奖励</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-background/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">你将获得</p>
            <p className="text-2xl font-bold text-primary">{rewards.inviter} XP</p>
            <p className="text-sm text-muted-foreground">每成功邀请一位好友</p>
          </div>
          <div className="bg-background/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">好友将获得</p>
            <p className="text-2xl font-bold text-green-500">{rewards.invitee} XP</p>
            <p className="text-sm text-muted-foreground">注册即送新人奖励</p>
          </div>
        </div>
      </div>

      {/* 邀请码和链接 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">邀请码</label>
          <div className="flex gap-2">
            <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-lg text-center tracking-widest">
              {inviteCode}
            </div>
            <button
              onClick={() => handleCopy('code')}
              className="px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {copied === 'code' ? '已复制!' : '复制'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">邀请链接</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inviteUrl}
              readOnly
              className="flex-1 p-3 bg-muted rounded-lg text-sm text-muted-foreground"
            />
            <button
              onClick={() => handleCopy('url')}
              className="px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {copied === 'url' ? '已复制!' : '复制'}
            </button>
          </div>
        </div>
      </div>

      {/* 邀请统计 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{stats.totalInvites}</p>
          <p className="text-sm text-muted-foreground">总邀请</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-500">{stats.successfulInvites}</p>
          <p className="text-sm text-muted-foreground">成功邀请</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-yellow-500">{stats.pendingInvites}</p>
          <p className="text-sm text-muted-foreground">待完成</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary">{stats.totalEarned}</p>
          <p className="text-sm text-muted-foreground">已获得 XP</p>
        </div>
      </div>

      {/* 邀请记录 */}
      <div>
        <h4 className="font-semibold text-foreground mb-4">邀请记录</h4>
        {invitedUsers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            暂无邀请记录，快去邀请好友吧！
          </div>
        ) : (
          <div className="space-y-3">
            {invitedUsers.map(user => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold">
                    {user.avatar ? (
                      <img loading="lazy" src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.joinedAt.toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${user.status === 'completed'
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-yellow-500/10 text-yellow-500'
                    }
                  `}>
                    {user.status === 'completed' ? '已完成' : '待完成'}
                  </span>
                  {user.reward && (
                    <p className="text-sm text-primary mt-1">+{user.reward} XP</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// =====================================================
// 二维码组件
// =====================================================

interface QRCodeProps {
  value: string;
  size?: number;
  title?: string;
}

export const QRCode: React.FC<QRCodeProps> = ({
  value,
  size = 200,
  title
}) => {
  // 简单的 QR 码占位符 - 实际应使用 qrcode 库
  return (
    <div className="text-center">
      <div 
        className="bg-white p-4 rounded-lg inline-block"
        style={{ width: size + 32, height: size + 32 }}
      >
        <div 
          className="bg-muted flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <span className="text-muted-foreground text-sm">QR Code</span>
        </div>
      </div>
      {title && (
        <p className="text-sm text-muted-foreground mt-2">{title}</p>
      )}
    </div>
  );
};

export default ShareButton;
