import React from 'react';
import { formatPrice } from '../../utils/formatters.js';

export default function WhatsAppPreview({ template, phone }) {
  const sampleProduct = {
    name: 'Classic Noir Linen Button-Down Shirt',
    size: 'L',
    price: 26500,
    category: 'Shirts',
    url: 'https://chijscollection.com/products/classic-noir-linen-shirt',
  };

  const previewMessage = (template || '')
    .replace(/\{\{product_name\}\}/gi, sampleProduct.name)
    .replace(/\{\{size\}\}/gi, sampleProduct.size)
    .replace(/\{\{price\}\}/gi, formatPrice(sampleProduct.price))
    .replace(/\{\{product_url\}\}/gi, sampleProduct.url)
    .replace(/\{\{category\}\}/gi, sampleProduct.category);

  return (
    <div className="bg-emerald-950/10 border border-emerald-900/20 rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Live WhatsApp Message Preview
        </span>
        <span className="text-[10px] text-emerald-800/80">Recipient: +{phone || '234...'}</span>
      </div>

      {/* WhatsApp Message Bubble Mockup */}
      <div className="bg-[#DCF8C6] text-zinc-900 p-4 rounded-lg rounded-tr-none shadow-xs text-xs font-sans whitespace-pre-line leading-relaxed max-w-md ml-auto border border-emerald-200">
        {previewMessage || 'Your message will appear here...'}
      </div>
    </div>
  );
}
