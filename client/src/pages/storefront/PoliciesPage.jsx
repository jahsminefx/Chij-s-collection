import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext.jsx';
import { Truck, RotateCcw, ShieldCheck } from 'lucide-react';

export default function PoliciesPage() {
  const { settings } = useStore();
  const [activeTab, setActiveTab] = useState('delivery');

  const defaultDelivery = `We deliver nationwide across Nigeria via reputable logistics and courier partners.

• Deliveries within Warri: Dispatched same-day or next-day.
• Deliveries to Lagos, Abuja, Port Harcourt: Typically delivered within 2–3 business days.
• Other States: Delivered within 3–5 business days.

Once your package has been dispatched, a tracking reference or rider contact will be forwarded directly to your WhatsApp.`;

  const defaultExchange = `We want you to be completely thrilled with the fit and quality of your CHIJ's pieces.

• Size Exchange Period: You have 3 days from the date of package delivery to request a size swap.
• Condition: All exchanged items must be unwashed, unworn, undamaged, free of fragrances, and have all original tags intact.
• Footwear: Shoes and slides must be tried on indoors on carpeted surfaces to prevent sole scuffing.
• Intimate / Custom Items: Customized or tailored garments cannot be exchanged due to personalization.
• Return Shipping: Delivery fees associated with size exchanges are the responsibility of the customer unless an incorrect size was fulfilled by our team.`;

  const deliveryText = settings?.deliveryInfo || defaultDelivery;
  const exchangeText = settings?.exchangePolicy || defaultExchange;

  return (
    <div className="py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="text-[11px] font-bold tracking-[0.25em] text-brand-accent uppercase block mb-1">
          Store Guidelines
        </span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-brand-primary">
          Delivery & Exchange Policies
        </h1>
        <p className="text-sm text-brand-text-secondary mt-2">
          Transparent, fair, and reliable policies to ensure a smooth shopping experience.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-brand-border/60 mb-8 justify-center">
        <button
          onClick={() => setActiveTab('delivery')}
          className={`flex items-center gap-2 py-3 px-6 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
            activeTab === 'delivery'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-brand-text-muted hover:text-brand-text'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Delivery Information</span>
        </button>
        <button
          onClick={() => setActiveTab('exchange')}
          className={`flex items-center gap-2 py-3 px-6 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
            activeTab === 'exchange'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-brand-text-muted hover:text-brand-text'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Size Exchange Policy</span>
        </button>
      </div>

      {/* Policy Card Content */}
      <div className="bg-brand-surface border border-brand-border p-6 sm:p-10 shadow-soft">
        {activeTab === 'delivery' ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-brand-border/60">
              <div className="w-10 h-10 rounded-full bg-brand-muted flex items-center justify-center text-brand-accent">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-brand-primary uppercase">
                  Nationwide Dispatch & Delivery Terms
                </h2>
                <span className="text-xs text-brand-text-muted">Swift & secure door-to-door delivery</span>
              </div>
            </div>

            <div className="text-sm text-brand-text-secondary leading-relaxed whitespace-pre-line space-y-4">
              {deliveryText}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-brand-border/60">
              <div className="w-10 h-10 rounded-full bg-brand-muted flex items-center justify-center text-brand-accent">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-brand-primary uppercase">
                  Size Exchange Policy
                </h2>
                <span className="text-xs text-brand-text-muted">Ensuring your perfect boutique fit</span>
              </div>
            </div>

            <div className="text-sm text-brand-text-secondary leading-relaxed whitespace-pre-line space-y-4">
              {exchangeText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
