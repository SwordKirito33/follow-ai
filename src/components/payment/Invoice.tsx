import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate?: string;
}

interface InvoiceListProps {
  invoices?: Invoice[];
  onDownload?: (invoiceId: string) => void;
  onView?: (invoiceId: string) => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ 
  invoices = [],
  onDownload,
  onView 
}) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-500 bg-green-500/10';
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'overdue':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return t('invoice.paid') || 'Paid';
      case 'pending':
        return t('invoice.pending') || 'Pending';
      case 'overdue':
        return t('invoice.overdue') || 'Overdue';
      default:
        return status;
    }
  };

  const handleDownload = async (invoiceId: string) => {
    setLoading(true);
    try {
      if (onDownload) {
        await onDownload(invoiceId);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (invoiceId: string) => {
    setLoading(true);
    try {
      if (onView) {
        await onView(invoiceId);
      }
    } finally {
      setLoading(false);
    }
  };

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {t('invoice.noRecords') || 'No invoices found'}
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
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{invoice.number}</p>
              <p className="text-xs text-muted-foreground">{invoice.date}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-sm">${invoice.amount.toFixed(2)}</p>
              <p className={`text-xs font-medium ${getStatusColor(invoice.status)}`}>
                {getStatusLabel(invoice.status)}
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleView(invoice.id)}
                disabled={loading}
                className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
                aria-label={t('invoice.view') || 'View invoice'}
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDownload(invoice.id)}
                disabled={loading}
                className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
                aria-label={t('invoice.download') || 'Download invoice'}
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvoiceList;
