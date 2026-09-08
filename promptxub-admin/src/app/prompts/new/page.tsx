'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminNavbar } from '@/components/AdminNavbar';
import { MediaDropZone } from '@/components/MediaDropZone';
import { ContentType } from '@/types';
import { createPromptWithMedia } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Tag as TagIcon,
  X,
  Plus,
} from 'lucide-react';

export default function NewPromptPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
    }
  }, [router]);

  // Form States
  const [title, setTitle] = useState('');
  const [promptText, setPromptText] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [aiModel, setAiModel] = useState('Midjourney v6');
  const [contentType, setContentType] = useState<ContentType>('PHOTO');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [categorySlug, setCategorySlug] = useState('photorealistic');
  const [displayViewCount, setDisplayViewCount] = useState<number>(0);
  const [displayCopyCount, setDisplayCopyCount] = useState<number>(0);
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  // Tag Chips
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['cinematic', 'portrait']);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const aiModels = [
    'Midjourney v6',
    'Flux.1 Dev',
    'Flux.1 Schnell',
    'Runway Gen-3 Alpha',
    'Luma Dream Machine',
    'Kling AI v1.5',
    'DALL-E 3',
    'Stable Diffusion 3.5',
  ];

  const categories = [
    { name: 'Photorealistic', slug: 'photorealistic' },
    { name: 'Cinematic', slug: 'cinematic' },
    { name: 'Anime & Concept', slug: 'anime-concept' },
    { name: 'Architecture', slug: 'architecture' },
    { name: '3D & CGI', slug: '3d-cgi' },
    { name: 'AI Video & Motion', slug: 'ai-video-motion' },
  ];

  const aspectRatios = ['16:9', '9:16', '1:1', '4:5', '21:9', '3:2'];

  const handleAddTag = () => {
    const cleaned = tagInput.trim().replace(/^#/, '');
    if (cleaned && !tags.includes(cleaned)) {
      setTags([...tags, cleaned]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleFileSelected = (file: File | null, detectedType: ContentType) => {
    setMediaFile(file);
    setContentType(detectedType);
    if (detectedType === 'VIDEO' && aiModel === 'Midjourney v6') {
      setAiModel('Runway Gen-3 Alpha');
      setCategorySlug('ai-video-motion');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!mediaFile) {
      setErrorMsg('Please upload a media file (Photo or Video).');
      return;
    }

    if (!title.trim() || !promptText.trim()) {
      setErrorMsg('Title and Prompt text are required.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', mediaFile);
      formData.append('title', title);
      formData.append('promptText', promptText);
      if (negativePrompt) formData.append('negativePrompt', negativePrompt);
      formData.append('aiModel', aiModel);
      formData.append('contentType', contentType);
      formData.append('aspectRatio', aspectRatio);
      formData.append('categorySlug', categorySlug);
      formData.append('tags', tags.join(','));
      formData.append('displayViewCount', displayViewCount.toString());
      formData.append('displayCopyCount', displayCopyCount.toString());

      await createPromptWithMedia(formData);

      setSuccessMsg('Prompt successfully published to PromptXub!');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1200);
    } catch (err: any) {
      console.error('Upload prompt error:', err);
      setErrorMsg(err.message || 'Failed to publish prompt. Please check backend connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex text-slate-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar
          title="Upload & Publish New AI Prompt"
          subtitle="Add high-quality prompts with ImageKit.io auto-optimization and tagging"
        />

        <main className="p-8 max-w-4xl mx-auto w-full space-y-6">
          
          {/* Status Alerts */}
          {successMsg && (
            <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            
            {/* Step 1: Media Upload Zone */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                1. Media File (Photo or Video) *
              </label>
              <MediaDropZone onFileSelected={handleFileSelected} />
            </div>

            {/* Step 2: Title & AI Model */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Prompt Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cyberpunk Geisha in Neon Rain"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  AI Model Generator *
                </label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition"
                >
                  {aiModels.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 3: Prompt Text Command */}
            <div>
              <label className="block text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Full Prompt Text Command *
              </label>
              <textarea
                required
                rows={4}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Enter exact prompt with parameters (--ar 16:9, --v 6.0, 60fps, camera tracking)..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-sm font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition leading-relaxed"
              />
            </div>

            {/* Negative Prompt */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Negative Prompt (Optional)
              </label>
              <textarea
                rows={2}
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="blurry, distorted, low quality, extra limbs, artifacts..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition"
              />
            </div>

            {/* Category, Content Type, Aspect Ratio */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Category
                </label>
                <select
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Aspect Ratio
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                >
                  {aspectRatios.map((ar) => (
                    <option key={ar} value={ar}>
                      {ar}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Format Type (Media Content)
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value as ContentType)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                >
                  <option value="PHOTO">📷 PHOTO (Image)</option>
                  <option value="VIDEO">🎥 VIDEO (Motion / MP4)</option>
                </select>
              </div>
            </div>

            {/* Initial Display Metrics (Boost) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div>
                <label className="block text-xs font-bold text-cyan-400 mb-1">
                  Initial Display Views (Public Boost)
                </label>
                <input
                  type="number"
                  min="0"
                  value={displayViewCount}
                  onChange={(e) => setDisplayViewCount(parseInt(e.target.value) || 0)}
                  placeholder="e.g. 5000"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Number of views shown to public users (real views add +1 to this)</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-purple-400 mb-1">
                  Initial Display Copies (Public Boost)
                </label>
                <input
                  type="number"
                  min="0"
                  value={displayCopyCount}
                  onChange={(e) => setDisplayCopyCount(parseInt(e.target.value) || 0)}
                  placeholder="e.g. 1200"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-purple-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Number of copies shown to public users (real copies add +1 to this)</span>
              </div>
            </div>

            {/* Tag Chips Input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <TagIcon className="w-3.5 h-3.5" /> Tags & Keywords
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Type tag and press Add..."
                  className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Tag Chips List */}
              <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/80 text-purple-300 border border-purple-800/80"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-purple-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-800/80">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-xl shadow-purple-600/30 transition hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading to ImageKit.io & Saving Prompt...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Publish Prompt to PromptXub</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </main>
      </div>
    </div>
  );
}
