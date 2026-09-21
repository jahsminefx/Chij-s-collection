import React from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

export default function FloatingWhatsApp() {
  const { settings } = useStore();
  const location = useLocation();

  // Specification rule #35: On product detail pages, the product-specific CTA takes priority
  const isProductDetailPage = location.pathname.startsWith('/products/');

  if (isProductDetailPage || !settings?.whatsappNumber) {
    return null;
  }

  const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <aside aria-label="WhatsApp quick chat" className="fixed bottom-6 right-6 z-40">
      <a
        href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent("Hello CHIJ's Collection 👋 I have an inquiry about your pieces.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-4 py-3 bg-brand-whatsapp text-white rounded-full shadow-lg hover:bg-brand-whatsapp-hover transition-all duration-300 transform hover:scale-105 group"
        aria-label="Chat with CHIJ's on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline text-xs font-bold tracking-wider uppercase">
          Chat With Us
        </span>
      </a>
    </aside>
  );
}
