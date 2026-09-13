'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Lock, User, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { loginAdmin } from '@/lib/api';
import { setAuthSession } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@PromptXub2025!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const data = await loginAdmin(username, password);

      setAuthSession(data.accessToken, {
        username: data.username,
        email: data.email,
        roles: data.roles || ['ROLE_ADMIN'],
      });

      router.push('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid username or password. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0F172A] relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px] mb-4 shadow-lg shadow-purple-600/30 overflow-hidden">
            <img
              src="/telegram-avatar.jpg"
              alt="PromptXub Logo"
              className="h-full w-full object-cover rounded-2xl"
            />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin Portal</h1>
          <p className="text-xs text-slate-400 mt-1">Sign in to manage PromptXub content & analytics</p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Username or Email
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/40 text-[11px] text-purple-300 flex items-center justify-between">
            <span>Default credentials:</span>
            <code className="font-mono text-cyan-300 font-bold">admin / Admin@PromptXub2025!</code>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-6 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>

          <div className="flex items-center gap-3 py-2">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          <button
            type="button"
            onClick={() => {
              const clientId = '446170911640-jiu8auha60mj2ismrcd6ajd9j2rt3ip7.apps.googleusercontent.com';
              const redirectUri = 'https://prompt-xub.vercel.app/auth/google/callback';
              window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=profile%20email&prompt=select_account`;
            }}
            className="w-full py-3 rounded-xl text-sm font-bold bg-slate-950/80 hover:bg-slate-800 text-white border border-slate-700/80 transition flex items-center justify-center gap-2.5 cursor-pointer shadow-md"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Sign in with Google</span>
          </button>
        </form>

      </div>
    </div>
  );
}
