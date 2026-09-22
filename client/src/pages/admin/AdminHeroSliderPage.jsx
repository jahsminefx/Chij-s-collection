import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Check,
  X,
  Loader2,
  Sparkles,
  ShoppingBag,
  Tag,
} from 'lucide-react';
import { heroSlideAPI, productAPI, uploadAPI } from '../../services/api.js';
import { formatPrice } from '../../utils/formatters.js';
import { showToast } from '../../components/common/Toast.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';

const MAX_SLOTS = 6;

export default function AdminHeroSliderPage() {
  const [slides, setSlides] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form states in modal
  const [selectedProductId, setSelectedProductId] = useState('');
  const [imageMode, setImageMode] = useState('product'); // 'product' | 'upload' | 'url'
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('Featured Look');
  const [isActive, setIsActive] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch slides and published products
  const loadData = async () => {
    try {
      setLoading(true);
      const [slidesRes, productsRes] = await Promise.all([
        heroSlideAPI.getAdminSlides(),
        productAPI.getAdminProducts({ limit: 100 }),
      ]);

      if (slidesRes.success) {
        setSlides(slidesRes.data || []);
      }
      if (productsRes.success) {
        setProducts(productsRes.data || []);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load hero slides', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    if (slides.length >= MAX_SLOTS) {
      showToast(`Maximum limit of ${MAX_SLOTS} slots reached. Edit or remove an existing slot.`, 'error');
      return;
    }
    setEditingSlide(null);
    setSelectedProductId('');
    setImageMode('product');
    setImageUrl('');
    setTitle('');
    setSubtitle('Featured Look');
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (slide) => {
    setEditingSlide(slide);
    setSelectedProductId(slide.productId || '');
    setImageUrl(slide.imageUrl || '');
    setTitle(slide.title || '');
    setSubtitle(slide.subtitle || 'Featured Look');
    setIsActive(slide.isActive !== undefined ? slide.isActive : true);

    // Check if the current image matches the selected product's primary image
    const prod = products.find((p) => p.id === slide.productId);
    const prodImg = prod?.images?.[0]?.url;
    if (prodImg && prodImg === slide.imageUrl) {
      setImageMode('product');
    } else {
      setImageMode('upload');
    }

    setModalOpen(true);
  };

  const handleProductSelect = (productId) => {
    setSelectedProductId(productId);
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      if (!title) setTitle(prod.name);
      if (imageMode === 'product' && prod.images?.[0]?.url) {
        setImageUrl(prod.images[0].url);
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file size must be under 5MB', 'error');
      return;
    }

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('images', file);

      const res = await uploadAPI.uploadImages(formData);
      if (res.success && res.data?.[0]?.url) {
        setImageUrl(res.data[0].url);
        setImageMode('upload');
        showToast('Photo uploaded successfully');
      }
    } catch (err) {
      showToast(err.message || 'Failed to upload photo', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveSlide = async (e) => {
    e.preventDefault();
    if (!imageUrl || imageUrl.trim() === '') {
      showToast('Please provide an image for this hero slide', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: title ? title.trim() : null,
        subtitle: subtitle ? subtitle.trim() : null,
        imageUrl: imageUrl.trim(),
        productId: selectedProductId || null,
        isActive,
      };

      if (editingSlide) {
        const res = await heroSlideAPI.updateSlide(editingSlide.id, payload);
        if (res.success) {
          showToast('Hero slide updated');
        }
      } else {
        const res = await heroSlideAPI.createSlide(payload);
        if (res.success) {
          showToast('Hero slide created');
        }
      }

      setModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to save hero slide', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSlide = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await heroSlideAPI.deleteSlide(deleteConfirmId);
      if (res.success) {
        showToast('Hero slide removed');
        setDeleteConfirmId(null);
        loadData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete slide', 'error');
    }
  };

  const handleToggleActive = async (slide) => {
    try {
      const res = await heroSlideAPI.updateSlide(slide.id, {
        isActive: !slide.isActive,
      });
      if (res.success) {
        showToast(`Slot #${slide.sortOrder + 1} ${!slide.isActive ? 'activated' : 'paused'}`);
        loadData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to toggle status', 'error');
    }
  };

  const handleMoveSlide = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    const reorderPayload = newSlides.map((s, idx) => ({
      id: s.id,
      sortOrder: idx,
    }));

    // Optimistic update
    setSlides(newSlides);

    try {
      await heroSlideAPI.reorderSlides(reorderPayload);
      showToast('Slide order updated');
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to reorder slides', 'error');
      loadData();
    }
  };

  // Build the 6 slots representation
  const slotCards = Array.from({ length: MAX_SLOTS }, (_, index) => {
    const slide = slides[index] || null;
    return { slotNumber: index + 1, slide };
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-zinc-900">
              Hero Slideshow
            </h1>
            <span
              className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                slides.length >= MAX_SLOTS
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              {slides.length} / {MAX_SLOTS} Slots Configured
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Curate up to 6 featured products and model lifestyle photos on your storefront hero section.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openAddModal}
            disabled={slides.length >= MAX_SLOTS}
            className={`flex items-center gap-2 px-4 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs ${
              slides.length >= MAX_SLOTS
                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                : 'bg-brand-primary text-white hover:bg-zinc-800'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add Hero Slide</span>
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Editorial Tip for Maximum Conversion:</p>
          <p className="text-amber-800 leading-relaxed">
            Link each slide to a high-demand product or new arrival. You can upload high-resolution editorial photos of models wearing the garments or use your catalog pictures. Customers can tap any slide on the homepage to order directly!
          </p>
        </div>
      </div>

      {/* 6 Slots Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 text-brand-primary animate-spin mx-auto mb-2" />
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Loading hero slots...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {slotCards.map(({ slotNumber, slide }, index) => {
            if (slide) {
              const product = slide.product;
              return (
                <div
                  key={slide.id}
                  className={`bg-white border rounded-xl overflow-hidden shadow-xs flex flex-col transition-all duration-200 ${
                    slide.isActive ? 'border-zinc-200' : 'border-zinc-300 opacity-60 bg-zinc-50'
                  }`}
                >
                  {/* Image Preview & Slot Badge */}
                  <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden group">
                    <img
                      src={slide.imageUrl}
                      alt={slide.title || 'Hero Slide'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-xs text-white px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider">
                      Slot #{slotNumber}
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleActive(slide)}
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-xs transition-colors ${
                          slide.isActive
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-zinc-700 text-zinc-200 hover:bg-zinc-600'
                        }`}
                        title={slide.isActive ? 'Slide is active' : 'Slide is paused'}
                      >
                        {slide.isActive ? 'Live' : 'Paused'}
                      </button>
                    </div>

                    {/* Floating Product Badge Preview */}
                    {product && (
                      <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs p-2.5 rounded shadow-sm border border-zinc-200/80 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-brand-accent block">
                            {slide.subtitle || 'Featured Look'}
                          </span>
                          <p className="text-xs font-bold text-zinc-900 truncate">
                            {product.name}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-brand-primary whitespace-nowrap">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Slot Details Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Tag className="w-3.5 h-3.5 text-brand-accent" />
                        <span className="font-semibold">{slide.subtitle || 'Featured Look'}</span>
                      </div>
                      <h3 className="font-display font-bold text-sm text-zinc-900 line-clamp-1">
                        {slide.title || product?.name || 'Untitled Slide'}
                      </h3>
                      {product ? (
                        <p className="text-xs text-zinc-500 flex items-center gap-1">
                          <ShoppingBag className="w-3.5 h-3.5 text-zinc-400" />
                          <span className="truncate">Linked: {product.name}</span>
                        </p>
                      ) : (
                        <p className="text-xs text-zinc-400 italic">No direct product link</p>
                      )}
                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2 text-xs">
                      {/* Move Up / Down */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveSlide(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 rounded hover:bg-zinc-100 text-zinc-500 disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Move Left / Earlier"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveSlide(index, 'down')}
                          disabled={index === slides.length - 1}
                          className="p-1.5 rounded hover:bg-zinc-100 text-zinc-500 disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Move Right / Later"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Edit / Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(slide)}
                          className="p-1.5 rounded text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                          title="Edit Slide"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(slide.id)}
                          className="p-1.5 rounded text-zinc-400 hover:text-red-600 hover:bg-red-50"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // Empty Slot Card
            return (
              <div
                key={`empty-${slotNumber}`}
                onClick={openAddModal}
                className="border-2 border-dashed border-zinc-200 hover:border-brand-primary rounded-xl aspect-[4/3] sm:aspect-auto min-h-[300px] flex flex-col items-center justify-center p-6 text-center group cursor-pointer bg-zinc-50/50 hover:bg-white transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-full bg-zinc-100 group-hover:bg-brand-primary group-hover:text-white flex items-center justify-center text-zinc-400 transition-colors mb-3">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 group-hover:text-zinc-900 mb-1">
                  Slot #{slotNumber}
                </span>
                <p className="text-xs text-zinc-500 max-w-[200px]">
                  Click to feature a product or editorial look in this slot
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Slide Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => !submitting && setModalOpen(false)}
          />

          <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 z-10 animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-5">
              <div>
                <h3 className="font-display font-bold text-lg text-zinc-900">
                  {editingSlide ? 'Edit Hero Slide' : 'Add Hero Slide'}
                </h3>
                <p className="text-xs text-zinc-500">
                  Configure photo and product link for this hero slot.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                disabled={submitting}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-5 text-xs">
              {/* 1. Select Linked Product */}
              <div>
                <label className="font-bold text-zinc-700 block mb-1.5">
                  1. Link to Product (Customer will be taken here when clicked)
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800 text-xs font-medium"
                >
                  <option value="">-- Optional: No direct product link --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {formatPrice(p.price)}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Photo Mode Choice */}
              <div>
                <label className="font-bold text-zinc-700 block mb-2">
                  2. Choose Slide Image
                </label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setImageMode('product');
                      const prod = products.find((p) => p.id === selectedProductId);
                      if (prod?.images?.[0]?.url) {
                        setImageUrl(prod.images[0].url);
                      }
                    }}
                    disabled={!selectedProductId}
                    className={`p-2.5 text-center border rounded text-xs font-semibold transition-colors ${
                      imageMode === 'product'
                        ? 'border-zinc-900 bg-zinc-900 text-white'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed'
                    }`}
                  >
                    Use Product Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode('upload')}
                    className={`p-2.5 text-center border rounded text-xs font-semibold transition-colors ${
                      imageMode === 'upload'
                        ? 'border-zinc-900 bg-zinc-900 text-white'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    Upload Model/Editorial Photo
                  </button>
                </div>

                {/* Upload Zone */}
                {imageMode === 'upload' && (
                  <div className="space-y-2">
                    <div className="border-2 border-dashed border-zinc-300 rounded-lg p-4 text-center hover:border-zinc-500 transition-colors bg-zinc-50">
                      <input
                        type="file"
                        id="hero-file-upload"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                      <label
                        htmlFor="hero-file-upload"
                        className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                      >
                        {uploadingImage ? (
                          <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-zinc-400" />
                        )}
                        <span className="text-xs font-bold text-zinc-700">
                          {uploadingImage ? 'Uploading photo...' : 'Click to select photo (JPEG, PNG, WebP)'}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          High resolution model or lifestyle image recommended (Max 5MB)
                        </span>
                      </label>
                    </div>

                    {/* Or URL input */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] text-zinc-400">or enter image URL:</span>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* Image Preview Box */}
                {imageUrl && (
                  <div className="mt-3 relative aspect-[16/9] rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                      Selected Photo
                    </span>
                  </div>
                )}
              </div>

              {/* 3. Custom Badge / Subtitle */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">
                    Badge / Tag (e.g. "Featured Look")
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="New Season, Trending Now..."
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1">
                    Display Headline (optional)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Defaults to product name"
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded text-xs"
                  />
                </div>
              </div>

              {/* Active Switch */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="slide-is-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-zinc-300 text-brand-primary focus:ring-zinc-800"
                />
                <label htmlFor="slide-is-active" className="text-xs font-semibold text-zinc-800 cursor-pointer">
                  Activate this slide immediately on the storefront
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-zinc-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2 border border-zinc-300 text-zinc-700 rounded font-semibold uppercase tracking-wider hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingImage || !imageUrl}
                  className="flex items-center gap-2 px-5 py-2 bg-brand-primary text-white rounded font-semibold uppercase tracking-wider hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingSlide ? 'Save Changes' : 'Add Slot'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDeleteSlide}
        title="Remove Hero Slide?"
        message="Are you sure you want to remove this hero slide slot? The product itself will NOT be deleted."
        confirmText="Remove Slot"
      />
    </div>
  );
}
