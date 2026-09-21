import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Search, Phone, MessageCircle, ChevronDown } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import MobileDrawer from './MobileDrawer.jsx';
import SearchModal from './SearchModal.jsx';

export default function Header() {
  const { settings, categories } = useStore();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);

  // Close menus on route change
  useEffect(() => {
    setDrawerOpen(false);
    setSearchOpen(false);
    setCategoryDropdown(false);
  }, [location.pathname]);

  // Handle sticky scroll styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const storePhone = settings?.phone || '+2348123456789';
  const whatsappNum = settings?.whatsappNumber || '2348123456789';

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-brand-surface/95 backdrop-blur-md shadow-sm border-b border-brand-border/60 py-3'
            : 'bg-brand-background border-b border-brand-border/40 py-4 md:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Left: Menu Toggle */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 -ml-2 text-brand-text hover:text-brand-accent transition-colors focus:outline-none"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-brand-text hover:text-brand-accent transition-colors focus:outline-none"
              aria-label="Open product search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo / Wordmark */}
          <div className="flex-1 md:flex-initial text-center md:text-left">
            <Link to="/" className="inline-block group">
              <img
                src={settings?.logo || '/logo.jpg'}
                alt={settings?.storeName || "CHIJ's COLLECTION"}
                className="h-8 sm:h-10 lg:h-11 w-auto object-contain mx-auto md:mx-0 mix-blend-multiply"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm tracking-widest font-medium uppercase text-brand-text">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition-colors hover:text-brand-accent ${isActive ? 'text-brand-accent font-semibold' : ''}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `transition-colors hover:text-brand-accent ${isActive ? 'text-brand-accent font-semibold' : ''}`
              }
            >
              Shop All
            </NavLink>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoryDropdown(true)}
              onMouseLeave={() => setCategoryDropdown(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 hover:text-brand-accent transition-colors focus:outline-none"
              >
                Categories
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {categoryDropdown && (
                <div className="absolute top-full left-0 w-52 bg-white shadow-lift border border-brand-border/80 py-2 mt-1 z-50 animate-fadeIn">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.slug}`}
                        className="block px-4 py-2 text-xs font-medium text-brand-text hover:bg-brand-muted hover:text-brand-accent transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))
                  ) : (
                    <span className="block px-4 py-2 text-xs text-brand-text-muted">
                      No categories yet
                    </span>
                  )}
                </div>
              )}
            </div>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `transition-colors hover:text-brand-accent ${isActive ? 'text-brand-accent font-semibold' : ''}`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `transition-colors hover:text-brand-accent ${isActive ? 'text-brand-accent font-semibold' : ''}`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Desktop Right Utilities */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs text-brand-text-secondary bg-brand-muted hover:bg-brand-border/60 transition-colors border border-brand-border/60"
              aria-label="Search collection"
            >
              <Search className="w-3.5 h-3.5 text-brand-text-muted" />
              <span className="tracking-wide">Search...</span>
            </button>

            <a
              href={`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-brand-text hover:text-brand-whatsapp transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-brand-whatsapp" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:${storePhone.replace(/\s+/g, '')}`}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors tracking-wider uppercase"
              title="Call Store directly"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Us</span>
            </a>
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        storePhone={storePhone}
        whatsappNum={whatsappNum}
      />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
