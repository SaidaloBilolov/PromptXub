export type ContentType = 'PHOTO' | 'VIDEO';

export interface AdminStats {
  totalPrompts: number;
  totalCopies: number;
  totalViews: number;
  totalPhotos: number;
  totalVideos: number;
  totalSearches: number;
  topCopiedPrompts: {
    id: number;
    title: string;
    aiModel: string;
    contentType: ContentType;
    copyCount: number;
    viewCount?: number;
    mediaUrl: string;
  }[];
  popularQueries: {
    query: string;
    count: number;
  }[];
}

export interface PromptFormData {
  title: string;
  promptText: string;
  negativePrompt?: string;
  aiModel: string;
  contentType: ContentType;
  aspectRatio: string;
  categorySlug: string;
  tags: string[];
  mediaFile?: File;
}
