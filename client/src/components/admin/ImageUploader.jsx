import React, { useRef, useState } from 'react';
import { UploadCloud, X, ArrowLeft, ArrowRight, Star, Loader2 } from 'lucide-react';
import { uploadAPI } from '../../services/api.js';
import { showToast } from '../common/Toast.jsx';

export default function ImageUploader({ images = [], onChange }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const invalid = files.filter((f) => !validTypes.includes(f.type));

    if (invalid.length > 0) {
      showToast('Only JPEG, PNG, and WebP images are allowed', 'error');
      return;
    }

    // Check size (5MB max)
    const tooLarge = files.filter((f) => f.size > 5 * 1024 * 1024);
    if (tooLarge.length > 0) {
      showToast('Each image must be under 5MB', 'error');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));

      const res = await uploadAPI.uploadImages(formData);
      if (res.success && res.data) {
        const newImages = res.data.map((item, idx) => ({
          url: item.url,
          altText: '',
          sortOrder: images.length + idx,
        }));
        onChange([...images, ...newImages]);
        showToast(`${newImages.length} image(s) uploaded successfully.`);
      }
    } catch (err) {
      showToast(err.message || 'Image upload failed', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (indexToRemove) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove).map((img, idx) => ({
      ...img,
      sortOrder: idx,
    }));
    onChange(updated);
  };

  const moveImage = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const newArr = [...images];
    const temp = newArr[index];
    newArr[index] = newArr[targetIndex];
    newArr[targetIndex] = temp;

    const reindexed = newArr.map((img, idx) => ({ ...img, sortOrder: idx }));
    onChange(reindexed);
  };

  const setPrimary = (index) => {
    if (index === 0) return;
    const item = images[index];
    const rest = images.filter((_, idx) => idx !== index);
    const reindexed = [item, ...rest].map((img, idx) => ({ ...img, sortOrder: idx }));
    onChange(reindexed);
  };

  return (
    <div className="space-y-4">
      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-colors ${
          isDragOver
            ? 'border-brand-accent bg-amber-50/50'
            : 'border-zinc-300 hover:border-zinc-400 bg-zinc-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={uploading}
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          {uploading ? (
            <Loader2 className="w-10 h-10 text-brand-accent animate-spin" />
          ) : (
            <UploadCloud className="w-10 h-10 text-zinc-400" />
          )}

          <div className="text-xs sm:text-sm font-medium text-zinc-700">
            {uploading ? (
              <span>Uploading & optimizing images...</span>
            ) : (
              <span>
                <strong className="text-brand-primary">Click to upload</strong> or drag and drop
              </span>
            )}
          </div>

          <p className="text-[11px] text-zinc-400">
            JPEG, PNG or WebP (Up to 5MB each). First image becomes primary.
          </p>
        </div>
      </div>

      {/* Uploaded Images List with Reordering */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              Product Gallery ({images.length} {images.length === 1 ? 'image' : 'images'})
            </span>
            <span className="text-[11px] text-zinc-400 italic">
              Use arrows to arrange display order
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="group relative aspect-[4/5] bg-zinc-100 rounded border border-zinc-200 overflow-hidden shadow-xs"
              >
                <img
                  src={img.url}
                  alt={`Product view ${idx + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Primary / Cover Badge */}
                {idx === 0 && (
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-brand-primary text-white text-[9px] font-bold uppercase tracking-wider rounded">
                    Cover
                  </span>
                )}

                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-between items-center">
                    {idx !== 0 ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPrimary(idx);
                        }}
                        className="p-1 bg-white/90 text-zinc-800 hover:text-amber-600 rounded text-[10px] flex items-center gap-1 font-semibold"
                        title="Set as Cover"
                      >
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>Cover</span>
                      </button>
                    ) : <div />}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(idx);
                      }}
                      className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Reorder Buttons */}
                  <div className="flex justify-center gap-2">
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveImage(idx, -1);
                        }}
                        className="p-1 bg-white/90 text-zinc-900 rounded hover:bg-white"
                        title="Move left"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {idx < images.length - 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveImage(idx, 1);
                        }}
                        className="p-1 bg-white/90 text-zinc-900 rounded hover:bg-white"
                        title="Move right"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
