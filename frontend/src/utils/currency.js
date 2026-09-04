/**
 * Shared currency formatter for GymForce
 * All currency must be displayed in Indian Rupees (₹)
 */

/**
 * Format a number as Indian Rupees
 * @param {number|string} amount - Amount to format
 * @returns {string} Formatted currency string (e.g., "₹2,499")
 */
export function formatCurrency(amount) {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '₹0';
  return `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

/**
 * Parse currency string to number
 * @param {string} currencyString - Currency string (e.g., "₹2,499" or "2499")
 * @returns {number} Parsed number
 */
export function parseCurrency(currencyString) {
  if (typeof currencyString === 'number') return currencyString;
  const cleaned = String(currencyString).replace(/[₹,\s]/g, '');
  return parseFloat(cleaned) || 0;
}
