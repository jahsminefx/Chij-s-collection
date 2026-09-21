import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { productAPI } from '../../services/api.js';
import { formatPrice } from '../../utils/formatters.js';
import BrandName from './BrandName';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await productAPI.getPublicProducts({ search: query.trim(), limit: 6 });
        if (res.success && res.data) {
          setResults(res.data);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectProduct = (slug) => {
    onClose();
    navigate(`/products/${slug}`);
  };

  const handleFullSearch = (e) => {
    e?.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white shadow-2xl border border-brand-border/80 overflow-hidden z-10 animate-fadeIn">
        {/* Input Bar */}
        <form onSubmit={handleFullSearch} className="flex items-center px-4 py-3.5 border-b border-brand-border">
          <Search className="w-5 h-5 text-brand-text-muted flex-shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search shirts, trousers, shoes, accessories..."
            className="flex-1 bg-transparent text-sm sm:text-base text-brand-text placeholder-brand-text-muted focus:outline-none"
          />
          {loading && <Loader2 className="w-4 h-4 text-brand-accent animate-spin mr-2" />}
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-brand-text-muted hover:text-brand-text rounded-full"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-4 divide-y divide-brand-border/40">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-sm text-brand-text-muted">
              Type product name or category to discover pieces in <BrandName withCollection={true} />.
            </div>
          ) : results.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-3">
                Matching Products
              </p>
              <div className="space-y-2">
                {results.map((product) => {
                  const cover = product.images?.[0]?.url || 'https://via.placeholder.com/100x120';
                  return (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product.slug)}
                      className="flex items-center gap-4 p-2 hover:bg-brand-muted cursor-pointer transition-colors group"
                    >
                      <img
                        src={cover}
                        alt={product.name}
                        className="w-12 h-14 object-cover flex-shrink-0 bg-zinc-100"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-brand-text group-hover:text-brand-accent truncate transition-colors">
                          {product.name}
                        </p>
                        <p className="text-xs text-brand-text-muted capitalize">
                          {product.category?.name || 'Collection'}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-brand-primary">
                          {formatPrice(product.price)}
                        </p>
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${
                          product.stockStatus === 'IN_STOCK' ? 'text-green-700' : 'text-red-600'
                        }`}>
                          {product.stockStatus === 'IN_STOCK' ? '● In Stock' : '○ Sold Out'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-brand-border/60 text-center">
                <button
                  type="button"
                  onClick={handleFullSearch}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-brand-accent hover:underline"
                >
                  <span>View all results for "{query}"</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : !loading ? (
            <div className="py-8 text-center text-sm text-brand-text-muted">
              No products found matching "<span className="text-brand-text font-medium">{query}</span>".
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
