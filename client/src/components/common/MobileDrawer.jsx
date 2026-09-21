import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, MessageCircle, Phone, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import BrandName from './BrandName';

export default function MobileDrawer({ isOpen, onClose, storePhone, whatsappNum }) {
  const { categories, settings } = useStore();

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer content pane */}
      <div className="relative w-full max-w-xs bg-brand-surface h-full shadow-2xl flex flex-col z-10 animate-slideRight">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border/60">
          <div>
            <img
              src={settings?.logo || '/logo.jpg'}
              alt={settings?.storeName || "CHIJ's"}
              className="h-8 w-auto object-contain mix-blend-multiply"
            />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-brand-text hover:text-brand-accent transition-colors rounded-full hover:bg-brand-muted"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div className="space-y-3">
            <Link
              to="/"
              onClick={onClose}
              className="block text-base font-medium tracking-wider uppercase text-brand-text hover:text-brand-accent transition-colors"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={onClose}
              className="block text-base font-medium tracking-wider uppercase text-brand-text hover:text-brand-accent transition-colors"
            >
              Shop All
            </Link>
          </div>

          {/* Dynamic Categories Section */}
          <div className="border-t border-brand-border/40 pt-4">
            <p className="text-[11px] font-bold tracking-widest text-brand-text-muted uppercase mb-3">
              Categories
            </p>
            <div className="space-y-2.5 pl-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between text-sm text-brand-text hover:text-brand-accent transition-colors py-1"
                >
                  <span>{cat.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                </Link>
              ))}
            </div>
          </div>

          {/* Secondary Info Links */}
          <div className="border-t border-brand-border/40 pt-4 space-y-2.5">
            <Link
              to="/about"
              onClick={onClose}
              className="inline-flex items-baseline gap-1 text-sm text-brand-text-secondary hover:text-brand-accent transition-colors"
            >
              About <BrandName />
            </Link>
            <Link
              to="/contact"
              onClick={onClose}
              className="block text-sm text-brand-text-secondary hover:text-brand-accent transition-colors"
            >
              Contact & Store Location
            </Link>
            <Link
              to="/policies"
              onClick={onClose}
              className="block text-sm text-brand-text-secondary hover:text-brand-accent transition-colors"
            >
              Delivery & Exchange Policies
            </Link>
          </div>
        </div>

        {/* Bottom Contact Actions */}
        <div className="p-6 border-t border-brand-border/60 bg-brand-muted/40 space-y-2.5">
          <a
            href={`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-brand-whatsapp text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-whatsapp-hover transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>

          <a
            href={`tel:${storePhone.replace(/\s+/g, '')}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-brand-primary text-brand-primary text-xs font-semibold uppercase tracking-wider hover:bg-brand-primary hover:text-white transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Call Us Directly</span>
          </a>
        </div>
      </div>
    </div>
  );
}
