'use client';

import React, { useRef, useEffect } from 'react';
import { Sparkles, Search, Copy, Zap, Flame, ShieldCheck, Command } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectTag: (tag: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  onSelectTag,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const quickTags = [
    { label: '🔥 Cyberpunk', tag: 'cyberpunk' },
    { label: '📸 Photorealistic', tag: 'photorealistic' },
    { label: '🎬 Cinematic', tag: 'cinematic' },
    { label: '⚡ Runway Motion', tag: 'motion' },
    { label: '🏛️ Architecture', tag: 'architecture' },
    { label: '👾 Mecha & Anime', tag: 'mecha' },
  ];

  // Cmd + K / Ctrl + K keyboard shortcut to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="relative pt-12 pb-10 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto overflow-hidden">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-6 backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
        <span>Next-Gen AI Prompt & Media Engine (Midjourney v6, Flux.1 & Runway)</span>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
        Master Generative AI with{' '}
        <span className="neon-text-gradient font-black">
          Precision Prompts
        </span>
      </h1>

      {/* Description */}
      <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
        Browse hyper-realistic photos, cinematic videos, and tested prompt recipes. 
        Copy prompt parameters with a single click and craft breathtaking visuals.
      </p>

      {/* Prominent Hero Search Bar */}
      <div className="max-w-2xl mx-auto mb-6 relative group">
        {/* Glow effect background */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-400 opacity-30 blur-lg group-hover:opacity-50 transition duration-500" />
        
        <div className="relative flex items-center bg-slate-900/95 border border-slate-700/80 rounded-2xl p-2 shadow-2xl backdrop-blur-xl focus-within:border-purple-500/80">
          <Search className="w-5 h-5 text-cyan-400 ml-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search prompts, styles, Flux.1, Midjourney..."
            className="w-full bg-transparent px-3 py-2 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="px-2 py-1 text-xs text-slate-400 hover:text-white mr-1"
            >
              Clear
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700/80 text-[11px] font-mono text-slate-400 shrink-0">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Quick Tag Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-orange-400" /> Popular:
        </span>
        {quickTags.map((item) => (
          <button
            key={item.tag}
            onClick={() => onSelectTag(item.tag)}
            className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60 hover:border-purple-500 hover:text-white hover:bg-purple-950/40 transition hover:scale-105 active:scale-95"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Stats Chips */}
      <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto p-4 rounded-2xl glass-panel border border-slate-800/80">
        <div className="flex flex-col items-center justify-center p-2">
          <div className="flex items-center gap-1.5 text-purple-400 font-bold text-xl sm:text-2xl">
            <Zap className="w-4 h-4" />
            <span>1-Click</span>
          </div>
          <span className="text-xs text-slate-400 font-medium mt-0.5">Instant Copy</span>
        </div>

        <div className="flex flex-col items-center justify-center p-2 border-x border-slate-800">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xl sm:text-2xl">
            <Copy className="w-4 h-4" />
            <span>50K+</span>
          </div>
          <span className="text-xs text-slate-400 font-medium mt-0.5">Total Copies</span>
        </div>

        <div className="flex flex-col items-center justify-center p-2">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xl sm:text-2xl">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Free</span>
          </div>
          <span className="text-xs text-slate-400 font-medium mt-0.5">Community Driven</span>
        </div>
      </div>
    </section>
  );
};
