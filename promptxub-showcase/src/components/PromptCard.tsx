'use client';

import React, { useState } from 'react';
import { Copy, Check, Video, Eye, Sparkles, Flame } from 'lucide-react';
import { Prompt } from '@/types';
import { formatCompactNumber } from '@/lib/utils';
import { incrementCopyCount } from '@/lib/api';
import { ShareButton } from './ShareButton';

interface PromptCardProps {
  prompt: Prompt;
  onOpenModal: (prompt: Prompt) => void;
  onShowToast: (message: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onOpenModal,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [localCopies, setLocalCopies] = useState(prompt.copyCount);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent modal opening

    try {
      await navigator.clipboard.writeText(prompt.promptText);
      setCopied(true);
      setLocalCopies((prev) => prev + 1);
      onShowToast(`Copied prompt: "${prompt.title.substring(0, 24)}..."`);

      // Increment counter in backend in real-time
      incrementCopyCount(prompt.id);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Clipboard copy error', err);
    }
  };

  // Color badge depending on AI Model
  const getModelBadgeColor = (model: string) => {
    if (model.toLowerCase().includes('midjourney')) return 'bg-purple-950/80 text-purple-300 border-purple-800';
    if (model.toLowerCase().includes('flux')) return 'bg-cyan-950/80 text-cyan-300 border-cyan-800';
    if (model.toLowerCase().includes('runway')) return 'bg-pink-950/80 text-pink-300 border-pink-800';
    if (model.toLowerCase().includes('luma')) return 'bg-amber-950/80 text-amber-300 border-amber-800';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div
      onClick={() => onOpenModal(prompt)}
      className="group relative rounded-2xl overflow-hidden bg-slate-900/70 border border-slate-800/80 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/20 flex flex-col cursor-pointer"
    >
      {/* Media Container */}
      <div className="relative w-full overflow-hidden bg-slate-950 aspect-[4/3] sm:aspect-square">
        {prompt.contentType === 'VIDEO' ? (
          <div className="w-full h-full relative">
            <video
              src={prompt.mediaUrl}
              poster={prompt.thumbnailUrl}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Video Indicator */}
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/50 text-[11px] font-bold text-cyan-300 z-10">
              <Video className="w-3.5 h-3.5" />
              <span>VIDEO</span>
            </div>
          </div>
        ) : (
          <img
            src={prompt.mediaUrl}
            alt={prompt.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md ${getModelBadgeColor(
              prompt.aiModel
            )}`}
          >
            {prompt.aiModel}
          </span>
        </div>

        {/* Floating Share Button */}
        <div className="absolute bottom-3 left-3 z-20">
          <ShareButton
            promptId={prompt.id}
            title={prompt.title}
            promptText={prompt.promptText}
            variant="button"
            onShowToast={onShowToast}
          />
        </div>

        {/* Floating One-Click Copy Button */}
        <button
          onClick={handleCopy}
          title="1-Click Copy Prompt"
          className={`absolute bottom-3 right-3 z-20 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 backdrop-blur-md shadow-lg ${
            copied
              ? 'bg-emerald-600 text-white scale-105 shadow-emerald-500/40'
              : 'bg-purple-600/90 text-white hover:bg-purple-500 hover:scale-105 active:scale-95 shadow-purple-600/40'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-white animate-bounce" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-white" />
              <span>Copy Prompt</span>
            </>
          )}
        </button>

        {/* Media Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
      </div>

      {/* Card Info */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-slate-100 group-hover:text-purple-300 transition line-clamp-1">
            {prompt.title}
          </h3>

          <p className="text-xs text-slate-400 font-mono line-clamp-2 mt-1.5 leading-relaxed bg-slate-950/50 p-2 rounded-lg border border-slate-800/60">
            {prompt.promptText}
          </p>
        </div>

        {/* Card Footer Metrics */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1 text-slate-400">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>{formatCompactNumber(localCopies)} copies</span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>{formatCompactNumber(prompt.viewCount)} views</span>
          </div>
        </div>
      </div>
    </div>
  );
};
