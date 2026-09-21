import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { categoryAPI } from '../../services/api.js';
import { showToast } from '../common/Toast.jsx';

export default function CategoryModal({ isOpen, category, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setDescription(category.description || '');
      setImage(category.image || '');
      setIsActive(category.isActive !== undefined ? category.isActive : true);
    } else {
      setName('');
      setDescription('');
      setImage('');
      setIsActive(true);
    }
    setError(null);
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        name: name.trim(),
        description: description.trim(),
        image: image.trim(),
        isActive,
      };

      if (category?.id) {
        await categoryAPI.updateCategory(category.id, payload);
        showToast('Category updated successfully');
      } else {
        await categoryAPI.createCategory(payload);
        showToast('Category created successfully');
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save category.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={loading ? undefined : onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white max-w-lg w-full rounded-lg shadow-2xl border border-zinc-200 overflow-hidden z-10 animate-fadeIn">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
          <h3 className="font-display font-bold text-base text-zinc-900">
            {category ? 'Edit Category' : 'Create New Category'}
          </h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-zinc-400 hover:text-zinc-700 p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Linen Shirts, Luxury Footwear..."
              className="w-full px-3 py-2 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800 text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief summary of what belongs in this curated line..."
              className="w-full px-3 py-2 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800 text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Cover Image URL (Optional)
            </label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://... or /uploads/..."
              className="w-full px-3 py-2 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800 text-sm"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="categoryActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded text-brand-primary focus:ring-brand-primary w-4 h-4"
            />
            <label htmlFor="categoryActive" className="text-zinc-800 font-semibold cursor-pointer">
              Category is Active (Visible on Storefront)
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="px-4 py-2 text-zinc-600 font-semibold hover:bg-zinc-100 rounded uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-brand-primary text-white font-semibold rounded uppercase tracking-wider hover:bg-brand-primary-hover disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{category ? 'Save Changes' : 'Create Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
