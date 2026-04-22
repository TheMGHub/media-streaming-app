import { Playlist } from "./types";

export const PLAYLIST_STORAGE_KEY = "media-streaming-app-playlist";

export const PLAYBACK_SPEEDS = [0.5, 1, 1.5, 2];

export const DEFAULT_PLAYLIST: Playlist = {
  videos: [],
  currentIndex: 0,
  lastUpdated: Date.now(),
};
