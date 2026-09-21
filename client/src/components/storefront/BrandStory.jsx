import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import BrandName from '../common/BrandName';

export default function BrandStory() {
  return (
    <section className="py-16 md:py-24 bg-brand-surface border-y border-brand-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Editorial Visual */}
          <div className="lg:col-span-5 relative aspect-[4/5] overflow-hidden bg-brand-muted shadow-soft">
            <img
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1000&q=80"
              alt="CHIJ's Collection Boutique Craftsmanship"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Story Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <span className="text-[11px] font-bold tracking-[0.25em] text-brand-accent uppercase inline-flex items-baseline gap-1">
              The <BrandName /> Philosophy
            </span>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-brand-primary leading-tight">
              Style is more than what you wear.<br />
              <span className="italic font-normal font-display text-brand-accent">
                It's how you show up.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-brand-text-secondary leading-relaxed max-w-xl">
              At <BrandName withCollection={true} />, we celebrate personal identity through refined silhouettes, premium fabrics, and curated footwear. Every piece in our store is carefully handpicked or bespoke crafted to ensure exceptional quality, impeccable fit, and effortless everyday elegance.
            </p>

            <p className="text-sm sm:text-base text-brand-text-secondary leading-relaxed max-w-xl">
              From crisp linen shirts and tailored trousers to handcrafted leather slides and penny loafers, our mission is to offer a boutique shopping experience that feels personalized, authentic, and dignified.
            </p>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-brand-primary hover:text-brand-accent border-b border-brand-primary hover:border-brand-accent pb-1 transition-colors group"
              >
                <span>Read Full Brand Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
