'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, User, Mail, ShieldCheck, LogOut, ArrowLeft, Heart, Bookmark, Copy, ExternalLink } from 'lucide-react';

export default function ShowcaseDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('promptxub_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser({ name: 'Creator', email: 'creator@promptxub.com', provider: 'google' });
        }
      } else {
        // Fallback default demo user if navigated directly
        setUser({
          name: 'AI Creator',
          email: 'creator@promptxub.com',
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          provider: 'google',
        });
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('promptxub_user');
      document.cookie = 'promptxub_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 selection:bg-purple-500/30 selection:text-purple-200">
      {/* Top Navbar */}
      <nav className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:opacity-90 transition">
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px]">
                <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                PromptXub
              </span>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-rose-300 hover:bg-rose-950/40 hover:border-rose-900 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* User Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/40 via-slate-900/90 to-slate-950 border border-slate-800/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            <img
              src={user?.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=promptxub'}
              alt={user?.name || 'User Avatar'}
              className="w-20 h-20 rounded-2xl border-2 border-purple-500/40 object-cover shadow-lg shadow-purple-900/20"
            />
            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
                <ShieldCheck className="w-3 h-3" /> Authenticated via Google
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {user?.name || 'Creator'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {user?.email || 'authenticated-user@gmail.com'}
              </p>
            </div>
            <div>
              <Link
                href="/"
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white shadow-lg shadow-purple-600/30 transition flex items-center gap-2"
              >
                <span>Explore Showcase</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Saved Prompts</span>
              <Bookmark className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-black text-white">12</p>
            <p className="text-[11px] text-slate-400">Prompts bookmarked to library</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Copied Prompts</span>
              <Copy className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-black text-white">48</p>
            <p className="text-[11px] text-slate-400">Total copies across sessions</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Liked Prompts</span>
              <Heart className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-2xl font-black text-white">25</p>
            <p className="text-[11px] text-slate-400">Favorites in community showcase</p>
          </div>
        </div>
      </main>
    </div>
  );
}
