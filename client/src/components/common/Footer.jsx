import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, MapPin, Instagram, Facebook, ArrowUpRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import BrandName from './BrandName';

export default function Footer() {
  const { settings, categories } = useStore();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-primary text-white pt-16 pb-12 border-t border-brand-primary-hover">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-zinc-800">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-display text-2xl font-bold tracking-widest uppercase text-white hover:text-brand-accent transition-colors">
                <BrandName withCollection={true} />
              </span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              {settings?.tagline || 'Refined Contemporary Fashion & Curated Footwear.'} Discover curated collections designed to elevate your everyday presence.
            </p>
            {/* Social Media Links (Only show if configured) */}
            <div className="flex items-center space-x-3 pt-2">
              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-300 hover:text-white hover:bg-brand-accent transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-300 hover:text-white hover:bg-brand-accent transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings?.tiktok && (
                <a
                  href={settings.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-300 hover:text-white hover:bg-brand-accent transition-colors text-xs font-bold"
                  aria-label="TikTok"
                >
                  TT
                </a>
              )}
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="font-display text-sm font-semibold tracking-widest uppercase text-zinc-200 mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="hover:text-brand-accent transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/shop" className="text-brand-accent hover:underline inline-flex items-center gap-1">
                  View All Products <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care / Policy Column */}
          <div>
            <h3 className="font-display text-sm font-semibold tracking-widest uppercase text-zinc-200 mb-4">
              Information
            </h3>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link to="/about" className="hover:text-brand-accent transition-colors inline-flex items-baseline gap-1">
                  About <BrandName />
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-accent transition-colors">
                  Contact & Store Location
                </Link>
              </li>
              <li>
                <Link to="/policies" className="hover:text-brand-accent transition-colors">
                  Delivery & Shipping
                </Link>
              </li>
              <li>
                <Link to="/policies" className="hover:text-brand-accent transition-colors">
                  Size Exchange Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div>
            <h3 className="font-display text-sm font-semibold tracking-widest uppercase text-zinc-200 mb-4">
              Visit & Contact
            </h3>
            <div className="space-y-3 text-sm text-zinc-400">
              {settings?.address && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-brand-accent flex-shrink-0 mt-1" />
                  <span>
                    {settings.address}, {settings.city || 'Warri'}, {settings.state || 'Delta State'}
                  </span>
                </div>
              )}

              {settings?.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-brand-accent flex-shrink-0" />
                  <a
                    href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                    className="hover:text-white transition-colors"
                  >
                    {settings.phone}
                  </a>
                </div>
              )}

              {settings?.whatsappNumber && (
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-brand-whatsapp flex-shrink-0" />
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    +{settings.whatsappNumber}
                  </a>
                </div>
              )}

              <div className="pt-2">
                <Link
                  to="/admin/login"
                  className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  Store Owner Portal
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {currentYear} <BrandName withCollection={true} className="text-zinc-500" />. All rights reserved.</p>
          <p className="tracking-wide">Direct WhatsApp & Phone Ordering Experience</p>
        </div>
      </div>
    </footer>
  );
}
