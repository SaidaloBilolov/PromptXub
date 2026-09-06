'use client';

import React, { useState } from 'react';
import { X, Sparkles, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOAuthLogin = (provider: 'google' | 'apple') => {
    setLoadingProvider(provider);
    // Simulate OAuth redirect / session authentication
    setTimeout(() => {
      setLoadingProvider(null);
      onSuccess();
    }, 1000);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoadingProvider('email');
    setTimeout(() => {
      setLoadingProvider(null);
      setIsEmailSent(true);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Overlay click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#0F172A] border border-slate-700/90 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden space-y-6">
        
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-slate-400 hover:text-white border border-slate-700/80 transition hover:scale-105 active:scale-95"
          title="Dismiss for now (Esc)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex p-3 rounded-2xl bg-purple-950/60 border border-purple-500/30 text-purple-400 mb-2">
            <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
            Unlock Unlimited Access & Save Favorite Prompts
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xs mx-auto leading-relaxed">
            Join thousands of creators using PromptXub to master Midjourney, Flux.1, and Runway prompts.
          </p>
        </div>

        {/* Auth Buttons */}
        {!isEmailSent ? (
          <div className="space-y-3">
            {/* Google OAuth Button */}
            <button
              onClick={() => handleOAuthLogin('google')}
              disabled={loadingProvider !== null}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700/80 flex items-center justify-center gap-3 transition active:scale-[0.99] shadow-md"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loadingProvider === 'google' ? 'Connecting Google...' : 'Continue with Google'}</span>
            </button>

            {/* Apple OAuth Button */}
            <button
              onClick={() => handleOAuthLogin('apple')}
              disabled={loadingProvider !== null}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-white hover:bg-slate-100 text-black flex items-center justify-center gap-3 transition active:scale-[0.99] shadow-md"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.04.24-9.97-1.84-14.8-6.23-3.26-2.98-7.14-7.69-11.67-14.15-6.73-9.56-12.06-20.35-15.98-32.39-3.92-12.03-5.88-23.75-5.88-35.15 0-14.74 3.73-26.89 11.18-36.46 7.45-9.57 16.9-14.4 28.36-14.5 4.8.12 10.13 1.25 15.99 3.4 5.86 2.14 9.87 3.26 12.02 3.36 1.77 0 5.92-1.2 12.44-3.6 6.52-2.4 11.83-3.48 15.93-3.24 11.14.96 20.08 5.16 26.82 12.6-23.86 14.41-23.51 37.07.95 50.14-2.73 7.82-6.52 15.74-11.37 23.76zM119.22 31.84c0-6.85 2.45-13.48 7.35-19.89 4.9-6.41 11.08-10.42 18.54-12.02.6 7.21-1.39 14.01-5.96 20.4-4.57 6.39-10.87 10.51-18.9 12.36-.24-.25-.66-.45-1.03-.85z" />
              </svg>
              <span>{loadingProvider === 'apple' ? 'Connecting Apple...' : 'Continue with Apple'}</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">or email</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Email Magic Link Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                type="submit"
                disabled={loadingProvider !== null}
                className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 active:scale-[0.99]"
              >
                <span>{loadingProvider === 'email' ? 'Sending Magic Link...' : 'Continue with Email'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-4 space-y-3">
            <div className="inline-flex p-3 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Check Your Inbox</h3>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              We sent a instant magic sign-in link to <span className="text-cyan-400 font-semibold">{email}</span>.
            </p>
            <button
              onClick={() => {
                onSuccess();
              }}
              className="mt-2 text-xs font-semibold text-purple-400 hover:underline"
            >
              Demo: Skip & Verify Session
            </button>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Free & Secure
          </span>
          <button onClick={onClose} className="hover:text-slate-200 underline">
            Browse freely first
          </button>
        </div>

      </div>
    </div>
  );
};
