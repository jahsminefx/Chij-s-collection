import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Settings,
  ExternalLink,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import BrandName from '../common/BrandName';
import { showToast } from '../common/Toast.jsx';

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    showToast('Logged out successfully');
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/categories', label: 'Categories', icon: FolderTree },
    { to: '/admin/settings', label: 'Store Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-zinc-900 text-white min-h-screen border-r border-zinc-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-zinc-800">
        <Link to="/admin" className="flex items-center gap-3">
          <img
            src="/logo.jpg"
            alt="CHIJ's"
            className="h-8 w-auto object-contain rounded bg-white p-1"
          />
          <div>
            <span className="font-display font-bold tracking-wider text-xs uppercase block text-zinc-100">
              <BrandName /> PORTAL
            </span>
            <span className="text-[9px] tracking-widest text-zinc-400 uppercase">
              Management
            </span>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 text-xs font-semibold uppercase tracking-wider">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded transition-colors ${
                  isActive
                    ? 'bg-zinc-800 text-brand-accent'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {/* Live Storefront Link */}
        <div className="pt-6 mt-6 border-t border-zinc-800/80">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-brand-accent" />
              <span>Live Storefront</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>
        </div>
      </nav>

      {/* User Info & Logout Footer */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950/60">
        <div className="flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-bold text-zinc-200 truncate">
              {user?.name || "CHIJ's Owner"}
            </p>
            <p className="text-[10px] text-zinc-400 truncate">
              {user?.email || 'admin@chijscollection.com'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
            title="Log Out"
            aria-label="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
