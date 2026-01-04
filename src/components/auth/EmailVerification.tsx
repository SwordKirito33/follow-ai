import React, { useState, useEffect } from 'react';

// =====================================================
// 邮件验证组件
// 任务: 139. 实现邮件验证流程
// =====================================================

interface EmailVerificationProps {
  email: string;
  onResend: () => Promise<void>;
  onChangeEmail?: () => void;
  onVerified?: () => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  onResend,
  onChangeEmail,
  onVerified
}) => {
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    
    setIsResending(true);
    setError(null);
    
    try {
      await onResend();
      setResendCooldown(60);
    } catch (err) {
      setError('发送失败，请稍后重试');
    } finally {
      setIsResending(false);
    }
  };

  const maskEmail = (email: string) => {
    const [local, domain] = email.split('@');
    if (local.length <= 2) return email;
    return `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 text-center">
      {/* 图标 */}
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>

      {/* 标题 */}
      <h2 className="text-2xl font-bold text-foreground mb-2">验证您的邮箱</h2>
      <p className="text-muted-foreground mb-6">
        我们已向 <span className="font-medium text-foreground">{maskEmail(email)}</span> 发送了验证链接
      </p>

      {/* 说明 */}
      <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
        <h4 className="font-medium text-foreground mb-2">请按以下步骤操作：</h4>
        <ol className="text-sm text-muted-foreground space-y-2">
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">1</span>
            <span>打开您的邮箱</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">2</span>
            <span>找到来自 Follow.ai 的邮件</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">3</span>
            <span>点击邮件中的验证链接</span>
          </li>
        </ol>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="text-destructive text-sm mb-4">{error}</div>
      )}

      {/* 操作按钮 */}
      <div className="space-y-3">
        <button
          onClick={handleResend}
          disabled={resendCooldown > 0 || isResending}
          className={`
            w-full py-3 px-4 rounded-lg font-medium transition-all
            ${resendCooldown > 0 || isResending
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }
          `}
        >
          {isResending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              发送中...
            </span>
          ) : resendCooldown > 0 ? (
            `${resendCooldown}s 后可重新发送`
          ) : (
            '重新发送验证邮件'
          )}
        </button>

        {onChangeEmail && (
          <button
            onClick={onChangeEmail}
            className="w-full py-3 px-4 rounded-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            更换邮箱地址
          </button>
        )}
      </div>

      {/* 帮助提示 */}
      <div className="mt-8 text-sm text-muted-foreground">
        <p>没有收到邮件？</p>
        <ul className="mt-2 space-y-1">
          <li>• 检查垃圾邮件文件夹</li>
          <li>• 确认邮箱地址正确</li>
          <li>• 等待几分钟后重试</li>
        </ul>
      </div>
    </div>
  );
};

// =====================================================
// 邮件验证成功组件
// =====================================================

interface EmailVerifiedProps {
  onContinue: () => void;
}

export const EmailVerified: React.FC<EmailVerifiedProps> = ({ onContinue }) => {
  return (
    <div className="w-full max-w-md mx-auto p-6 text-center">
      {/* 成功图标 */}
      <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      {/* 标题 */}
      <h2 className="text-2xl font-bold text-foreground mb-2">邮箱验证成功！</h2>
      <p className="text-muted-foreground mb-8">
        您的邮箱已成功验证，现在可以使用所有功能了
      </p>

      {/* 继续按钮 */}
      <button
        onClick={onContinue}
        className="w-full py-3 px-4 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        开始使用
      </button>
    </div>
  );
};

export default EmailVerification;
