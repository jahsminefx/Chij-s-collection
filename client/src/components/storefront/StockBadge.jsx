import React from 'react';

export default function StockBadge({ status, className = '' }) {
  const isInStock = status === 'IN_STOCK';

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase ${
        isInStock ? 'text-green-700' : 'text-red-600'
      } ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isInStock ? 'bg-green-600' : 'bg-red-500'}`} />
      <span>{isInStock ? 'In Stock' : 'Sold Out'}</span>
    </span>
  );
}
