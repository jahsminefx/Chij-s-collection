import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productAPI, categoryAPI } from '../../services/api.js';
import ProductGrid from '../../components/storefront/ProductGrid.jsx';
import { ProductGridSkeleton } from '../../components/common/SkeletonLoader.jsx';
import { ArrowLeft } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCategoryData() {
      try {
        setLoading(true);
        setError(null);

        const [catRes, prodRes] = await Promise.all([
          categoryAPI.getPublicCategoryBySlug(slug),
          productAPI.getPublicProducts({ category: slug, limit: 36 }),
        ]);

        if (isMounted) {
          if (catRes.success) setCategory(catRes.data);
          if (prodRes.success) setProducts(prodRes.data);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Category not found.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadCategoryData();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (error) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4">
        <h2 className="font-display text-2xl font-bold text-brand-primary mb-2">Category Not Found</h2>
        <p className="text-sm text-brand-text-secondary mb-6">{error}</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Collections</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb & Navigation */}
      <div className="mb-6">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-brand-text-muted hover:text-brand-accent transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Collections</span>
        </Link>
      </div>

      {/* Category Banner Header */}
      <div className="mb-10 pb-8 border-b border-brand-border/60">
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-brand-primary uppercase">
          {category?.name || slug.replace(/-/g, ' ')}
        </h1>
        {category?.description && (
          <p className="text-sm sm:text-base text-brand-text-secondary max-w-2xl mt-2 leading-relaxed">
            {category.description}
          </p>
        )}
        <div className="mt-4 text-xs text-brand-text-muted font-medium">
          Showing <span className="font-bold text-brand-primary">{products.length}</span> {products.length === 1 ? 'Piece' : 'Pieces'}
        </div>
      </div>

      {/* Grid of Products */}
      {loading ? (
        <ProductGridSkeleton count={6} />
      ) : (
        <ProductGrid
          products={products}
          emptyTitle="No products available in this category yet."
          emptyDescription={`We are preparing new pieces for ${category?.name || 'this category'}. Check back shortly or browse our other collections.`}
        />
      )}
    </div>
  );
}
