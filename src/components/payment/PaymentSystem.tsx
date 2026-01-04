import React, { useState } from 'react';

// =====================================================
// 支付系统组件
// 任务: 141-150 支付相关任务
// =====================================================

// 支付方式类型
type PaymentMethod = 'card' | 'alipay' | 'wechat' | 'paypal';

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  availableMethods?: PaymentMethod[];
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selected,
  onSelect,
  availableMethods = ['card', 'alipay', 'wechat', 'paypal']
}) => {
  const methods: { id: PaymentMethod; name: string; icon: React.ReactNode }[] = [
    {
      id: 'card',
      name: '银行卡',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      id: 'alipay',
      name: '支付宝',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.422 15.358c-.598-.187-3.465-1.242-5.828-2.134.744-1.584 1.32-3.387 1.627-5.224H13.5V6.5h4.5V5h-4.5V2.5h-2V5H7v1.5h4.5V8H8.25v1.5h7.5c-.234 1.32-.656 2.555-1.219 3.656-2.25-.797-4.078-1.406-4.078-1.406C8.016 10.969 6 11.953 6 14.25c0 1.875 1.547 3.375 4.125 3.375 2.016 0 3.656-.984 4.875-2.531 2.578 1.125 5.766 2.531 5.766 2.531.281.094.609.141.984.141 1.5 0 2.25-.984 2.25-2.25 0-.469-.141-.938-.422-1.266-.14-.188-.14-.188-.156-.188v-.704zM9.75 15.75c-1.406 0-2.25-.656-2.25-1.5 0-1.031.938-1.594 2.344-1.031.844.328 1.781.75 2.719 1.219-.844 1.031-1.875 1.312-2.813 1.312z"/>
        </svg>
      )
    },
    {
      id: 'wechat',
      name: '微信支付',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zm-2.036 2.87c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982z"/>
        </svg>
      )
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 00-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 00-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 00.554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 01.923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {methods.filter(m => availableMethods.includes(m.id)).map(method => (
        <button
          key={method.id}
          onClick={() => onSelect(method.id)}
          className={`
            flex items-center gap-3 p-4 rounded-lg border-2 transition-all
            ${selected === method.id
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
            }
          `}
        >
          <div className={`${selected === method.id ? 'text-primary' : 'text-muted-foreground'}`}>
            {method.icon}
          </div>
          <span className={`font-medium ${selected === method.id ? 'text-primary' : 'text-foreground'}`}>
            {method.name}
          </span>
        </button>
      ))}
    </div>
  );
};

// =====================================================
// 银行卡输入组件
// =====================================================

interface CardInputProps {
  onSubmit: (cardData: {
    number: string;
    expiry: string;
    cvc: string;
    name: string;
  }) => void;
}

export const CardInput: React.FC<CardInputProps> = ({ onSubmit }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      number: cardNumber.replace(/\s/g, ''),
      expiry,
      cvc,
      name
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          卡号
        </label>
        <input
          type="text"
          value={cardNumber}
          onChange={e => setCardNumber(formatCardNumber(e.target.value))}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          className="w-full p-3 rounded-lg border border-border bg-background"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            有效期
          </label>
          <input
            type="text"
            value={expiry}
            onChange={e => setExpiry(formatExpiry(e.target.value))}
            placeholder="MM/YY"
            maxLength={5}
            className="w-full p-3 rounded-lg border border-border bg-background"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            CVC
          </label>
          <input
            type="text"
            value={cvc}
            onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="123"
            maxLength={4}
            className="w-full p-3 rounded-lg border border-border bg-background"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          持卡人姓名
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="ZHANG SAN"
          className="w-full p-3 rounded-lg border border-border bg-background uppercase"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 px-4 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        确认支付
      </button>
    </form>
  );
};

// =====================================================
// 支付处理中组件
// =====================================================

interface PaymentProcessingProps {
  amount: number;
  currency?: string;
}

