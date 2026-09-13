import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { fetchPromptById, fetchPrompts } from '@/lib/api';
import { PromptDetailView } from '@/components/PromptDetailView';
import { getOptimizedMediaUrl } from '@/lib/imagekit';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Prompt } from '@/types';

interface PageProps {
  params: { id: string };
}

// Enable Incremental Static Regeneration (ISR): cached at Edge CDN for 60 seconds
export const revalidate = 60;

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
          url: getOptimizedMediaUrl(prompt.mediaUrl, { width: 1200 }),
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
      images: [getOptimizedMediaUrl(prompt.mediaUrl, { width: 1200 })],
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

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://promptxub.uz').replace(/\/+$/, '');
  const promptUrl = `${siteUrl}/prompt/${prompt.id}`;

  // Fetch recommended prompts (prioritizing same category, then trending)
  let recommendedPrompts: Prompt[] = [];
  try {
    const recRes = await fetchPrompts({
      category: prompt.category?.slug,
      size: 8,
      sort: 'trending',
    });
    recommendedPrompts = (recRes.content || [])
      .filter((p) => p.id.toString() !== prompt.id.toString())
      .slice(0, 6);

    // If category has few prompts, backfill with general trending prompts
    if (recommendedPrompts.length < 4) {
      const generalRes = await fetchPrompts({
        size: 8,
        sort: 'trending',
      });
      const extra = (generalRes.content || []).filter(
        (p) => p.id.toString() !== prompt.id.toString() && !recommendedPrompts.some((r) => r.id === p.id)
      );
      recommendedPrompts = [...recommendedPrompts, ...extra].slice(0, 6);
    }
  } catch (err) {
    console.warn('Error fetching recommendations for prompt detail page', err);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['CreativeWork', prompt.contentType === 'VIDEO' ? 'VideoObject' : 'ImageObject'],
    name: prompt.title,
    description: prompt.promptText,
    url: promptUrl,
    contentUrl: prompt.mediaUrl,
    thumbnailUrl: getOptimizedMediaUrl(prompt.thumbnailUrl || prompt.mediaUrl, { width: 800 }),
    dateCreated: prompt.createdAt,
    creator: {
      '@type': 'Organization',
      name: 'PromptXub AI Platform',
      url: siteUrl,
    },
    genre: prompt.category?.name || 'AI Art & Prompts',
    keywords: [prompt.aiModel, ...(prompt.tags?.map((t) => t.name) || [])].join(', '),
    interactionStatistic: [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/WatchAction',
        userInteractionCount: prompt.viewCount,
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/ShareAction',
        userInteractionCount: prompt.copyCount,
      },
    ],
  };

  return (
    <>
      {/* Schema.org JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Interactive Prompt Detail View with Mobile Action Bar & Recommendations */}
      <PromptDetailView
        prompt={prompt}
        recommendedPrompts={recommendedPrompts}
        siteUrl={siteUrl}
      />
    </>
  );
}
