'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, PlusCircle, Users, Sparkles, LogOut, Layers, ExternalLink, ShieldAlert } from 'lucide-react';
import { clearAuthSession, getCurrentUser } from '@/lib/auth';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const user = getCurrentUser();

  const handleLogout = () => {
    clearAuthSession();
    router.push('/login');
  };

  const navItems = [
    { label: 'Analytics Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'User Accounts', href: '/users', icon: Users },
    { label: 'Upload New Prompt', href: '/prompts/new', icon: PlusCircle },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand */}
        <div className="h-20 px-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px] overflow-hidden">
              <img
                src="/telegram-avatar.jpg"
                alt="PromptXub Logo"
                className="h-full w-full object-cover rounded-xl"
              />
            </div>
            <div>
              <span className="font-extrabold text-base text-white tracking-tight">Prompt<span className="text-cyan-400">Xub</span></span>
              <span className="text-[10px] block text-purple-400 font-bold uppercase tracking-wider">Admin Control</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-1.5">
          <span className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Navigation
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Public Site Link */}
        <div className="p-4 pt-0">
          <span className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Showcase App
          </span>
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 transition"
          >
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Public Website</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-200">{user?.username || 'Administrator'}</span>
            <span className="text-[10px] text-purple-400 font-semibold">{user?.roles?.[0] || 'ROLE_ADMIN'}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 hover:text-rose-400 text-slate-400 text-xs font-semibold border border-slate-700/60 hover:border-rose-800/50 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
