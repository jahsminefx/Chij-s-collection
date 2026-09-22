import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { heroSlideAPI } from '../../services/api.js';
import { formatPrice } from '../../utils/formatters.js';

// Default curated fallback slides if no custom slides exist
const FALLBACK_SLIDES = [
  {
    id: 'fallback-1',
    imageUrl:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
    title: 'New Season Streetwear & Luxury Loungewear',
    subtitle: 'New Arrival',
    product: null,
  },
  {
    id: 'fallback-2',
    imageUrl:
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    title: 'Artisanal Tailored Pleated Trousers',
    subtitle: 'Bespoke Fit',
    product: null,
  },
  {
    id: 'fallback-3',
    imageUrl:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85',
    title: 'Handcrafted Genuine Leather Footwear',
    subtitle: 'Curated Showcase',
    product: null,
  },
];

const AUTO_SLIDE_INTERVAL = 5500; // 5.5 seconds

export default function HeroSection() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef(null);
  const navigate = useNavigate();

  // Load public active hero slides
  useEffect(() => {
    let isMounted = true;
    heroSlideAPI
      .getPublicSlides()
      .then((res) => {
        if (isMounted && res.success && res.data && res.data.length > 0) {
          setSlides(res.data);
        } else if (isMounted) {
          setSlides(FALLBACK_SLIDES);
        }
      })
      .catch(() => {
        if (isMounted) setSlides(FALLBACK_SLIDES);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const activeSlides = slides.length > 0 ? slides : FALLBACK_SLIDES;
  const currentSlide = activeSlides[currentIndex] || activeSlides[0];

  // Auto-play slideshow timer
  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [activeSlides.length, isPaused]);

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  };

  // Mobile Touch Swipe Handling
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    // Minimum swipe threshold (50px)
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext(); // swipe left -> next
      } else {
        handlePrev(); // swipe right -> prev
      }
    }
    touchStartXRef.current = null;
  };

  const handleSlideClick = () => {
    if (currentSlide?.product?.slug) {
      navigate(`/products/${currentSlide.product.slug}`);
    } else {
      navigate('/shop');
    }
  };

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
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-brand-primary text-white text-xs font-semibold tracking-widest uppercase hover:bg-brand-primary-hover transition-colors shadow-soft group"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-6 py-3.5 border border-brand-border text-brand-text text-xs font-semibold tracking-widest uppercase hover:border-brand-primary transition-colors"
              >
                Our Brand Story
              </Link>
            </div>
          </div>

          {/* Right Hero Slideshow Slider */}
          <div
            className="lg:col-span-6 relative min-h-[440px] sm:min-h-[500px] lg:min-h-full overflow-hidden select-none cursor-pointer group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={handleSlideClick}
          >
            {/* Slides container */}
            {activeSlides.map((slide, index) => {
              const isCurrent = index === currentIndex;
              return (
                <div
                  key={slide.id || index}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                  aria-hidden={!isCurrent}
                >
                  <img
                    src={slide.imageUrl}
                    alt={slide.title || slide.product?.name || "CHIJ's Collection Hero Showcase"}
                    className={`w-full h-full object-cover object-top transform transition-transform duration-7000 ease-out ${
                      isCurrent ? 'scale-105' : 'scale-100'
                    }`}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent hidden lg:block" />
                </div>
              );
            })}

            {/* Navigation Chevrons (Show on hover or always on touch devices) */}
            {activeSlides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-xs opacity-75 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-none"
                  aria-label="Previous hero slide"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-xs opacity-75 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-none"
                  aria-label="Next hero slide"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}

            {/* Floating Product Card (Overlaid in bottom corner) */}
            <div className="absolute bottom-6 left-4 right-4 sm:left-6 sm:right-6 z-20 flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-4">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleSlideClick();
                }}
                className="bg-zinc-950/85 backdrop-blur-md p-4 sm:p-4.5 rounded-xl border border-white/15 text-white max-w-sm shadow-2xl transition-all duration-300 hover:bg-zinc-950 group/card"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-brand-accent">
                    {currentSlide?.subtitle || 'Featured Look'}
                  </span>
                </div>

                <h2 className="font-display text-sm sm:text-base font-bold text-white tracking-wide line-clamp-1 mb-1 group-hover/card:text-brand-accent transition-colors">
                  {currentSlide?.title || currentSlide?.product?.name || 'Exclusive Showcase'}
                </h2>

                <div className="flex items-center justify-between gap-3 pt-1">
                  {currentSlide?.product ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-zinc-100">
                        {formatPrice(currentSlide.product.price)}
                      </span>
                      {currentSlide.product.stockStatus === 'SOLD_OUT' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-900/80 text-red-200 font-bold uppercase">
                          Sold Out
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-400">CHIJ'ˢ Curated Collection</span>
                  )}

                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-brand-accent group-hover/card:translate-x-0.5 transition-transform">
                    <span>{currentSlide?.product ? 'Shop This Look' : 'Explore'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Dots and Counter Indicators */}
              {activeSlides.length > 1 && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-between sm:justify-end gap-3 bg-black/40 backdrop-blur-xs px-3.5 py-2 rounded-full border border-white/10 self-start sm:self-auto"
                >
                  <div className="flex items-center gap-1.5">
                    {activeSlides.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none ${
                          idx === currentIndex
                            ? 'w-6 bg-brand-accent'
                            : 'w-1.5 bg-white/40 hover:bg-white/70'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <span className="text-[10px] font-mono font-semibold text-white/70">
                    {String(currentIndex + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(activeSlides.length).padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
