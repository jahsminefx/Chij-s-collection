import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, ExternalLink, Filter } from 'lucide-react';
import { productAPI, categoryAPI } from '../../services/api.js';
import { formatPrice } from '../../utils/formatters.js';
import { showToast } from '../../components/common/Toast.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStock, setSelectedStock] = useState('');
  const [selectedPublished, setSelectedPublished] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCategory) params.category = selectedCategory;
      if (selectedStock) params.stock = selectedStock;
      if (selectedPublished !== '') params.published = selectedPublished;

      const [prodRes, catRes] = await Promise.all([
        productAPI.getAdminProducts(params),
        categoryAPI.getAdminCategories(),
      ]);

      if (prodRes.success) setProducts(prodRes.data);
      if (catRes.success) setCategories(catRes.data);
    } catch (err) {
      showToast(err.message || 'Error loading products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, selectedStock, selectedPublished]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadProducts();
  };

  const handleToggleStock = async (id, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'IN_STOCK' ? 'SOLD_OUT' : 'IN_STOCK';
      await productAPI.toggleStock(id, nextStatus);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stockStatus: nextStatus } : p))
      );
      showToast(`Updated to ${nextStatus === 'IN_STOCK' ? 'In Stock' : 'Sold Out'}`);
    } catch (err) {
      showToast(err.message || 'Failed to update stock', 'error');
    }
  };

  const handleTogglePublish = async (id, currentPublished) => {
    try {
      const nextPublished = !currentPublished;
      await productAPI.togglePublish(id, nextPublished);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isPublished: nextPublished } : p))
      );
      showToast(`Product is now ${nextPublished ? 'Published' : 'Unpublished (Draft)'}`);
    } catch (err) {
      showToast(err.message || 'Failed to update publish state', 'error');
    }
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      setDeleteLoading(true);
      await productAPI.deleteProduct(productToDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      showToast(`Product "${productToDelete.name}" deleted.`);
      setDeleteModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Failed to delete product', 'error');
    } finally {
      setDeleteLoading(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-900">
            Products Catalog
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage your boutique inventory, prices, sizes, and stock availability.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white text-xs font-semibold rounded uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-zinc-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-8 pr-3 py-2 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800"
            />
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </form>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Stock Dropdown */}
          <select
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800"
          >
            <option value="">All Stock Status</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="SOLD_OUT">Sold Out</option>
          </select>

          {/* Published Dropdown */}
          <select
            value={selectedPublished}
            onChange={(e) => setSelectedPublished(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800"
          >
            <option value="">All Visibility</option>
            <option value="true">Published</option>
            <option value="false">Draft / Hidden</option>
          </select>
        </div>
      </div>

      {/* Products Display (Table on Desktop, Cards on Mobile per Rule #74) */}
      <div className="bg-white rounded-lg border border-zinc-200 shadow-xs overflow-hidden">
        {products.length === 0 && !loading ? (
          <EmptyState
            title="No products found"
            description="There are currently no products matching your search or filters."
            actionText="Add Product"
            actionLink="/admin/products/new"
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider text-[10px] border-b border-zinc-200">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Image</th>
                    <th className="py-3.5 px-4 font-semibold">Product Name</th>
                    <th className="py-3.5 px-4 font-semibold">Category</th>
                    <th className="py-3.5 px-4 font-semibold">Price</th>
                    <th className="py-3.5 px-4 font-semibold">Stock</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {products.map((product) => {
                    const cover = product.images?.[0]?.url || 'https://via.placeholder.com/100';
                    return (
                      <tr key={product.id} className="hover:bg-zinc-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <img
                            src={cover}
                            alt={product.name}
                            className="w-12 h-14 object-cover rounded bg-zinc-100"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-zinc-900 line-clamp-1">
                            {product.name}
                          </div>
                          <span className="text-[10px] text-zinc-400">
                            Sizes: {product.sizes?.join(', ') || 'None'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-zinc-600 font-medium">
                          {product.category?.name || 'Uncategorized'}
                        </td>
                        <td className="py-3 px-4 font-bold text-zinc-900">
                          {formatPrice(product.price)}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleStock(product.id, product.stockStatus)}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider transition-colors ${
                              product.stockStatus === 'IN_STOCK'
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                            title="Click to toggle Stock Status"
                          >
                            {product.stockStatus === 'IN_STOCK' ? '● In Stock' : '○ Sold Out'}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(product.id, product.isPublished)}
                            className={`px-2 py-0.5 text-[10px] font-semibold rounded uppercase tracking-wider transition-colors ${
                              product.isPublished
                                ? 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            }`}
                            title="Click to toggle Published / Draft"
                          >
                            {product.isPublished ? 'Published' : 'Draft'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                          <Link
                            to={`/products/${product.slug}`}
                            target="_blank"
                            className="p-1.5 text-zinc-400 hover:text-zinc-700 inline-block"
                            title="Preview on Store"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="p-1.5 text-blue-600 hover:text-blue-800 inline-block"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => confirmDelete(product)}
                            className="p-1.5 text-red-600 hover:text-red-800 inline-block"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (Rule #74: Tables transform into usable cards) */}
            <div className="md:hidden divide-y divide-zinc-200 p-3 space-y-3">
              {products.map((product) => {
                const cover = product.images?.[0]?.url || 'https://via.placeholder.com/100';
                return (
                  <div key={product.id} className="p-3 bg-zinc-50 rounded-lg flex gap-3.5">
                    <img
                      src={cover}
                      alt={product.name}
                      className="w-16 h-20 object-cover rounded bg-zinc-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-zinc-500 font-semibold uppercase block">
                          {product.category?.name}
                        </span>
                        <h4 className="font-bold text-zinc-900 truncate">{product.name}</h4>
                        <p className="font-bold text-zinc-800 mt-1">{formatPrice(product.price)}</p>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-zinc-200">
                        <button
                          type="button"
                          onClick={() => handleToggleStock(product.id, product.stockStatus)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            product.stockStatus === 'IN_STOCK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {product.stockStatus === 'IN_STOCK' ? '● In Stock' : '○ Sold Out'}
                        </button>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="text-blue-600 font-semibold text-xs"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => confirmDelete(product)}
                            className="text-red-600 font-semibold text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Safety Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Product?"
        message={`Are you sure you want to delete "${productToDelete?.name}"? All associated gallery images will be permanently removed. This action cannot be undone.`}
        confirmText="Delete Product"
        isDestructive={true}
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
