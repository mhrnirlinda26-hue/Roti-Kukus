/**
 * Format string tanggal UTC ke string tanggal lokal Asia/Jakarta (YYYY-MM-DD)
 */
export function getJakartaDateString(dateInput: string | Date = new Date()): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  // Intl format untuk Asia/Jakarta YYYY-MM-DD
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(d); // Output format: YYYY-MM-DD
}

/**
 * Cek apakah sebuah timestamp berada pada tanggal tertentu di zona Asia/Jakarta
 */
export function isSameJakartaDate(dateA: string | Date, dateB: string | Date): boolean {
  return getJakartaDateString(dateA) === getJakartaDateString(dateB);
}

/**
 * Format mata uang Rupiah
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Rp0';
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format angka
 */
export function formatNumber(value: number | null | undefined, decimals = 0): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format tanggal dalam bahasa Indonesia timezone Asia/Jakarta
 */
export function formatDate(dateString: string | Date): string {
  const d = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

/**
 * Format tanggal & jam dalam bahasa Indonesia timezone Asia/Jakarta
 */
export function formatDateTime(dateString: string | Date): string {
  const d = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Generate nomor invoice unik
 */
export function generateInvoiceNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const date = now.getDate().toString().padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-${year}${month}${date}-${random}`;
}

/**
 * Generate nomor purchase order unik
 */
export function generatePurchaseNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const date = now.getDate().toString().padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PO-${year}${month}${date}-${random}`;
}

/**
 * Penentuan status stok
 */
export function getStockStatus(currentStock: number, minimumStock: number): {
  status: 'Aman' | 'Kritis' | 'Habis';
  color: string;
  badgeClass: string;
} {
  if (currentStock <= 0) {
    return {
      status: 'Habis',
      color: '#dc2626',
      badgeClass: 'bg-red-100 text-red-800 border-red-200',
    };
  }
  if (currentStock <= minimumStock) {
    return {
      status: 'Kritis',
      color: '#d97706',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    };
  }
  return {
    status: 'Aman',
    color: '#16a34a',
    badgeClass: 'bg-green-100 text-green-800 border-green-200',
  };
}
