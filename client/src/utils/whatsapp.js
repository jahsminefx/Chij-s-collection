import { formatPrice } from './formatters.js';

export const DEFAULT_WHATSAPP_TEMPLATE = `Hello CHIJ's Collection 👋

I'd like to order:

Product: {{product_name}}
Size: {{size}}
Price: {{price}}

Product Link:
{{product_url}}

Please confirm availability.

Thank you!`;

/**
 * Builds a dynamic WhatsApp click-to-chat URL with pre-filled message
 */
export const generateWhatsAppUrl = ({
  phone,
  template,
  product,
  size,
  productUrl,
}) => {
  if (!phone) return '#';

  // Sanitize phone number (remove spaces, plus sign, dashes, parentheses)
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  const msgTemplate = template || DEFAULT_WHATSAPP_TEMPLATE;

  const productName = product?.name || 'Item';
  const productPrice = formatPrice(product?.price || 0);
  const selectedSize = size || 'Standard';
  const categoryName = product?.category?.name || '';
  const directLink = productUrl || (typeof window !== 'undefined' ? window.location.href : '');

  const message = msgTemplate
    .replace(/\{\{product_name\}\}/gi, productName)
    .replace(/\{\{size\}\}/gi, selectedSize)
    .replace(/\{\{price\}\}/gi, productPrice)
    .replace(/\{\{product_url\}\}/gi, directLink)
    .replace(/\{\{category\}\}/gi, categoryName);

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};
