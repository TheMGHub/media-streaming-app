"use client";

import { useMemo, useRef, useState } from "react";
import { AddVideoForm } from "@/components/AddVideoForm";
import { PlaylistSidebar } from "@/components/PlaylistSidebar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { DEFAULT_PLAYLIST, PLAYLIST_STORAGE_KEY } from "@/lib/constants";
import { getVideoMetadata, parseGoogleDriveUrl } from "@/lib/googleDriveUtils";
import { savePlaylist } from "@/lib/storageUtils";
import { Playlist, Video } from "@/lib/types";

export default function Home() {
  const fallbackIdCounter = useRef(0);
  const [playlist, setPlaylist] = useState<Playlist>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_PLAYLIST;
    }

    try {
      const raw = window.localStorage.getItem(PLAYLIST_STORAGE_KEY);
      if (!raw) {
        return DEFAULT_PLAYLIST;
      }
      const parsed = JSON.parse(raw) as Playlist;
      if (!Array.isArray(parsed.videos)) {
        return DEFAULT_PLAYLIST;
      }
      return parsed;
    } catch {
      return DEFAULT_PLAYLIST;
    }
  });

  const currentVideo = useMemo(
    () => playlist.videos[playlist.currentIndex] ?? null,
    [playlist.currentIndex, playlist.videos],
  );

  async function handleAddVideo(url: string) {
    const parsed = parseGoogleDriveUrl(url);

    if (!parsed) {
      throw new Error("Invalid Google Drive URL. Use a public share link.");
    }

    const metadata = await getVideoMetadata(parsed.videoId);

    const fallbackId = () => {
      fallbackIdCounter.current += 1;
      return `${Date.now()}-${fallbackIdCounter.current}`;
    };

    const newVideo: Video = {
      id: globalThis.crypto?.randomUUID?.() ?? fallbackId(),
      title: metadata.title,
      url: parsed.streamingUrl,
      driveId: parsed.videoId,
      duration: metadata.duration,
      thumbnail: metadata.thumbnail,
      addedAt: Date.now(),
    };

    setPlaylist((current) => {
      const nextVideos = [...current.videos, newVideo];
      const updated: Playlist = {
        videos: nextVideos,
        currentIndex: nextVideos.length === 1 ? 0 : current.currentIndex,
        lastUpdated: Date.now(),
      };
      savePlaylist(updated);
      return updated;
    });
  }

  function handleSelect(index: number) {
    setPlaylist((current) => {
      const updated = { ...current, currentIndex: index, lastUpdated: Date.now() };
      savePlaylist(updated);
      return updated;
    });
  }

  function handleRemove(videoId: string) {
    setPlaylist((current) => {
      const removingIndex = current.videos.findIndex((video) => video.id === videoId);
      if (removingIndex < 0) {
        return current;
      }

      const nextVideos = current.videos.filter((video) => video.id !== videoId);
      if (nextVideos.length === 0) {
        const updated: Playlist = {
          videos: nextVideos,
          currentIndex: 0,
          lastUpdated: Date.now(),
        };
        savePlaylist(updated);
        return updated;
      }

      const decrementedIndex =
        current.currentIndex > removingIndex ? current.currentIndex - 1 : current.currentIndex;
      const nextIndex = Math.min(decrementedIndex, nextVideos.length - 1);

      const updated: Playlist = {
        videos: nextVideos,
        currentIndex: nextIndex,
        lastUpdated: Date.now(),
      };
      savePlaylist(updated);
      return updated;
    });
  }

  function handleAutoNext() {
    setPlaylist((current) => {
      if (current.currentIndex >= current.videos.length - 1) {
        return current;
      }

      const updated: Playlist = {
        ...current,
        currentIndex: current.currentIndex + 1,
        lastUpdated: Date.now(),
      };
      savePlaylist(updated);
      return updated;
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-slate-100 md:p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row">
        <div className="flex-1 space-y-4">
          <AddVideoForm onAdd={handleAddVideo} />
          <VideoPlayer video={currentVideo} onEnded={handleAutoNext} />
        </div>

        <PlaylistSidebar
          videos={playlist.videos}
          currentIndex={playlist.currentIndex}
          onSelect={handleSelect}
          onRemove={handleRemove}
        />
      </div>
    </main>
  );
}
