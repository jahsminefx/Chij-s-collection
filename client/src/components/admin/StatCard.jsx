import React from 'react';

export default function StatCard({
  label,
  value,
  icon: Icon,
  color = 'bg-brand-primary',
  subtitle,
  badge,
  className = '',
}) {
  return (
    <div
      className={`bg-white p-4 sm:p-5 rounded-xl border border-zinc-200 shadow-xs flex items-center justify-between gap-4 transition-all duration-200 hover:shadow-sm ${className}`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider truncate">
            {label}
          </p>
          {badge && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-zinc-100 text-zinc-600">
              {badge}
            </span>
          )}
        </div>
        <p className="text-2xl sm:text-3xl font-bold font-display text-zinc-900 mt-1.5 tracking-tight">
          {value}
        </p>
        {subtitle && (
          <p className="text-[11px] text-zinc-400 mt-1 truncate">
            {subtitle}
          </p>
        )}
      </div>

      <div
        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-xs ${color}`}
      >
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
    </div>
  );
}
