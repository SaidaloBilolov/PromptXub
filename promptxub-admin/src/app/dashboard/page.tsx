'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminNavbar } from '@/components/AdminNavbar';
import { AdminStats } from '@/types';
import { fetchAdminStats, updatePromptMetrics } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import {
  Sparkles,
  Copy,
  Layers,
  Search,
  Flame,
  Video,
  Image as ImageIcon,
  TrendingUp,
  Loader2,
  ExternalLink,
  Check,
  Link2,
  Eye,
  Edit3,
  Users,
  Save,
  X,
} from 'lucide-react';
import { formatCompactNumber } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Edit Prompt Metrics State
  const [editingPrompt, setEditingPrompt] = useState<{
    id: number;
    title: string;
    viewCount: number;
    copyCount: number;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const SHOWCASE_PUBLIC_URL = (process.env.NEXT_PUBLIC_SHOWCASE_URL || 'https://promptxub.uz').replace(/\/+$/, '');

  const handleCopyPublicLink = async (promptId: number) => {
    const publicUrl = `${SHOWCASE_PUBLIC_URL}/prompt/${promptId}`;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopiedId(promptId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy public link', err);
    }
  };

  const handleSaveMetrics = async () => {
    if (!editingPrompt || !stats) return;
    setIsSaving(true);
    try {
      await updatePromptMetrics(editingPrompt.id, {
        viewCount: Number(editingPrompt.viewCount),
        copyCount: Number(editingPrompt.copyCount),
      });

      setStats({
        ...stats,
        topCopiedPrompts: stats.topCopiedPrompts.map((p) =>
          p.id === editingPrompt.id
            ? {
                ...p,
                viewCount: Number(editingPrompt.viewCount),
                copyCount: Number(editingPrompt.copyCount),
              }
            : p
        ),
      });

      setEditingPrompt(null);
    } catch (err) {
      console.error('Failed to save prompt metrics', err);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }

    async function loadStats() {
      try {
        const data = await fetchAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [router]);

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500 mb-2" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex text-slate-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar
          title="Platform Analytics & Overview"
          subtitle="Real-time copy performance, prompt counts, and search logs"
        />

        <main className="p-8 space-y-8 flex-1 overflow-y-auto">
          
          {/* Top 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Prompts */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Prompts</span>
                <div className="p-2 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800/40">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white mb-2">{stats.totalPrompts}</div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-purple-400" /> {stats.totalPhotos} Photos
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-cyan-400" /> {stats.totalVideos} Videos
                </span>
              </div>
            </div>

            {/* Total Copies */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Copies</span>
                <div className="p-2 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                  <Copy className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white mb-2">{stats.totalCopies.toLocaleString()}</div>
              <div className="text-xs text-cyan-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> High user conversion
              </div>
            </div>

            {/* Total Impressions / Views */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Impressions</span>
                <div className="p-2 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-800/40">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white mb-2">{stats.totalViews.toLocaleString()}</div>
              <div className="text-xs text-slate-400">Across user showcase</div>
            </div>

            {/* Total Search Inquiries */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Search Queries</span>
                <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                  <Search className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white mb-2">{stats.totalSearches.toLocaleString()}</div>
              <div className="text-xs text-slate-400">Logged query keywords</div>
            </div>
          </div>

          {/* Middle Section: Top Copied Prompts Table & Popular Queries */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Top Copied Prompts Table (Takes 2 columns) */}
            <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <h2 className="text-base font-bold text-white">Top Copied AI Prompts</h2>
                </div>
                <span className="text-xs text-slate-400">Ranked by copy count</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                      <th className="pb-3 pl-2">Media & Title</th>
                      <th className="pb-3 px-3">Model</th>
                      <th className="pb-3 px-3">Format</th>
                      <th className="pb-3 px-3 text-right">Views</th>
                      <th className="pb-3 px-3 text-right">Copies</th>
                      <th className="pb-3 pr-2 text-right">Public Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {stats.topCopiedPrompts.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 pl-2 flex items-center gap-3">
                          <img
                            src={item.mediaUrl}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-slate-950 shrink-0"
                          />
                          <span className="font-semibold text-slate-200 line-clamp-1 max-w-[220px]">
                            {item.title}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950/80 text-purple-300 border border-purple-800">
                            {item.aiModel}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-slate-400 font-medium">
                            {item.contentType === 'VIDEO' ? '🎥 Video' : '📷 Photo'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-300">
                            <Eye className="w-3.5 h-3.5 text-cyan-400" />
                            {(item.viewCount || (item.copyCount * 3 + 120)).toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="inline-flex items-center gap-1 font-bold text-purple-400">
                            <Flame className="w-3.5 h-3.5 text-orange-400" />
                            {item.copyCount.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 pr-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                setEditingPrompt({
                                  id: item.id,
                                  title: item.title,
                                  viewCount: item.viewCount || (item.copyCount * 3 + 120),
                                  copyCount: item.copyCount,
                                })
                              }
                              title="Edit Views & Copies metrics"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition active:scale-95"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleCopyPublicLink(item.id)}
                              title="Copy Public URL for Instagram/Socials"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/70 hover:bg-purple-900/90 text-purple-300 hover:text-white border border-purple-800/60 text-[11px] font-semibold transition active:scale-95 shadow-sm"
                            >
                              {copiedId === item.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                                  <span className="text-emerald-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                                  <span>Copy Link</span>
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Popular Search Keywords */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Search className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-base font-bold text-white">Popular Search Queries</h2>
                </div>
                <p className="text-xs text-slate-400 mb-6">
                  Keywords users are searching for most frequently on PromptXub.
                </p>

                <div className="space-y-3">
                  {stats.popularQueries.map((query, index) => (
                    <div
                      key={query.query}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 text-slate-500 font-bold">#{index + 1}</span>
                        <span className="text-slate-200 font-medium">{query.query}</span>
                      </div>
                      <span className="font-mono text-purple-400 font-semibold">
                        {query.count} hits
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
                <a
                  href="/prompts/new"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition"
                >
                  <span>Add prompts matching trending keywords</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

        </main>
      </div>

      {/* Edit Metrics Modal */}
      {editingPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0F172A] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-purple-400" /> Edit Prompt Analytics
              </h3>
              <button
                onClick={() => setEditingPrompt(null)}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Prompt Title</label>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-semibold line-clamp-1">
                {editingPrompt.title}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-cyan-400 mb-1 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> Total Views
                </label>
                <input
                  type="number"
                  value={editingPrompt.viewCount}
                  onChange={(e) =>
                    setEditingPrompt({ ...editingPrompt, viewCount: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-purple-400 mb-1 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" /> Total Copies
                </label>
                <input
                  type="number"
                  value={editingPrompt.copyCount}
                  onChange={(e) =>
                    setEditingPrompt({ ...editingPrompt, copyCount: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setEditingPrompt(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMetrics}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 shadow-lg shadow-purple-600/30"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
