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

export interface UserSummary {
  id: number;
  name: string;
  email: string;
  provider: 'Google' | 'Apple' | 'Email';
  avatarUrl?: string;
  joinedDate: string;
  savedPromptsCount: number;
  enabled: boolean;
}

export interface UserStats {
  totalUsers: number;
  googleUsersCount: number;
  appleUsersCount: number;
  emailUsersCount: number;
  newUsersToday: number;
  usersList: UserSummary[];
}
