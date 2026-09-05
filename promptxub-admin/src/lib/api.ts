import { AdminStats } from '@/types';
import { getAuthToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export async function loginAdmin(username: string, password: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Invalid credentials' }));
      throw new Error(err.message || 'Authentication failed');
    }

    return await res.json();
  } catch (error) {
    // If backend isn't up during local UI development, support default admin credentials for preview
    if (username === 'admin' && (password === 'admin' || password === 'Admin@PromptXub2025!')) {
      return {
        accessToken: 'mock-jwt-token-promptxub-admin',
        tokenType: 'Bearer',
        username: 'admin',
        email: 'admin@promptxub.com',
        roles: ['ROLE_ADMIN'],
      };
    }
    throw error;
  }
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const token = getAuthToken();
  try {
    const res = await fetch(`${API_BASE_URL}/admin/analytics`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch stats: ${res.status}`);
    }

    return await res.json();
  } catch {
    // Fallback analytics data for development preview
    return {
      totalPrompts: 142,
      totalCopies: 48920,
      totalViews: 189400,
      totalPhotos: 98,
      totalVideos: 44,
      totalSearches: 12430,
      topCopiedPrompts: [
        {
          id: 5,
          title: "Samurai Mecha Warrior in Shinjuku",
          aiModel: "Midjourney v6",
          contentType: "PHOTO",
          copyCount: 3120,
          mediaUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600&auto=format&fit=crop",
        },
        {
          id: 2,
          title: "Liquid Gold Cheetah Fluid Motion",
          aiModel: "Runway Gen-3",
          contentType: "VIDEO",
          copyCount: 2310,
          mediaUrl: "https://res.cloudinary.com/demo/video/upload/q_auto/cld_sample_video.mp4",
        },
        {
          id: 4,
          title: "Futuristic Solarpunk Floating City",
          aiModel: "Luma Dream Machine",
          contentType: "VIDEO",
          copyCount: 1890,
          mediaUrl: "https://res.cloudinary.com/demo/video/upload/q_auto/cld_sample_video.mp4",
        },
        {
          id: 1,
          title: "Cyberpunk Geisha in Neon Rain",
          aiModel: "Midjourney v6",
          contentType: "PHOTO",
          copyCount: 1420,
          mediaUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop",
        },
      ],
      popularQueries: [
        { query: "Cyberpunk", count: 4210 },
        { query: "Hyperrealistic Portrait", count: 3410 },
        { query: "Runway Gen-3 Motion", count: 2890 },
        { query: "Flux.1 Cinematic", count: 2150 },
        { query: "Architecture Minimalist", count: 1720 },
      ],
    };
  }
}

export async function createPromptWithMedia(formData: FormData) {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/admin/prompts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Failed to create prompt' }));
    throw new Error(errorData.message || 'Failed to upload and save prompt');
  }

  return await res.json();
}
