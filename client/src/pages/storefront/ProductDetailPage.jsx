import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageCircle, Phone, ArrowLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { productAPI } from '../../services/api.js';
import { useStore } from '../../context/StoreContext.jsx';
import { formatPrice } from '../../utils/formatters.js';
import { generateWhatsAppUrl } from '../../utils/whatsapp.js';
import ProductGallery from '../../components/storefront/ProductGallery.jsx';
import SizeSelector from '../../components/storefront/SizeSelector.jsx';
import StockBadge from '../../components/storefront/StockBadge.jsx';
import StickyProductAction from '../../components/storefront/StickyProductAction.jsx';
import { ProductDetailSkeleton } from '../../components/common/SkeletonLoader.jsx';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { settings } = useStore();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [sizeError, setSizeError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);
        setSelectedSize('');
        setSizeError(false);

        const res = await productAPI.getPublicProductBySlug(slug);
        if (isMounted && res.success) {
          setProduct(res.data);
          // Set dynamic page title for SEO (Specification rule #72)
          document.title = `${res.data.name} | CHIJ'ˢ Collection`;
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Product not found.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
      document.title = "CHIJ'ˢ Collection — Fashion, Clothing & Accessories";
    };
  }, [slug]);

  const isSoldOut = product?.stockStatus === 'SOLD_OUT';
  const hasSizes = product?.sizes && product.sizes.length > 0;

  // WhatsApp order action handler
  const handleWhatsAppOrder = () => {
    if (isSoldOut) return;

    if (hasSizes && !selectedSize) {
      setSizeError(true);
      // Smooth scroll to size selector if on mobile
      const el = document.getElementById('size-selector-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const whatsappUrl = generateWhatsAppUrl({
      phone: settings?.whatsappNumber || '2348123456789',
      template: settings?.whatsappTemplate,
      product,
      size: selectedSize || 'Standard',
      productUrl: window.location.href,
    });

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const storePhone = settings?.phone || '+2348123456789';
  const phoneCallUrl = `tel:${storePhone.replace(/\s+/g, '')}`;

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <h2 className="font-display text-2xl font-bold text-brand-primary mb-2">Piece Not Found</h2>
        <p className="text-sm text-brand-text-secondary mb-6 leading-relaxed">
          {error || "We couldn't find the product you're looking for. It may have been relocated or unpublished."}
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Collections</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Category / Breadcrumb link */}
      <div className="mb-6 flex items-center gap-2 text-xs font-medium text-brand-text-muted">
        <Link to="/" className="hover:text-brand-accent transition-colors">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-brand-accent transition-colors">Shop</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link to={`/category/${product.category.slug}`} className="hover:text-brand-accent transition-colors">
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-brand-text truncate max-w-[200px]">{product.name}</span>
      </div>

      {/* Main 2-Column Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left Column: Image Gallery (4:5 Aspect Ratio) */}
        <div className="lg:col-span-7">
          <ProductGallery
            images={product.images}
            productName={product.name}
          />
        </div>

        {/* Right Column: Information & Ordering Engine */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            {product.category && (
              <span className="text-xs font-bold tracking-[0.2em] text-brand-accent uppercase block mb-1.5">
                {product.category.name}
              </span>
            )}

            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-brand-border/60">
              <span className="font-display text-2xl sm:text-3xl font-bold text-brand-primary">
                {formatPrice(product.price)}
              </span>
              <StockBadge status={product.stockStatus} />
            </div>
          </div>

          {/* Size Selector Section */}
          <div id="size-selector-section" className="pt-2">
            <SizeSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              onSelectSize={(size) => {
                setSelectedSize(size);
                setSizeError(false);
              }}
              disabled={isSoldOut}
              hasError={sizeError}
            />
          </div>

          {/* Ordering Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-brand-border/60">
            {isSoldOut ? (
              <div className="p-4 bg-zinc-100 border border-zinc-200 text-center">
                <p className="text-sm font-bold uppercase tracking-wider text-red-600 mb-1">
                  Currently Sold Out
                </p>
                <p className="text-xs text-brand-text-secondary">
                  This item is currently out of stock. Contact us on WhatsApp to inquire about future restocks.
                </p>
                <a
                  href={`https://wa.me/${(settings?.whatsappNumber || '2348123456789').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello CHIJ's Collection 👋 I would like to inquire about restock availability for: ${product.name} (${window.location.href})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center justify-center gap-2 w-full py-3 px-6 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-primary-hover transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-brand-whatsapp" />
                  <span>Inquire Restock on WhatsApp</span>
                </a>
              </div>
            ) : (
              <>
                {/* Primary CTA: Order via WhatsApp */}
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="flex items-center justify-center gap-2.5 w-full py-4 px-6 bg-brand-whatsapp text-white text-xs sm:text-sm font-bold tracking-widest uppercase hover:bg-brand-whatsapp-hover transition-colors shadow-soft"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Order via WhatsApp</span>
                </button>

                {/* Secondary CTA: Call to Order */}
                <a
                  href={phoneCallUrl}
                  className="flex items-center justify-center gap-2 w-full py-3 px-6 border border-brand-primary text-brand-primary text-xs font-bold tracking-widest uppercase hover:bg-brand-primary hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call to Order ({storePhone})</span>
                </a>
              </>
            )}
          </div>

          {/* Description & Details */}
          <div className="pt-6 border-t border-brand-border/60 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-primary">
              Product Overview
            </h2>
            <div className="text-sm text-brand-text-secondary leading-relaxed whitespace-pre-line">
              {product.description || "Crafted with premium materials and signature CHIJ's styling."}
            </div>
          </div>

          {/* Trust Value Badges */}
          <div className="pt-4 border-t border-brand-border/60 grid grid-cols-2 gap-3 text-xs text-brand-text-secondary">
            <div className="flex items-start gap-2 p-2.5 bg-brand-surface border border-brand-border/40">
              <Truck className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-brand-primary block">Nationwide Dispatch</span>
                <span className="text-[11px]">Same-day in Warri, 2–4 days interstate</span>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2.5 bg-brand-surface border border-brand-border/40">
              <RotateCcw className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-brand-primary block">Size Exchange</span>
                <span className="text-[11px]">Within 3 days of delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar for Mobile */}
      <StickyProductAction
        product={product}
        selectedSize={selectedSize}
        isSoldOut={isSoldOut}
        onOrderWhatsApp={handleWhatsAppOrder}
        phoneUrl={phoneCallUrl}
      />
    </div>
  );
}
