import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import { Sparkles, Award, HeartHandshake, MapPin } from 'lucide-react';
import BrandName from '../../components/common/BrandName';

export default function AboutPage() {
  const { settings } = useStore();

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
      {/* 1. Brand Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[11px] font-bold tracking-[0.25em] text-brand-accent uppercase block">
          Behind the Label
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-primary leading-tight">
          Fashion That Speaks For You
        </h1>
        <p className="text-base sm:text-lg text-brand-text-secondary leading-relaxed">
          <BrandName withCollection={true} /> was founded with a singular vision: to bring curated refinement, artisanal precision, and elevated styling to individuals who appreciate understated elegance.
        </p>
      </div>

      {/* 2. Visual & Story Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        <div className="lg:col-span-6 relative aspect-[4/5] overflow-hidden bg-brand-muted shadow-soft">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
            alt="CHIJ's Collection Atelier & Curated Showcase"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="lg:col-span-6 space-y-6">
          <span className="text-[11px] font-bold tracking-[0.25em] text-brand-accent uppercase">
            Our Journey
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-primary leading-snug">
            Craftsmanship, Sourcing, and Uncompromising Standards.
          </h2>
          <p className="text-sm sm:text-base text-brand-text-secondary leading-relaxed">
            What started as a passion for distinctive menswear and luxury footwear has blossomed into a cherished fashion sanctuary. Based in Warri, Delta State, we provide garments and accessories that balance contemporary world-class trends with local comfort and dignity.
          </p>
          <p className="text-sm sm:text-base text-brand-text-secondary leading-relaxed">
            We reject the disposable nature of fast fashion. Instead, every piece in our collection—from crisp linen shirts and custom pleated trousers to hand-finished leather slides and shoes—is chosen for its fabric integrity, durability, and silhouette.
          </p>
        </div>
      </div>

      {/* 3. Core Pillars / Promise */}
      <div className="bg-brand-surface border border-brand-border/60 p-8 sm:p-12">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-primary uppercase tracking-wide">
            Our Core Pillars
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-brand-muted flex items-center justify-center text-brand-accent mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-brand-primary">Curated Exclusivity</h3>
            <p className="text-xs sm:text-sm text-brand-text-secondary leading-relaxed">
              We produce and stock in limited batches so you stand out effortlessly without blending into the crowd.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-brand-muted flex items-center justify-center text-brand-accent mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-brand-primary">Artisanal Quality</h3>
            <p className="text-xs sm:text-sm text-brand-text-secondary leading-relaxed">
              Breathable natural fibers, reinforced stitching, and full-grain leather footwear crafted for longevity.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-brand-muted flex items-center justify-center text-brand-accent mx-auto">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-brand-primary">Personal Relationship</h3>
            <p className="text-xs sm:text-sm text-brand-text-secondary leading-relaxed">
              Direct consultation via WhatsApp and phone ensures you get exact sizing guidance, tailored recommendations, and prompt support.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Store Visit & Direct CTA */}
      <div className="text-center space-y-6 pt-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-text-secondary">
          <MapPin className="w-4 h-4 text-brand-accent" />
          <span>
            {settings?.address || 'Plot 14 Airport Road, Opposite High Court'}, {settings?.city || 'Warri'}, {settings?.state || 'Delta State'}
          </span>
        </div>
        <div>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-brand-primary text-white text-xs font-semibold tracking-widest uppercase hover:bg-brand-primary-hover transition-colors shadow-soft"
          >
            Explore the Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
