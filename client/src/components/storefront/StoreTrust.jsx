import React from 'react';
import { MapPin, Clock, Truck, RotateCcw, ArrowUpRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

export default function StoreTrust() {
  const { settings } = useStore();

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <span className="text-[11px] font-bold tracking-[0.25em] text-brand-accent uppercase block mb-1">
          Store & Services
        </span>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary">
          Visit Us & Order with Confidence
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {/* Physical Store Location */}
        <div className="p-6 bg-brand-surface border border-brand-border/60 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-full bg-brand-muted flex items-center justify-center text-brand-primary mb-4">
              <MapPin className="w-5 h-5 text-brand-accent" />
            </div>
            <h3 className="font-display text-base font-bold text-brand-primary uppercase tracking-wide mb-2">
              Physical Boutique
            </h3>
            <p className="text-xs text-brand-text-secondary leading-relaxed">
              {settings?.address
                ? `${settings.address}, ${settings.city || 'Warri'}, ${settings.state || 'Delta State'}`
                : 'Plot 14 Airport Road, Opposite High Court, Warri, Delta State.'}
            </p>
          </div>

          {settings?.mapsUrl && (
            <a
              href={settings.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase text-brand-accent hover:underline"
            >
              <span>Get Directions</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Opening Hours */}
        <div className="p-6 bg-brand-surface border border-brand-border/60">
          <div className="w-10 h-10 rounded-full bg-brand-muted flex items-center justify-center text-brand-primary mb-4">
            <Clock className="w-5 h-5 text-brand-accent" />
          </div>
          <h3 className="font-display text-base font-bold text-brand-primary uppercase tracking-wide mb-2">
            Opening Hours
          </h3>
          <p className="text-xs text-brand-text-secondary leading-relaxed">
            <span className="font-medium text-brand-text block">Monday – Saturday</span>
            9:00 AM – 6:00 PM
          </p>
          <p className="text-xs text-brand-text-muted mt-2">
            Sunday: Closed (Online WhatsApp inquiries accepted)
          </p>
        </div>

        {/* Nationwide Delivery */}
        <div className="p-6 bg-brand-surface border border-brand-border/60">
          <div className="w-10 h-10 rounded-full bg-brand-muted flex items-center justify-center text-brand-primary mb-4">
            <Truck className="w-5 h-5 text-brand-accent" />
          </div>
          <h3 className="font-display text-base font-bold text-brand-primary uppercase tracking-wide mb-2">
            Nationwide Delivery
          </h3>
          <p className="text-xs text-brand-text-secondary leading-relaxed">
            {settings?.deliveryInfo ||
              'Reliable delivery across all 36 states in Nigeria. Same-day dispatch within Warri; 2–4 business days nationwide.'}
          </p>
        </div>

        {/* Size Exchange Guarantee */}
        <div className="p-6 bg-brand-surface border border-brand-border/60">
          <div className="w-10 h-10 rounded-full bg-brand-muted flex items-center justify-center text-brand-primary mb-4">
            <RotateCcw className="w-5 h-5 text-brand-accent" />
          </div>
          <h3 className="font-display text-base font-bold text-brand-primary uppercase tracking-wide mb-2">
            Size Exchange
          </h3>
          <p className="text-xs text-brand-text-secondary leading-relaxed">
            {settings?.exchangePolicy ||
              'Hassle-free size exchange within 3 days of delivery. Items must remain unworn with original tags attached.'}
          </p>
        </div>
      </div>
    </section>
  );
}
