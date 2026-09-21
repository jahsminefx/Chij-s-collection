import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { formatPrice } from '../../utils/formatters.js';

export default function StickyProductAction({
  product,
  selectedSize,
  isSoldOut,
  onOrderWhatsApp,
  phoneUrl,
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger sticky bar once user scrolls past top section (approx 450px)
      setIsVisible(window.scrollY > 450);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible || isSoldOut) {
    return null;
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-brand-surface border-t border-brand-border/80 shadow-2xl p-3 animate-slideUp">
      <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-brand-primary truncate">
            {product?.name}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-brand-text-secondary">
            <span className="font-semibold text-brand-primary">{formatPrice(product?.price)}</span>
            <span>•</span>
            <span className={selectedSize ? 'font-bold text-brand-accent' : 'text-zinc-400'}>
              {selectedSize ? `Size: ${selectedSize}` : 'No size chosen'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={onOrderWhatsApp}
            className="flex items-center gap-1 px-3 py-2.5 bg-brand-whatsapp text-white text-xs font-bold uppercase tracking-wider rounded-none"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>WhatsApp</span>
          </button>

          <a
            href={phoneUrl}
            className="p-2.5 bg-brand-primary text-white text-xs rounded-none"
            aria-label="Call store"
          >
            <Phone className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
