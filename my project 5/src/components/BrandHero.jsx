import React from 'react';
import { Sun, ShieldCheck, Sparkles, Compass, CheckCircle2, Heart } from 'lucide-react';

export default function BrandHero({ currentTab, onSwitchTab }) {
  return (
    <div className="relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 h-full text-warm-900 bg-gradient-to-br from-[#F5EDE3] via-[#FBF5EC] to-[#F1E4D3] overflow-hidden border-b lg:border-b-0 lg:border-r border-warm-200">
      {/* Decorative Warm Ambient Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-terracotta-300/20 rounded-full blur-3xl pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none transform -translate-x-1/4 translate-y-1/4" />

      {/* Top Header & Brand Identity */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-terracotta-600 to-terracotta-400 flex items-center justify-center text-white shadow-md shadow-terracotta-500/25">
            <Sun className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-warm-900">
              Morrow
            </span>
            <span className="block text-xs uppercase tracking-widest font-semibold text-terracotta-700/80">
              Studio & Workspace
            </span>
          </div>
        </div>

        {/* Hero Headline */}
        <div className="max-w-md">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-warm-900 leading-[1.18] tracking-tight mb-4">
            Calm spaces for tomorrow&apos;s best work.
          </h1>
          <p className="text-base sm:text-lg text-warm-700 font-normal leading-relaxed">
            Begin each day with intentional clarity. A gentle, distraction-free environment
            crafted for thinkers, writers, and makers.
          </p>
        </div>
      </div>

      {/* Middle Graphic / Ambient Card */}
      <div className="relative z-10 my-8 sm:my-10">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-warm border border-white/60 space-y-4 max-w-md">
          {/* Subtle Quote / Philosophy */}
          <div className="flex items-start gap-3">
            <span className="text-3xl font-serif text-terracotta-400 leading-none">“</span>
            <p className="font-serif italic text-warm-800 text-sm sm:text-base leading-relaxed">
              Order and calm are the secret architecture of great work. Take your time, think deeply, and build gently.
            </p>
          </div>

          <div className="pt-3 border-t border-warm-100 flex items-center justify-between text-xs text-warm-600 font-medium">
            <span className="flex items-center gap-1.5 text-terracotta-700">
              <Sparkles className="w-4 h-4 text-terracotta-500" />
              Daily Focus Note
            </span>
            <span>Morning Edition</span>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 max-w-md">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-warm-100/70 border border-warm-200/60 text-xs font-medium text-warm-800">
            <ShieldCheck className="w-4 h-4 text-terracotta-600 flex-shrink-0" />
            <span>Web Crypto SHA-256 Hashing</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-warm-100/70 border border-warm-200/60 text-xs font-medium text-warm-800">
            <Compass className="w-4 h-4 text-terracotta-600 flex-shrink-0" />
            <span>Local Browser Persistence</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Notice */}
      <div className="relative z-10 pt-4 border-t border-warm-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-warm-600">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Demo Environment Ready</span>
        </div>
        <p className="text-warm-500 text-[11px]">
          Front-end educational demo app
        </p>
      </div>
    </div>
  );
}
