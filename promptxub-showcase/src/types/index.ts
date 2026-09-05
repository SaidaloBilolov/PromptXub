export type ContentType = 'PHOTO' | 'VIDEO';

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  displayOrder?: number;
}

export interface Prompt {
  id: number;
  title: string;
  promptText: string;
  negativePrompt?: string;
  aiModel: string;
  contentType: ContentType;
  mediaUrl: string;
  mediaPublicId?: string;
  thumbnailUrl?: string;
  aspectRatio?: string;
  width?: number;
  height?: number;
  duration?: number;
  copyCount: number;
  viewCount: number;
  isFeatured: boolean;
  category?: Category;
  tags?: Tag[];
  createdAt: string;
  updatedAt?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
