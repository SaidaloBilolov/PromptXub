import React from 'react';
import { Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 pt-6 sm:pt-12 pb-24 sm:pb-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto space-y-5 sm:space-y-10">
        
        {/* Mobile View (< sm): Compact, Clean & User-Friendly Layout */}
        <div className="block sm:hidden space-y-4">
          {/* Top Brand Line + Operational Pill */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px]">
                <div className="h-full w-full bg-[#0F172A] rounded-lg flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              </div>
              <span className="text-base font-black text-white tracking-tight">
                Prompt<span className="text-cyan-400">Xub</span>
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Operational
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-snug">
            Premier Generative AI prompt engine. Explore, copy, and innovate with photorealistic AI prompts.
          </p>

          {/* 2-Column Link Grid */}
          <div className="grid grid-cols-2 gap-4 text-[11px] pt-3 border-t border-slate-800/60">
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-bold text-slate-200 uppercase tracking-wider">AI Models</h4>
              <ul className="space-y-1 text-slate-400">
                <li className="hover:text-purple-400 transition cursor-pointer">Midjourney v6</li>
                <li className="hover:text-purple-400 transition cursor-pointer">Flux.1 Pro</li>
                <li className="hover:text-purple-400 transition cursor-pointer">Nano Banana (Gemini)</li>
                <li className="hover:text-purple-400 transition cursor-pointer">ChatGPT Image</li>
              </ul>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-[10px] font-bold text-slate-200 uppercase tracking-wider">Categories</h4>
              <ul className="space-y-1 text-slate-400">
                <li className="hover:text-cyan-400 transition cursor-pointer">Photorealistic</li>
                <li className="hover:text-cyan-400 transition cursor-pointer">Cinematic Film</li>
                <li className="hover:text-cyan-400 transition cursor-pointer">3D & CGI Renders</li>
                <li className="hover:text-cyan-400 transition cursor-pointer">Cyberpunk Art</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Desktop View (>= sm): Full 4-Column Layout */}
        <div className="hidden sm:grid grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px]">
                <div className="h-full w-full bg-[#0F172A] rounded-xl flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                Prompt<span className="text-cyan-400">Xub</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              The premier Generative AI prompt engine & visual showcase platform. Explore, copy, and innovate with photorealistic and cinematic AI prompts.
            </p>
          </div>

          {/* AI Generators */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">AI Generators</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li className="hover:text-purple-400 transition cursor-pointer">Midjourney v6 & v5.2</li>
              <li className="hover:text-purple-400 transition cursor-pointer">Flux.1 Pro & Dev</li>
              <li className="hover:text-purple-400 transition cursor-pointer">Nano Banana (Gemini AI)</li>
              <li className="hover:text-purple-400 transition cursor-pointer">ChatGPT Image</li>
              <li className="hover:text-purple-400 transition cursor-pointer">Runway Gen-3 & Luma</li>
            </ul>
          </div>

          {/* Prompt Categories */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Categories</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li className="hover:text-cyan-400 transition cursor-pointer">Photorealistic Portraits</li>
              <li className="hover:text-cyan-400 transition cursor-pointer">Cinematic Lighting & Film</li>
              <li className="hover:text-cyan-400 transition cursor-pointer">3D & CGI Renders</li>
              <li className="hover:text-cyan-400 transition cursor-pointer">Cyberpunk & Neon Aesthetics</li>
              <li className="hover:text-cyan-400 transition cursor-pointer">Modern Architecture</li>
            </ul>
          </div>

          {/* Platform Features */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Platform Features</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li className="hover:text-white transition cursor-pointer flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> 1-Click Prompt Copy
              </li>
              <li className="hover:text-white transition cursor-pointer flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> High-Res ImageKit CDN
              </li>
              <li className="hover:text-white transition cursor-pointer flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Real-time Tracked Analytics
              </li>
              <li className="hover:text-white transition cursor-pointer flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span> AI Video & Motion Prompts
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Legal */}
        <div className="pt-4 sm:pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} PromptXub. Built for AI Creators worldwide.</p>
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Systems Operational
            </span>
            <span className="hover:text-slate-300 transition cursor-pointer">Privacy</span>
            <span className="hover:text-slate-300 transition cursor-pointer">Terms</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
