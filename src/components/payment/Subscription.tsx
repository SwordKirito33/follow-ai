import React, { useState } from 'react';

// =====================================================
// 订阅管理组件
// 任务: 156-160 订阅相关任务
// =====================================================

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
}

interface SubscriptionProps {
  currentPlan?: Plan;
  plans: Plan[];
  onSubscribe: (planId: string) => Promise<void>;
  onCancel: () => Promise<void>;
  onUpgrade: (planId: string) => Promise<void>;
}

export const Subscription: React.FC<SubscriptionProps> = ({
  currentPlan,
  plans,
  onSubscribe,
  onCancel,
  onUpgrade
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleSubscribe = async (planId: string) => {
    setIsProcessing(true);
    try {
      if (currentPlan) {
        await onUpgrade(planId);
      } else {
        await onSubscribe(planId);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    setIsProcessing(true);
    try {
      await onCancel();
      setShowCancelConfirm(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 当前订阅 */}
      {currentPlan && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">当前订阅</h3>
              <p className="text-muted-foreground mt-1">{currentPlan.name}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                ¥{currentPlan.price}
                <span className="text-sm font-normal text-muted-foreground">
                  /{currentPlan.interval === 'month' ? '月' : '年'}
                </span>
              </p>
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="text-sm text-muted-foreground hover:text-destructive transition-colors mt-2"
              >
                取消订阅
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 订阅计划 */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {currentPlan ? '升级计划' : '选择计划'}
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`
                relative rounded-lg border-2 p-6 transition-all cursor-pointer
                ${selectedPlan === plan.id || currentPlan?.id === plan.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
                }
                ${currentPlan?.id === plan.id ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onClick={() => currentPlan?.id !== plan.id && setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  最受欢迎
                </div>
              )}
              
              <h4 className="text-xl font-semibold text-foreground">{plan.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              
              <div className="mt-4">
                <span className="text-3xl font-bold text-foreground">¥{plan.price}</span>
                <span className="text-muted-foreground">/{plan.interval === 'month' ? '月' : '年'}</span>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {currentPlan?.id === plan.id ? (
                <div className="mt-6 py-2 text-center text-sm text-muted-foreground">
                  当前计划
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubscribe(plan.id);
                  }}
                  disabled={isProcessing}
                  className={`
                    w-full mt-6 py-2 px-4 rounded-lg font-medium transition-colors
                    ${selectedPlan === plan.id
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                    }
                  `}
                >
                  {isProcessing ? '处理中...' : currentPlan ? '升级' : '订阅'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 取消确认对话框 */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-sm w-full mx-4">
            <h4 className="text-lg font-semibold text-foreground mb-2">
              确认取消订阅？
            </h4>
            <p className="text-muted-foreground mb-6">
              取消后，您将在当前计费周期结束时失去所有高级功能。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-2 px-4 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                保留订阅
              </button>
              <button
                onClick={handleCancel}
                disabled={isProcessing}
                className="flex-1 py-2 px-4 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
              >
                {isProcessing ? '处理中...' : '确认取消'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================
// 账单历史组件
// =====================================================

interface BillingHistoryItem {
  id: string;
  date: Date;
  description: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  invoiceUrl?: string;
}

interface BillingHistoryProps {
  items: BillingHistoryItem[];
  onDownloadInvoice: (id: string) => void;
}

export const BillingHistory: React.FC<BillingHistoryProps> = ({
  items,
  onDownloadInvoice
}) => {
  const getStatusBadge = (status: BillingHistoryItem['status']) => {
    const styles = {
      paid: 'bg-green-500/10 text-green-500',
      pending: 'bg-yellow-500/10 text-yellow-500',
      failed: 'bg-destructive/10 text-destructive'
    };
    const labels = {
      paid: '已支付',
      pending: '待支付',
      failed: '支付失败'
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        暂无账单记录
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">账单历史</h3>
      <div className="space-y-3">
        {items.map(item => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 rounded-lg border border-border"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">{item.description}</p>
                <p className="text-sm text-muted-foreground">
                  {item.date.toLocaleDateString('zh-CN')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {getStatusBadge(item.status)}
              <span className="font-semibold text-foreground">¥{item.amount.toFixed(2)}</span>
              {item.invoiceUrl && (
                <button
                  onClick={() => onDownloadInvoice(item.id)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =====================================================
// 支付方式管理组件
// =====================================================

interface PaymentMethodItem {
  id: string;
  type: 'card' | 'alipay' | 'wechat';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

interface PaymentMethodsProps {
  methods: PaymentMethodItem[];
  onAdd: () => void;
  onRemove: (id: string) => Promise<void>;
  onSetDefault: (id: string) => Promise<void>;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  methods,
  onAdd,
  onRemove,
  onSetDefault
}) => {
  const [removing, setRemoving] = useState<string | null>(null);

  const handleRemove = async (id: string) => {
    setRemoving(id);
    try {
      await onRemove(id);
    } finally {
      setRemoving(null);
    }
  };

  const getMethodIcon = (type: PaymentMethodItem['type']) => {
    switch (type) {
      case 'card':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'alipay':
        return <span className="text-lg">支</span>;
      case 'wechat':
        return <span className="text-lg">微</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">支付方式</h3>
        <button
          onClick={onAdd}
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          + 添加支付方式
        </button>
      </div>

      {methods.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          暂无支付方式
        </div>
      ) : (
        <div className="space-y-3">
          {methods.map(method => (
            <div
              key={method.id}
              className={`
                flex items-center justify-between p-4 rounded-lg border transition-colors
                ${method.isDefault ? 'border-primary bg-primary/5' : 'border-border'}
              `}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                  {getMethodIcon(method.type)}
                </div>
                <div>
                  {method.type === 'card' ? (
                    <>
                      <p className="font-medium text-foreground">
                        {method.brand} •••• {method.last4}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        有效期 {method.expiryMonth}/{method.expiryYear}
                      </p>
                    </>
                  ) : (
                    <p className="font-medium text-foreground">
                      {method.type === 'alipay' ? '支付宝' : '微信支付'}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {method.isDefault ? (
                  <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                    默认
                  </span>
                ) : (
                  <button
                    onClick={() => onSetDefault(method.id)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    设为默认
                  </button>
                )}
                <button
                  onClick={() => handleRemove(method.id)}
                  disabled={removing === method.id}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  {removing === method.id ? (
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Subscription;
