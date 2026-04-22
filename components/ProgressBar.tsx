"use client";

import { useMemo } from "react";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  buffered: number;
  onSeek: (time: number) => void;
}

function formatTime(timeInSeconds: number): string {
  if (!Number.isFinite(timeInSeconds)) {
    return "00:00";
  }

  const total = Math.floor(timeInSeconds);
  const mins = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const secs = (total % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

export function ProgressBar({ currentTime, duration, buffered, onSeek }: ProgressBarProps) {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;

  const currentPercent = useMemo(
    () => (safeDuration ? Math.min((currentTime / safeDuration) * 100, 100) : 0),
    [currentTime, safeDuration],
  );

  const bufferedPercent = useMemo(
    () => (safeDuration ? Math.min((buffered / safeDuration) * 100, 100) : 0),
    [buffered, safeDuration],
  );

  return (
    <div className="space-y-2">
      <div className="relative h-2 rounded-full bg-slate-800">
        <div className="absolute h-2 rounded-full bg-slate-600" style={{ width: `${bufferedPercent}%` }} />
        <div className="absolute h-2 rounded-full bg-sky-500" style={{ width: `${currentPercent}%` }} />
        <input
          className="absolute inset-0 h-2 w-full cursor-pointer appearance-none bg-transparent"
          type="range"
          min={0}
          max={safeDuration || 0}
          step={0.1}
          value={Math.min(currentTime, safeDuration || 0)}
          onChange={(event) => onSeek(Number(event.target.value))}
          aria-label="Seek video timeline"
        />
      </div>
      <div className="flex justify-between text-xs text-slate-300">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
