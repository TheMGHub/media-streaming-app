import { DEFAULT_PLAYLIST, PLAYLIST_STORAGE_KEY } from "./constants";
import { Playlist, Video } from "./types";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function savePlaylist(playlist: Playlist): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(playlist));
}

export function loadPlaylist(): Playlist {
  if (!canUseStorage()) {
    return { ...DEFAULT_PLAYLIST };
  }

  try {
    const raw = window.localStorage.getItem(PLAYLIST_STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_PLAYLIST };
    }

    const parsed = JSON.parse(raw) as Playlist;

    if (!Array.isArray(parsed.videos)) {
      return { ...DEFAULT_PLAYLIST };
    }

    return {
      videos: parsed.videos,
      currentIndex: Math.max(0, Math.min(parsed.currentIndex ?? 0, parsed.videos.length - 1)),
      lastUpdated: parsed.lastUpdated ?? Date.now(),
    };
  } catch {
    return { ...DEFAULT_PLAYLIST };
  }
}

export function getPlaylist(): Playlist {
  return loadPlaylist();
}

export function addVideoToPlaylist(video: Video): Playlist {
  const current = loadPlaylist();
  const updated: Playlist = {
    ...current,
    videos: [...current.videos, video],
    currentIndex: current.videos.length === 0 ? 0 : current.currentIndex,
    lastUpdated: Date.now(),
  };

  savePlaylist(updated);
  return updated;
}

export function removeVideoFromPlaylist(id: string): Playlist {
  const current = loadPlaylist();
  const nextVideos = current.videos.filter((video) => video.id !== id);
  const currentIndex = Math.max(0, Math.min(current.currentIndex, nextVideos.length - 1));

  const updated: Playlist = {
    videos: nextVideos,
    currentIndex,
    lastUpdated: Date.now(),
  };

  savePlaylist(updated);
  return updated;
}

export function clearPlaylist(): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(PLAYLIST_STORAGE_KEY);
}
