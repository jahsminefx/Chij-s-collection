import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  FolderTree,
  Settings,
  ExternalLink,
  LogOut,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import BrandName from '../common/BrandName';
import { showToast } from '../common/Toast.jsx';

export default function AdminMobileHeader() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    showToast('Logged out');
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/categories', label: 'Categories', icon: FolderTree },
    { to: '/admin/hero-slides', label: 'Hero Slideshow', icon: Layers },
    { to: '/admin/settings', label: 'Store Settings', icon: Settings },
  ];

  return (
    <header className="lg:hidden bg-zinc-900 text-white border-b border-zinc-800 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="p-1.5 text-zinc-300 hover:text-white"
            aria-label="Open admin menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-display font-bold text-sm uppercase tracking-wider">
            <BrandName /> ADMIN
          </span>
        </div>

        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-bold uppercase tracking-wider text-brand-accent flex items-center gap-1"
        >
          <span>Store</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Slide-out Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-72 bg-zinc-900 text-white h-full shadow-2xl flex flex-col z-10 animate-slideRight">
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <span className="font-display font-bold text-sm tracking-wider uppercase">
                <BrandName /> PORTAL
              </span>
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-zinc-400 hover:text-white rounded"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 text-xs font-semibold uppercase tracking-wider">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-3 rounded transition-colors ${
                        isActive
                          ? 'bg-zinc-800 text-brand-accent'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="p-4 border-t border-zinc-800 bg-zinc-950/70">
              <div className="mb-3">
                <p className="text-xs font-bold text-zinc-200 truncate">{user?.name}</p>
                <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full py-2.5 px-3 bg-red-950/40 border border-red-900/50 text-red-300 hover:bg-red-900/40 text-xs font-semibold rounded uppercase tracking-wider transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
