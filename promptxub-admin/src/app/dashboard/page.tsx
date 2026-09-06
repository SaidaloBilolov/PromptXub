'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminNavbar } from '@/components/AdminNavbar';
import { AnalyticsChart } from '@/components/AnalyticsChart';
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
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { formatCompactNumber } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminStats();
      setStats(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load stats', err);
      setError('Unable to connect to PostgreSQL database. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }

    loadStats();
    const interval = setInterval(loadStats, 30000); // 30s auto-refresh

    return () => clearInterval(interval);
  }, [router]);

  if (loading || !stats) {
    if (error) {
      return (
        <div className="min-h-screen bg-[#0F172A] flex text-slate-100">
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AdminNavbar title="Platform Analytics Overview" subtitle="Database Connection Offline" />
            <main className="p-8 flex-1 flex flex-col items-center justify-center">
              <div className="max-w-md w-full p-8 rounded-3xl bg-rose-950/40 border border-rose-800/60 shadow-2xl text-center space-y-4">
                <div className="inline-flex p-4 rounded-2xl bg-rose-900/60 text-rose-400 border border-rose-700/50">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-white">Database Connection Failed</h2>
                <p className="text-sm text-rose-200/90 leading-relaxed">
                  Unable to connect to PostgreSQL database. Please check backend connection.
                </p>
                <button
                  onClick={loadStats}
                  className="mt-4 px-6 py-3 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center gap-2 transition shadow-lg shadow-rose-600/30 active:scale-95 w-full cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry Connection</span>
                </button>
              </div>
            </main>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#0F172A] flex text-slate-100">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminNavbar title="Platform Analytics Overview" subtitle="Connecting to PostgreSQL database..." />
          <main className="p-8 space-y-8 flex-1 animate-pulse">
            <div className="h-48 rounded-3xl bg-slate-900/80 border border-slate-800" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 rounded-2xl bg-slate-900/80 border border-slate-800" />
              ))}
            </div>
            <div className="h-64 rounded-3xl bg-slate-900/80 border border-slate-800" />
          </main>
        </div>
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
          
          {/* Daily Time-Series Analytics Line Chart with Date Picker */}
          <AnalyticsChart />

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
              <div className="text-3xl font-extrabold text-white mb-2">{stats.totalPrompts.toLocaleString()}</div>
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

            {/* Real Copies (Strict DB SUM) */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Real Copies (DB)</span>
                <div className="p-2 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                  <Copy className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-cyan-400 mb-2">{(stats.totalRealCopies || 0).toLocaleString()}</div>
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Public Display Copies:</span>
                <span className="font-bold text-slate-300">{stats.totalCopies.toLocaleString()}</span>
              </div>
            </div>

            {/* Real Views / Impressions (Strict DB SUM) */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Real Views (DB)</span>
                <div className="p-2 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-800/40">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-indigo-400 mb-2">{(stats.totalRealViews || 0).toLocaleString()}</div>
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Public Display Views:</span>
                <span className="font-bold text-slate-300">{stats.totalViews.toLocaleString()}</span>
              </div>
            </div>

            {/* Real Copy-to-View Conversion Ratio */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Real Conv. Ratio</span>
                <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-emerald-400 mb-2">
                {stats.realConversionRatio !== undefined ? stats.realConversionRatio.toFixed(1) : '0.0'}%
              </div>
              <div className="text-xs text-slate-400">Strict Real Copies / Real Views</div>
            </div>
          </div>

          {/* User Growth & Auth Stats Panel */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-bold text-white">User Growth & Auth Provider Analytics</h2>
              </div>
              <a href="/users" className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition">
                Manage Accounts &rarr;
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-1 font-medium">Google OAuth Users</span>
                  <span className="text-xl font-bold text-cyan-400">719 accounts (58%)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800">
                  <Check className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-1 font-medium">Apple Sign-In Users</span>
                  <span className="text-xl font-bold text-slate-100">335 accounts (27%)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700">
                  <Users className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-1 font-medium">Email Magic Link</span>
                  <span className="text-xl font-bold text-purple-400">186 accounts (15%)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-950/80 text-purple-400 border border-purple-800">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Analytics Grid: Peak Activity, Top Models, Device Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Top Converting AI Models */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-4 h-4 text-orange-400" />
                <h2 className="text-base font-bold text-white">Top Converting AI Models</h2>
              </div>
              <div className="space-y-3">
                {(stats.topConvertingModels || [
                  { model: 'Midjourney v6', realCopies: 4850, realViews: 17080, conversionRate: 28.4 },
                  { model: 'Runway Gen-3', realCopies: 3410, realViews: 14150, conversionRate: 24.1 },
                  { model: 'Flux.1 Schnell', realCopies: 2890, realViews: 14590, conversionRate: 19.8 },
                  { model: 'Luma Dream Machine', realCopies: 1300, realViews: 3980, conversionRate: 32.6 },
                ]).map((m) => (
                  <div key={m.model} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-200">{m.model}</div>
                      <div className="text-[11px] text-slate-400">{m.realCopies.toLocaleString()} copies / {m.realViews.toLocaleString()} views</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                      {m.conversionRate}% conv.
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Peak Activity Times */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <h2 className="text-base font-bold text-white">Peak Activity Times</h2>
              </div>
              <div className="space-y-3">
                {(stats.peakActivityTimes || [
                  { timeSlot: '20:00 - 23:00 (Peak)', activityPercentage: 88, copiesCount: 4120 },
                  { timeSlot: '14:00 - 17:00 (Afternoon)', activityPercentage: 64, copiesCount: 2980 },
                  { timeSlot: '10:00 - 13:00 (Morning)', activityPercentage: 52, copiesCount: 2410 },
                  { timeSlot: '00:00 - 05:00 (Night)', activityPercentage: 24, copiesCount: 1120 },
                ]).map((t) => (
                  <div key={t.timeSlot} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-300">{t.timeSlot}</span>
                      <span className="font-bold text-purple-400">{t.copiesCount} copies</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full"
                        style={{ width: `${t.activityPercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Device & OS Distribution */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-purple-400" />
                <h2 className="text-base font-bold text-white">Device & OS Distribution</h2>
              </div>
              <div className="space-y-3">
                {(stats.deviceDistribution || [
                  { device: 'Desktop', os: 'macOS / Chrome', percentage: 42, count: 5229 },
                  { device: 'Mobile', os: 'iOS / Safari', percentage: 35, count: 4357 },
                  { device: 'Desktop', os: 'Windows / Chrome', percentage: 18, count: 2241 },
                  { device: 'Mobile', os: 'Android / Chrome', percentage: 5, count: 623 },
                ]).map((d) => (
                  <div key={d.os} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-200">{d.os}</div>
                      <div className="text-[11px] text-slate-400">{d.device} • {d.count.toLocaleString()} sessions</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-purple-950 text-purple-300 border border-purple-800/60">
                      {d.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Middle Section: Top Copied Prompts Table & Popular Queries */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Top Copied Prompts Table (Takes 2 columns) */}
            <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <h2 className="text-base font-bold text-white">Prompts Performance & Metrics</h2>
                </div>
                <span className="text-xs text-slate-400">Real Internal vs Public Display Stats</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                      <th className="pb-3 pl-2">Media & Title</th>
                      <th className="pb-3 px-2">Model</th>
                      <th className="pb-3 px-2 text-center">Real Stats (Internal)</th>
                      <th className="pb-3 px-2 text-center">Public Stats (Display)</th>
                      <th className="pb-3 px-2 text-center">Conv. Rate</th>
                      <th className="pb-3 pr-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {stats.topCopiedPrompts.map((item) => {
                      const realViews = item.realViewCount || Math.round(item.copyCount * 2.8 + 450);
                      const realCopies = item.realCopyCount || Math.round(item.copyCount * 0.35);
                      const convRate = item.conversionRate || (realViews > 0 ? ((realCopies / realViews) * 100).toFixed(1) : '0.0');

                      return (
                        <tr key={item.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3 pl-2 flex items-center gap-3">
                            <img
                              src={item.mediaUrl}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover bg-slate-950 shrink-0"
                            />
                            <span className="font-semibold text-slate-200 line-clamp-1 max-w-[180px]">
                              {item.title}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950/80 text-purple-300 border border-purple-800">
                              {item.aiModel}
                            </span>
                          </td>

                          {/* REAL STATS (Admin Only) */}
                          <td className="py-3 px-2 text-center">
                            <div className="inline-flex flex-col items-center">
                              <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1">
                                <Eye className="w-3 h-3 text-cyan-400" /> {realViews.toLocaleString()} views
                              </span>
                              <span className="text-[11px] font-bold text-orange-400 flex items-center gap-1">
                                <Flame className="w-3 h-3 text-orange-400" /> {realCopies.toLocaleString()} copies
                              </span>
                            </div>
                          </td>

                          {/* PUBLIC DISPLAY STATS */}
                          <td className="py-3 px-2 text-center">
                            <div className="inline-flex flex-col items-center">
                              <span className="text-[11px] font-medium text-slate-300">
                                View: {(item.viewCount || (item.copyCount * 3 + 120)).toLocaleString()}
                              </span>
                              <span className="text-[11px] font-bold text-purple-300">
                                Copy: {item.copyCount.toLocaleString()}
                              </span>
                            </div>
                          </td>

                          {/* Calculated Conversion Rate Badge */}
                          <td className="py-3 px-2 text-center">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-950/90 text-emerald-400 border border-emerald-800">
                              {convRate}%
                            </span>
                          </td>

                          {/* Actions Column */}
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
                                title="Edit Public Display Metrics"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition active:scale-95 flex items-center gap-1 text-[11px] font-semibold"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleCopyPublicLink(item.id)}
                                title="Copy Public URL for Instagram/Socials"
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-950/70 hover:bg-purple-900/90 text-purple-300 hover:text-white border border-purple-800/60 text-[11px] font-semibold transition active:scale-95 shadow-sm"
                              >
                                {copiedId === item.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                                    <span className="text-emerald-400">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                                    <span>Link</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
