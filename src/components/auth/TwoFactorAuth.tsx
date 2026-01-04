import React, { useState, useRef, useEffect } from 'react';

// =====================================================
// 双因素认证组件
// 任务: 136. 实现双因素认证 (2FA)
// =====================================================

interface TwoFactorAuthProps {
  onVerify: (code: string) => Promise<boolean>;
  onResend?: () => Promise<void>;
  onCancel?: () => void;
  email?: string;
  method?: '2fa' | 'email' | 'sms';
}

export const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({
  onVerify,
  onResend,
  onCancel,
  email,
  method = '2fa'
}) => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError(null);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // 自动提交
    if (newCode.every(c => c) && newCode.join('').length === 6) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = [...code];
    pastedData.split('').forEach((char, i) => {
      if (i < 6) newCode[i] = char;
    });
    setCode(newCode);
    
    if (pastedData.length === 6) {
      handleSubmit(pastedData);
    }
  };

  const handleSubmit = async (codeString?: string) => {
    const verifyCode = codeString || code.join('');
    if (verifyCode.length !== 6) {
      setError('请输入完整的 6 位验证码');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await onVerify(verifyCode);
      if (!success) {
        setError('验证码错误，请重试');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('验证失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !onResend) return;
    
    try {
      await onResend();
      setResendCooldown(60);
    } catch (err) {
      setError('发送失败，请稍后重试');
    }
  };

  const getMethodText = () => {
    switch (method) {
      case 'email':
        return `验证码已发送至 ${email || '您的邮箱'}`;
      case 'sms':
        return '验证码已发送至您的手机';
      default:
        return '请输入身份验证器应用中的验证码';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">双因素认证</h2>
        <p className="text-muted-foreground">{getMethodText()}</p>
      </div>

      <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
        {code.map((digit, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            className={`
              w-12 h-14 text-center text-2xl font-bold rounded-lg border-2
              focus:outline-none focus:ring-2 focus:ring-primary/50
              transition-all duration-200
              ${error ? 'border-destructive' : 'border-border focus:border-primary'}
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={isLoading}
          />
        ))}
      </div>

      {error && (
        <div className="text-center text-destructive text-sm mb-4">
          {error}
        </div>
      )}

      <button
        onClick={() => handleSubmit()}
        disabled={isLoading || code.some(c => !c)}
        className={`
          w-full py-3 px-4 rounded-lg font-medium
          transition-all duration-200
          ${isLoading || code.some(c => !c)
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            验证中...
          </span>
        ) : (
          '验证'
        )}
      </button>

      <div className="mt-6 text-center space-y-2">
        {onResend && (
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className={`
              text-sm transition-colors
              ${resendCooldown > 0
                ? 'text-muted-foreground cursor-not-allowed'
                : 'text-primary hover:text-primary/80'
              }
            `}
          >
            {resendCooldown > 0 ? `${resendCooldown}s 后可重新发送` : '重新发送验证码'}
          </button>
        )}
        
        {onCancel && (
          <button
            onClick={onCancel}
            className="block w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            取消
          </button>
        )}
      </div>
    </div>
  );
};

// =====================================================
// 2FA 设置组件
// =====================================================

interface TwoFactorSetupProps {
  qrCodeUrl: string;
  secret: string;
  onVerify: (code: string) => Promise<boolean>;
  onCancel?: () => void;
}

export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({
  qrCodeUrl,
  secret,
  onVerify,
  onCancel
}) => {
  const [step, setStep] = useState<'scan' | 'verify'>('scan');
  const [copied, setCopied] = useState(false);

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      {step === 'scan' ? (
        <>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">设置双因素认证</h2>
            <p className="text-muted-foreground">使用身份验证器应用扫描下方二维码</p>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg mb-6 mx-auto w-fit">
            <img loading="lazy" src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
          </div>

          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2 text-center">
              或手动输入以下密钥：
            </p>
            <div className="flex items-center gap-2 bg-muted rounded-lg p-3">
              <code className="flex-1 text-sm font-mono break-all">{secret}</code>
              <button
                onClick={copySecret}
                className="p-2 hover:bg-background rounded transition-colors"
              >
                {copied ? (
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            onClick={() => setStep('verify')}
            className="w-full py-3 px-4 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            下一步
          </button>

          {onCancel && (
            <button
              onClick={onCancel}
              className="w-full mt-3 py-3 px-4 rounded-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              取消
            </button>
          )}
        </>
      ) : (
        <TwoFactorAuth
          onVerify={onVerify}
          onCancel={() => setStep('scan')}
          method="2fa"
        />
      )}
    </div>
  );
};

export default TwoFactorAuth;
