import React from 'react';
import { Compass, Sparkles, Activity } from 'lucide-react';

export default function LiveTicker({ treks = [] }) {
  const openTreks = treks.filter((t) => t.status === 'open');

  return (
    <div className="w-full bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-md overflow-hidden py-2 px-4 relative z-20">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold shrink-0 shadow-sm shadow-teal-500/20">
          <span className="live-ripple-dot" />
          <span className="uppercase tracking-wider">Live Operations</span>
        </div>

        {/* Marquee Loop Container */}
        <div className="overflow-hidden whitespace-nowrap relative w-full">
          <div className="inline-flex gap-8 animate-marquee text-xs font-semibold text-slate-300">
            {openTreks.map((t, idx) => (
              <span key={idx} className="inline-flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-teal-400 animate-spin-slow" />
                <span className="text-white font-bold">{t.name}</span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-400 font-bold">${t.price}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">Capacity: {t.max_capacity} max</span>
                <span className="mx-4 text-slate-700">|</span>
              </span>
            ))}

            {/* Repeat loop content for seamless infinite marquee scroll */}
            {openTreks.map((t, idx) => (
              <span key={`dup-${idx}`} className="inline-flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-teal-400 animate-spin-slow" />
                <span className="text-white font-bold">{t.name}</span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-400 font-bold">${t.price}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">Capacity: {t.max_capacity} max</span>
                <span className="mx-4 text-slate-700">|</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
