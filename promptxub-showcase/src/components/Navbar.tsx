'use client';

import React from 'react';
import { Sparkles, Compass, Flame, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0F172A]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/20 group-hover:scale-105 transition">
            <div className="h-full w-full bg-[#0F172A] rounded-2xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-white">Prompt<span className="text-cyan-400">Xub</span></span>
            </div>
            <span className="text-xs text-slate-400 font-medium tracking-wide">AI Media & Prompt Engine</span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
          <Link href="/" className="hover:text-cyan-400 transition flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-purple-400" />
            <span>Showcase Feed</span>
          </Link>
          <a href="#filter-bar" className="hover:text-cyan-400 transition flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>Trending Prompts</span>
          </a>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <a
            href="https://promptxub.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition flex items-center gap-1.5 shadow-md active:scale-95"
          >
            <span>Admin Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </a>
        </div>

      </div>
    </header>
  );
};
