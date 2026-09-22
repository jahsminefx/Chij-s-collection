import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  FolderTree,
  CheckCircle2,
  AlertCircle,
  Plus,
  Settings,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { productAPI, categoryAPI } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatPrice } from '../../utils/formatters.js';
import StatCard from '../../components/admin/StatCard.jsx';
import StockBadge from '../../components/storefront/StockBadge.jsx';
import { showToast } from '../../components/common/Toast.jsx';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        productAPI.getAdminProducts({ limit: 5 }),
        categoryAPI.getAdminCategories(),
      ]);

      if (prodRes.success) setProducts(prodRes.data);
      if (catRes.success) setCategories(catRes.data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStockToggle = async (productId, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'IN_STOCK' ? 'SOLD_OUT' : 'IN_STOCK';
      await productAPI.toggleStock(productId, nextStatus);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stockStatus: nextStatus } : p))
      );
      showToast(`Stock updated to ${nextStatus === 'IN_STOCK' ? 'In Stock' : 'Sold Out'}`);
    } catch (err) {
      showToast(err.message || 'Failed to update stock', 'error');
    }
  };

  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.stockStatus === 'IN_STOCK').length;
  const soldOutCount = products.filter((p) => p.stockStatus === 'SOLD_OUT').length;
  const totalCategories = categories.length;

  return (
    <div className="space-y-8">
      {/* Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-zinc-900">
            Good day, {user?.name || "CHIJ's Owner"} 👋
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Here is what's happening in your boutique catalog today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/products/new"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-primary text-white text-xs font-semibold rounded uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
          <Link
            to="/admin/settings"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-zinc-300 text-zinc-700 text-xs font-semibold rounded uppercase tracking-wider hover:bg-zinc-50 transition-colors shadow-xs"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row - Horizontal Scroll on Mobile with Custom Scrollbar */}
      <div>
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 custom-scrollbar">
          <StatCard
            label="Total Products"
            value={loading ? '...' : totalProducts}
            icon={Package}
            color="bg-zinc-900"
            subtitle="Catalog inventory pieces"
            badge="Live"
            className="w-[250px] sm:w-auto flex-shrink-0 sm:flex-shrink"
          />
          <StatCard
            label="Categories"
            value={loading ? '...' : totalCategories}
            icon={FolderTree}
            color="bg-amber-600"
            subtitle="Active departments"
            badge="Departments"
            className="w-[250px] sm:w-auto flex-shrink-0 sm:flex-shrink"
          />
          <StatCard
            label="In Stock"
            value={loading ? '...' : inStockCount}
            icon={CheckCircle2}
            color="bg-emerald-600"
            subtitle="Ready to order"
            badge="Available"
            className="w-[250px] sm:w-auto flex-shrink-0 sm:flex-shrink"
          />
          <StatCard
            label="Sold Out"
            value={loading ? '...' : soldOutCount}
            icon={AlertCircle}
            color="bg-red-600"
            subtitle="Requires restocking"
            badge={soldOutCount > 0 ? "Restock" : "All Good"}
            className="w-[250px] sm:w-auto flex-shrink-0 sm:flex-shrink"
          />
        </div>
      </div>

      {/* Recent Products Overview Table */}
      <div className="bg-white rounded-lg border border-zinc-200 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-200 gap-2">
          <div>
            <h2 className="font-display text-base font-bold text-zinc-900">
              Recent Products
            </h2>
            <p className="text-xs text-zinc-500">Quick stock and status control</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="sm:hidden text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded whitespace-nowrap">
              Scroll table →
            </span>
            <Link
              to="/admin/products"
              className="text-xs font-semibold text-brand-accent hover:underline flex items-center gap-1 whitespace-nowrap"
            >
              <span>View All ({totalProducts})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Horizontal scrollbar for products table on mobile */}
        <div className="overflow-x-auto pb-2 custom-scrollbar">
          <table className="w-full min-w-[620px] text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider text-[10px] border-b border-zinc-200">
              <tr>
                <th className="py-3.5 px-4 font-semibold min-w-[220px]">Product</th>
                <th className="py-3.5 px-4 font-semibold min-w-[130px]">Category</th>
                <th className="py-3.5 px-4 font-semibold min-w-[100px]">Price</th>
                <th className="py-3.5 px-4 font-semibold min-w-[120px]">Stock Toggle</th>
                <th className="py-3.5 px-4 font-semibold text-right min-w-[90px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {products.slice(0, 5).map((p) => {
                const cover = p.images?.[0]?.url || 'https://via.placeholder.com/100';
                return (
                  <tr key={p.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={cover}
                          alt={p.name}
                          className="w-10 h-12 object-cover rounded bg-zinc-100 flex-shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-medium text-zinc-900 truncate">{p.name}</p>
                          <span className="text-[10px] text-zinc-400">
                            Sizes: {p.sizes?.join(', ') || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-600">
                      {p.category?.name || 'Uncategorized'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-zinc-900">
                      {formatPrice(p.price)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleStockToggle(p.id, p.stockStatus)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider cursor-pointer transition-colors ${
                          p.stockStatus === 'IN_STOCK'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                        title="Click to toggle stock status"
                      >
                        {p.stockStatus === 'IN_STOCK' ? '● In Stock' : '○ Sold Out'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                      <Link
                        to={`/admin/products/${p.id}/edit`}
                        className="text-brand-accent hover:underline font-semibold"
                      >
                        Edit
                      </Link>
                      <span className="text-zinc-300">|</span>
                      <Link
                        to={`/products/${p.slug}`}
                        target="_blank"
                        className="text-zinc-500 hover:text-zinc-800"
                        title="Preview on storefront"
                      >
                        <ExternalLink className="w-3.5 h-3.5 inline" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
