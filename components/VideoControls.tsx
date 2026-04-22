"use client";

import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { PLAYBACK_SPEEDS } from "@/lib/constants";

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  speed: number;
  isFullscreen: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onVolumeChange: (value: number) => void;
  onSpeedChange: (value: number) => void;
  onToggleFullscreen: () => void;
}

export function VideoControls({
  isPlaying,
  isMuted,
  volume,
  speed,
  isFullscreen,
  onTogglePlay,
  onToggleMute,
  onVolumeChange,
  onSpeedChange,
  onToggleFullscreen,
}: VideoControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl bg-slate-900/80 p-3 backdrop-blur">
      <button
        type="button"
        onClick={onTogglePlay}
        className="rounded-md bg-sky-500 p-2 text-white transition hover:bg-sky-400"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>

      <button
        type="button"
        onClick={onToggleMute}
        className="rounded-md bg-slate-800 p-2 text-slate-100 transition hover:bg-slate-700"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(event) => onVolumeChange(Number(event.target.value))}
        className="h-2 w-28 cursor-pointer"
        aria-label="Volume"
      />

      <label className="text-xs text-slate-300">
        Speed
        <select
          className="ml-2 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
          value={speed}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
          aria-label="Playback speed"
        >
          {PLAYBACK_SPEEDS.map((option) => (
            <option key={option} value={option}>
              {option}x
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={onToggleFullscreen}
        className="rounded-md bg-slate-800 p-2 text-slate-100 transition hover:bg-slate-700"
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
      </button>

      <span className="ml-auto text-xs text-slate-400">Shortcuts: Space, ←, →</span>
    </div>
  );
}
