import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductGallery({ images = [], productName = 'Product' }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const fallbackImage = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1000&q=80';
  const galleryList = images.length > 0 ? images : [{ url: fallbackImage, altText: productName }];

  const currentImage = galleryList[selectedIndex] || galleryList[0];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? galleryList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === galleryList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Stage */}
      <div className="relative w-full aspect-fashion overflow-hidden bg-brand-muted border border-brand-border/60">
        <img
          src={currentImage.url}
          alt={currentImage.altText || productName}
          className="w-full h-full object-cover object-center transition-all duration-300"
        />

        {/* Carousel Navigation Arrows if multiple images */}
        {galleryList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-white text-brand-primary shadow-sm rounded-full transition-colors focus:outline-none"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-white text-brand-primary shadow-sm rounded-full transition-colors focus:outline-none"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Mobile Pagination Dots */}
            <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 md:hidden">
              {galleryList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === selectedIndex ? 'bg-brand-primary w-4' : 'bg-black/30'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Bar (Desktop & Tablet) */}
      {galleryList.length > 1 && (
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-2.5">
          {galleryList.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-fashion overflow-hidden bg-brand-muted border-2 transition-all ${
                idx === selectedIndex
                  ? 'border-brand-primary'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img.url}
                alt={img.altText || `${productName} view ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
