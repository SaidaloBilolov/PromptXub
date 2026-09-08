'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  User,
  Mail,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Heart,
  Bookmark,
  Copy,
  ExternalLink,
  Trash2,
  Check,
  Video,
  Eye,
  Compass,
  Layers,
} from 'lucide-react';
import { Prompt } from '@/types';
import {
  getActiveUser,
  getUserData,
  removeSavedPrompt,
  recordUserCopy,
  UserData,
  UserProfile,
  USER_STORAGE_KEY,
} from '@/lib/userStore';
import { getOptimizedMediaUrl } from '@/lib/imagekit';
import { PromptDetailModal } from '@/components/PromptDetailModal';
import { Toast } from '@/components/Toast';

export default function ShowcaseDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userData, setUserData] = useState<UserData>({
    savedPrompts: [],
    copiedCount: 0,
    likedPromptIds: [],
  });
  const [activeModalPrompt, setActiveModalPrompt] = useState<Prompt | null>(null);
  const [copiedPromptId, setCopiedPromptId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const syncData = () => {
    if (typeof window === 'undefined') return;
    const activeUser = getActiveUser();
    setUser(activeUser);
    if (activeUser) {
      setUserData(getUserData(activeUser));
    } else {
      const legacy = localStorage.getItem('promptxub_active_user_session');
      if (legacy) {
        try {
          const parsed = JSON.parse(legacy);
          setUser(parsed);
          setUserData(getUserData(parsed));
          localStorage.setItem(USER_STORAGE_KEY, legacy);
        } catch {}
      } else {
        setUserData(getUserData(null));
      }
    }
  };

  useEffect(() => {
    syncData();
    window.addEventListener('promptxub_library_updated', syncData);
    window.addEventListener('storage', syncData);

    return () => {
      window.removeEventListener('promptxub_library_updated', syncData);
      window.removeEventListener('storage', syncData);
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem('promptxub_active_user_session');
      document.cookie = 'promptxub_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      window.dispatchEvent(new CustomEvent('promptxub_library_updated'));
    }
    router.push('/');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopyPrompt = async (prompt: Prompt, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      setCopiedPromptId(prompt.id);
      recordUserCopy(user, prompt.id);
      showToast(`Prompt nusxalandi: "${prompt.title.substring(0, 24)}..."`);
      setTimeout(() => {
        setCopiedPromptId(null);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemovePrompt = (promptId: number, promptTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeSavedPrompt(user, promptId);
    showToast(`"${promptTitle.substring(0, 22)}..." saqlanganlardan oʻchirildi`);
  };

  const getModelBadgeColor = (model: string) => {
    if (model.toLowerCase().includes('midjourney')) return 'bg-purple-950/80 text-purple-300 border-purple-800';
    if (model.toLowerCase().includes('flux')) return 'bg-cyan-950/80 text-cyan-300 border-cyan-800';
    if (model.toLowerCase().includes('runway')) return 'bg-pink-950/80 text-pink-300 border-pink-800';
    if (model.toLowerCase().includes('luma')) return 'bg-amber-950/80 text-amber-300 border-amber-800';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 selection:bg-purple-500/30 selection:text-purple-200">
      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Top Navbar */}
      <nav className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:opacity-90 transition">
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px] overflow-hidden">
                <img
                  src="/circular-logo.png"
                  alt="PromptXub Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Prompt<span className="text-cyan-400">Xub</span>
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
            >
              <Compass className="w-3.5 h-3.5 text-purple-400" />
              <span>Showcase Feed</span>
            </Link>

            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-rose-300 hover:bg-rose-950/40 hover:border-rose-900 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* User Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/40 via-slate-900/90 to-slate-950 border border-slate-800/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            <img
              src={
                user?.image ||
                `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
                  user?.email || 'creator'
                )}`
              }
              alt={user?.name || 'User Avatar'}
              className="w-20 h-20 rounded-2xl border-2 border-purple-500/40 object-cover shadow-lg shadow-purple-900/20 bg-slate-900"
            />
            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
                <ShieldCheck className="w-3 h-3" />
                {user ? 'Authenticated via Google' : 'Guest Mode (Local Session)'}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {user?.name || 'Showcase Creator'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {user?.email || 'guest@promptxub.com'}
              </p>
            </div>
            <div>
              <Link
                href="/"
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white shadow-lg shadow-purple-600/30 transition flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Showcase</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Real Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Saved Prompts</span>
              <Bookmark className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-3xl font-black text-white">{userData.savedPrompts.length}</p>
            <p className="text-[11px] text-slate-400">Shaxsiy kutubxonangizda saqlangan promptlar</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Copied Prompts</span>
              <Copy className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-3xl font-black text-white">{userData.copiedCount}</p>
            <p className="text-[11px] text-slate-400">Jami nusxalangan promptlar soni</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Liked Prompts</span>
              <Heart className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-3xl font-black text-white">{userData.likedPromptIds.length}</p>
            <p className="text-[11px] text-slate-400">Sevimlilar roʻyxatidagi promptlar</p>
          </div>
        </div>

        {/* Saved Prompts Collection Section */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                Saqlangan Promptlarim
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-950/80 text-purple-300 border border-purple-800/60">
                {userData.savedPrompts.length}
              </span>
            </div>

            {userData.savedPrompts.length > 0 && (
              <Link
                href="/"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1"
              >
                <span>Yana prompt qidirish</span>
                <ArrowLeft className="w-3 h-3 rotate-180" />
              </Link>
            )}
          </div>

          {userData.savedPrompts.length === 0 ? (
            /* Clean Empty State */
            <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/40 p-10 sm:p-14 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-950/50 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400 shadow-inner">
                <Bookmark className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Hozircha saqlangan promptlar yoʻq
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Bosh sahifadagi kartochkalar ustidagi Bookmark (saqlash) tugmachasini bosish orqali oʻzingizga maʼqul kelgan Midjourney, Flux yoki Runway promptlarini shaxsiy kutubxonangizga saqlab oling. Ular faqat sizning shaxsiy akkauntingizda koʻrinadi.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white shadow-lg shadow-purple-600/30 transition"
                >
                  <Compass className="w-4 h-4" />
                  <span>Showcase Feed'ga oʻtish</span>
                </Link>
              </div>
            </div>
          ) : (
            /* Grid of Real Saved Prompts */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userData.savedPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  onClick={() => setActiveModalPrompt(prompt)}
                  className="group relative rounded-2xl overflow-hidden bg-slate-900/70 border border-slate-800/80 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/20 flex flex-col cursor-pointer"
                >
                  {/* Media Preview */}
                  <div className="relative w-full overflow-hidden bg-slate-950 aspect-[4/3] sm:aspect-square">
                    {prompt.contentType === 'VIDEO' ? (
                      <div className="w-full h-full relative">
                        <video
                          src={prompt.mediaUrl}
                          poster={getOptimizedMediaUrl(prompt.thumbnailUrl || prompt.mediaUrl, { width: 600 })}
                          muted
                          loop
                          playsInline
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/50 text-[10px] font-bold text-cyan-300 z-10">
                          <Video className="w-3 h-3" />
                          <span>VIDEO</span>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={getOptimizedMediaUrl(prompt.mediaUrl, { width: 600 })}
                        alt={prompt.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}

                    {/* Top Controls */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                      <button
                        onClick={(e) => handleRemovePrompt(prompt.id, prompt.title, e)}
                        title="Saqlanganlardan oʻchirish"
                        className="p-1.5 rounded-xl bg-slate-950/80 hover:bg-rose-950/90 text-slate-300 hover:text-rose-400 border border-slate-700/60 hover:border-rose-800 backdrop-blur-md transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border backdrop-blur-md ${getModelBadgeColor(
                          prompt.aiModel
                        )}`}
                      >
                        {prompt.aiModel}
                      </span>
                    </div>

                    {/* Floating One-Click Copy Button */}
                    <button
                      onClick={(e) => handleCopyPrompt(prompt, e)}
                      title="Nusxalash"
                      className={`absolute bottom-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 backdrop-blur-md shadow-lg ${
                        copiedPromptId === prompt.id
                          ? 'bg-emerald-600 text-white scale-105 shadow-emerald-500/40'
                          : 'bg-purple-600/90 text-white hover:bg-purple-500 hover:scale-105 active:scale-95 shadow-purple-600/40'
                      }`}
                    >
                      {copiedPromptId === prompt.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Nusxalandi!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-white" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  </div>

                  {/* Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="font-bold text-sm text-slate-100 group-hover:text-purple-300 transition line-clamp-1">
                        {prompt.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono line-clamp-2 mt-1 leading-relaxed bg-slate-950/50 p-2 rounded-lg border border-slate-800/60">
                        {prompt.promptText}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 font-medium">
                      <span>{prompt.category?.name || 'General AI'}</span>
                      <span className="text-purple-400 group-hover:underline">Batafsil koʻrish &rarr;</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Prompt Detail Modal */}
      <PromptDetailModal
        prompt={activeModalPrompt}
        onClose={() => setActiveModalPrompt(null)}
        onShowToast={showToast}
      />
    </div>
  );
}
