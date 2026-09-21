import React from 'react';
import { MessageCircle, Phone, Mail, MapPin, Clock, ArrowUpRight, Instagram, Facebook } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

export default function ContactPage() {
  const { settings } = useStore();

  const phone = settings?.phone || '+234 812 345 6789';
  const whatsapp = settings?.whatsappNumber || '2348123456789';
  const email = settings?.email || 'contact@chijscollection.com';
  const address = settings?.address || 'Plot 14 Airport Road, Opposite High Court';
  const city = settings?.city || 'Warri';
  const state = settings?.state || 'Delta State';

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-[11px] font-bold tracking-[0.25em] text-brand-accent uppercase block mb-1">
          Get in Touch
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-brand-primary">
          We'd Love to Hear From You
        </h1>
        <p className="text-sm sm:text-base text-brand-text-secondary mt-3 leading-relaxed">
          Have an inquiry about a product, sizing advice, or custom order? Reach out to us directly through WhatsApp or phone.
        </p>
      </div>

      {/* Main Contact Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* WhatsApp Direct */}
        <div className="bg-brand-surface border border-brand-border p-8 flex flex-col justify-between shadow-soft">
          <div>
            <div className="w-12 h-12 rounded-full bg-green-50 text-brand-whatsapp flex items-center justify-center mb-6">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-brand-primary uppercase tracking-wide mb-2">
              WhatsApp Concierge
            </h3>
            <p className="text-xs sm:text-sm text-brand-text-secondary leading-relaxed mb-6">
              Instant product availability checks, size confirmations, order placement, and styling recommendations.
            </p>
          </div>
          <a
            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-brand-whatsapp text-white text-xs font-bold tracking-widest uppercase hover:bg-brand-whatsapp-hover transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Direct Phone Call */}
        <div className="bg-brand-surface border border-brand-border p-8 flex flex-col justify-between shadow-soft">
          <div>
            <div className="w-12 h-12 rounded-full bg-brand-muted text-brand-primary flex items-center justify-center mb-6">
              <Phone className="w-6 h-6 text-brand-accent" />
            </div>
            <h3 className="font-display text-lg font-bold text-brand-primary uppercase tracking-wide mb-2">
              Call The Store
            </h3>
            <p className="text-xs sm:text-sm text-brand-text-secondary leading-relaxed mb-6">
              Speak directly with our store representatives during operational hours for prompt assistance.
            </p>
          </div>
          <a
            href={`tel:${phone.replace(/\s+/g, '')}`}
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-brand-primary text-white text-xs font-bold tracking-widest uppercase hover:bg-brand-primary-hover transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Call Us ({phone})</span>
          </a>
        </div>

        {/* Physical Boutique Visit */}
        <div className="bg-brand-surface border border-brand-border p-8 flex flex-col justify-between shadow-soft">
          <div>
            <div className="w-12 h-12 rounded-full bg-brand-muted text-brand-primary flex items-center justify-center mb-6">
              <MapPin className="w-6 h-6 text-brand-accent" />
            </div>
            <h3 className="font-display text-lg font-bold text-brand-primary uppercase tracking-wide mb-2">
              Visit Our Store
            </h3>
            <p className="text-xs sm:text-sm text-brand-text-secondary leading-relaxed mb-1 font-medium text-brand-text">
              {address}
            </p>
            <p className="text-xs text-brand-text-muted mb-6">
              {city}, {state}, Nigeria
            </p>
          </div>
          {settings?.mapsUrl ? (
            <a
              href={settings.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 border border-brand-border text-brand-text text-xs font-bold tracking-widest uppercase hover:border-brand-primary transition-colors"
            >
              <span>Get Directions</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          ) : (
            <div className="text-center text-xs text-brand-text-muted py-2">
              Warri, Delta State
            </div>
          )}
        </div>
      </div>

      {/* Operational Hours & Email */}
      <div className="bg-brand-muted/50 border border-brand-border p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex items-start gap-4">
          <Clock className="w-5 h-5 text-brand-accent flex-shrink-0 mt-1" />
          <div className="space-y-1">
            <h4 className="font-display text-base font-bold text-brand-primary uppercase tracking-wide">
              Store Hours
            </h4>
            <p className="text-xs sm:text-sm text-brand-text-secondary">
              Monday – Saturday: 9:00 AM – 6:00 PM
            </p>
            <p className="text-xs text-brand-text-muted">
              Sunday: In-store visits closed (online inquiries monitored)
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Mail className="w-5 h-5 text-brand-accent flex-shrink-0 mt-1" />
          <div className="space-y-1">
            <h4 className="font-display text-base font-bold text-brand-primary uppercase tracking-wide">
              Email Correspondence
            </h4>
            <p className="text-xs sm:text-sm text-brand-text-secondary">
              {email}
            </p>
            <p className="text-xs text-brand-text-muted">
              For business partnerships, styling collaborations & bulk orders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
