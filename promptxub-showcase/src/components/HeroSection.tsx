'use client';

import React, { useRef, useEffect } from 'react';
import { Search, Flame, Command } from 'lucide-react';

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
    <section className="relative pt-4 sm:pt-6 pb-2 sm:pb-4 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
      {/* Sleek Minimal Title */}
      <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
        Explore & 1-Click Copy <span className="neon-text-gradient">AI Prompts</span>
      </h1>

      {/* Prominent Compact Search Bar */}
      <div className="max-w-xl mx-auto mb-3 relative group">
        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-400 opacity-25 blur group-hover:opacity-40 transition duration-300" />
        
        <div className="relative flex items-center bg-slate-900/95 border border-slate-700/80 rounded-xl p-1.5 shadow-xl backdrop-blur-xl focus-within:border-purple-500/80">
          <Search className="w-4 h-4 text-cyan-400 ml-2.5 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search prompts, Midjourney, Flux.1..."
            className="w-full bg-transparent px-2.5 py-1.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="px-2 py-1 text-xs text-slate-400 hover:text-white mr-1"
            >
              Clear
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400 shrink-0">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Compact Quick Tag Pills */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1">
          <Flame className="w-3 h-3 text-orange-400" /> Popular:
        </span>
        {quickTags.map((item) => (
          <button
            key={item.tag}
            onClick={() => onSelectTag(item.tag)}
            className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-purple-500 hover:text-white transition active:scale-95"
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );
};
