'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Compass, Flame, User, LogIn, LogOut, Bookmark, UserCheck, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  provider?: string;
}

interface NavbarProps {
  user?: UserProfile | null;
  isAuthenticated?: boolean;
  onOpenAuth?: () => void;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  isAuthenticated = false,
  onOpenAuth,
  onSignOut,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0F172A]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/30 group-hover:scale-105 transition overflow-hidden">
            <img
              src="/circular-logo.png"
              alt="PromptXub Logo"
              className="h-full w-full object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-white">Prompt<span className="text-cyan-400">Xub</span></span>
            </div>
            <span className="text-xs text-slate-400 font-medium tracking-wide">AI Media & Prompt Engine</span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
          <Link href="/" className="hover:text-cyan-400 transition flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-purple-400" />
            <span>Showcase Feed</span>
          </Link>
          <a href="#filter-bar" className="hover:text-cyan-400 transition flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>Trending Prompts</span>
          </a>
        </div>

        {/* User Auth Controls */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 text-xs font-semibold text-purple-300 hover:text-white transition shadow-sm"
              >
                <Bookmark className="w-3.5 h-3.5 text-purple-400" />
                <span>My Library</span>
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition text-slate-200 active:scale-95 shadow-md cursor-pointer"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || 'User Avatar'}
                      className="w-7 h-7 rounded-full object-cover border border-purple-500/50"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center font-bold text-xs text-white">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="text-xs font-semibold max-w-[100px] truncate hidden sm:inline-block text-slate-100">
                    {user.name || 'Creator'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0F172A] border border-slate-700/90 shadow-2xl p-2 z-50 animate-fadeIn space-y-1">
                    <div className="px-3 py-2 border-b border-slate-800/80">
                      <p className="text-xs font-bold text-slate-100 truncate">{user.name || 'Creator'}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email || 'user@promptxub.uz'}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                      <Bookmark className="w-4 h-4 text-purple-400" />
                      <span>Saved Prompts & Dashboard</span>
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                      <UserCheck className="w-4 h-4 text-cyan-400" />
                      <span>Profile & Settings</span>
                    </Link>

                  <div className="border-t border-slate-800/80 pt-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        if (onSignOut) onSignOut();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white transition flex items-center gap-2 shadow-lg shadow-purple-600/30 active:scale-95 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Get Started</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
