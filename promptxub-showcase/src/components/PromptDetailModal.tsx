'use client';

import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Sparkles, Sliders, Download } from 'lucide-react';
import { Prompt } from '@/types';
import { incrementCopyCount } from '@/lib/api';
import { ShareButton } from './ShareButton';
import { getImageKitWatermarkUrl } from '@/lib/imagekit';

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

  // Quick Prompt Parameter Variator States
  const [customPromptText, setCustomPromptText] = useState<string>('');
  const [selectedAr, setSelectedAr] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [selectedStylize, setSelectedStylize] = useState<string | null>(null);

  // Mobile Swipe-down to Dismiss Gesture States
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchOffsetY, setTouchOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (prompt) {
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

  // Touch handlers for mobile swipe-down to dismiss
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY;

    if (deltaY > 0) {
      setTouchOffsetY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (touchOffsetY > 90) {
      onClose();
    } else {
      setTouchOffsetY(0);
    }
    setTouchStartY(null);
    setIsDragging(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-8 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container (Bottom Sheet on Mobile, Centered Modal on Desktop) */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: touchOffsetY > 0 ? `translateY(${touchOffsetY}px)` : undefined,
          transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0,0,0.2,1)',
        }}
        className="relative w-full max-w-5xl bg-[#0F172A] border border-slate-700/80 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row max-h-[92vh] md:max-h-[90vh]"
      >
        {/* Mobile Top Drag Indicator Handle */}
        <div className="w-full flex justify-center pt-3 pb-1 md:hidden bg-slate-900/60 border-b border-slate-800/60 shrink-0 cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 bg-slate-600/80 rounded-full" />
        </div>

        {/* Left: Media Display (Photo / Video) */}
        <div className="w-full md:w-1/2 bg-black flex items-center justify-center relative overflow-hidden min-h-[260px] sm:min-h-[340px] md:min-h-full shrink-0">
          {prompt.contentType === 'VIDEO' ? (
            <video
              src={prompt.mediaUrl}
              poster={getImageKitWatermarkUrl(prompt.thumbnailUrl || prompt.mediaUrl)}
              controls
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full max-h-[50vh] md:max-h-[85vh] object-contain"
            />
          ) : (
            <img
              src={getImageKitWatermarkUrl(prompt.mediaUrl)}
              alt={prompt.title}
              className="w-full h-full max-h-[50vh] md:max-h-[85vh] object-contain"
            />
          )}

          {/* Quick link to view original */}
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
        <div className="w-full md:w-1/2 p-5 sm:p-8 flex flex-col overflow-y-auto space-y-6 flex-1">
          
          {/* Header & Badges */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              {/* Badges */}
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

              {/* Actions: Share & Desktop Close Button */}
              <div className="flex items-center gap-3 shrink-0">
                <ShareButton
                  promptId={prompt.id}
                  title={prompt.title}
                  promptText={customPromptText || prompt.promptText}
                  variant="modal"
                  onShowToast={onShowToast}
                />
                <button
                  onClick={onClose}
                  className="hidden md:flex items-center justify-center p-2 rounded-xl bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80 backdrop-blur-md transition hover:scale-105 active:scale-95"
                  title="Close modal (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{prompt.title}</h2>
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
