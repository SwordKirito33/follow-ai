import React, { useState } from 'react';

// =====================================================
// 管理员后台组件
// 任务: 301-330 管理员相关任务
// =====================================================

// =====================================================
// 管理员仪表盘
// =====================================================

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalTools: number;
  totalReviews: number;
  totalXP: number;
  revenue: number;
  newUsersToday: number;
  newReviewsToday: number;
}

interface AdminDashboardProps {
  stats: AdminStats;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats }) => {
  const statCards = [
    { label: '总用户数', value: stats.totalUsers, icon: '👥', color: 'from-blue-500/20 to-blue-500/5' },
    { label: '活跃用户', value: stats.activeUsers, icon: '🟢', color: 'from-green-500/20 to-green-500/5' },
    { label: 'AI 工具数', value: stats.totalTools, icon: '🛠️', color: 'from-purple-500/20 to-purple-500/5' },
    { label: '总评价数', value: stats.totalReviews, icon: '⭐', color: 'from-yellow-500/20 to-yellow-500/5' },
    { label: '总 XP', value: stats.totalXP, icon: '✨', color: 'from-pink-500/20 to-pink-500/5' },
    { label: '总收入', value: `¥${stats.revenue.toLocaleString()}`, icon: '💰', color: 'from-emerald-500/20 to-emerald-500/5' },
    { label: '今日新用户', value: stats.newUsersToday, icon: '📈', color: 'from-cyan-500/20 to-cyan-500/5' },
    { label: '今日新评价', value: stats.newReviewsToday, icon: '📝', color: 'from-orange-500/20 to-orange-500/5' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">管理员仪表盘</h1>
        <p className="text-muted-foreground">平台数据概览</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${card.color} rounded-xl p-6`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{card.icon}</span>
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="text-2xl font-bold text-foreground">
                  {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 快捷操作 */}
      <div className="grid md:grid-cols-3 gap-4">
        <button className="p-6 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors text-left">
          <span className="text-2xl">➕</span>
          <p className="font-semibold text-foreground mt-2">添加工具</p>
          <p className="text-sm text-muted-foreground">添加新的 AI 工具</p>
        </button>
        <button className="p-6 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors text-left">
          <span className="text-2xl">📋</span>
          <p className="font-semibold text-foreground mt-2">审核评价</p>
          <p className="text-sm text-muted-foreground">审核待处理的评价</p>
        </button>
        <button className="p-6 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors text-left">
          <span className="text-2xl">📊</span>
          <p className="font-semibold text-foreground mt-2">查看报告</p>
          <p className="text-sm text-muted-foreground">查看详细分析报告</p>
        </button>
      </div>
    </div>
  );
};

// =====================================================
// 用户管理
// =====================================================

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: number;
  xp: number;
  status: 'active' | 'suspended' | 'banned';
  role: 'user' | 'moderator' | 'admin';
  createdAt: Date;
  lastActive: Date;
}

interface UserManagementProps {
  users: User[];
  onUpdateUser: (userId: string, updates: Partial<User>) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onUpdateUser,
  onDeleteUser
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: User['status']) => {
    const styles = {
      active: 'bg-green-500/10 text-green-500',
      suspended: 'bg-yellow-500/10 text-yellow-500',
      banned: 'bg-red-500/10 text-red-500'
    };
    const labels = {
      active: '活跃',
      suspended: '暂停',
      banned: '封禁'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getRoleBadge = (role: User['role']) => {
    const styles = {
      user: 'bg-slate-800/50/50/10 text-gray-400',
      moderator: 'bg-blue-500/10 text-blue-500',
      admin: 'bg-purple-500/10 text-purple-500'
    };
    const labels = {
      user: '用户',
      moderator: '版主',
      admin: '管理员'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[role]}`}>
        {labels[role]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">用户管理</h2>
          <p className="text-muted-foreground">管理平台用户</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          导出用户
        </button>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索用户名或邮箱..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-border bg-background"
        >
          <option value="all">全部状态</option>
          <option value="active">活跃</option>
          <option value="suspended">暂停</option>
          <option value="banned">封禁</option>
        </select>
      </div>

      {/* 用户列表 */}
      <div className="bg-muted/30 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">用户</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">等级</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">状态</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">角色</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">注册时间</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-b border-border/50 hover:bg-muted/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold">
                      {user.avatar ? (
                        <img loading="lazy" src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">Lv.{user.level}</span>
                    <span className="text-sm text-muted-foreground">({user.xp.toLocaleString()} XP)</span>
                  </div>
                </td>
                <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {user.createdAt.toLocaleDateString('zh-CN')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                      title="编辑"
                    >
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDeleteUser(user.id)}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="删除"
                    >
                      <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// =====================================================
// 工具管理
// =====================================================

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  logo?: string;
  website: string;
  rating: number;
  reviewCount: number;
  status: 'active' | 'pending' | 'rejected';
  createdAt: Date;
}

interface ToolManagementProps {
  tools: Tool[];
  onUpdateTool: (toolId: string, updates: Partial<Tool>) => Promise<void>;
  onDeleteTool: (toolId: string) => Promise<void>;
}

export const ToolManagement: React.FC<ToolManagementProps> = ({
  tools,
  onUpdateTool,
  onDeleteTool
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: Tool['status']) => {
    const styles = {
      active: 'bg-green-500/10 text-green-500',
      pending: 'bg-yellow-500/10 text-yellow-500',
      rejected: 'bg-red-500/10 text-red-500'
    };
    const labels = {
      active: '已上线',
      pending: '待审核',
      rejected: '已拒绝'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">工具管理</h2>
          <p className="text-muted-foreground">管理 AI 工具列表</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          添加工具
        </button>
      </div>

      {/* 搜索 */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="搜索工具名称或分类..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* 工具列表 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map(tool => (
          <div key={tool.id} className="bg-muted/30 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                  {tool.logo ? (
                    <img loading="lazy" src={tool.logo} alt={tool.name} className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    tool.name.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground">{tool.category}</p>
                </div>
              </div>
              {getStatusBadge(tool.status)}
            </div>

            <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
              {tool.description}
            </p>

            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">⭐</span>
                <span className="text-foreground">{tool.rating.toFixed(1)}</span>
              </div>
              <div className="text-muted-foreground">
                {tool.reviewCount} 评价
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => onUpdateTool(tool.id, { status: 'active' })}
                className="flex-1 px-3 py-2 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              >
                编辑
              </button>
              <button
                onClick={() => onDeleteTool(tool.id)}
                className="px-3 py-2 text-sm bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =====================================================
// 评价审核
// =====================================================

interface Review {
  id: string;
  userId: string;
  userName: string;
  toolId: string;
  toolName: string;
  rating: number;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

interface ReviewModerationProps {
  reviews: Review[];
  onApprove: (reviewId: string) => Promise<void>;
  onReject: (reviewId: string) => Promise<void>;
}

export const ReviewModeration: React.FC<ReviewModerationProps> = ({
  reviews,
  onApprove,
  onReject
}) => {
  const pendingReviews = reviews.filter(r => r.status === 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">评价审核</h2>
        <p className="text-muted-foreground">
          {pendingReviews.length} 条评价待审核
        </p>
      </div>

      {pendingReviews.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-xl">
          <span className="text-4xl">✅</span>
          <p className="mt-4 text-lg font-medium text-foreground">没有待审核的评价</p>
          <p className="text-muted-foreground">所有评价都已处理完毕</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingReviews.map(review => (
            <div key={review.id} className="bg-muted/30 rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{review.userName}</span>
                    <span className="text-muted-foreground">评价了</span>
                    <span className="font-medium text-primary">{review.toolName}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-muted'}>
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {review.createdAt.toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-foreground">{review.content}</p>

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => onApprove(review.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  通过
                </button>
                <button
                  onClick={() => onReject(review.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  拒绝
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// =====================================================
// 系统设置
// =====================================================

interface SystemSettingsProps {
  settings: {
    siteName: string;
    siteDescription: string;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    emailVerificationRequired: boolean;
    xpMultiplier: number;
    maxDailyTasks: number;
  };
  onSave: (settings: SystemSettingsProps['settings']) => Promise<void>;
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({
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
        <h2 className="text-2xl font-bold text-foreground">系统设置</h2>
        <p className="text-muted-foreground">配置平台全局设置</p>
      </div>

      {/* 基本设置 */}
      <div className="bg-muted/30 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">基本设置</h3>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">网站名称</label>
          <input
            type="text"
            value={settings.siteName}
            onChange={e => setSettings({ ...settings, siteName: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">网站描述</label>
          <textarea
            value={settings.siteDescription}
            onChange={e => setSettings({ ...settings, siteDescription: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background resize-none"
          />
        </div>
      </div>

      {/* 功能开关 */}
      <div className="bg-muted/30 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">功能开关</h3>
        {[
          { key: 'maintenanceMode', label: '维护模式', desc: '开启后用户无法访问网站' },
          { key: 'registrationEnabled', label: '开放注册', desc: '允许新用户注册' },
          { key: 'emailVerificationRequired', label: '邮箱验证', desc: '要求用户验证邮箱' }
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between py-2">
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
                  absolute top-1 w-4 h-4 rounded-full bg-slate-800/50 transition-transform
                  ${settings[item.key as keyof typeof settings] ? 'left-7' : 'left-1'}
                `}
              />
            </button>
          </div>
        ))}
      </div>

      {/* XP 设置 */}
      <div className="bg-muted/30 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">XP 设置</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">XP 倍率</label>
            <input
              type="number"
              value={settings.xpMultiplier}
              onChange={e => setSettings({ ...settings, xpMultiplier: parseFloat(e.target.value) })}
              min={0.1}
              max={10}
              step={0.1}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">每日任务上限</label>
            <input
              type="number"
              value={settings.maxDailyTasks}
              onChange={e => setSettings({ ...settings, maxDailyTasks: parseInt(e.target.value) })}
              min={1}
              max={100}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background"
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
          {isSaving ? '保存中...' : '保存设置'}
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
