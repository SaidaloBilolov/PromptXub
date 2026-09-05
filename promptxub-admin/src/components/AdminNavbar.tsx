'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Bell } from 'lucide-react';

interface AdminNavbarProps {
  title: string;
  subtitle?: string;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({ title, subtitle }) => {
  return (
    <header className="h-20 px-8 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/prompts/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Prompt</span>
        </Link>
      </div>
    </header>
  );
};
