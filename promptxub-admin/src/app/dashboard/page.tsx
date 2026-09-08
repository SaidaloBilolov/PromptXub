'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminNavbar } from '@/components/AdminNavbar';
import { AnalyticsChart } from '@/components/AnalyticsChart';
import { AdminStats, UserStats } from '@/types';
import { fetchAdminStats, fetchUserStats, updatePromptMetrics, deletePrompt, fetchAdminPrompts } from '@/lib/api';
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
  Trash2,
  BarChart2,
  Activity,
} from 'lucide-react';
import { formatCompactNumber } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [promptsList, setPromptsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Analyze Prompt State
  const [analyzingPrompt, setAnalyzingPrompt] = useState<any | null>(null);

  // Edit Prompt State
  const [editingPrompt, setEditingPrompt] = useState<{
    id: number;
    title: string;
    promptText: string;
    negativePrompt: string;
    aiModel: string;
    aspectRatio: string;
    categorySlug: string;
    contentType: string;
    viewCount: number;
    copyCount: number;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete Prompt State
  const [deletingPromptId, setDeletingPromptId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeletePrompt = async (id: number) => {
    setIsDeleting(true);
    try {
      await deletePrompt(id);
      setPromptsList((prev) => prev.filter((p) => p.id !== id));
      if (stats) {
        setStats({
          ...stats,
          topCopiedPrompts: stats.topCopiedPrompts.filter((p) => p.id !== id),
          totalPrompts: Math.max(0, stats.totalPrompts - 1),
        });
      }
      setDeletingPromptId(null);
    } catch (err) {
      console.error('Failed to delete prompt:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveMetrics = async () => {
    if (!editingPrompt) return;
    setIsSaving(true);
    try {
      await updatePromptMetrics(editingPrompt.id, {
        title: editingPrompt.title,
        promptText: editingPrompt.promptText,
        negativePrompt: editingPrompt.negativePrompt,
        aiModel: editingPrompt.aiModel,
        aspectRatio: editingPrompt.aspectRatio,
        categorySlug: editingPrompt.categorySlug,
        contentType: editingPrompt.contentType,
        displayViewCount: Number(editingPrompt.viewCount),
        displayCopyCount: Number(editingPrompt.copyCount),
        viewCount: Number(editingPrompt.viewCount),
        copyCount: Number(editingPrompt.copyCount),
      });

      setPromptsList((prev) =>
        prev.map((p) =>
          p.id === editingPrompt.id
            ? {
                ...p,
                title: editingPrompt.title,
                promptText: editingPrompt.promptText,
                negativePrompt: editingPrompt.negativePrompt,
                aiModel: editingPrompt.aiModel,
                aspectRatio: editingPrompt.aspectRatio,
                category: { ...p.category, slug: editingPrompt.categorySlug },
                contentType: editingPrompt.contentType,
                displayViewCount: Number(editingPrompt.viewCount),
                displayCopyCount: Number(editingPrompt.copyCount),
                viewCount: Number(editingPrompt.viewCount),
                copyCount: Number(editingPrompt.copyCount),
              }
            : p
        )
      );

      if (stats) {
        setStats({
          ...stats,
          topCopiedPrompts: stats.topCopiedPrompts.map((p) =>
            p.id === editingPrompt.id
              ? {
                  ...p,
                  title: editingPrompt.title,
                  aiModel: editingPrompt.aiModel,
                  contentType: editingPrompt.contentType as any,
                  viewCount: Number(editingPrompt.viewCount),
                  copyCount: Number(editingPrompt.copyCount),
                }
              : p
          ),
        });
      }

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
      const [data, uData, pList] = await Promise.all([
        fetchAdminStats(),
        fetchUserStats().catch(() => null),
        fetchAdminPrompts().catch(() => []),
      ]);
      setStats(data);
      if (uData) setUserStats(uData);
      if (pList && Array.isArray(pList) && pList.length > 0) {
        setPromptsList(pList);
      } else if (data && data.topCopiedPrompts) {
        setPromptsList(data.topCopiedPrompts);
      }
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
                  <span className="text-xl font-bold text-cyan-400">
                    {userStats?.googleUsersCount || 0} accounts ({userStats && userStats.totalUsers > 0 ? Math.round((userStats.googleUsersCount / userStats.totalUsers) * 100) : 0}%)
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800">
                  <Check className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-1 font-medium">Apple Sign-In Users</span>
                  <span className="text-xl font-bold text-slate-100">
                    {userStats?.appleUsersCount || 0} accounts ({userStats && userStats.totalUsers > 0 ? Math.round((userStats.appleUsersCount / userStats.totalUsers) * 100) : 0}%)
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700">
                  <Users className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-1 font-medium">Email Magic Link</span>
                  <span className="text-xl font-bold text-purple-400">
                    {userStats?.emailUsersCount || 0} accounts ({userStats && userStats.totalUsers > 0 ? Math.round((userStats.emailUsersCount / userStats.totalUsers) * 100) : 0}%)
                  </span>
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
                {stats.topConvertingModels && stats.topConvertingModels.length > 0 ? (
                  stats.topConvertingModels.map((m) => (
                    <div key={m.model} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-200">{m.model}</div>
                        <div className="text-[11px] text-slate-400">{m.realCopies.toLocaleString()} copies / {m.realViews.toLocaleString()} views</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                        {m.conversionRate}% conv.
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-center text-xs text-slate-500">
                    No model performance data recorded yet.
                  </div>
                )}
              </div>
            </div>

            {/* Peak Activity Times */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <h2 className="text-base font-bold text-white">Peak Activity Times</h2>
              </div>
              <div className="space-y-3">
                {stats.peakActivityTimes && stats.peakActivityTimes.length > 0 ? (
                  stats.peakActivityTimes.map((t) => (
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
                  ))
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-center text-xs text-slate-500">
                    No hourly activity data recorded yet.
                  </div>
                )}
              </div>
            </div>

            {/* User Device & OS Distribution */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-purple-400" />
                <h2 className="text-base font-bold text-white">Device & OS Distribution</h2>
              </div>
              <div className="space-y-3">
                {stats.deviceDistribution && stats.deviceDistribution.length > 0 ? (
                  stats.deviceDistribution.map((d) => (
                    <div key={d.os} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-200">{d.os}</div>
                        <div className="text-[11px] text-slate-400">{d.device} • {d.count.toLocaleString()} sessions</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-purple-950 text-purple-300 border border-purple-800/60">
                        {d.percentage}%
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-center text-xs text-slate-500">
                    No device analytics recorded yet.
                  </div>
                )}
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
                    {(promptsList.length > 0 ? promptsList : stats.topCopiedPrompts).map((item) => {
                      const realViews = item.realViewCount ?? 0;
                      const realCopies = item.realCopyCount ?? 0;
                      const displayViews = item.displayViewCount ?? item.viewCount ?? 0;
                      const displayCopies = item.displayCopyCount ?? item.copyCount ?? 0;
                      const convRate = item.conversionRate !== undefined ? item.conversionRate : (realViews > 0 ? ((realCopies / realViews) * 100).toFixed(1) : '0.0');

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

                          {/* REAL STATS (Internal DB) */}
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
                                View: {displayViews.toLocaleString()}
                              </span>
                              <span className="text-[11px] font-bold text-purple-300">
                                Copy: {displayCopies.toLocaleString()}
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
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {/* Tahlil (Analyze) Button */}
                              <button
                                onClick={() => setAnalyzingPrompt(item)}
                                title="Detailed Analytics & Prompt Analysis"
                                className="px-2 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 hover:text-white border border-cyan-800/80 transition active:scale-95 flex items-center gap-1 text-[11px] font-bold shadow-sm"
                              >
                                <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Tahlil</span>
                              </button>

                              {/* Edit Button */}
                              <button
                                onClick={() =>
                                  setEditingPrompt({
                                    id: item.id,
                                    title: item.title || '',
                                    promptText: item.promptText || '',
                                    negativePrompt: item.negativePrompt || '',
                                    aiModel: item.aiModel || 'Midjourney v6',
                                    aspectRatio: item.aspectRatio || '16:9',
                                    categorySlug: item.category?.slug || item.categorySlug || '3d-render',
                                    contentType: item.contentType || 'PHOTO',
                                    viewCount: displayViews,
                                    copyCount: displayCopies,
                                  })
                                }
                                title="Edit Public Display Metrics"
                                className="px-2 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 text-purple-300 hover:text-white border border-purple-800/80 transition active:scale-95 flex items-center gap-1 text-[11px] font-bold shadow-sm"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                                <span>Edit</span>
                              </button>

                              {/* Copy Link Button */}
                              <button
                                onClick={() => handleCopyPublicLink(item.id)}
                                title="Copy Public URL for Instagram/Socials"
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-semibold transition active:scale-95 shadow-sm"
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

                              {/* O'chirish (Delete) Button */}
                              <button
                                onClick={() => setDeletingPromptId(item.id)}
                                title="Delete Prompt"
                                className="px-2 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-800/80 transition active:scale-95 flex items-center gap-1 text-[11px] font-bold shadow-sm"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                <span>O'chirish</span>
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

      {/* Edit Prompt Modal */}
      {editingPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#0F172A] border border-purple-900/80 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-purple-400" /> Promptni Tahrirlash (Edit Prompt)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Sarlavha, matn, AI model, kategoriya va statistika ko'rsatkichlarini o'zgartirish</p>
              </div>
              <button
                onClick={() => setEditingPrompt(null)}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Prompt Sarlavhasi (Title)</label>
              <input
                type="text"
                value={editingPrompt.title}
                onChange={(e) => setEditingPrompt({ ...editingPrompt, title: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-semibold focus:outline-none focus:border-purple-500"
                placeholder="Prompt sarlavhasini kiriting..."
              />
            </div>

            {/* Grid of AI Model, Category, Aspect Ratio, Content Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">AI Model Generator</label>
                <div className="space-y-1.5">
                  <select
                    value={['Midjourney v6', 'Midjourney', 'Flux 1.1 Pro', 'Flux Dev', 'DALL-E 3', 'Stable Diffusion XL', 'Runway Gen-3', 'Luma Dream Machine', 'Sora', 'Kling AI'].includes(editingPrompt.aiModel) ? editingPrompt.aiModel : '__CUSTOM__'}
                    onChange={(e) => {
                      if (e.target.value !== '__CUSTOM__') {
                        setEditingPrompt({ ...editingPrompt, aiModel: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-medium focus:outline-none focus:border-purple-500"
                  >
                    <option value="Midjourney v6">Midjourney v6</option>
                    <option value="Midjourney">Midjourney</option>
                    <option value="Flux 1.1 Pro">Flux 1.1 Pro</option>
                    <option value="Flux Dev">Flux Dev</option>
                    <option value="DALL-E 3">DALL-E 3</option>
                    <option value="Stable Diffusion XL">Stable Diffusion XL</option>
                    <option value="Runway Gen-3">Runway Gen-3</option>
                    <option value="Luma Dream Machine">Luma Dream Machine</option>
                    <option value="Sora">Sora</option>
                    <option value="Kling AI">Kling AI</option>
                    <option value="__CUSTOM__">✍️ + Custom / Yozib qo'shish...</option>
                  </select>

                  {(!['Midjourney v6', 'Midjourney', 'Flux 1.1 Pro', 'Flux Dev', 'DALL-E 3', 'Stable Diffusion XL', 'Runway Gen-3', 'Luma Dream Machine', 'Sora', 'Kling AI'].includes(editingPrompt.aiModel) || editingPrompt.aiModel === '') && (
                    <input
                      type="text"
                      value={editingPrompt.aiModel}
                      onChange={(e) => setEditingPrompt({ ...editingPrompt, aiModel: e.target.value })}
                      placeholder="Custom model nomini yozing (masalan: Ideogram 2.0)..."
                      className="w-full px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/80 text-cyan-200 text-xs focus:outline-none"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Kategoriya</label>
                <div className="space-y-1.5">
                  <select
                    value={['3d-render', 'fotorealizm', 'portret-insonlar', 'fantastika-scifi', 'kiberpank-neon', 'tabiat-landshaft', 'anime-sanat', 'memorchilik-bino', 'photorealistic', 'cinematic', 'anime-concept', 'architecture', '3d-cgi', 'ai-video-motion'].includes(editingPrompt.categorySlug) ? editingPrompt.categorySlug : '__CUSTOM__'}
                    onChange={(e) => {
                      if (e.target.value !== '__CUSTOM__') {
                        setEditingPrompt({ ...editingPrompt, categorySlug: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-medium focus:outline-none focus:border-purple-500"
                  >
                    <option value="photorealistic">Fotorealizm (Photorealistic)</option>
                    <option value="cinematic">Kinematik (Cinematic)</option>
                    <option value="anime-concept">Anime & San'at (Anime & Concept)</option>
                    <option value="architecture">Me'morchilik (Architecture)</option>
                    <option value="3d-cgi">3D & CGI</option>
                    <option value="ai-video-motion">AI Video & Motion</option>
                    <option value="kiberpank-neon">Kiberpank & Neon</option>
                    <option value="tabiat-landshaft">Tabiat & Landshaft</option>
                    <option value="__CUSTOM__">✍️ + Custom / Yangi Kategoriya Yozish...</option>
                  </select>

                  {(!['3d-render', 'fotorealizm', 'portret-insonlar', 'fantastika-scifi', 'kiberpank-neon', 'tabiat-landshaft', 'anime-sanat', 'memorchilik-bino', 'photorealistic', 'cinematic', 'anime-concept', 'architecture', '3d-cgi', 'ai-video-motion'].includes(editingPrompt.categorySlug) || editingPrompt.categorySlug === '') && (
                    <input
                      type="text"
                      value={editingPrompt.categorySlug}
                      onChange={(e) => setEditingPrompt({ ...editingPrompt, categorySlug: e.target.value })}
                      placeholder="Yangi kategoriya nomini yozing (masalan: Logo & Vector)..."
                      className="w-full px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/80 text-cyan-200 text-xs focus:outline-none"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Aspect Ratio (Nisbat)</label>
                <select
                  value={editingPrompt.aspectRatio}
                  onChange={(e) => setEditingPrompt({ ...editingPrompt, aspectRatio: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-medium focus:outline-none focus:border-purple-500"
                >
                  <option value="16:9">16:9 (Landscape)</option>
                  <option value="9:16">9:16 (Portrait / Reels / Story)</option>
                  <option value="1:1">1:1 (Square)</option>
                  <option value="4:3">4:3 (Standard)</option>
                  <option value="3:4">3:4 (Tall)</option>
                  <option value="21:9">21:9 (Ultrawide)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Media Turi (Type)</label>
                <select
                  value={editingPrompt.contentType}
                  onChange={(e) => setEditingPrompt({ ...editingPrompt, contentType: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-medium focus:outline-none focus:border-purple-500"
                >
                  <option value="PHOTO">Rasm (PHOTO)</option>
                  <option value="VIDEO">Video (VIDEO)</option>
                </select>
              </div>
            </div>

            {/* Prompt Text Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Prompt Matni (Prompt Text)</label>
              <textarea
                rows={4}
                value={editingPrompt.promptText}
                onChange={(e) => setEditingPrompt({ ...editingPrompt, promptText: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-purple-500 leading-relaxed"
                placeholder="Prompt matnini kiriting..."
              />
            </div>

            {/* Negative Prompt Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Salbiy Prompt (Negative Prompt - Ixtiyoriy)</label>
              <textarea
                rows={2}
                value={editingPrompt.negativePrompt}
                onChange={(e) => setEditingPrompt({ ...editingPrompt, negativePrompt: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-mono focus:outline-none focus:border-purple-500"
                placeholder="Negative prompt..."
              />
            </div>

            {/* Display Counts Grid */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">Ommaviy Statistika Ko'rsatkichlari (Display Metrics)</span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-cyan-400 mb-1 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> Jami Ko'rishlar Sonı
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
                    <Flame className="w-3.5 h-3.5 text-orange-400" /> Jami Nusxalashlar Sonı
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
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setEditingPrompt(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Bekor Qilish
              </button>
              <button
                onClick={handleSaveMetrics}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 shadow-lg shadow-purple-600/30 transition active:scale-95"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>O'zgarishlarni Saqlash</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prompt Detailed Analysis Modal (Tahlil Modali) */}
      {analyzingPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#0F172A] border border-cyan-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Prompt Tahlili & Analitikasi</h3>
                  <p className="text-xs text-slate-400">ID: #{analyzingPrompt.id} • Real DB ko'rsatkichlari va sozlangan raqamlar</p>
                </div>
              </div>
              <button
                onClick={() => setAnalyzingPrompt(null)}
                className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Media & Title Overview */}
            <div className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <img
                src={analyzingPrompt.mediaUrl}
                alt=""
                className="w-24 h-24 rounded-xl object-cover bg-slate-900 shrink-0 border border-slate-800"
              />
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-800">
                    {analyzingPrompt.aiModel}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {analyzingPrompt.contentType}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white leading-snug">{analyzingPrompt.title}</h4>
              </div>
            </div>

            {/* Metrics Comparison Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Real Internal Stats (Database) */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-900/60 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  <span>Haqiqiy Statistikalar (DB)</span>
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Haqiqiy Ko'rishlar:</span>
                    <span className="font-bold text-white">{analyzingPrompt.realViewCount ?? 0} views</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Haqiqiy Copy Qilingan:</span>
                    <span className="font-bold text-orange-400">{analyzingPrompt.realCopyCount ?? 0} copies</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-slate-400">Konversiya Rate:</span>
                    <span className="font-extrabold text-emerald-400">
                      {analyzingPrompt.realViewCount > 0
                        ? ((analyzingPrompt.realCopyCount / analyzingPrompt.realViewCount) * 100).toFixed(1)
                        : '0.0'}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Public Display Stats (User Facing) */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-900/60 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-purple-400 uppercase tracking-wider">
                  <span>Foydalanuvchilarga Ko'rinadigan</span>
                  <Eye className="w-4 h-4 text-purple-400" />
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Display Views:</span>
                    <span className="font-bold text-white">{(analyzingPrompt.displayViewCount ?? analyzingPrompt.viewCount ?? 0).toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Display Copies:</span>
                    <span className="font-bold text-purple-300">{(analyzingPrompt.displayCopyCount ?? analyzingPrompt.copyCount ?? 0).toLocaleString()} copies</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-slate-400">Holat:</span>
                    <span className="font-bold text-cyan-300">Sozlangan Base + Real Increments</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt Command Content */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">Prompt Matni</span>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed select-all">
                {analyzingPrompt.promptText}
              </div>
            </div>

            {/* Modal Bottom Actions: Edit & Delete */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  const pId = analyzingPrompt.id;
                  setAnalyzingPrompt(null);
                  setDeletingPromptId(pId);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/80 flex items-center gap-1.5 transition active:scale-95 shadow-lg shadow-rose-950/40"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>Promptni O'chirish</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const pToEdit = analyzingPrompt;
                    setAnalyzingPrompt(null);
                    setEditingPrompt({
                      id: pToEdit.id,
                      title: pToEdit.title || '',
                      promptText: pToEdit.promptText || '',
                      negativePrompt: pToEdit.negativePrompt || '',
                      aiModel: pToEdit.aiModel || 'Midjourney v6',
                      aspectRatio: pToEdit.aspectRatio || '16:9',
                      categorySlug: pToEdit.category?.slug || pToEdit.categorySlug || '3d-render',
                      contentType: pToEdit.contentType || 'PHOTO',
                      viewCount: pToEdit.displayViewCount ?? pToEdit.viewCount ?? 0,
                      copyCount: pToEdit.displayCopyCount ?? pToEdit.copyCount ?? 0,
                    });
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 transition active:scale-95 shadow-lg shadow-purple-600/30"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Promptni Tahrirlash</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Prompt Confirmation Modal */}
      {deletingPromptId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0F172A] border border-rose-900/60 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800/80 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white">Promptni o'chirishni tasdiqlaysizmi?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ushbu prompt va unga bog'langan barcha statistik ma'lumotlar butunlay o'chiriladi. Bu amalni ortga qaytarib bo'lmaydi.
            </p>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                onClick={() => setDeletingPromptId(null)}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => handleDeletePrompt(deletingPromptId)}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>Ha, O'chirish</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
