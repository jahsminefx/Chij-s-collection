import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import { ArrowUpRight } from 'lucide-react';

export default function CategorySection() {
  const { categories } = useStore();

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
        <div>
          <span className="text-[11px] font-bold tracking-[0.25em] text-brand-accent uppercase block mb-1">
            Curated Lines
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary">
            Shop by Category
          </h2>
        </div>
        <Link
          to="/shop"
          className="mt-3 sm:mt-0 text-xs font-semibold tracking-widest uppercase text-brand-text hover:text-brand-accent transition-colors inline-flex items-center gap-1 group"
        >
          <span>View All Products</span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        {categories.map((category) => {
          const fallbackImg = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80';
          return (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="group relative overflow-hidden bg-brand-surface aspect-[3/4] block border border-brand-border/60 hover:border-brand-accent transition-colors shadow-soft"
            >
              {/* Image */}
              <img
                src={category.image || fallbackImg}
                alt={category.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Bottom Label Content */}
              <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 text-white">
                <h3 className="font-display text-sm sm:text-base font-bold tracking-wide uppercase group-hover:text-brand-accent transition-colors">
                  {category.name}
                </h3>
                {category.productCount !== undefined && (
                  <p className="text-[10px] sm:text-xs text-zinc-300 tracking-wider">
                    {category.productCount} {category.productCount === 1 ? 'Item' : 'Items'}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
