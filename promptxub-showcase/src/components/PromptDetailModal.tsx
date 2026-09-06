'use client';

import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Sparkles, Sliders, Download, Eye, Flame } from 'lucide-react';
import { Prompt } from '@/types';
import { incrementCopyCount, incrementViewCount } from '@/lib/api';
import { formatCompactNumber } from '@/lib/utils';
import { ShareButton } from './ShareButton';
import { getOptimizedMediaUrl } from '@/lib/imagekit';

interface PromptDetailModalProps {
  prompt: Prompt | null;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  onUpdateMetrics?: (promptId: number, views: number, copies: number) => void;
}

export const PromptDetailModal: React.FC<PromptDetailModalProps> = ({
  prompt,
  onClose,
  onShowToast,
  onUpdateMetrics,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedNegative, setCopiedNegative] = useState(false);
  const [localViews, setLocalViews] = useState<number>(0);
  const [localCopies, setLocalCopies] = useState<number>(0);

  // Quick Prompt Parameter Variator States
  const [customPromptText, setCustomPromptText] = useState<string>('');
  const [selectedAr, setSelectedAr] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [selectedStylize, setSelectedStylize] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (prompt) {
      const newViews = (prompt.viewCount || 0) + 1;
      const initialCopies = prompt.copyCount || 0;
      setLocalViews(newViews);
      setLocalCopies(initialCopies);

      // Track view on backend
      incrementViewCount(prompt.id);
      if (onUpdateMetrics) {
        onUpdateMetrics(prompt.id, newViews, initialCopies);
      }

      setCustomPromptText(prompt.promptText);
      const arMatch = prompt.promptText.match(/--(?:ar|aspect)\s+([0-9]+:[0-9]+)/i);
      setSelectedAr(arMatch ? arMatch[1] : null);

      const vMatch = prompt.promptText.match(/--(?:v|version)\s+([^\s]+)/i);
      setSelectedVersion(vMatch ? vMatch[1] : null);

      const sMatch = prompt.promptText.match(/--(?:s|stylize)\s+([0-9]+)/i);
      setSelectedStylize(sMatch ? sMatch[1] : null);
    }
  }, [prompt]);

  if (!prompt) return null;

  const updateParam = (paramKey: '--ar' | '--v' | '--s', value: string) => {
    let updated = customPromptText || prompt.promptText;

    if (paramKey === '--ar') {
      const isSame = selectedAr === value;
      const newAr = isSame ? null : value;
      setSelectedAr(newAr);
      if (updated.match(/--(?:ar|aspect)\s+[0-9]+:[0-9]+/i)) {
        updated = newAr
          ? updated.replace(/--(?:ar|aspect)\s+[0-9]+:[0-9]+/i, `--ar ${newAr}`)
          : updated.replace(/\s*--(?:ar|aspect)\s+[0-9]+:[0-9]+/i, '');
      } else if (newAr) {
        updated = `${updated.trim()} --ar ${newAr}`;
      }
    } else if (paramKey === '--v') {
      const isSame = selectedVersion === value;
      const newV = isSame ? null : value;
      setSelectedVersion(newV);
      if (updated.match(/--(?:v|version)\s+[^\s]+/i)) {
        updated = newV
          ? updated.replace(/--(?:v|version)\s+[^\s]+/i, `--v ${newV}`)
          : updated.replace(/\s*--(?:v|version)\s+[^\s]+/i, '');
      } else if (newV) {
        updated = `${updated.trim()} --v ${newV}`;
      }
    } else if (paramKey === '--s') {
      const isSame = selectedStylize === value;
      const newS = isSame ? null : value;
      setSelectedStylize(newS);
      if (updated.match(/--(?:s|stylize)\s+[0-9]+/i)) {
        updated = newS
          ? updated.replace(/--(?:s|stylize)\s+[0-9]+/i, `--s ${newS}`)
          : updated.replace(/\s*--(?:s|stylize)\s+[0-9]+/i, '');
      } else if (newS) {
        updated = `${updated.trim()} --s ${newS}`;
      }
    }

    setCustomPromptText(updated);
  };

  const handleCopyPrompt = async () => {
    try {
      const textToCopy = customPromptText || prompt.promptText;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      const newCopies = localCopies + 1;
      setLocalCopies(newCopies);
      incrementCopyCount(prompt.id);
      if (onUpdateMetrics) {
        onUpdateMetrics(prompt.id, localViews, newCopies);
      }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-8 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div
        className="relative w-full h-full sm:h-auto max-w-5xl bg-[#0F172A] sm:border border-slate-700/80 rounded-none sm:rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row sm:max-h-[92vh] md:max-h-[90vh]"
      >
        {/* Sticky Universal Close Button (Mobile & Desktop) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-50 p-2.5 rounded-full bg-slate-900/90 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700/80 backdrop-blur-xl shadow-xl transition active:scale-95 flex items-center justify-center cursor-pointer"
          title="Close modal (Esc)"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Left: Media Display */}
        <div className="w-full md:w-1/2 bg-black flex items-center justify-center relative overflow-hidden min-h-[220px] max-h-[40vh] sm:max-h-[45vh] md:max-h-full shrink-0">
          {prompt.contentType === 'VIDEO' ? (
            <video
              src={prompt.mediaUrl}
              poster={getOptimizedMediaUrl(prompt.thumbnailUrl || prompt.mediaUrl, { width: 1200 })}
              controls
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full max-h-[35vh] sm:max-h-[45vh] md:max-h-[85vh] object-contain"
            />
          ) : (
            <img
              src={getOptimizedMediaUrl(prompt.mediaUrl, { width: 1200 })}
              alt={prompt.title}
              className="w-full h-full max-h-[35vh] sm:max-h-[45vh] md:max-h-[85vh] object-contain"
            />
          )}

          <a
            href={prompt.mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-cyan-300 border border-slate-700 backdrop-blur-md flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Full Resolution</span>
          </a>
        </div>

        {/* Right: Details & Prompt Parameters */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col overflow-y-auto space-y-5 flex-1">
          
          {/* Header & Badges */}
          <div className="pr-10">
            <div className="flex items-center justify-between gap-3 mb-2">
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
                promptText={customPromptText || prompt.promptText}
                variant="modal"
                onShowToast={onShowToast}
              />
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">{prompt.title}</h2>
          </div>

          {/* Real-time Counter Stats Bar */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-[10px] text-slate-400 block">Views</span>
                <span className="font-bold text-cyan-300">{formatCompactNumber(localViews)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <div>
                <span className="text-[10px] text-slate-400 block">Copies</span>
                <span className="font-bold text-purple-300">{formatCompactNumber(localCopies)}</span>
              </div>
            </div>
          </div>

          {/* Quick Parameter Variator Controls */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Sliders className="w-4 h-4" /> Quick Parameter Customizer
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Click pills to adjust</span>
            </div>

            {/* Aspect Ratio Pills */}
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-slate-400">Aspect Ratio (--ar):</span>
              <div className="flex flex-wrap gap-1.5">
                {['16:9', '9:16', '1:1', '4:3', '21:9'].map((ar) => (
                  <button
                    key={ar}
                    type="button"
                    onClick={() => updateParam('--ar', ar)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition ${
                      selectedAr === ar
                        ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                    }`}
                  >
                    --ar {ar}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Version Pills */}
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-slate-400">Model Version (--v):</span>
              <div className="flex flex-wrap gap-1.5">
                {['6.0', '5.2', '6.1', '5.1'].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => updateParam('--v', v)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition ${
                      selectedVersion === v
                        ? 'bg-purple-500 text-white shadow-md shadow-purple-500/30'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                    }`}
                  >
                    --v {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Stylize Pills */}
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-slate-400">Stylize (--s):</span>
              <div className="flex flex-wrap gap-1.5">
                {['100', '250', '750'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => updateParam('--s', s)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition ${
                      selectedStylize === s
                        ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                    }`}
                  >
                    --s {s}
                  </button>
                ))}
              </div>
            </div>
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
              {customPromptText || prompt.promptText}
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
            <div>
              <span className="text-slate-500 block mb-0.5">Category:</span>
              <span className="font-semibold text-slate-200">{prompt.category?.name || 'General AI'}</span>
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

          {/* Desktop Bottom Action */}
          <div className="hidden md:block pt-4">
            <button
              onClick={handleCopyPrompt}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white hover:opacity-95 shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition active:scale-[0.99]"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Prompt Copied to Clipboard!' : '1-Click Copy Full Prompt'}</span>
            </button>
          </div>

        </div>

        {/* Mobile Floating Sticky Bottom Close & Action Bar */}
        <div className="sticky bottom-0 inset-x-0 p-3.5 bg-[#0F172A]/95 backdrop-blur-md border-t border-slate-800/80 md:hidden z-40 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={handleCopyPrompt}
            className="flex-1 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 active:scale-95"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
          </button>
          
          <button
            onClick={onClose}
            className="py-3 px-5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 active:scale-95 shadow-md shrink-0"
          >
            <X className="w-4 h-4" />
            <span>Close</span>
          </button>
        </div>

      </div>
    </div>
  );
};
