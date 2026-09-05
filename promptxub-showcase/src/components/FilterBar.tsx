'use client';

import React from 'react';
import { Flame, TrendingUp, Clock, Filter, Check } from 'lucide-react';
import { ContentType } from '@/types';

interface FilterBarProps {
  selectedType: ContentType | 'ALL';
  onTypeSelect: (type: ContentType | 'ALL') => void;
  selectedSort: 'trending' | 'top' | 'latest';
  onSortSelect: (sort: 'trending' | 'top' | 'latest') => void;
  selectedCategory: string;
  onCategorySelect: (cat: string) => void;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedType,
  onTypeSelect,
  selectedSort,
  onSortSelect,
  selectedCategory,
  onCategorySelect,
  totalCount,
}) => {
  const categories = [
    { name: 'All Categories', slug: '' },
    { name: 'Photorealistic', slug: 'photorealistic' },
    { name: 'Cinematic', slug: 'cinematic' },
    { name: 'Anime & Concept', slug: 'anime-concept' },
    { name: 'Architecture', slug: 'architecture' },
    { name: 'AI Video & Motion', slug: 'ai-video-motion' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 space-y-4">
      {/* Top Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        
        {/* Content Type Filter Pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Type:
          </span>
          {(['ALL', 'PHOTO', 'VIDEO'] as const).map((type) => (
            <button
              key={type}
              onClick={() => onTypeSelect(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedType === type
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {type === 'ALL' ? 'All Formats' : type === 'PHOTO' ? '📷 Photos' : '🎥 Videos'}
            </button>
          ))}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onSortSelect('trending')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedSort === 'trending'
                ? 'bg-purple-600/80 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Trending
          </button>
          <button
            onClick={() => onSortSelect('top')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedSort === 'top'
                ? 'bg-purple-600/80 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            Top Copied
          </button>
          <button
            onClick={() => onSortSelect('latest')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedSort === 'latest'
                ? 'bg-purple-600/80 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Latest
          </button>
        </div>

      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => onCategorySelect(cat.slug)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition border ${
                  isActive
                    ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 font-semibold shadow-sm shadow-cyan-500/20'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-400 whitespace-nowrap pl-4 hidden md:block">
          Showing <span className="text-purple-400 font-bold">{totalCount}</span> AI prompts
        </div>
      </div>
    </div>
  );
};
