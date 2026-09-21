import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {/* 4:5 fashion aspect ratio image placeholder */}
      <div className="w-full aspect-fashion bg-zinc-200" />
      <div className="space-y-2 pt-1">
        <div className="h-4 bg-zinc-200 w-3/4" />
        <div className="h-3.5 bg-zinc-200 w-1/3" />
        <div className="flex gap-1 pt-1">
          <div className="h-4 w-6 bg-zinc-200 rounded" />
          <div className="h-4 w-6 bg-zinc-200 rounded" />
          <div className="h-4 w-6 bg-zinc-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-7">
          <div className="w-full aspect-fashion bg-zinc-200" />
          <div className="grid grid-cols-4 gap-3 mt-4">
            <div className="aspect-fashion bg-zinc-200" />
            <div className="aspect-fashion bg-zinc-200" />
            <div className="aspect-fashion bg-zinc-200" />
            <div className="aspect-fashion bg-zinc-200" />
          </div>
        </div>
        <div className="lg:col-span-5 space-y-6">
          <div className="h-8 bg-zinc-200 w-4/5" />
          <div className="h-6 bg-zinc-200 w-1/4" />
          <div className="h-4 bg-zinc-200 w-1/3" />
          <div className="space-y-2 pt-4">
            <div className="h-4 bg-zinc-200 w-1/4" />
            <div className="flex gap-2">
              <div className="h-10 w-12 bg-zinc-200" />
              <div className="h-10 w-12 bg-zinc-200" />
              <div className="h-10 w-12 bg-zinc-200" />
            </div>
          </div>
          <div className="h-12 bg-zinc-200 w-full" />
          <div className="h-12 bg-zinc-200 w-full" />
          <div className="space-y-2 pt-4">
            <div className="h-4 bg-zinc-200 w-full" />
            <div className="h-4 bg-zinc-200 w-full" />
            <div className="h-4 bg-zinc-200 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
