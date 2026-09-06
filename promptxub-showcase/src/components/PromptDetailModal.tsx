'use client';

import React, { useState, useEffect } from 'react';
import { X, Copy, Check, ExternalLink, Sparkles, Layers, Sliders, Calendar, Download } from 'lucide-react';
import { Prompt } from '@/types';
import { incrementCopyCount } from '@/lib/api';
import { ShareButton } from './ShareButton';

interface PromptDetailModalProps {
  prompt: Prompt | null;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const PromptDetailModal: React.FC<PromptDetailModalProps> = ({
  prompt,
  onClose,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedNegative, setCopiedNegative] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!prompt) return null;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      setCopied(true);
      incrementCopyCount(prompt.id);
      onShowToast('Prompt copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyNegative = async () => {
    if (!prompt.negativePrompt) return;
    try {
      await navigator.clipboard.writeText(prompt.negativePrompt);
      setCopiedNegative(true);
      onShowToast('Negative prompt copied to clipboard!');
      setTimeout(() => setCopiedNegative(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-[#0F172A] border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Media Display (Photo / Video) */}
        <div className="w-full md:w-1/2 bg-black flex items-center justify-center relative overflow-hidden min-h-[300px] md:min-h-full">
          {prompt.contentType === 'VIDEO' ? (
            <video
              src={prompt.mediaUrl}
              controls
              autoPlay
              loop
              className="w-full h-full max-h-[60vh] md:max-h-[85vh] object-contain"
            />
          ) : (
            <img
              src={prompt.mediaUrl}
              alt={prompt.title}
              className="w-full h-full max-h-[60vh] md:max-h-[85vh] object-contain"
            />
          )}

          {/* Quick link to view original */}
          <a
            href={prompt.mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-cyan-300 border border-slate-700 backdrop-blur-md flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Full Resolution</span>
          </a>
        </div>

        {/* Right: Details & Prompt Parameters */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col overflow-y-auto space-y-6">
          
          {/* Header & Badges */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-950/80 text-purple-300 border border-purple-800">
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

              <ShareButton
                promptId={prompt.id}
                title={prompt.title}
                promptText={prompt.promptText}
                variant="modal"
                onShowToast={onShowToast}
              />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{prompt.title}</h2>
          </div>

          {/* Prompt Text Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Prompt Command
              </span>
              <button
                onClick={handleCopyPrompt}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition active:scale-95 shadow-md shadow-purple-600/30"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
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
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed select-all">
              {prompt.promptText}
            </div>
          </div>

          {/* Negative Prompt (if present) */}
          {prompt.negativePrompt && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5" /> Negative Prompt
                </span>
                <button
                  onClick={handleCopyNegative}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                >
                  {copiedNegative ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedNegative ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 font-mono text-xs text-slate-400 select-all">
                {prompt.negativePrompt}
              </div>
            </div>
          )}

          {/* Parameters & Tags */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80 text-xs">
            <div className="grid grid-cols-2 gap-3 text-slate-400">
              <div>
                <span className="text-slate-500 block mb-0.5">Category:</span>
                <span className="font-semibold text-slate-200">{prompt.category?.name || 'General AI'}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Total Copies:</span>
                <span className="font-semibold text-purple-400">{prompt.copyCount.toLocaleString()} times</span>
              </div>
            </div>

            {prompt.tags && prompt.tags.length > 0 && (
              <div>
                <span className="text-slate-500 block mb-1.5">Tags:</span>
                <div className="flex flex-wrap gap-1.5">
                  {prompt.tags.map((tag) => (
                    <span
                      key={tag.slug}
                      className="px-2.5 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60 text-[11px]"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action */}
          <div className="pt-4">
            <button
              onClick={handleCopyPrompt}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white hover:opacity-95 shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition active:scale-[0.99]"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Prompt Copied to Clipboard!' : '1-Click Copy Full Prompt'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
