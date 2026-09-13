'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Copy, 
  Check, 
  Sparkles, 
  Sliders, 
  Flame, 
  Eye, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Bookmark, 
  ArrowLeft,
  Share2,
  Film,
  ExternalLink
} from 'lucide-react';
import { Prompt } from '@/types';
import { formatCompactNumber } from '@/lib/utils';
import { incrementCopyCount, incrementViewCount } from '@/lib/api';
import { ShareButton } from '@/components/ShareButton';
import { Toast } from '@/components/Toast';
import { getOptimizedMediaUrl } from '@/lib/imagekit';
import { isPromptSaved, toggleSavePrompt, recordUserCopy, getActiveUser } from '@/lib/userStore';

interface PromptDetailViewProps {
  prompt: Prompt;
  recommendedPrompts: Prompt[];
  siteUrl: string;
}

export const PromptDetailView: React.FC<PromptDetailViewProps> = ({
  prompt,
  recommendedPrompts,
  siteUrl,
}) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [localCopies, setLocalCopies] = useState<number>(prompt.displayCopyCount || prompt.copyCount || 0);
  const [copiedCardId, setCopiedCardId] = useState<number | null>(null);

  // Sync saved status with active user library
  useEffect(() => {
    const checkSaved = () => {
      const activeUser = getActiveUser();
      setSaved(isPromptSaved(activeUser, prompt.id));
    };

    checkSaved();
    window.addEventListener('promptxub_library_updated', checkSaved);
    window.addEventListener('storage', checkSaved);

    // Track page view
    incrementViewCount(prompt.id);

    return () => {
      window.removeEventListener('promptxub_library_updated', checkSaved);
      window.removeEventListener('storage', checkSaved);
    };
  }, [prompt.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      setCopied(true);
      setLocalCopies((prev) => prev + 1);

      const activeUser = getActiveUser();
      recordUserCopy(activeUser, prompt.id);
      incrementCopyCount(prompt.id);

      showToast("Prompt copied to clipboard! 🎉");
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Clipboard error', err);
      showToast("Failed to copy to clipboard");
    }
  };

  const handleCopyNegative = async () => {
    if (!prompt.negativePrompt) return;
    try {
      await navigator.clipboard.writeText(prompt.negativePrompt);
      showToast("Negative prompt copied to clipboard!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSave = () => {
    const activeUser = getActiveUser();
    const isNowSaved = toggleSavePrompt(activeUser, prompt);
    setSaved(isNowSaved);
    if (isNowSaved) {
      showToast(`Saved "${prompt.title.substring(0, 24)}..." to your library! 🔖`);
    } else {
      showToast(`Removed from your library`);
    }
  };

  const handleCardCopy = async (cardPrompt: Prompt, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(cardPrompt.promptText);
      setCopiedCardId(cardPrompt.id);

      const activeUser = getActiveUser();
      recordUserCopy(activeUser, cardPrompt.id);
      incrementCopyCount(cardPrompt.id);

      showToast(`Copied: "${cardPrompt.title.substring(0, 22)}..."`);
      setTimeout(() => setCopiedCardId(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // Color badge depending on AI Model
  const getModelBadgeColor = (model: string) => {
    const m = (model || '').toLowerCase();
    if (m.includes('banana') || m.includes('gemen') || m.includes('gemini')) return 'bg-amber-950/90 text-amber-300 border-amber-500/80 shadow-sm shadow-amber-500/20';
    if (m.includes('chatgpt') || m.includes('gpt') || m.includes('dall-e')) return 'bg-emerald-950/90 text-emerald-300 border-emerald-500/80 shadow-sm shadow-emerald-500/20';
    if (m.includes('midjourney')) return 'bg-purple-950/80 text-purple-300 border-purple-800';
    if (m.includes('flux')) return 'bg-cyan-950/80 text-cyan-300 border-cyan-800';
    if (m.includes('runway')) return 'bg-pink-950/80 text-pink-300 border-pink-800';
    if (m.includes('luma')) return 'bg-amber-950/80 text-amber-300 border-amber-800';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 selection:bg-purple-500 selection:text-white flex flex-col pb-24 sm:pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0F172A]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition group"
          >
            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-purple-500/50 transition">
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="hidden sm:inline">Back to Showcase</span>
            <span className="sm:hidden text-xs">Back</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleToggleSave}
              className={`p-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 active:scale-95 ${
                saved
                  ? 'bg-purple-950/80 border-purple-500/50 text-purple-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
              title={saved ? 'Saved to library' : 'Save to library'}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-purple-400 text-purple-400' : ''}`} />
              <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
            </button>

            <ShareButton
              promptId={prompt.id}
              title={prompt.title}
              promptText={prompt.promptText}
              variant="button"
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-1 w-full space-y-12">
        {/* Main Prompt Card */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          
          {/* Left Column: Media Presentation */}
          <div className="w-full lg:w-1/2 bg-black flex items-center justify-center relative min-h-[340px] sm:min-h-[440px] lg:min-h-[580px] overflow-hidden">
            {prompt.contentType === 'VIDEO' ? (
              <video
                src={prompt.mediaUrl}
                poster={getOptimizedMediaUrl(prompt.mediaUrl, { width: 1200 })}
                controls
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full max-h-[70vh] object-contain"
              />
            ) : (
              <img
                src={getOptimizedMediaUrl(prompt.mediaUrl, { width: 1200 })}
                alt={prompt.title}
                className="w-full h-full max-h-[70vh] object-contain"
              />
            )}

            {/* High-res Download link */}
            <a
              href={prompt.mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-slate-950/85 hover:bg-slate-900 text-xs font-semibold text-cyan-300 border border-slate-700/80 backdrop-blur-md flex items-center gap-1.5 transition active:scale-95 shadow-lg"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Full Resolution</span>
            </a>
          </div>

          {/* Right Column: Prompt Details & Action Panel */}
          <div className="w-full lg:w-1/2 p-5 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {/* Badges & Title */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getModelBadgeColor(prompt.aiModel)}`}>
                    {prompt.aiModel}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                    {prompt.contentType}
                  </span>
                  {prompt.aspectRatio && (
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {prompt.aspectRatio}
                    </span>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
                  {prompt.title}
                </h1>
              </div>

              {/* COMPACT & CLAMPED PROMPT COMMAND BOX */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Prompt Command
                  </span>

                  {/* Primary 1-Click Copy Button */}
                  <button
                    onClick={handleCopyPrompt}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-md active:scale-95 ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/20'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Clamped Prompt Text with Optional Expand */}
                <div className="relative rounded-2xl bg-slate-950/90 border border-slate-800 overflow-hidden shadow-inner">
                  <div
                    className={`p-4 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed select-all transition-all duration-300 ${
                      isExpanded
                        ? 'max-h-none'
                        : 'max-h-32 sm:max-h-40 overflow-hidden'
                    }`}
                  >
                    {prompt.promptText}
                  </div>

                  {/* Smooth Gradient Overlay when Clamped */}
                  {!isExpanded && prompt.promptText.length > 180 && (
                    <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pointer-events-none" />
                  )}
                </div>

                {/* Show More / Show Less Toggle Button */}
                {prompt.promptText.length > 180 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition py-1"
                  >
                    <span>{isExpanded ? "Show less" : "Show full prompt"}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {/* Negative Prompt (if present) */}
              {prompt.negativePrompt && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5" /> Negative Prompt
                    </span>
                    <button
                      onClick={handleCopyNegative}
                      className="text-[11px] font-semibold text-pink-400 hover:text-pink-300 transition flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 font-mono text-xs text-slate-400 line-clamp-2 select-all">
                    {prompt.negativePrompt}
                  </div>
                </div>
              )}

              {/* Stats Counters */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5 text-[11px]">Category</span>
                  <span className="font-semibold text-slate-200 truncate block">
                    {prompt.category?.name || 'General AI'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5 text-[11px]">Copies</span>
                  <span className="font-semibold text-purple-400 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    {formatCompactNumber(localCopies)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5 text-[11px]">Views</span>
                  <span className="font-semibold text-cyan-400 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    {formatCompactNumber(prompt.displayViewCount || prompt.viewCount || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Action Row */}
            <div className="hidden sm:flex items-center gap-3 pt-6 border-t border-slate-800/80">
              <button
                onClick={handleCopyPrompt}
                className={`flex-1 py-3 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg active:scale-95 ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Prompt Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>

              <ShareButton
                promptId={prompt.id}
                title={prompt.title}
                promptText={prompt.promptText}
                variant="button"
                className="py-3 px-5"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RECOMMENDED PROMPTS SECTION ("Recommended Prompts") */}
        {/* ========================================================================= */}
        {recommendedPrompts && recommendedPrompts.length > 0 && (
          <section className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>You Might Also Like</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Recommended Prompts
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Explore similar high-performing prompts in {prompt.category?.name || 'Showcase'} and trending AI creations
                </p>
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
              >
                <span>Explore all</span>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>

            {/* Recommended Prompts Grid - Full Edge-to-Edge Images, No Letterboxing or White Borders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {recommendedPrompts.map((rec) => {
                const isCardCopied = copiedCardId === rec.id;
                return (
                  <div
                    key={rec.id}
                    className="group bg-slate-900/70 border border-slate-800/80 hover:border-purple-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/20 flex flex-col"
                  >
                    {/* Full-Bleed Media Container (4:3 aspect ratio, object-cover filling 100% of card) */}
                    <Link
                      href={`/prompt/${rec.id}`}
                      className="relative w-full aspect-[4/3] sm:aspect-square bg-slate-950 overflow-hidden block"
                    >
                      <img
                        src={getOptimizedMediaUrl(rec.mediaUrl, { width: 800 })}
                        alt={rec.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Clean dark gradient overlay at bottom of image */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />

                      {/* Top Model & Content Type Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${getModelBadgeColor(rec.aiModel)}`}>
                          {rec.aiModel}
                        </span>
                        {rec.contentType === 'VIDEO' && (
                          <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-slate-950/80 text-cyan-300 border border-slate-700/50 backdrop-blur-md flex items-center gap-1">
                            <Film className="w-3 h-3" /> Video
                          </span>
                        )}
                      </div>

                      {/* Aspect Ratio Badge */}
                      {rec.aspectRatio && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-slate-950/80 text-slate-300 border border-slate-800 backdrop-blur-md">
                          {rec.aspectRatio}
                        </span>
                      )}
                    </Link>

                    {/* Card Content Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <Link
                          href={`/prompt/${rec.id}`}
                          className="font-bold text-sm sm:text-base text-slate-100 group-hover:text-purple-300 transition line-clamp-1 block"
                        >
                          {rec.title}
                        </Link>
                        <p className="text-xs text-slate-400 font-mono line-clamp-2 leading-relaxed bg-slate-950/50 p-2 rounded-lg border border-slate-800/60">
                          {rec.promptText}
                        </p>
                      </div>

                      {/* Card Footer: Metrics + 1-Click Copy */}
                      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-orange-400" />
                            {formatCompactNumber(rec.displayCopyCount || rec.copyCount || 0)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-cyan-400" />
                            {formatCompactNumber(rec.displayViewCount || rec.viewCount || 0)}
                          </span>
                        </div>

                        <button
                          onClick={(e) => handleCardCopy(rec, e)}
                          title="1-Click Copy Prompt"
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 ${
                            isCardCopied
                              ? 'bg-emerald-600 text-white'
                              : 'bg-purple-600/90 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30'
                          }`}
                        >
                          {isCardCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* ========================================================================= */}
      {/* STICKY BOTTOM MOBILE ACTION BAR (English & High Visibility) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-0 inset-x-0 p-3 bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-2xl z-50 sm:hidden flex items-center gap-2 shadow-2xl">
        <button
          onClick={handleToggleSave}
          className={`p-3 rounded-2xl border transition active:scale-95 flex items-center justify-center ${
            saved
              ? 'bg-purple-950/80 border-purple-500/50 text-purple-300'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
          aria-label="Save to library"
        >
          <Bookmark className={`w-5 h-5 ${saved ? 'fill-purple-400 text-purple-400' : ''}`} />
        </button>

        <button
          onClick={handleCopyPrompt}
          className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-lg ${
            copied
              ? 'bg-emerald-600 text-white shadow-emerald-600/30'
              : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-purple-600/30'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Prompt</span>
            </>
          )}
        </button>

        <ShareButton
          promptId={prompt.id}
          title={prompt.title}
          promptText={prompt.promptText}
          variant="icon"
          className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 active:scale-95"
        />
      </div>
    </div>
  );
};
