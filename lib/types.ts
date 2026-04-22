export interface Video {
  id: string;
  title: string;
  url: string;
  driveId: string;
  duration?: number;
  thumbnail?: string;
  addedAt: number;
}

export interface Playlist {
  videos: Video[];
  currentIndex: number;
  lastUpdated: number;
}

export interface VideoMetadata {
  title: string;
  duration?: number;
  thumbnail?: string;
}
