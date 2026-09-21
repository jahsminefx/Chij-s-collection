import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brand-surface border-b border-brand-border/40">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[640px]">
          {/* Left Editorial Copy */}
          <div className="lg:col-span-6 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 lg:py-20 z-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="h-px w-8 bg-brand-accent"></span>
              <span className="text-[11px] font-bold tracking-[0.25em] text-brand-accent uppercase">
                New Season Collection
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-primary leading-[1.08] mb-6">
              NEW SEASON.<br />
              <span className="italic font-normal font-display text-brand-accent">NEW YOU.</span>
            </h1>

            <p className="text-base sm:text-lg text-brand-text-secondary leading-relaxed max-w-md mb-8">
              Discover effortless luxury, tailored statement pieces, and curated footwear designed to speak for you.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-brand-primary text-white text-xs font-semibold tracking-widest uppercase hover:bg-brand-primary-hover transition-colors shadow-soft"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-6 py-3.5 border border-brand-border text-brand-text text-xs font-semibold tracking-widest uppercase hover:border-brand-primary transition-colors"
              >
                Our Brand Story
              </Link>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="lg:col-span-6 relative min-h-[380px] lg:min-h-full">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85"
              alt="CHIJ's Collection Editorial Fashion Model"
              className="absolute inset-0 w-full h-full object-cover object-top"
              loading="eager"
            />
            {/* Subtle Gradient Overlay for Mobile Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent lg:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}
