'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { FilterBar } from '@/components/FilterBar';
import { PromptCard } from '@/components/PromptCard';
import { PromptDetailModal } from '@/components/PromptDetailModal';
import { AuthModal } from '@/components/AuthModal';
import { Toast } from '@/components/Toast';
import { Prompt, ContentType } from '@/types';
import { fetchPrompts } from '@/lib/api';
import { useAuthTracker } from '@/hooks/useAuthTracker';
import { Sparkles, Loader2, Frown } from 'lucide-react';

export default function ShowcasePage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [contentType, setContentType] = useState<ContentType | 'ALL'>('ALL');
  const [sort, setSort] = useState<'trending' | 'top' | 'latest'>('trending');
  const [category, setCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalPrompt, setActiveModalPrompt] = useState<Prompt | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    showAuthModal,
    triggerInteraction,
    dismissAuthModal,
    setAuthenticated,
  } = useAuthTracker();

  useEffect(() => {
    let isCancelled = false;
    async function loadData() {
      setLoading(true);
      try {
        const response = await fetchPrompts({
          contentType: contentType === 'ALL' ? undefined : contentType,
          sort,
          category: category || undefined,
          search: searchQuery || undefined,
        });
        if (!isCancelled) {
          setPrompts(response.content);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadData();
    }, 200);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [contentType, sort, category, searchQuery]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    triggerInteraction(true);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleOpenCardModal = (prompt: Prompt) => {
    setActiveModalPrompt(prompt);
    triggerInteraction(false);
  };

  return (
    <main className="flex-1 flex flex-col min-h-screen">
      {/* Top Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectTag={(tag) => setSearchQuery(tag)}
      />

      {/* Dynamic Filter Controls */}
      <FilterBar
        selectedType={contentType}
        onTypeSelect={setContentType}
        selectedSort={sort}
        onSortSelect={setSort}
        selectedCategory={category}
        onCategorySelect={setCategory}
        totalCount={prompts.length}
      />

      {/* Main Grid Card Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full pb-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400 mb-3" />
            <p className="text-sm font-medium">Loading high-res AI prompts...</p>
          </div>
        ) : prompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 max-w-md mx-auto text-center">
            <Frown className="w-12 h-12 text-slate-500 mb-4" />
            <h3 className="text-lg font-bold text-slate-200 mb-1">No prompts found</h3>
            <p className="text-xs text-slate-400 mb-6">
              Try adjusting your search keywords or switching content format filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setContentType('ALL');
                setCategory('');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onOpenModal={handleOpenCardModal}
                onShowToast={showToast}
              />
            ))}
          </div>
        )}
      </div>

      {/* Prompt Detail Modal */}
      <PromptDetailModal
        prompt={activeModalPrompt}
        onClose={() => setActiveModalPrompt(null)}
        onShowToast={showToast}
      />

      {/* Progressive Engagement Soft-Gate Login Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={dismissAuthModal}
        onSuccess={() => setAuthenticated(true)}
      />

      {/* Floating Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-8 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-200">PromptXub</span>
            <span>— The Generative AI Prompt Showcase & Discovery Platform</span>
          </div>
          <p className="text-slate-400">Built for $0 infrastructure budget with Next.js 14, Neon & ImageKit.</p>
        </div>
      </footer>
    </main>
  );
}
