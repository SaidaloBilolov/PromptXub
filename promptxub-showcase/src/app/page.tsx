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

interface UserProfile {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  provider?: string;
}

const USER_SESSION_KEY = 'promptxub_active_user_session';

export default function ShowcasePage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [contentType, setContentType] = useState<ContentType | 'ALL'>('ALL');
  const [sort, setSort] = useState<'trending' | 'top' | 'latest'>('trending');
  const [category, setCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalPrompt, setActiveModalPrompt] = useState<Prompt | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [manualAuthOpen, setManualAuthOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const {
    showAuthModal: softGateAuthModal,
    triggerInteraction,
    dismissAuthModal,
    isAuthenticated,
    setAuthenticated,
  } = useAuthTracker();

  // Load stored user session on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_SESSION_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setAuthenticated(true);
      }
    } catch (e) {
      console.error('Failed to load user session', e);
    }
  }, [setAuthenticated]);

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

  const handleAuthSuccess = (userData?: UserProfile) => {
    const activeUser = userData || {
      id: `usr_${Date.now()}`,
      name: 'Showcase Creator',
      email: 'creator@promptxub.uz',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    };
    setUser(activeUser);
    setAuthenticated(true);
    setManualAuthOpen(false);
    try {
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(activeUser));
    } catch (e) {
      console.error(e);
    }
    showToast(`Welcome back, ${activeUser.name || 'Creator'}! 👋`);
  };

  const handleSignOut = () => {
    setUser(null);
    setAuthenticated(false);
    try {
      localStorage.removeItem(USER_SESSION_KEY);
    } catch (e) {
      console.error(e);
    }
    showToast('Signed out successfully.');
  };

  const isModalVisible = manualAuthOpen || softGateAuthModal;
  const handleCloseModal = () => {
    setManualAuthOpen(false);
    dismissAuthModal();
  };

  const handleUpdatePromptMetrics = (promptId: number, views: number, copies: number) => {
    setPrompts((prev) =>
      prev.map((p) =>
        p.id === promptId ? { ...p, viewCount: views, copyCount: copies } : p
      )
    );
  };

  return (
    <main className="flex-1 flex flex-col min-h-screen">
      {/* Top Navbar */}
      <Navbar
        user={user}
        isAuthenticated={isAuthenticated}
        onOpenAuth={() => setManualAuthOpen(true)}
        onSignOut={handleSignOut}
      />

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
        onUpdateMetrics={handleUpdatePromptMetrics}
      />

      {/* Progressive Engagement Soft-Gate & Manual Auth Login Modal */}
      <AuthModal
        isOpen={isModalVisible}
        onClose={handleCloseModal}
        onSuccess={handleAuthSuccess}
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
