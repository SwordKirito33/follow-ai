/**
 * Data Export Utilities
 * Provides functions to export user data in various formats
 */

interface ExportOptions {
  filename?: string;
  includeTimestamp?: boolean;
}

/**
 * Export data as JSON file
 */
export const exportAsJSON = (data: any, options: ExportOptions = {}) => {
  const { filename = 'export', includeTimestamp = true } = options;
  const timestamp = includeTimestamp ? `-${new Date().toISOString().split('T')[0]}` : '';
  const fullFilename = `${filename}${timestamp}.json`;

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  downloadBlob(blob, fullFilename);
};

/**
 * Export data as CSV file
 */
export const exportAsCSV = (
  data: Record<string, any>[],
  options: ExportOptions = {}
) => {
  const { filename = 'export', includeTimestamp = true } = options;
  const timestamp = includeTimestamp ? `-${new Date().toISOString().split('T')[0]}` : '';
  const fullFilename = `${filename}${timestamp}.csv`;

  if (!data.length) {
    console.warn('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          // Escape quotes and wrap in quotes if contains comma
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value ?? '';
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, fullFilename);
};

/**
 * Export data as Excel-compatible file (using CSV with BOM)
 */
export const exportAsExcel = (
  data: Record<string, any>[],
  options: ExportOptions = {}
) => {
  const { filename = 'export', includeTimestamp = true } = options;
  const timestamp = includeTimestamp ? `-${new Date().toISOString().split('T')[0]}` : '';
  const fullFilename = `${filename}${timestamp}.csv`;

  if (!data.length) {
    console.warn('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value ?? '';
        })
        .join(',')
    ),
  ].join('\n');

  // Add BOM for Excel compatibility
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, fullFilename);
};

/**
 * Export transaction history
 */
export const exportTransactions = (
  transactions: any[],
  format: 'json' | 'csv' = 'csv'
) => {
  const formattedData = transactions.map((t) => ({
    Date: new Date(t.created_at).toLocaleDateString(),
    Type: t.type,
    Amount: t.amount,
    Currency: t.currency,
    XP: t.xp_amount,
    Status: t.status,
    'Transaction ID': t.id,
  }));

  if (format === 'json') {
    exportAsJSON(formattedData, { filename: 'transactions' });
  } else {
    exportAsCSV(formattedData, { filename: 'transactions' });
  }
};

/**
 * Export XP history
 */
export const exportXPHistory = (
  history: any[],
  format: 'json' | 'csv' = 'csv'
) => {
  const formattedData = history.map((h) => ({
    Date: new Date(h.created_at).toLocaleDateString(),
    Source: h.source,
    'XP Earned': h.xp_earned,
    'Total XP': h.total_xp,
    Level: h.level,
    Description: h.description,
  }));

  if (format === 'json') {
    exportAsJSON(formattedData, { filename: 'xp-history' });
  } else {
    exportAsCSV(formattedData, { filename: 'xp-history' });
  }
};

/**
 * Export user profile data
 */
export const exportProfileData = (profile: any) => {
  const exportData = {
    exportDate: new Date().toISOString(),
    profile: {
      displayName: profile.display_name,
      email: profile.email,
      joinedAt: profile.created_at,
      level: profile.level,
      totalXP: profile.total_xp,
      currentXP: profile.xp,
    },
    // Note: Sensitive data should be excluded
  };

  exportAsJSON(exportData, { filename: 'profile-data' });
};

/**
 * Helper function to trigger file download
 */
const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default {
  exportAsJSON,
  exportAsCSV,
  exportAsExcel,
  exportTransactions,
  exportXPHistory,
  exportProfileData,
};
