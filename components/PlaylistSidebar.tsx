"use client";

import { Trash2 } from "lucide-react";
import { Video } from "@/lib/types";

interface PlaylistSidebarProps {
  videos: Video[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onRemove: (videoId: string) => void;
}

function formatTime(duration?: number): string {
  if (!duration) {
    return "--:--";
  }

  const mins = Math.floor(duration / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(duration % 60)
    .toString()
    .padStart(2, "0");

  return `${mins}:${secs}`;
}

export function PlaylistSidebar({ videos, currentIndex, onSelect, onRemove }: PlaylistSidebarProps) {
  return (
    <aside className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-4 lg:w-80" aria-label="Playlist">
      <h2 className="mb-3 text-lg font-semibold text-slate-50">Playlist</h2>
      {videos.length === 0 ? (
        <p className="text-sm text-slate-400">Add a Google Drive video to start streaming.</p>
      ) : (
        <ul className="space-y-2">
          {videos.map((video, index) => {
            const isActive = index === currentIndex;
            return (
              <li key={video.id}>
                <div
                  className={`flex items-center gap-3 rounded-lg border p-2 transition ${
                    isActive
                      ? "border-sky-500 bg-sky-500/10"
                      : "border-slate-700 bg-slate-950 hover:border-slate-500"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(index)}
                    className="flex-1 text-left"
                    aria-current={isActive ? "true" : undefined}
                  >
                    <p className="line-clamp-1 text-sm font-medium text-slate-100">{video.title}</p>
                    <p className="text-xs text-slate-400">{formatTime(video.duration)}</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(video.id)}
                    className="rounded-md p-1 text-slate-400 transition hover:bg-slate-800 hover:text-rose-400"
                    aria-label={`Remove ${video.title}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
