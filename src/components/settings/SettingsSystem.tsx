import React, { useState } from 'react';

// =====================================================
// 设置和偏好组件
// 任务: 271-300 设置相关任务
// =====================================================

// =====================================================
// 设置页面布局
// =====================================================

interface SettingsLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({
  children,
  activeSection,
  onSectionChange
}) => {
  const sections = [
    { id: 'profile', name: '个人资料', icon: '👤' },
    { id: 'account', name: '账户安全', icon: '🔒' },
    { id: 'notifications', name: '通知设置', icon: '🔔' },
    { id: 'privacy', name: '隐私设置', icon: '🛡️' },
    { id: 'appearance', name: '外观设置', icon: '🎨' },
    { id: 'language', name: '语言地区', icon: '🌐' },
    { id: 'billing', name: '账单订阅', icon: '💳' },
    { id: 'api', name: 'API 密钥', icon: '🔑' },
    { id: 'data', name: '数据管理', icon: '📊' }
  ];

  return (
    <div className="flex gap-8">
      {/* 侧边导航 */}
      <nav className="w-64 flex-shrink-0">
        <div className="sticky top-4 space-y-1">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                ${activeSection === section.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
            >
              <span>{section.icon}</span>
              <span>{section.name}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* 内容区域 */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
};

// =====================================================
// 个人资料设置
// =====================================================

interface ProfileSettingsProps {
  profile: {
    name: string;
    username: string;
    email: string;
    bio: string;
    avatar?: string;
    website?: string;
    location?: string;
    socialLinks: {
      twitter?: string;
      github?: string;
      linkedin?: string;
    };
  };
  onSave: (profile: ProfileSettingsProps['profile']) => Promise<void>;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  profile: initialProfile,
  onSave
}) => {
  const [profile, setProfile] = useState(initialProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      await onSave(profile);
      setMessage({ type: 'success', text: '保存成功！' });
    } catch (error) {
      setMessage({ type: 'error', text: '保存失败，请重试' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">个人资料</h2>
        <p className="text-muted-foreground">管理你的公开个人信息</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
        }`}>
          {message.text}
        </div>
      )}

      {/* 头像 */}
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
          ) : (
            profile.name.charAt(0)
          )}
        </div>
        <div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            更换头像
          </button>
          <p className="text-sm text-muted-foreground mt-2">
            支持 JPG、PNG 格式，最大 2MB
          </p>
        </div>
      </div>

      {/* 基本信息 */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">显示名称</label>
          <input
            type="text"
            value={profile.name}
            onChange={e => setProfile({ ...profile, name: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">用户名</label>
          <div className="flex">
            <span className="px-4 py-2 bg-muted rounded-l-lg border border-r-0 border-border text-muted-foreground">
              @
            </span>
            <input
              type="text"
              value={profile.username}
              onChange={e => setProfile({ ...profile, username: e.target.value })}
              className="flex-1 px-4 py-2 rounded-r-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">个人简介</label>
          <textarea
            value={profile.bio}
            onChange={e => setProfile({ ...profile, bio: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="介绍一下你自己..."
          />
          <p className="text-sm text-muted-foreground mt-1">
            {profile.bio.length}/200 字符
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">个人网站</label>
          <input
            type="url"
            value={profile.website || ''}
            onChange={e => setProfile({ ...profile, website: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="https://example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">所在地</label>
          <input
            type="text"
            value={profile.location || ''}
            onChange={e => setProfile({ ...profile, location: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="城市, 国家"
          />
        </div>
      </div>

      {/* 社交链接 */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">社交链接</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="w-24 text-muted-foreground">Twitter</span>
            <input
              type="text"
              value={profile.socialLinks.twitter || ''}
              onChange={e => setProfile({
                ...profile,
                socialLinks: { ...profile.socialLinks, twitter: e.target.value }
              })}
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="@username"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="w-24 text-muted-foreground">GitHub</span>
            <input
              type="text"
              value={profile.socialLinks.github || ''}
              onChange={e => setProfile({
                ...profile,
                socialLinks: { ...profile.socialLinks, github: e.target.value }
              })}
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="username"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="w-24 text-muted-foreground">LinkedIn</span>
            <input
              type="text"
              value={profile.socialLinks.linkedin || ''}
              onChange={e => setProfile({
                ...profile,
                socialLinks: { ...profile.socialLinks, linkedin: e.target.value }
              })}
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="username"
            />
          </div>
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSaving ? '保存中...' : '保存更改'}
        </button>
      </div>
    </div>
  );
};

// =====================================================
// 通知设置
// =====================================================

interface NotificationSettingsProps {
  settings: {
    email: {
      marketing: boolean;
      updates: boolean;
      security: boolean;
      weekly: boolean;
    };
    push: {
      enabled: boolean;
      newFollower: boolean;
      newComment: boolean;
      taskReminder: boolean;
      levelUp: boolean;
    };
  };
  onSave: (settings: NotificationSettingsProps['settings']) => Promise<void>;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  settings: initialSettings,
  onSave
}) => {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(settings);
    } finally {
      setIsSaving(false);
    }
  };

  const Toggle: React.FC<{
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    description?: string;
  }> = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-4">
      <div>
        <p className="font-medium text-foreground">{label}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`
          relative w-12 h-6 rounded-full transition-colors
          ${checked ? 'bg-primary' : 'bg-muted'}
        `}
      >
        <span
          className={`
            absolute top-1 w-4 h-4 rounded-full bg-white transition-transform
            ${checked ? 'left-7' : 'left-1'}
          `}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">通知设置</h2>
        <p className="text-muted-foreground">管理你的通知偏好</p>
      </div>

      {/* 邮件通知 */}
      <div className="bg-muted/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">📧 邮件通知</h3>
        <div className="divide-y divide-border">
          <Toggle
            checked={settings.email.updates}
            onChange={v => setSettings({
              ...settings,
              email: { ...settings.email, updates: v }
            })}
            label="产品更新"
            description="新功能和改进通知"
          />
          <Toggle
            checked={settings.email.security}
            onChange={v => setSettings({
              ...settings,
              email: { ...settings.email, security: v }
            })}
            label="安全提醒"
            description="登录和账户安全相关通知"
          />
          <Toggle
            checked={settings.email.weekly}
            onChange={v => setSettings({
              ...settings,
              email: { ...settings.email, weekly: v }
            })}
            label="周报摘要"
            description="每周活动和进度总结"
          />
          <Toggle
            checked={settings.email.marketing}
            onChange={v => setSettings({
              ...settings,
              email: { ...settings.email, marketing: v }
            })}
            label="营销邮件"
            description="优惠活动和推广信息"
          />
        </div>
      </div>

      {/* 推送通知 */}
      <div className="bg-muted/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">🔔 推送通知</h3>
        <div className="divide-y divide-border">
          <Toggle
            checked={settings.push.enabled}
            onChange={v => setSettings({
              ...settings,
              push: { ...settings.push, enabled: v }
            })}
            label="启用推送通知"
            description="在浏览器中接收通知"
          />
          {settings.push.enabled && (
            <>
              <Toggle
                checked={settings.push.newFollower}
                onChange={v => setSettings({
                  ...settings,
                  push: { ...settings.push, newFollower: v }
                })}
                label="新关注者"
                description="有人关注你时通知"
              />
              <Toggle
                checked={settings.push.newComment}
                onChange={v => setSettings({
                  ...settings,
                  push: { ...settings.push, newComment: v }
                })}
                label="新评论"
                description="你的内容收到评论时通知"
              />
              <Toggle
                checked={settings.push.taskReminder}
                onChange={v => setSettings({
                  ...settings,
                  push: { ...settings.push, taskReminder: v }
                })}
                label="任务提醒"
                description="任务即将到期时通知"
              />
              <Toggle
                checked={settings.push.levelUp}
                onChange={v => setSettings({
                  ...settings,
                  push: { ...settings.push, levelUp: v }
                })}
                label="等级提升"
                description="升级时通知"
              />
            </>
          )}
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSaving ? '保存中...' : '保存更改'}
        </button>
      </div>
    </div>
  );
};

// =====================================================
// 隐私设置
// =====================================================

interface PrivacySettingsProps {
  settings: {
    profileVisibility: 'public' | 'followers' | 'private';
    showEmail: boolean;
    showActivity: boolean;
    showLevel: boolean;
    allowMessages: 'everyone' | 'followers' | 'none';
    dataCollection: boolean;
  };
  onSave: (settings: PrivacySettingsProps['settings']) => Promise<void>;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  settings: initialSettings,
  onSave
}) => {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(settings);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">隐私设置</h2>
        <p className="text-muted-foreground">控制谁可以看到你的信息</p>
      </div>

      {/* 个人资料可见性 */}
      <div className="bg-muted/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">个人资料可见性</h3>
        <div className="space-y-3">
          {[
            { value: 'public', label: '公开', desc: '所有人都可以查看' },
            { value: 'followers', label: '仅关注者', desc: '只有关注你的人可以查看' },
            { value: 'private', label: '私密', desc: '只有你自己可以查看' }
          ].map(option => (
            <label
              key={option.value}
              className={`
                flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors
                ${settings.profileVisibility === option.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
                }
              `}
            >
              <input
                type="radio"
                name="profileVisibility"
                value={option.value}
                checked={settings.profileVisibility === option.value}
                onChange={e => setSettings({
                  ...settings,
                  profileVisibility: e.target.value as typeof settings.profileVisibility
                })}
                className="sr-only"
              />
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${settings.profileVisibility === option.value
                  ? 'border-primary'
                  : 'border-muted-foreground'
                }
              `}>
                {settings.profileVisibility === option.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">{option.label}</p>
                <p className="text-sm text-muted-foreground">{option.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* 信息显示 */}
      <div className="bg-muted/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">信息显示</h3>
        <div className="space-y-4">
          {[
            { key: 'showEmail', label: '显示邮箱', desc: '在个人资料中显示邮箱地址' },
            { key: 'showActivity', label: '显示活动', desc: '在个人资料中显示最近活动' },
            { key: 'showLevel', label: '显示等级', desc: '在个人资料中显示等级和 XP' }
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <button
                onClick={() => setSettings({
                  ...settings,
                  [item.key]: !settings[item.key as keyof typeof settings]
                })}
                className={`
                  relative w-12 h-6 rounded-full transition-colors
                  ${settings[item.key as keyof typeof settings] ? 'bg-primary' : 'bg-muted'}
                `}
              >
                <span
                  className={`
                    absolute top-1 w-4 h-4 rounded-full bg-white transition-transform
                    ${settings[item.key as keyof typeof settings] ? 'left-7' : 'left-1'}
                  `}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSaving ? '保存中...' : '保存更改'}
        </button>
      </div>
    </div>
  );
};

// =====================================================
// 外观设置
// =====================================================

interface AppearanceSettingsProps {
  settings: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
    fontFamily: string;
    accentColor: string;
    reducedMotion: boolean;
  };
  onSave: (settings: AppearanceSettingsProps['settings']) => Promise<void>;
}

export const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  settings: initialSettings,
  onSave
}) => {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const themes = [
    { value: 'light', label: '浅色', icon: '☀️' },
    { value: 'dark', label: '深色', icon: '🌙' },
    { value: 'system', label: '跟随系统', icon: '💻' }
  ];

  const fontSizes = [
    { value: 'small', label: '小' },
    { value: 'medium', label: '中' },
    { value: 'large', label: '大' }
  ];

  const accentColors = [
    '#3b82f6', // Blue
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#10b981', // Green
    '#f59e0b', // Yellow
    '#ef4444'  // Red
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(settings);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">外观设置</h2>
        <p className="text-muted-foreground">自定义界面外观</p>
      </div>

      {/* 主题 */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">主题</h3>
        <div className="grid grid-cols-3 gap-4">
          {themes.map(theme => (
            <button
              key={theme.value}
              onClick={() => setSettings({ ...settings, theme: theme.value as typeof settings.theme })}
              className={`
                p-4 rounded-xl border text-center transition-all
                ${settings.theme === theme.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
                }
              `}
            >
              <span className="text-2xl">{theme.icon}</span>
              <p className="mt-2 font-medium text-foreground">{theme.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 强调色 */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">强调色</h3>
        <div className="flex gap-3">
          {accentColors.map(color => (
            <button
              key={color}
              onClick={() => setSettings({ ...settings, accentColor: color })}
              className={`
                w-10 h-10 rounded-full transition-transform
                ${settings.accentColor === color ? 'ring-2 ring-offset-2 ring-offset-background scale-110' : ''}
              `}
              style={{ backgroundColor: color, ringColor: color }}
            />
          ))}
        </div>
      </div>

      {/* 字体大小 */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">字体大小</h3>
        <div className="flex gap-2">
          {fontSizes.map(size => (
            <button
              key={size.value}
              onClick={() => setSettings({ ...settings, fontSize: size.value as typeof settings.fontSize })}
              className={`
                px-6 py-2 rounded-lg border transition-colors
                ${settings.fontSize === size.value
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-primary/50'
                }
              `}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      {/* 减少动画 */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
        <div>
          <p className="font-medium text-foreground">减少动画</p>
          <p className="text-sm text-muted-foreground">减少界面动画效果</p>
        </div>
        <button
          onClick={() => setSettings({ ...settings, reducedMotion: !settings.reducedMotion })}
          className={`
            relative w-12 h-6 rounded-full transition-colors
            ${settings.reducedMotion ? 'bg-primary' : 'bg-muted'}
          `}
        >
          <span
            className={`
              absolute top-1 w-4 h-4 rounded-full bg-white transition-transform
              ${settings.reducedMotion ? 'left-7' : 'left-1'}
            `}
          />
        </button>
      </div>

      {/* 保存按钮 */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSaving ? '保存中...' : '保存更改'}
        </button>
      </div>
    </div>
  );
};

export default SettingsLayout;
