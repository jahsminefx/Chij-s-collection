import React from 'react';
import { useStore } from '../../context/StoreContext.jsx';
import { Sparkles } from 'lucide-react';

export default function AnnouncementBar() {
  const { settings } = useStore();

  if (!settings || !settings.announcementEnabled || !settings.announcement?.trim()) {
    return null;
  }

  return (
    <div className="bg-brand-primary text-white text-xs md:text-sm py-2 px-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center font-medium tracking-wide">
        <Sparkles className="w-3.5 h-3.5 text-brand-accent flex-shrink-0 animate-pulse" />
        <span className="truncate max-w-[95%] sm:max-w-none">
          {settings.announcement}
        </span>
      </div>
    </div>
  );
}
