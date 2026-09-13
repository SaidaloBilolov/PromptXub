import React from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PromptDetailLoading() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col">
      {/* Header Bar Skeleton */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0F172A]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition"
          >
            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
            </div>
            <span>Back to Showcase</span>
          </Link>

          <div className="h-9 w-24 rounded-xl bg-slate-800/80 animate-pulse" />
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          
          {/* Left Column: Media Skeleton */}
          <div className="w-full lg:w-1/2 bg-slate-950 flex flex-col items-center justify-center relative min-h-[360px] lg:min-h-[600px] overflow-hidden">
            <div className="flex flex-col items-center gap-3 animate-pulse">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-cyan-400 shadow-lg shadow-cyan-500/10">
                <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <span className="text-xs font-mono font-medium text-slate-500 tracking-wider">
                Loading AI Visual...
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Right Column: Prompt Details Skeleton */}
          <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Badges & Title Skeleton */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-6 w-24 rounded-full bg-slate-800/80 animate-pulse" />
                  <div className="h-6 w-16 rounded-full bg-slate-800/80 animate-pulse" />
                  <div className="h-6 w-14 rounded-full bg-slate-800/80 animate-pulse" />
                </div>
                <div className="h-8 w-3/4 rounded-xl bg-slate-800/80 animate-pulse mb-2" />
                <div className="h-8 w-1/2 rounded-xl bg-slate-800/80 animate-pulse" />
              </div>

              {/* Prompt Box Skeleton */}
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-slate-800/80 animate-pulse" />
                <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800/80 space-y-2.5">
                  <div className="h-4 w-full rounded bg-slate-800/70 animate-pulse" />
                  <div className="h-4 w-5/6 rounded bg-slate-800/70 animate-pulse" />
                  <div className="h-4 w-4/6 rounded bg-slate-800/70 animate-pulse" />
                  <div className="h-4 w-2/3 rounded bg-slate-800/70 animate-pulse" />
                </div>
              </div>

              {/* Stats Skeleton */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60">
                <div className="space-y-1">
                  <div className="h-3 w-12 rounded bg-slate-800/70 animate-pulse" />
                  <div className="h-4 w-16 rounded bg-slate-700/70 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <div className="h-3 w-12 rounded bg-slate-800/70 animate-pulse" />
                  <div className="h-4 w-16 rounded bg-slate-700/70 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <div className="h-3 w-12 rounded bg-slate-800/70 animate-pulse" />
                  <div className="h-4 w-16 rounded bg-slate-700/70 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Bottom Actions Skeleton */}
            <div className="pt-6 border-t border-slate-800/80 flex items-center gap-3">
              <div className="h-12 w-36 rounded-xl bg-slate-800/80 animate-pulse" />
              <div className="h-12 w-32 rounded-xl bg-slate-800/60 animate-pulse" />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
