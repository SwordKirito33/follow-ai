/**
 * Data export utilities
 * Supports CSV and JSON export
 */

/**
 * Convert data to CSV format
 */
export function exportToCSV(data: any[], filename: string): void {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ];

  const csvContent = csvRows.join('\n');
  
  // Create and download file
  downloadFile(csvContent, filename, 'text/csv');
}

/**
 * Convert data to JSON format
 */
export function exportToJSON(data: any, filename: string): void {
  if (!data) {
    throw new Error('No data to export');
  }

  const jsonContent = JSON.stringify(data, null, 2);
  
  // Create and download file
  downloadFile(jsonContent, filename, 'application/json');
}

/**
 * Download file
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export user data
 */
export function exportUserData(user: any): void {
  const timestamp = new Date().toISOString().split('T')[0];
  exportToJSON(user, `user-data-${timestamp}.json`);
}

/**
 * Export transactions
 */
export function exportTransactions(transactions: any[]): void {
  const timestamp = new Date().toISOString().split('T')[0];
  exportToCSV(transactions, `transactions-${timestamp}.csv`);
}

/**
 * Export XP history
 */
export function exportXPHistory(history: any[]): void {
  const timestamp = new Date().toISOString().split('T')[0];
  exportToCSV(history, `xp-history-${timestamp}.csv`);
}

/**
 * Export reviews
 */
export function exportReviews(reviews: any[]): void {
  const timestamp = new Date().toISOString().split('T')[0];
  exportToCSV(reviews, `reviews-${timestamp}.csv`);
}

/**
 * Export all user data
 */
export function exportAllUserData(data: {
  user: any;
  transactions: any[];
  xpHistory: any[];
  reviews: any[];
}): void {
  const timestamp = new Date().toISOString().split('T')[0];
  exportToJSON(data, `all-user-data-${timestamp}.json`);
}
