import { Prompt, Category, PageResponse, ContentType } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Fallback high-quality curated AI media prompts to guarantee instant demo functionality
export const MOCK_PROMPTS: Prompt[] = [
  {
    id: 1,
    title: "Cyberpunk Geisha in Neon Rain",
    promptText: "Cyberpunk geisha portrait standing under torrential acid rain, vibrant neon signs reflecting in puddles, translucent holographic umbrella, intricate mechanical kimono with glowing fiber optics, hyperdetailed skin texture, volumetric smoke, cinematic 8k, photorealistic --ar 16:9 --v 6.0 --style raw",
    negativePrompt: "blurry, low quality, deformed hands, extra fingers, cartoon, 3d render",
    aiModel: "Midjourney v6",
    contentType: "PHOTO",
    mediaUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop",
    aspectRatio: "16:9",
    copyCount: 1420,
    viewCount: 6850,
    isFeatured: true,
    category: { id: 1, name: "Photorealistic", slug: "photorealistic" },
    tags: [{ id: 1, name: "cyberpunk", slug: "cyberpunk" }, { id: 2, name: "portrait", slug: "portrait" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Liquid Gold Cheetah Fluid Motion",
    promptText: "A majestic cheetah made of liquid chrome and molten gold sprinting at lightning speed across obsidian desert dunes, high-speed fluid dynamics, slow-motion particle spray, camera tracking forward, hyper-realistic physics, cinematic lighting, 60fps",
    negativePrompt: "choppy, static, low framerate, artifacts, glitch",
    aiModel: "Runway Gen-3",
    contentType: "VIDEO",
    mediaUrl: "https://res.cloudinary.com/demo/video/upload/q_auto/cld_sample_video.mp4",
    aspectRatio: "16:9",
    copyCount: 2310,
    viewCount: 11400,
    isFeatured: true,
    category: { id: 6, name: "AI Video & Motion", slug: "ai-video-motion" },
    tags: [{ id: 3, name: "motion", slug: "motion" }, { id: 4, name: "cinematic", slug: "cinematic" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Ethereal Forest Solitary Explorer",
    promptText: "A solitary astronaut walking through a bioluminescent alien forest, giant towering crystalline trees emitting soft cyan and ultraviolet light, atmospheric mist, dust motes floating in light rays, Kodak Portra 800 tone, shallow depth of field --ar 9:16 --v 6.0",
    negativePrompt: "oversaturated, plastic, anime, amateurish",
    aiModel: "Flux.1",
    contentType: "PHOTO",
    mediaUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    aspectRatio: "9:16",
    copyCount: 980,
    viewCount: 4200,
    isFeatured: true,
    category: { id: 2, name: "Cinematic", slug: "cinematic" },
    tags: [{ id: 5, name: "space", slug: "space" }, { id: 6, name: "fantasy", slug: "fantasy" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Futuristic Solarpunk Floating City",
    promptText: "Sweeping aerial cinematic shot of an utopian solarpunk city floating in emerald clouds, waterfalls cascading into the abyss, lush vertical gardens wrapping around curved glass skyscrapers, drone camera swooping between bridges, soft morning sunrise glow",
    negativePrompt: "dark, dystopian, noisy, jittery motion",
    aiModel: "Luma Dream Machine",
    contentType: "VIDEO",
    mediaUrl: "https://res.cloudinary.com/demo/video/upload/q_auto/cld_sample_video.mp4",
    aspectRatio: "16:9",
    copyCount: 1890,
    viewCount: 8900,
    isFeatured: true,
    category: { id: 6, name: "AI Video & Motion", slug: "ai-video-motion" },
    tags: [{ id: 7, name: "solarpunk", slug: "solarpunk" }, { id: 8, name: "drone", slug: "drone" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    title: "Samurai Mecha Warrior in Shinjuku",
    promptText: "Massive Japanese mecha samurai kneeling amidst glowing neon holographic billboards in future Tokyo, detailed worn battle armor with katana drawn, sparks flying from damaged shoulder plating, dramatic anamorphic lens flare, photorealistic cgi render --ar 4:5",
    negativePrompt: "flat colors, low detail, blurry",
    aiModel: "Midjourney v6",
    contentType: "PHOTO",
    mediaUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1200&auto=format&fit=crop",
    aspectRatio: "4:5",
    copyCount: 3120,
    viewCount: 14500,
    isFeatured: true,
    category: { id: 3, name: "Anime & Concept", slug: "anime-concept" },
    tags: [{ id: 9, name: "mecha", slug: "mecha" }, { id: 10, name: "tokyo", slug: "tokyo" }],
    createdAt: new Date().toISOString(),
  },
  {
    id: 6,
    title: "Minimalist Brutalist Concrete Sanctuary",
    promptText: "Modern architectural interior of a minimalist brutalist villa overlooking the ocean, raw textured concrete walls, light beams cutting through ceiling skylight, monolithic black marble pool, warm beige linen furniture, architectural digest photography --ar 16:9",
    negativePrompt: "cluttered, dirty, oversaturated, unrealistic",
    aiModel: "Flux.1",
    contentType: "PHOTO",
    mediaUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    aspectRatio: "16:9",
    copyCount: 840,
    viewCount: 3900,
    isFeatured: false,
    category: { id: 4, name: "Architecture", slug: "architecture" },
    tags: [{ id: 11, name: "interior", slug: "interior" }, { id: 12, name: "minimalism", slug: "minimalism" }],
    createdAt: new Date().toISOString(),
  }
];

export async function fetchPrompts(params: {
  contentType?: 'PHOTO' | 'VIDEO';
  sort?: 'trending' | 'top' | 'latest';
  search?: string;
  category?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<Prompt>> {
  try {
    const queryParams = new URLSearchParams();
    if (params.contentType) queryParams.set('contentType', params.contentType);
    if (params.sort) queryParams.set('sort', params.sort);
    if (params.search) queryParams.set('query', params.search);
    if (params.category) queryParams.set('category', params.category);
    queryParams.set('page', (params.page || 0).toString());
    queryParams.set('size', (params.size || 20).toString());

    const res = await fetch(`${API_BASE_URL}/public/prompts?${queryParams.toString()}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    // Graceful fallback to client curated mock data if backend is offline or starting up
    console.warn('Backend API connection warning, utilizing high-quality fallback prompts', err);

    let filtered = [...MOCK_PROMPTS];

    if (params.contentType) {
      filtered = filtered.filter((p) => p.contentType === params.contentType);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.promptText.toLowerCase().includes(q) ||
          p.aiModel.toLowerCase().includes(q)
      );
    }
    if (params.sort === 'top') {
      filtered.sort((a, b) => b.copyCount - a.copyCount);
    } else if (params.sort === 'trending') {
      filtered.sort((a, b) => b.copyCount * 2 + b.viewCount - (a.copyCount * 2 + a.viewCount));
    }

    return {
      content: filtered,
      totalElements: filtered.length,
      totalPages: 1,
      size: filtered.length,
      number: 0,
      first: true,
      last: true,
    };
  }
}

export async function incrementCopyCount(promptId: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/public/prompts/${promptId}/copy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return res.ok;
  } catch (err) {
    console.warn('Failed to notify backend about copy event', err);
    return false;
  }
}

export async function fetchPromptById(id: number | string): Promise<Prompt | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/public/prompts/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      const found = MOCK_PROMPTS.find((p) => p.id.toString() === id.toString());
      return found || null;
    }

    return await res.json();
  } catch (err) {
    console.warn('API error fetching prompt by id, falling back to mock prompts', err);
    const found = MOCK_PROMPTS.find((p) => p.id.toString() === id.toString());
    return found || null;
  }
}

export interface SmartSearchResponse {
  originalQuery: string;
  optimizedQuery: string;
  aiModel: string;
  category: string;
  suggestedKeywords: string[];
}

export interface EnhancePromptResponse {
  originalPrompt: string;
  enhancedPrompt: string;
  aiModel: string;
  suggestedParameters: string;
}

export async function smartSearchQuery(query: string): Promise<SmartSearchResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/smart-search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) throw new Error('Smart search request failed');
    return await res.json();
  } catch (err) {
    console.warn('Smart search API fallback:', err);
    return {
      originalQuery: query,
      optimizedQuery: query,
      aiModel: 'All',
      category: 'All',
      suggestedKeywords: ['AI Art', '4K', 'Cinematic'],
    };
  }
}

export async function enhancePromptText(prompt: string, aiModel?: string): Promise<EnhancePromptResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/enhance-prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, aiModel: aiModel || 'Midjourney v6' }),
    });
    if (!res.ok) throw new Error('Enhance prompt request failed');
    return await res.json();
  } catch (err) {
    console.warn('Enhance prompt API fallback:', err);
    return {
      originalPrompt: prompt,
      enhancedPrompt: `${prompt}, cinematic lighting, hyper-detailed, octane render, 8k resolution --ar 16:9 --v 6.0`,
      aiModel: aiModel || 'Midjourney v6',
      suggestedParameters: '--ar 16:9 --v 6.0',
    };
  }
}
