import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, X } from 'lucide-react';
import { categoryAPI } from '../../services/api.js';
import ImageUploader from './ImageUploader.jsx';
import { showToast } from '../common/Toast.jsx';

export default function ProductForm({ initialData, onSubmit, isEditing = false }) {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form Fields
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price !== undefined ? String(initialData.price) : '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [sizes, setSizes] = useState(initialData?.sizes || ['S', 'M', 'L', 'XL']);
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [stockStatus, setStockStatus] = useState(initialData?.stockStatus || 'IN_STOCK');
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [isPublished, setIsPublished] = useState(initialData?.isPublished !== undefined ? initialData.isPublished : true);
  const [images, setImages] = useState(initialData?.images || []);

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoadingCategories(true);
        const res = await categoryAPI.getAdminCategories();
        if (res.success) {
          setCategories(res.data);
          if (!categoryId && res.data.length > 0) {
            setCategoryId(res.data[0].id);
          }
        }
      } catch (err) {
        showToast('Failed to load categories for selection', 'error');
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  const handleTogglePresetSize = (size) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  const handleAddCustomSize = (e) => {
    e?.preventDefault();
    const trimmed = customSizeInput.trim().toUpperCase();
    if (trimmed && !sizes.includes(trimmed)) {
      setSizes([...sizes, trimmed]);
      setCustomSizeInput('');
    }
  };

  const handleRemoveSize = (sizeToRemove) => {
    setSizes(sizes.filter((s) => s !== sizeToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!price || isNaN(Number(price)) || Number(price) < 0) {
      setError('Please provide a valid numeric price.');
      return;
    }
    if (!categoryId) {
      setError('Please select a category for this product.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        categoryId,
        sizes,
        stockStatus,
        isFeatured,
        isPublished,
        images,
      };

      await onSubmit(payload);
    } catch (err) {
      setError(err.message || 'Failed to save product.');
    } finally {
      setSubmitting(false);
    }
  };

  const clothingPresets = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  const shoePresets = ['39', '40', '41', '42', '43', '44', '45', '46'];

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-xs text-zinc-800">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg font-medium text-xs">
          {error}
        </div>
      )}

      {/* 1. Basic Information */}
      <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-xs space-y-4">
        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-3">
          1. Basic Product Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Classic Noir Linen Button-Down Shirt"
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800 text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={loadingCategories}
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800 text-sm"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Price (₦ Naira) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              step="100"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 25000"
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Description & Styling Notes
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the fabric, cut, silhouette, occasion, or care guidelines..."
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800 text-sm"
            />
          </div>
        </div>
      </div>

      {/* 2. Product Images */}
      <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-xs space-y-4">
        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-3">
          2. Product Images & Gallery
        </h2>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      {/* 3. Available Sizes */}
      <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-xs space-y-4">
        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-3">
          3. Available Sizing
        </h2>

        <div>
          <span className="block font-semibold text-zinc-600 mb-2">Clothing Presets:</span>
          <div className="flex flex-wrap gap-2">
            {clothingPresets.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleTogglePresetSize(size)}
                className={`px-3 py-1.5 rounded text-xs font-semibold uppercase border transition-colors ${
                  sizes.includes(size)
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-zinc-50 text-zinc-700 border-zinc-300 hover:border-zinc-500'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="block font-semibold text-zinc-600 mb-2">Footwear Presets:</span>
          <div className="flex flex-wrap gap-2">
            {shoePresets.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleTogglePresetSize(size)}
                className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors ${
                  sizes.includes(size)
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-zinc-50 text-zinc-700 border-zinc-300 hover:border-zinc-500'
                }`}
              >
                {size}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleTogglePresetSize('One Size')}
              className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors ${
                sizes.includes('One Size')
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-zinc-50 text-zinc-700 border-zinc-300 hover:border-zinc-500'
              }`}
            >
              One Size
            </button>
          </div>
        </div>

        {/* Custom Size Tag Input */}
        <div className="pt-2 flex items-center gap-2 max-w-sm">
          <input
            type="text"
            value={customSizeInput}
            onChange={(e) => setCustomSizeInput(e.target.value)}
            placeholder="Add custom size (e.g. 34, Petite)..."
            className="flex-1 px-3 py-1.5 bg-zinc-50 border border-zinc-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-zinc-800"
          />
          <button
            type="button"
            onClick={handleAddCustomSize}
            className="px-3 py-1.5 bg-zinc-200 text-zinc-800 rounded font-semibold hover:bg-zinc-300 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Selected Sizes Display */}
        <div className="pt-2 border-t border-zinc-100">
          <span className="text-[11px] text-zinc-500 block mb-1.5 font-medium">
            Active Product Sizes ({sizes.length}):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {sizes.length > 0 ? (
              sizes.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded font-bold text-xs"
                >
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(s)}
                    className="text-amber-700 hover:text-red-600 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-zinc-400 italic">No sizes specified.</span>
            )}
          </div>
        </div>
      </div>

      {/* 4. Stock & Publishing Controls */}
      <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-xs space-y-4">
        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-3">
          4. Inventory, Featured & Visibility
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stock Status */}
          <div>
            <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-2">
              Inventory Status
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="stockStatus"
                  value="IN_STOCK"
                  checked={stockStatus === 'IN_STOCK'}
                  onChange={() => setStockStatus('IN_STOCK')}
                  className="text-brand-primary focus:ring-brand-primary"
                />
                <span className="font-semibold text-green-700">● In Stock (Available for ordering)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="stockStatus"
                  value="SOLD_OUT"
                  checked={stockStatus === 'SOLD_OUT'}
                  onChange={() => setStockStatus('SOLD_OUT')}
                  className="text-brand-primary focus:ring-brand-primary"
                />
                <span className="font-semibold text-red-600">○ Sold Out (Ordering disabled)</span>
              </label>
            </div>
          </div>

          {/* Visibility / Draft */}
          <div>
            <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-2">
              Publishing State
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="isPublished"
                  checked={isPublished === true}
                  onChange={() => setIsPublished(true)}
                  className="text-brand-primary focus:ring-brand-primary"
                />
                <span className="font-semibold text-zinc-800">Published (Visible on storefront)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="isPublished"
                  checked={isPublished === false}
                  onChange={() => setIsPublished(false)}
                  className="text-brand-primary focus:ring-brand-primary"
                />
                <span className="font-semibold text-zinc-600">Draft (Private admin only)</span>
              </label>
            </div>
          </div>

          {/* Featured on Homepage */}
          <div>
            <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-2">
              Homepage Spotlight
            </label>
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded text-brand-accent focus:ring-brand-accent w-4 h-4"
              />
              <span className="font-semibold text-zinc-800">
                Mark as Featured Collection Piece
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          disabled={submitting}
          onClick={() => navigate('/admin/products')}
          className="px-6 py-2.5 bg-white border border-zinc-300 text-zinc-700 font-semibold rounded uppercase tracking-wider hover:bg-zinc-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 px-8 py-2.5 bg-brand-primary text-white font-semibold rounded uppercase tracking-widest hover:bg-zinc-800 transition-colors shadow-xs disabled:opacity-50"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{isEditing ? 'Update Product' : 'Publish Product'}</span>
        </button>
      </div>
    </form>
  );
}
