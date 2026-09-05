'use client';

import React from 'react';
import { Sparkles, Search, Video, Image as ImageIcon, Layers, ExternalLink } from 'lucide-react';
import { ContentType } from '@/types';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedType: ContentType | 'ALL';
  onTypeSelect: (type: ContentType | 'ALL') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeSelect,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0F172A]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/20">
            <div className="h-full w-full bg-[#0F172A] rounded-2xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-white">Prompt<span className="text-cyan-400">Xub</span></span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/50">PRO</span>
            </div>
            <span className="text-xs text-slate-400 font-medium tracking-wide">AI Media & Prompt Engine</span>
          </div>
        </div>

        {/* Global Live Search Input */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search prompts, styles, Flux.1, Midjourney..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-full pl-10 pr-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/80 transition shadow-inner"
          />
        </div>

        {/* Media Filter Switcher */}
        <div className="hidden sm:flex items-center bg-slate-900/90 p-1 rounded-full border border-slate-800/80">
          <button
            onClick={() => onTypeSelect('ALL')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              selectedType === 'ALL'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            All
          </button>
          <button
            onClick={() => onTypeSelect('PHOTO')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              selectedType === 'PHOTO'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Photos
          </button>
          <button
            onClick={() => onTypeSelect('VIDEO')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              selectedType === 'VIDEO'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Videos
          </button>
        </div>

        {/* Dedicated Admin / Action button */}
        <div className="flex items-center gap-3">
          <a
            href="http://localhost:3001/login"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/20 transition hover:scale-105 active:scale-95"
          >
            <span>Admin Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </header>
  );
};
