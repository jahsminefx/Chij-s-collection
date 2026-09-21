import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { productAPI } from '../../services/api.js';
import { useStore } from '../../context/StoreContext.jsx';
import ProductGrid from '../../components/storefront/ProductGrid.jsx';
import { ProductGridSkeleton } from '../../components/common/SkeletonLoader.jsx';
import BrandName from '../../components/common/BrandName';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useStore();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters from query params
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const stockParam = searchParams.get('stock') || '';
  const featuredParam = searchParams.get('featured') || '';

  const [searchInput, setSearchInput] = useState(searchParam);

  // Sync state if URL param changes
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Fetch products matching filters
  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        setLoading(true);
        const params = {
          limit: 36,
        };
        if (categoryParam) params.category = categoryParam;
        if (searchParam) params.search = searchParam;
        if (stockParam) params.stock = stockParam;
        if (featuredParam === 'true') params.featured = true;

        const res = await productAPI.getPublicProducts(params);
        if (isMounted && res.success) {
          setProducts(res.data);
          setTotalCount(res.meta?.total || res.data.length);
        }
      } catch (err) {
        console.error('Error fetching shop products:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [categoryParam, searchParam, stockParam, featuredParam]);

  const updateParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput.trim());
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = categoryParam || searchParam || stockParam || featuredParam;

  return (
    <div className="py-10 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[11px] font-bold tracking-[0.25em] text-brand-accent uppercase block mb-1">
          Catalog
        </span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-brand-primary">
          Shop All Pieces
        </h1>
        <p className="text-xs sm:text-sm text-brand-text-secondary mt-2">
          Explore the complete <BrandName withCollection={true} />. Select any piece to view details and order directly.
        </p>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="bg-brand-surface border border-brand-border/80 p-4 sm:p-5 mb-8 shadow-soft">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Category Filter Chips (Horizontal Scroll on Mobile) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 lg:pb-0 -mx-2 px-2">
            <button
              onClick={() => updateParam('category', '')}
              className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
                !categoryParam
                  ? 'bg-brand-primary text-white'
                  : 'bg-brand-muted text-brand-text hover:bg-brand-border/60'
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateParam('category', cat.slug)}
                className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
                  categoryParam === cat.slug
                    ? 'bg-brand-primary text-white'
                    : 'bg-brand-muted text-brand-text hover:bg-brand-border/60'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or style..."
              className="w-full bg-brand-muted/70 border border-brand-border pl-9 pr-8 py-2 text-xs text-brand-text placeholder-brand-text-muted focus:outline-none focus:border-brand-primary transition-colors"
            />
            <Search className="w-4 h-4 text-brand-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  updateParam('search', '');
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-text p-0.5"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>

        {/* Secondary Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-brand-border/40 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-brand-text-muted font-medium">Availability:</span>
            <button
              onClick={() => updateParam('stock', '')}
              className={`font-semibold hover:underline ${!stockParam ? 'text-brand-primary' : 'text-brand-text-muted'}`}
            >
              All
            </button>
            <span>•</span>
            <button
              onClick={() => updateParam('stock', 'IN_STOCK')}
              className={`font-semibold hover:underline ${stockParam === 'IN_STOCK' ? 'text-brand-primary font-bold' : 'text-brand-text-muted'}`}
            >
              In Stock Only
            </button>
          </div>

          <div className="flex items-center gap-4 text-brand-text-muted">
            <span>
              Showing <strong className="text-brand-primary">{products.length}</strong> of {totalCount} items
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-brand-accent hover:underline font-semibold"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid / Skeletons */}
      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : (
        <ProductGrid
          products={products}
          emptyTitle="No matching pieces found"
          emptyDescription="We couldn't find any products matching your active filters. Try adjusting your search query or category."
        />
      )}
    </div>
  );
}
