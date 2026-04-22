"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ProgressBar } from "@/components/ProgressBar";
import { VideoControls } from "@/components/VideoControls";
import { Video } from "@/lib/types";

interface VideoPlayerProps {
  video: Video | null;
  onEnded: () => void;
}

export function VideoPlayer({ video, onEnded }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const activeVideo = videoRef.current;

    return () => {
      if (activeVideo) {
        activeVideo.pause();
      }
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, []);

  useEffect(() => {
    const activeVideo = videoRef.current;
    if (!activeVideo || !video) {
      return;
    }

    setError(null);
    setIsLoading(true);
    setCurrentTime(0);
    setDuration(0);

    hlsRef.current?.destroy();
    hlsRef.current = null;

    if (video.url.endsWith(".m3u8") && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(video.url);
      hls.attachMedia(activeVideo);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          setError("Failed to stream this HLS video.");
        }
      });
      hlsRef.current = hls;
    } else {
      activeVideo.src = video.url;
    }

    activeVideo
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setError("Playback was blocked. Click Play to start."))
      .finally(() => setIsLoading(false));
  }, [video]);

  useEffect(() => {
    const activeVideo = videoRef.current;
    if (!activeVideo) {
      return;
    }

    const onLoadedMetadata = () => setDuration(activeVideo.duration || 0);
    const onTimeUpdate = () => setCurrentTime(activeVideo.currentTime || 0);
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };
    const onPause = () => setIsPlaying(false);
    const onEndedInternal = () => {
      setIsPlaying(false);
      onEnded();
    };
    const onProgress = () => {
      const buffer = activeVideo.buffered;
      if (buffer.length > 0) {
        setBuffered(buffer.end(buffer.length - 1));
      }
    };
    const onError = () => setError("Unable to load video from this source.");

    activeVideo.addEventListener("loadedmetadata", onLoadedMetadata);
    activeVideo.addEventListener("timeupdate", onTimeUpdate);
    activeVideo.addEventListener("waiting", onWaiting);
    activeVideo.addEventListener("playing", onPlaying);
    activeVideo.addEventListener("pause", onPause);
    activeVideo.addEventListener("ended", onEndedInternal);
    activeVideo.addEventListener("progress", onProgress);
    activeVideo.addEventListener("error", onError);

    return () => {
      activeVideo.removeEventListener("loadedmetadata", onLoadedMetadata);
      activeVideo.removeEventListener("timeupdate", onTimeUpdate);
      activeVideo.removeEventListener("waiting", onWaiting);
      activeVideo.removeEventListener("playing", onPlaying);
      activeVideo.removeEventListener("pause", onPause);
      activeVideo.removeEventListener("ended", onEndedInternal);
      activeVideo.removeEventListener("progress", onProgress);
      activeVideo.removeEventListener("error", onError);
    };
  }, [onEnded]);

  async function togglePlay() {
    const activeVideo = videoRef.current;
    if (!activeVideo) {
      return;
    }

    if (activeVideo.paused) {
      await activeVideo.play();
      setIsPlaying(true);
    } else {
      activeVideo.pause();
      setIsPlaying(false);
    }
  }

  function toggleMute() {
    const activeVideo = videoRef.current;
    if (!activeVideo) {
      return;
    }

    activeVideo.muted = !activeVideo.muted;
    setIsMuted(activeVideo.muted);
  }

  function changeVolume(value: number) {
    const activeVideo = videoRef.current;
    if (!activeVideo) {
      return;
    }

    activeVideo.volume = value;
    activeVideo.muted = value === 0;
    setVolume(value);
    setIsMuted(activeVideo.muted);
  }

  function changeSpeed(value: number) {
    const activeVideo = videoRef.current;
    if (!activeVideo) {
      return;
    }

    activeVideo.playbackRate = value;
    setSpeed(value);
  }

  function seek(time: number) {
    const activeVideo = videoRef.current;
    if (!activeVideo) {
      return;
    }

    const maxSeek = Number.isFinite(activeVideo.duration) && activeVideo.duration > 0 ? activeVideo.duration : time;
    activeVideo.currentTime = Math.max(0, Math.min(time, maxSeek));
  }

  async function toggleFullscreen() {
    if (!containerRef.current) {
      return;
    }

    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
      return;
    }

    await document.exitFullscreen();
    setIsFullscreen(false);
  }

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const activeVideo = videoRef.current;
      if (!activeVideo) {
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();
        if (activeVideo.paused) {
          void activeVideo.play().then(() => setIsPlaying(true));
        } else {
          activeVideo.pause();
          setIsPlaying(false);
        }
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        activeVideo.currentTime = Math.max(activeVideo.currentTime - 10, 0);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        if (Number.isFinite(activeVideo.duration) && activeVideo.duration > 0) {
          activeVideo.currentTime = Math.min(activeVideo.currentTime + 10, activeVideo.duration);
        } else {
          activeVideo.currentTime += 10;
        }
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const subtitle = useMemo(() => {
    if (!video) {
      return "Add a video to begin.";
    }

    return `Drive ID: ${video.driveId}`;
  }, [video]);

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-white">{video?.title ?? "Media Streaming App"}</h1>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </header>

      <div ref={containerRef} className="overflow-hidden rounded-2xl border border-slate-800 bg-black">
        <div className="relative aspect-video">
          <video
            ref={videoRef}
            className="h-full w-full"
            playsInline
            controls={false}
            preload="metadata"
            aria-label={video?.title ?? "Video player"}
          />
          {isLoading ? (
            <div className="absolute inset-0 grid place-items-center bg-black/70">
              <LoadingSpinner />
            </div>
          ) : null}
          {!video ? (
            <div className="absolute inset-0 grid place-items-center bg-black/70 text-sm text-slate-300">
              Paste a public Google Drive video link to start.
            </div>
          ) : null}
        </div>

        <div className="space-y-3 p-4">
          <ProgressBar currentTime={currentTime} duration={duration} buffered={buffered} onSeek={seek} />
          <VideoControls
            isPlaying={isPlaying}
            isMuted={isMuted}
            volume={volume}
            speed={speed}
            isFullscreen={isFullscreen}
            onTogglePlay={() => {
              void togglePlay();
            }}
            onToggleMute={toggleMute}
            onVolumeChange={changeVolume}
            onSpeedChange={changeSpeed}
            onToggleFullscreen={() => {
              void toggleFullscreen();
            }}
          />
        </div>
      </div>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
    </section>
  );
}
