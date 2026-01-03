/**
 * Transaction Export Utilities
 * Export transactions to CSV, PDF, and Excel formats
 */

interface Transaction {
  id: string;
  date: Date;
  type: string;
  amount: number;
  xp: number;
  status: string;
  description?: string;
  reference?: string;
}

interface ExportOptions {
  filename?: string;
  dateRange?: { start: Date; end: Date };
  includeHeaders?: boolean;
  currency?: string;
}

/**
 * Export transactions to CSV
 */
export const exportToCSV = (
  transactions: Transaction[],
  options: ExportOptions = {}
): void => {
  const {
    filename = `transactions_${new Date().toISOString().split('T')[0]}`,
    includeHeaders = true,
    currency = 'CNY',
  } = options;

  const headers = ['Date', 'Type', 'Amount', 'XP', 'Status', 'Description', 'Reference'];
  
  const rows = transactions.map((t) => [
    new Date(t.date).toLocaleDateString(),
    t.type,
    `${currency}${t.amount.toFixed(2)}`,
    t.xp > 0 ? `+${t.xp}` : t.xp.toString(),
    t.status,
    t.description || '',
    t.reference || '',
  ]);

  const csvContent = [
    includeHeaders ? headers.join(',') : '',
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ]
    .filter(Boolean)
    .join('\n');

  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
};

/**
 * Export transactions to JSON
 */
export const exportToJSON = (
  transactions: Transaction[],
  options: ExportOptions = {}
): void => {
  const { filename = `transactions_${new Date().toISOString().split('T')[0]}` } = options;

  const data = {
    exportDate: new Date().toISOString(),
    totalTransactions: transactions.length,
    transactions: transactions.map((t) => ({
      ...t,
      date: new Date(t.date).toISOString(),
    })),
  };

  downloadFile(JSON.stringify(data, null, 2), `${filename}.json`, 'application/json');
};

/**
 * Generate PDF report (returns HTML for printing)
 */
export const generatePDFReport = (
  transactions: Transaction[],
  options: ExportOptions = {}
): string => {
  const { currency = 'CNY' } = options;

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalXP = transactions.reduce((sum, t) => sum + t.xp, 0);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Transaction Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { color: #1a1a1a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
        .summary { display: flex; gap: 40px; margin: 20px 0; }
        .summary-item { background: #f3f4f6; padding: 20px; border-radius: 8px; }
        .summary-label { color: #6b7280; font-size: 14px; }
        .summary-value { font-size: 24px; font-weight: bold; color: #1a1a1a; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #3b82f6; color: white; padding: 12px; text-align: left; }
        td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
        tr:hover { background: #f9fafb; }
        .positive { color: #10b981; }
        .negative { color: #ef4444; }
        .status-completed { color: #10b981; }
        .status-pending { color: #f59e0b; }
        .footer { margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px; }
      </style>
    </head>
    <body>
      <h1>Transaction Report</h1>
      <p>Generated on ${new Date().toLocaleDateString()}</p>
      
      <div class="summary">
        <div class="summary-item">
          <div class="summary-label">Total Transactions</div>
          <div class="summary-value">${transactions.length}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Total Amount</div>
          <div class="summary-value">${currency}${totalAmount.toFixed(2)}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Total XP</div>
          <div class="summary-value">${totalXP > 0 ? '+' : ''}${totalXP.toLocaleString()}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>XP</th>
            <th>Status</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${transactions
            .map(
              (t) => `
            <tr>
              <td>${new Date(t.date).toLocaleDateString()}</td>
              <td>${t.type}</td>
              <td>${currency}${t.amount.toFixed(2)}</td>
              <td class="${t.xp > 0 ? 'positive' : 'negative'}">${t.xp > 0 ? '+' : ''}${t.xp}</td>
              <td class="status-${t.status.toLowerCase()}">${t.status}</td>
              <td>${t.description || '-'}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <div class="footer">
        <p>Follow.ai - Transaction Report</p>
        <p>This report was automatically generated. For questions, contact support@follow.ai</p>
      </div>
    </body>
    </html>
  `;

  return html;
};

/**
 * Print PDF report
 */
export const printPDFReport = (
  transactions: Transaction[],
  options: ExportOptions = {}
): void => {
  const html = generatePDFReport(transactions, options);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  }
};

/**
 * Download PDF report
 */
export const downloadPDFReport = async (
  transactions: Transaction[],
  options: ExportOptions = {}
): Promise<void> => {
  const { filename = `transactions_${new Date().toISOString().split('T')[0]}` } = options;
  const html = generatePDFReport(transactions, options);
  
  // Create a blob and download
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Helper function to download file
 */
const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Calculate transaction statistics
 */
export const calculateTransactionStats = (transactions: Transaction[]) => {
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalXP = transactions.reduce((sum, t) => sum + t.xp, 0);
  const completedCount = transactions.filter((t) => t.status === 'completed').length;
  const pendingCount = transactions.filter((t) => t.status === 'pending').length;

  const byType = transactions.reduce((acc, t) => {
    acc[t.type] = (acc[t.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byMonth = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
    acc[month] = (acc[month] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalAmount,
    totalXP,
    totalCount: transactions.length,
    completedCount,
    pendingCount,
    completionRate: transactions.length > 0 ? (completedCount / transactions.length) * 100 : 0,
    byType,
    byMonth,
    averageAmount: transactions.length > 0 ? totalAmount / transactions.length : 0,
    averageXP: transactions.length > 0 ? totalXP / transactions.length : 0,
  };
};

export default {
  exportToCSV,
  exportToJSON,
  generatePDFReport,
  printPDFReport,
  downloadPDFReport,
  calculateTransactionStats,
};
