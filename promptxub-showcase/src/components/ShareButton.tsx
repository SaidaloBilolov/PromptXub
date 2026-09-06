'use client';

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
  promptId: number | string;
  title: string;
  promptText?: string;
  variant?: 'icon' | 'button' | 'modal';
  className?: string;
  onShowToast?: (message: string) => void;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  promptId,
  title,
  promptText,
  variant = 'button',
  className = '',
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening card modal when clicking share on a card

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://promptxub.uz')).replace(/\/+$/, '');
    const shareUrl = `${siteUrl}/prompt/${promptId}`;

    let copySuccess = false;

    // 1. Primary Action: Direct Clipboard Copy
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        copySuccess = true;
      } catch (err) {
        console.warn('navigator.clipboard.writeText failed, trying fallback copy:', err);
      }
    }

    // 2. Fallback Copy using temporary textarea (for legacy or restricted browser environments)
    if (!copySuccess && typeof document !== 'undefined') {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        copySuccess = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch (err) {
        console.error('Fallback execCommand copy failed:', err);
      }
    }

    // 3. Fallback to Web Share API if clipboard access was blocked
    if (!copySuccess && typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `PromptXub - ${title}`,
          text: promptText ? `Check out this AI Prompt on PromptXub: "${title}"` : title,
          url: shareUrl,
        });
        copySuccess = true;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    if (copySuccess) {
      setCopied(true);
      if (onShowToast) {
        onShowToast('Prompt link copied to clipboard!');
      }
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleShare}
        title="Share / Copy Link"
        className={`p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 backdrop-blur-md transition hover:scale-105 active:scale-95 ${className}`}
      >
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-400" />}
      </button>
    );
  }

  if (variant === 'modal') {
    return (
      <button
        onClick={handleShare}
        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/60 transition active:scale-95 ${className}`}
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
        <span>{copied ? 'Link Copied!' : 'Share Link'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-slate-700/80 backdrop-blur-md transition hover:scale-105 active:scale-95 shadow-md ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Share</span>
        </>
      )}
    </button>
  );
};
