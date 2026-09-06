import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { fetchPromptById } from '@/lib/api';
import { ShareButton } from '@/components/ShareButton';
import { getImageKitWatermarkUrl } from '@/lib/imagekit';
import { ArrowLeft, Sparkles, Sliders, Flame, Eye, Copy, Download, Layers, Film, Camera } from 'lucide-react';
import { formatCompactNumber } from '@/lib/utils';

interface PageProps {
  params: { id: string };
}

// Dynamic OpenGraph / Twitter social media metadata generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const prompt = await fetchPromptById(params.id);

  if (!prompt) {
    return {
      title: 'Prompt Not Found - AI Prompt | PromptXub',
      description: 'The requested AI prompt could not be found on PromptXub.',
    };
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://promptxub.uz').replace(/\/+$/, '');
  const title = `${prompt.title} - AI Prompt | PromptXub`;
  const description = `${prompt.promptText.substring(0, 140)}... (${prompt.aiModel}${prompt.category ? `, ${prompt.category.name}` : ''})`;
  const shareUrl = `${siteUrl}/prompt/${prompt.id}`;

  const keywords = [
    prompt.aiModel,
    prompt.category?.name || 'AI Showcase',
    ...(prompt.tags?.map((t) => t.name) || []),
    'AI Prompts',
    'Midjourney',
    'Flux.1',
    'Runway Gen-3',
    'PromptXub',
  ];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: shareUrl,
      siteName: 'PromptXub AI Showcase',
      type: prompt.contentType === 'VIDEO' ? 'video.other' : 'website',
      images: [
        {
          url: prompt.mediaUrl,
          width: 1200,
          height: 630,
          alt: prompt.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [prompt.mediaUrl],
    },
  };
}

export default async function PromptDetailPage({ params }: PageProps) {
  const prompt = await fetchPromptById(params.id);

  if (!prompt) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 rounded-full bg-slate-900 border border-slate-800 mb-4">
          <Sparkles className="w-8 h-8 text-cyan-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Prompt Not Found</h1>
        <p className="text-slate-400 text-sm max-w-md mb-6">
          The AI prompt you are looking for does not exist or has been removed from PromptXub.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-500 text-white transition shadow-lg shadow-purple-600/30 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Showcase Feed</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 selection:bg-purple-500 selection:text-white flex flex-col">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0F172A]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition group"
          >
            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-purple-500/50 transition">
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
            </div>
            <span>Back to Showcase</span>
          </Link>

          <div className="flex items-center gap-3">
            <ShareButton
              promptId={prompt.id}
              title={prompt.title}
              promptText={prompt.promptText}
              variant="button"
            />
          </div>
        </div>
      </header>

      {/* Main Content View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          
          {/* Left Column: Media Renderer */}
          <div className="w-full lg:w-1/2 bg-black flex items-center justify-center relative min-h-[360px] lg:min-h-[600px] overflow-hidden">
            {prompt.contentType === 'VIDEO' ? (
              <video
                src={prompt.mediaUrl}
                poster={getImageKitWatermarkUrl(prompt.thumbnailUrl || prompt.mediaUrl)}
                controls
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full max-h-[75vh] object-contain"
              />
            ) : (
              <img
                src={getImageKitWatermarkUrl(prompt.mediaUrl)}
                alt={prompt.title}
                className="w-full h-full max-h-[75vh] object-contain"
              />
            )}

            {/* Resolution Link */}
            <a
              href={prompt.mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-xs font-semibold text-cyan-300 border border-slate-700/80 backdrop-blur-md flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Full Resolution</span>
            </a>
          </div>

          {/* Right Column: Prompt Details & Command Panel */}
          <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Badges & Meta */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-950/80 text-purple-300 border border-purple-800">
                    {prompt.aiModel}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                    {prompt.contentType}
                  </span>
                  {prompt.aspectRatio && (
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {prompt.aspectRatio}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {prompt.title}
                </h1>
              </div>

              {/* Prompt Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Prompt Command
                  </span>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed select-all shadow-inner">
                  {prompt.promptText}
                </div>
              </div>

              {/* Negative Prompt */}
              {prompt.negativePrompt && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-4 h-4" /> Negative Prompt
                  </span>
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 font-mono text-xs text-slate-400 select-all">
                    {prompt.negativePrompt}
                  </div>
                </div>
              )}

              {/* Metadata Info & Tags */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5">Category</span>
                  <span className="font-semibold text-slate-200">{prompt.category?.name || 'General AI'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Total Copies</span>
                  <span className="font-semibold text-purple-400 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    {formatCompactNumber(prompt.copyCount)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Impressions</span>
                  <span className="font-semibold text-cyan-400 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    {formatCompactNumber(prompt.viewCount)}
                  </span>
                </div>
              </div>

              {/* Tags */}
              {prompt.tags && prompt.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map((tag) => (
                    <span
                      key={tag.slug}
                      className="px-3 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60 text-xs font-medium"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-3">
              <ShareButton
                promptId={prompt.id}
                title={prompt.title}
                promptText={prompt.promptText}
                variant="button"
                className="w-full sm:w-auto py-3 px-5 justify-center"
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