export const PaymentProcessing: React.FC<PaymentProcessingProps> = ({
  amount,
  currency = 'CNY'
}) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-6 relative">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">支付处理中</h3>
      <p className="text-muted-foreground mb-4">
        正在处理您的支付，请稍候...
      </p>
      <p className="text-2xl font-bold text-primary">
        {currency === 'CNY' ? '¥' : '$'}{amount.toFixed(2)}
      </p>
    </div>
  );
};

// =====================================================
// 支付成功组件
// =====================================================

interface PaymentSuccessProps {
  amount: number;
  xpAmount: number;
  transactionId: string;
  onContinue: () => void;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  amount,
  xpAmount,
  transactionId,
  onContinue
}) => {
  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h3 className="text-2xl font-bold text-foreground mb-2">支付成功！</h3>
      <p className="text-muted-foreground mb-6">
        您已成功购买 {xpAmount.toLocaleString()} XP
      </p>

      <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-muted-foreground">支付金额</span>
          <span className="font-medium text-foreground">¥{amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-muted-foreground">获得 XP</span>
          <span className="font-medium text-primary">+{xpAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-muted-foreground">交易号</span>
          <span className="font-mono text-sm text-foreground">{transactionId}</span>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="w-full py-3 px-4 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        完成
      </button>
    </div>
  );
};

// =====================================================
// 支付失败组件
// =====================================================

interface PaymentFailedProps {
  error: string;
  onRetry: () => void;
  onCancel: () => void;
}

export const PaymentFailed: React.FC<PaymentFailedProps> = ({
  error,
  onRetry,
  onCancel
}) => {
  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <h3 className="text-2xl font-bold text-foreground mb-2">支付失败</h3>
      <p className="text-muted-foreground mb-6">{error}</p>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 px-4 rounded-lg font-medium border border-border hover:bg-muted transition-colors"
        >
          取消
        </button>
        <button
          onClick={onRetry}
          className="flex-1 py-3 px-4 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          重试
        </button>
      </div>
    </div>
  );
};

// =====================================================
// 订单摘要组件
// =====================================================

interface OrderSummaryProps {
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  discount?: number;
  currency?: string;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  discount = 0,
  currency = 'CNY'
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal - discount;
  const symbol = currency === 'CNY' ? '¥' : '$';

  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <h4 className="font-semibold text-foreground mb-4">订单摘要</h4>
      
      <div className="space-y-3 mb-4">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {item.name} x {item.quantity}
            </span>
            <span className="text-foreground">
              {symbol}{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">小计</span>
          <span className="text-foreground">{symbol}{subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">折扣</span>
            <span className="text-green-500">-{symbol}{discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
          <span className="text-foreground">总计</span>
          <span className="text-primary">{symbol}{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// 优惠码输入组件
// =====================================================

interface CouponInputProps {
  onApply: (code: string) => Promise<{ valid: boolean; discount?: number; message?: string }>;
}

export const CouponInput: React.FC<CouponInputProps> = ({ onApply }) => {
  const [code, setCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [result, setResult] = useState<{ valid: boolean; message?: string } | null>(null);

  const handleApply = async () => {
    if (!code.trim()) return;
    
    setIsApplying(true);
    setResult(null);
    
    try {
      const res = await onApply(code.trim().toUpperCase());
      setResult({ valid: res.valid, message: res.message });
      if (res.valid) {
        setCode('');
      }
    } catch (err) {
      setResult({ valid: false, message: '验证失败，请重试' });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="输入优惠码"
          className="flex-1 p-3 rounded-lg border border-border bg-background uppercase"
        />
        <button
          onClick={handleApply}
          disabled={isApplying || !code.trim()}
          className={`
            px-4 rounded-lg font-medium transition-colors
            ${isApplying || !code.trim()
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }
          `}
        >
          {isApplying ? '验证中...' : '应用'}
        </button>
      </div>
      {result && (
        <p className={`text-sm ${result.valid ? 'text-green-500' : 'text-destructive'}`}>
          {result.message || (result.valid ? '优惠码已应用' : '无效的优惠码')}
        </p>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
