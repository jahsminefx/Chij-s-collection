import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title = 'No products found',
  description = 'There are currently no items matching your criteria in this collection.',
  actionText = 'Explore All Collections',
  actionLink = '/shop',
  onAction,
  icon: Icon = PackageOpen,
}) {
  return (
    <div className="py-16 px-4 text-center max-w-md mx-auto">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-muted flex items-center justify-center text-brand-accent">
        <Icon className="w-8 h-8 opacity-80" />
      </div>
      <h3 className="font-display text-lg sm:text-xl font-semibold text-brand-primary mb-2">
        {title}
      </h3>
      <p className="text-sm text-brand-text-secondary mb-6 leading-relaxed">
        {description}
      </p>

      {onAction ? (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-6 py-2.5 bg-brand-primary text-white text-xs font-semibold tracking-widest uppercase hover:bg-brand-primary-hover transition-colors"
        >
          {actionText}
        </button>
      ) : actionLink ? (
        <Link
          to={actionLink}
          className="inline-flex items-center justify-center px-6 py-2.5 bg-brand-primary text-white text-xs font-semibold tracking-widest uppercase hover:bg-brand-primary-hover transition-colors"
        >
          {actionText}
        </Link>
      ) : null}
    </div>
  );
}
