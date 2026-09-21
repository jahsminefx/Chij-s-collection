import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatters.js';
import StockBadge from './StockBadge.jsx';

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  const images = product?.images || [];
  const primaryImage = images[0]?.url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80';
  const secondaryImage = images[1]?.url || primaryImage;

  const isSoldOut = product?.stockStatus === 'SOLD_OUT';

  return (
    <article className="group flex flex-col bg-brand-surface border border-brand-border/60 hover:border-brand-border transition-all duration-300 shadow-soft">
      {/* Product Image Container (4:5 Aspect Ratio) */}
      <Link
        to={`/products/${product.slug}`}
        className="relative block w-full aspect-fashion overflow-hidden bg-brand-muted"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={isHovered && images.length > 1 ? secondaryImage : primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Status Badges */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 items-end z-10">
          {isSoldOut ? (
            <span className="px-2 py-0.5 bg-black/80 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider">
              Sold Out
            </span>
          ) : product.isFeatured ? (
            <span className="px-2 py-0.5 bg-brand-accent text-white text-[9px] font-bold uppercase tracking-wider">
              Featured
            </span>
          ) : null}
        </div>
      </Link>

      {/* Product Card Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          {product.category?.name && (
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-brand-text-muted uppercase block mb-1">
              {product.category.name}
            </span>
          )}

          {/* Title */}
          <h3 className="font-medium text-xs sm:text-sm text-brand-text group-hover:text-brand-accent transition-colors line-clamp-2 leading-snug">
            <Link to={`/products/${product.slug}`}>
              {product.name}
            </Link>
          </h3>
        </div>

        <div className="mt-3 pt-2.5 border-t border-brand-border/40">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-sm sm:text-base text-brand-primary">
              {formatPrice(product.price)}
            </span>
            <StockBadge status={product.stockStatus} />
          </div>

          {/* Available Sizes preview */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1 items-center text-[10px] text-brand-text-secondary">
              <span className="font-medium text-brand-text-muted mr-0.5">Sizes:</span>
              {product.sizes.slice(0, 5).map((size, index) => (
                <span
                  key={index}
                  className="px-1.5 py-0.5 bg-brand-muted text-brand-text-secondary border border-brand-border/50 text-[10px]"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 5 && (
                <span className="text-[9px] text-brand-text-muted">
                  +{product.sizes.length - 5}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
