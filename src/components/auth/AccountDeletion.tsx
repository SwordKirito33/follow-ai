import React, { useState } from 'react';

// =====================================================
// 账户删除组件
// 任务: 140. 实现账户删除功能
// =====================================================

interface AccountDeletionProps {
  email: string;
  onDelete: (password: string, reason?: string) => Promise<void>;
  onCancel: () => void;
}

export const AccountDeletion: React.FC<AccountDeletionProps> = ({
  email,
  onDelete,
  onCancel
}) => {
  const [step, setStep] = useState<'warning' | 'confirm' | 'reason'>('warning');
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reasons = [
    '不再需要此服务',
    '找到了更好的替代品',
    '隐私/安全顾虑',
    '使用体验不佳',
    '其他原因'
  ];

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      setError('请输入 DELETE 确认删除');
      return;
    }

    if (!password) {
      setError('请输入密码');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const finalReason = reason === '其他原因' ? customReason : reason;
      await onDelete(password, finalReason);
    } catch (err) {
      setError('删除失败，请检查密码是否正确');
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {step === 'warning' && (
        <div className="p-6">
          {/* 警告图标 */}
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-foreground text-center mb-2">删除账户</h2>
          <p className="text-muted-foreground text-center mb-6">
            此操作不可逆，请仔细阅读以下内容
          </p>

          {/* 警告内容 */}
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-destructive mb-3">删除账户后：</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>您的所有数据将被永久删除</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>您的 XP 和等级将无法恢复</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>您的评论和提交记录将被匿名化</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>您将无法使用此邮箱重新注册</span>
              </li>
            </ul>
          </div>

          {/* 按钮 */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 px-4 rounded-lg font-medium border border-border hover:bg-muted transition-colors"
            >
              取消
            </button>
            <button
              onClick={() => setStep('reason')}
              className="flex-1 py-3 px-4 rounded-lg font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
            >
              继续
            </button>
          </div>
        </div>
      )}

      {step === 'reason' && (
        <div className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-2">告诉我们原因</h2>
          <p className="text-muted-foreground mb-6">
            您的反馈将帮助我们改进服务（可选）
          </p>

          <div className="space-y-3 mb-6">
            {reasons.map(r => (
              <label
                key={r}
                className={`
                  flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                  ${reason === r ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted'}
                `}
              >
                <input
                  type="radio"
                  name="reason"
                  value={r}
                  checked={reason === r}
                  onChange={e => setReason(e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-foreground">{r}</span>
              </label>
            ))}
          </div>

          {reason === '其他原因' && (
            <textarea
              value={customReason}
              onChange={e => setCustomReason(e.target.value)}
              placeholder="请告诉我们您的原因..."
              className="w-full p-3 rounded-lg border border-border bg-background resize-none h-24 mb-6"
            />
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep('warning')}
              className="flex-1 py-3 px-4 rounded-lg font-medium border border-border hover:bg-muted transition-colors"
            >
              返回
            </button>
            <button
              onClick={() => setStep('confirm')}
              className="flex-1 py-3 px-4 rounded-lg font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
            >
              继续
            </button>
          </div>
        </div>
      )}

      {step === 'confirm' && (
        <div className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-2">确认删除</h2>
          <p className="text-muted-foreground mb-6">
            请输入您的密码并确认删除
          </p>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="输入您的密码"
                className="w-full p-3 rounded-lg border border-border bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                输入 <span className="font-mono text-destructive">DELETE</span> 确认
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full p-3 rounded-lg border border-border bg-background font-mono"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('reason')}
              disabled={isDeleting}
              className="flex-1 py-3 px-4 rounded-lg font-medium border border-border hover:bg-muted transition-colors"
            >
              返回
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting || confirmText !== 'DELETE' || !password}
              className={`
                flex-1 py-3 px-4 rounded-lg font-medium transition-colors
                ${isDeleting || confirmText !== 'DELETE' || !password
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                }
              `}
            >
              {isDeleting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  删除中...
                </span>
              ) : (
                '永久删除账户'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDeletion;
