'use client';

import { Prompt } from '@/types';

export interface UserProfile {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  provider?: string;
  accessToken?: string;
}

export interface UserData {
  savedPrompts: Prompt[];
  copiedCount: number;
  likedPromptIds: number[];
}

export const USER_STORAGE_KEY = 'promptxub_user';

export function getActiveUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getDataKey(user: UserProfile | null): string {
  const id = user?.email || user?.id || 'guest';
  return `promptxub_library_${id.replace(/[^a-zA-Z0-9_]/g, '_')}`;
}

export function getUserData(user: UserProfile | null): UserData {
  if (typeof window === 'undefined') {
    return { savedPrompts: [], copiedCount: 0, likedPromptIds: [] };
  }
  try {
    const key = getDataKey(user);
    const raw = localStorage.getItem(key);
    if (!raw) {
      return { savedPrompts: [], copiedCount: 0, likedPromptIds: [] };
    }
    const parsed = JSON.parse(raw);
    return {
      savedPrompts: Array.isArray(parsed.savedPrompts) ? parsed.savedPrompts : [],
      copiedCount: typeof parsed.copiedCount === 'number' ? parsed.copiedCount : 0,
      likedPromptIds: Array.isArray(parsed.likedPromptIds) ? parsed.likedPromptIds : [],
    };
  } catch {
    return { savedPrompts: [], copiedCount: 0, likedPromptIds: [] };
  }
}

function saveUserData(user: UserProfile | null, data: UserData) {
  if (typeof window === 'undefined') return;
  try {
    const key = getDataKey(user);
    localStorage.setItem(key, JSON.stringify(data));
    // Notify other components
    window.dispatchEvent(new CustomEvent('promptxub_library_updated'));
  } catch (e) {
    console.error('Failed to save user data:', e);
  }
}

export function isPromptSaved(user: UserProfile | null, promptId: number): boolean {
  const data = getUserData(user);
  return data.savedPrompts.some((p) => p.id === promptId);
}

export function toggleSavePrompt(user: UserProfile | null, prompt: Prompt): boolean {
  const data = getUserData(user);
  const exists = data.savedPrompts.some((p) => p.id === prompt.id);
  let updatedPrompts: Prompt[];

  if (exists) {
    updatedPrompts = data.savedPrompts.filter((p) => p.id !== prompt.id);
  } else {
    updatedPrompts = [prompt, ...data.savedPrompts];
  }

  saveUserData(user, {
    ...data,
    savedPrompts: updatedPrompts,
  });

  return !exists; // returns true if now saved, false if unsaved
}

export function removeSavedPrompt(user: UserProfile | null, promptId: number): void {
  const data = getUserData(user);
  const updatedPrompts = data.savedPrompts.filter((p) => p.id !== promptId);
  saveUserData(user, {
    ...data,
    savedPrompts: updatedPrompts,
  });
}

export function recordUserCopy(user: UserProfile | null, _promptId?: number): number {
  const data = getUserData(user);
  const updatedCount = data.copiedCount + 1;
  saveUserData(user, {
    ...data,
    copiedCount: updatedCount,
  });
  return updatedCount;
}

export function isPromptLiked(user: UserProfile | null, promptId: number): boolean {
  const data = getUserData(user);
  return data.likedPromptIds.includes(promptId);
}

export function toggleLikePrompt(user: UserProfile | null, promptId: number): boolean {
  const data = getUserData(user);
  const isLiked = data.likedPromptIds.includes(promptId);
  const updatedLikes = isLiked
    ? data.likedPromptIds.filter((id) => id !== promptId)
    : [...data.likedPromptIds, promptId];

  saveUserData(user, {
    ...data,
    likedPromptIds: updatedLikes,
  });

  return !isLiked;
}
