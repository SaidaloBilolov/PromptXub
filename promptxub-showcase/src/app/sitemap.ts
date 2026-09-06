import { MetadataRoute } from 'next';
import { fetchPrompts, MOCK_PROMPTS } from '@/lib/api';

const DEFAULT_CATEGORIES = [
  { slug: 'photorealistic' },
  { slug: 'cinematic' },
  { slug: 'anime-concept' },
  { slug: 'architecture' },
  { slug: '3d-cgi' },
  { slug: 'ai-video-motion' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://promptxub.uz').replace(/\/+$/, '');

  // 1. Fetch prompts from API (with fallback to mock prompts if backend is unavailable)
  let prompts = MOCK_PROMPTS;
  try {
    const data = await fetchPrompts({ size: 1000 });
    if (data && data.content && data.content.length > 0) {
      prompts = data.content;
    }
  } catch (err) {
    console.warn('Sitemap generator: Failed to fetch live API prompts, using mock prompts', err);
  }

  // 2. Base homepage route
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // 3. Dynamic Category routes
  DEFAULT_CATEGORIES.forEach((cat) => {
    routes.push({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // 4. Dynamic Prompt detail routes
  prompts.forEach((prompt) => {
    routes.push({
      url: `${baseUrl}/prompt/${prompt.id}`,
      lastModified: prompt.createdAt ? new Date(prompt.createdAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });

  return routes;
}
