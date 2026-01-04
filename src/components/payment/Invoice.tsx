import React from 'react';

// =====================================================
// 发票和收据组件
// 任务: 151-155 发票相关任务
// =====================================================

interface InvoiceItem {
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface InvoiceProps {
  invoiceNumber: string;
  date: Date;
  dueDate?: Date;
  status: 'paid' | 'pending' | 'overdue';
  
  // 卖方信息
  seller: {
    name: string;
    address?: string;
    email?: string;
    phone?: string;
    taxId?: string;
  };
  
  // 买方信息
  buyer: {
    name: string;
    email: string;
    address?: string;
  };
  
  // 商品明细
  items: InvoiceItem[];
  
  // 金额
  subtotal: number;
  tax?: number;
  taxRate?: number;
  discount?: number;
  total: number;
  
  // 货币
  currency?: string;
  
  // 备注
  notes?: string;
  
  // 操作
  onDownload?: () => void;
  onPrint?: () => void;
}

export const Invoice: React.FC<InvoiceProps> = ({
  invoiceNumber,
  date,
  dueDate,
  status,
  seller,
  buyer,
  items,
  subtotal,
  tax = 0,
  taxRate,
  discount = 0,
  total,
  currency = 'CNY',
  notes,
  onDownload,
  onPrint
}) => {
  const symbol = currency === 'CNY' ? '¥' : '$';
  
  const formatDate = (d: Date) => {
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = () => {
    const styles = {
      paid: 'bg-green-500/10 text-green-500',
      pending: 'bg-yellow-500/10 text-yellow-500',
      overdue: 'bg-destructive/10 text-destructive'
    };
    const labels = {
      paid: '已支付',
      pending: '待支付',
      overdue: '已逾期'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="bg-background rounded-lg border border-border overflow-hidden">
      {/* 头部 */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">发票</h2>
            <p className="text-muted-foreground mt-1">#{invoiceNumber}</p>
          </div>
          <div className="text-right">
            {getStatusBadge()}
            <p className="text-sm text-muted-foreground mt-2">
              开票日期: {formatDate(date)}
            </p>
            {dueDate && (
              <p className="text-sm text-muted-foreground">
                到期日期: {formatDate(dueDate)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 买卖双方信息 */}
      <div className="p-6 grid grid-cols-2 gap-6 border-b border-border">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">卖方</h4>
          <p className="font-semibold text-foreground">{seller.name}</p>
          {seller.address && <p className="text-sm text-muted-foreground">{seller.address}</p>}
          {seller.email && <p className="text-sm text-muted-foreground">{seller.email}</p>}
          {seller.phone && <p className="text-sm text-muted-foreground">{seller.phone}</p>}
          {seller.taxId && <p className="text-sm text-muted-foreground">税号: {seller.taxId}</p>}
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">买方</h4>
          <p className="font-semibold text-foreground">{buyer.name}</p>
          <p className="text-sm text-muted-foreground">{buyer.email}</p>
          {buyer.address && <p className="text-sm text-muted-foreground">{buyer.address}</p>}
        </div>
      </div>

      {/* 商品明细 */}
      <div className="p-6 border-b border-border">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-muted-foreground border-b border-border">
              <th className="pb-3 font-medium">商品</th>
              <th className="pb-3 font-medium text-right">数量</th>
              <th className="pb-3 font-medium text-right">单价</th>
              <th className="pb-3 font-medium text-right">金额</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b border-border last:border-0">
                <td className="py-3">
                  <p className="font-medium text-foreground">{item.name}</p>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  )}
                </td>
                <td className="py-3 text-right text-foreground">{item.quantity}</td>
                <td className="py-3 text-right text-foreground">{symbol}{item.unitPrice.toFixed(2)}</td>
                <td className="py-3 text-right text-foreground">{symbol}{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 金额汇总 */}
      <div className="p-6 border-b border-border">
        <div className="max-w-xs ml-auto space-y-2">
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
          {tax > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                税费 {taxRate ? `(${taxRate}%)` : ''}
              </span>
              <span className="text-foreground">{symbol}{tax.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
            <span className="text-foreground">总计</span>
            <span className="text-primary">{symbol}{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 备注 */}
      {notes && (
        <div className="p-6 border-b border-border">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">备注</h4>
          <p className="text-sm text-foreground">{notes}</p>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="p-6 flex gap-3">
        {onDownload && (
          <button
            onClick={onDownload}
            className="flex-1 py-2 px-4 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            下载 PDF
          </button>
        )}
        {onPrint && (
          <button
            onClick={onPrint}
            className="flex-1 py-2 px-4 rounded-lg font-medium border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            打印
          </button>
        )}
      </div>
    </div>
  );
};

// =====================================================
// 发票列表组件
// =====================================================

interface InvoiceListItem {
  id: string;
  invoiceNumber: string;
  date: Date;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

interface InvoiceListProps {
  invoices: InvoiceListItem[];
  onView: (id: string) => void;
  onDownload: (id: string) => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  onView,
  onDownload
}) => {
  const getStatusBadge = (status: InvoiceListItem['status']) => {
    const styles = {
      paid: 'bg-green-500/10 text-green-500',
      pending: 'bg-yellow-500/10 text-yellow-500',
      overdue: 'bg-destructive/10 text-destructive'
    };
    const labels = {
      paid: '已支付',
      pending: '待支付',
      overdue: '已逾期'
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        暂无发票记录
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invoices.map(invoice => (
        <div
          key={invoice.id}
          className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg className="w-5 h-5
