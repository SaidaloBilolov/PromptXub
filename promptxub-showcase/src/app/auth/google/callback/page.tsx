'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setErrorMessage(searchParams.get('error_description') || error || 'Google sign in was cancelled or failed.');
      return;
    }

    if (!code) {
      setStatus('error');
      setErrorMessage('No authorization code found in callback query parameters.');
      return;
    }

    // Exchange authorization code for authenticated user
    const exchangeCode = async () => {
      try {
        const response = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to authenticate with Google.');
        }

        // Store user in localStorage & cookie for session persistence across client
        if (typeof window !== 'undefined') {
          localStorage.setItem('promptxub_user', JSON.stringify(data.user));
          document.cookie = `promptxub_auth_token=${data.user.accessToken || 'google_token'}; path=/; max-age=2592000; SameSite=Lax`;
        }

        setStatus('success');

        // Redirect to /dashboard after brief confirmation
        setTimeout(() => {
          router.push('/dashboard');
        }, 800);
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.message || 'An unexpected error occurred during authentication.');
      }
    };

    exchangeCode();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0F172A] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10 text-center space-y-6">
        
        {/* Brand Header */}
        <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px] shadow-lg shadow-purple-600/30">
          <div className="h-full w-full bg-slate-950 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
        </div>

        {status === 'loading' && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Authenticating with Google...
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Verifying your credentials and establishing a secure session. Please wait.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="inline-flex p-3 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Login Successful!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Welcome back! Redirecting you to your Creator Dashboard...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="inline-flex p-3 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Authentication Failed
            </h2>
            <p className="text-xs sm:text-sm text-rose-300 bg-rose-950/40 p-3 rounded-xl border border-rose-900/50">
              {errorMessage}
            </p>
            <div className="pt-2">
              <button
                onClick={() => router.push('/')}
                className="w-full py-3 rounded-xl text-sm font-bold bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0F172A] text-white">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
