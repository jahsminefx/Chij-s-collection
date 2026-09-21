import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { productAPI } from '../../services/api.js';
import HeroSection from '../../components/storefront/HeroSection.jsx';
import CategorySection from '../../components/storefront/CategorySection.jsx';
import ProductGrid from '../../components/storefront/ProductGrid.jsx';
import { ProductGridSkeleton } from '../../components/common/SkeletonLoader.jsx';
import BrandStory from '../../components/storefront/BrandStory.jsx';
import StoreTrust from '../../components/storefront/StoreTrust.jsx';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadHomeProducts() {
      try {
        setLoading(true);
        const [featuredRes, newRes] = await Promise.all([
          productAPI.getPublicProducts({ featured: true, limit: 4 }),
          productAPI.getPublicProducts({ limit: 4 }),
        ]);

        if (isMounted) {
          if (featuredRes.success) setFeaturedProducts(featuredRes.data);
          if (newRes.success) setNewArrivals(newRes.data);
        }
      } catch (err) {
        console.error('Error fetching home products:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadHomeProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Category Navigation */}
      <CategorySection />

      {/* 3. New Arrivals */}
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
          <div>
            <span className="text-[11px] font-bold tracking-[0.25em] text-brand-accent uppercase block mb-1">
              Fresh Drops
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop"
            className="mt-3 sm:mt-0 text-xs font-semibold tracking-widest uppercase text-brand-text hover:text-brand-accent transition-colors inline-flex items-center gap-1 group"
          >
            <span>Explore All</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <ProductGrid products={newArrivals} />
        )}
      </section>

      {/* 4. Featured Collection */}
      {featuredProducts.length > 0 && (
        <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
            <div>
              <span className="text-[11px] font-bold tracking-[0.25em] text-brand-accent uppercase block mb-1">
                Spotlight
              </span>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary">
                Featured Collection
              </h2>
            </div>
            <Link
              to="/shop?featured=true"
              className="mt-3 sm:mt-0 text-xs font-semibold tracking-widest uppercase text-brand-text hover:text-brand-accent transition-colors inline-flex items-center gap-1 group"
            >
              <span>See More Highlights</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <ProductGrid products={featuredProducts} />
          )}
        </section>
      )}

      {/* 5. Brand Story */}
      <BrandStory />

      {/* 6. Store Information & Trust */}
      <StoreTrust />
    </div>
  );
}
