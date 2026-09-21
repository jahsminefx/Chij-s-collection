import React from 'react';
import ProductCard from './ProductCard.jsx';
import EmptyState from '../common/EmptyState.jsx';

export default function ProductGrid({
  products = [],
  emptyTitle = 'No products found',
  emptyDescription = 'There are currently no products available in this selection.',
}) {
  if (!products || products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
