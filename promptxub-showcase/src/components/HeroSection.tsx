'use client';

import React from 'react';
import { Sparkles, Copy, Zap, Flame, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  onSelectTag: (tag: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectTag }) => {
  const quickTags = [
    { label: '🔥 Cyberpunk', tag: 'cyberpunk' },
    { label: '📸 Photorealistic', tag: 'photorealistic' },
    { label: '🎬 Cinematic', tag: 'cinematic' },
    { label: '⚡ Runway Motion', tag: 'motion' },
    { label: '🏛️ Architecture', tag: 'architecture' },
    { label: '👾 Mecha & Anime', tag: 'mecha' },
  ];

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
