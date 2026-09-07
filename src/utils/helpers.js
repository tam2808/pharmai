/**
 * Format number with Vietnamese locale (e.g. 1.000.000)
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Format number with dot separators (e.g. 12.400+)
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('vi-VN').format(num);
};

/**
 * Format date string or timestamp to Vietnamese format
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch (e) {
    return String(dateStr);
  }
};

/**
 * Truncate text to maxLength characters
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Generate random ID
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

/**
 * Check if prefers-reduced-motion is enabled
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Classname merge utility (simple version)
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
