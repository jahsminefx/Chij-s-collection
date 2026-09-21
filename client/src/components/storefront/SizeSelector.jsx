import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function SizeSelector({
  sizes = [],
  selectedSize,
  onSelectSize,
  disabled = false,
  hasError = false,
}) {
  if (!sizes || sizes.length === 0) {
    return (
      <div className="text-xs text-brand-text-muted italic py-1">
        Standard sizing applies to this piece.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-widest text-brand-text">
          Select Size <span className="text-red-500">*</span>
        </label>
        {selectedSize && (
          <span className="text-xs text-brand-text-secondary font-medium">
            Selected: <span className="font-bold text-brand-primary">{selectedSize}</span>
          </span>
        )}
      </div>

      {/* Sizes Chips */}
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          return (
            <button
              key={size}
              type="button"
              disabled={disabled}
              onClick={() => onSelectSize(size)}
              className={`min-w-[48px] h-11 px-3 flex items-center justify-center text-xs font-semibold transition-all border ${
                disabled
                  ? 'opacity-40 cursor-not-allowed bg-brand-muted border-brand-border text-brand-text-muted line-through'
                  : isSelected
                  ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                  : 'bg-brand-surface text-brand-text border-brand-border hover:border-brand-primary'
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>

      {/* Validation Message if customer clicks without selecting size */}
      {hasError && !selectedSize && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-red-600 pt-1 animate-shake">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Please select an available size before placing your order.</span>
        </p>
      )}
    </div>
  );
}
