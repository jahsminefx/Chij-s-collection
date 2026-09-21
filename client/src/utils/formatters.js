/**
 * Formats a numeric price into Nigerian Naira currency representation (e.g., ₦25,000)
 * @param {number|string} amount
 * @returns {string}
 */
export const formatPrice = (amount) => {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '₦0';
  }
  const numeric = Number(amount);
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(numeric);
};

/**
 * Formats an ISO date into a readable string
 * @param {string|Date} dateString
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
