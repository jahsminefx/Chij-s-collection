import React from 'react';

export default function StatCard({ label, value, icon: Icon, color = 'bg-brand-primary', subtitle }) {
  return (
    <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-xs flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{label}</p>
        <p className="text-2xl sm:text-3xl font-bold font-display text-zinc-900 mt-1">{value}</p>
        {subtitle && <p className="text-[11px] text-zinc-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}
