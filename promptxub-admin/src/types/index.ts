export type ContentType = 'PHOTO' | 'VIDEO';

export interface TopCopiedPrompt {
  id: number;
  title: string;
  aiModel: string;
  contentType: ContentType;
  copyCount: number;         // Public Display Copies
  viewCount: number;         // Public Display Views
  realCopyCount?: number;    // Internal Real Copies
  realViewCount?: number;    // Internal Real Views
  conversionRate?: number;   // Real Copies / Real Views * 100%
  mediaUrl: string;
}

export interface ModelConversion {
  model: string;
  realCopies: number;
  realViews: number;
  conversionRate: number;
}

export interface PeakActivity {
  timeSlot: string;
  activityPercentage: number;
  copiesCount: number;
}

export interface DeviceDistribution {
  device: string;
  os: string;
  percentage: number;
  count: number;
}

export interface AdminStats {
  totalPrompts: number;
  totalCopies: number;        // Total Display Copies
  totalViews: number;         // Total Display Views
  totalRealCopies?: number;
  totalRealViews?: number;
  realConversionRatio?: number;
  totalPhotos: number;
  totalVideos: number;
  totalSearches: number;
  topCopiedPrompts: TopCopiedPrompt[];
  popularQueries: {
    query: string;
    count: number;
  }[];
  topConvertingModels?: ModelConversion[];
  peakActivityTimes?: PeakActivity[];
  deviceDistribution?: DeviceDistribution[];
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
