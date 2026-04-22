import { VideoMetadata } from "./types";

const GOOGLE_DRIVE_HOSTS = new Set(["drive.google.com", "www.drive.google.com"]);
const DRIVE_ID_REGEX = /^[a-zA-Z0-9_-]{10,}$/;

export function extractVideoId(url: string): string | null {
  if (!url?.trim()) {
    return null;
  }

  try {
    const parsed = new URL(url.trim());

    if (!GOOGLE_DRIVE_HOSTS.has(parsed.hostname)) {
      return null;
    }

    const pathMatch = parsed.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (pathMatch?.[1]) {
      return pathMatch[1];
    }

    const queryId = parsed.searchParams.get("id");
    if (queryId) {
      return queryId;
    }

    const ucMatch = parsed.pathname.match(/\/uc(?:\/u\/\d+)?/);
    if (ucMatch) {
      const altQueryId = parsed.searchParams.get("id");
      if (altQueryId) {
        return altQueryId;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function getStreamingUrl(videoId: string): string {
  return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(videoId)}`;
}

export function parseGoogleDriveUrl(url: string): { videoId: string; streamingUrl: string } | null {
  const videoId = extractVideoId(url);

  if (!videoId || !DRIVE_ID_REGEX.test(videoId)) {
    return null;
  }

  return {
    videoId,
    streamingUrl: getStreamingUrl(videoId),
  };
}

export async function getVideoMetadata(videoId: string): Promise<VideoMetadata> {
  return {
    title: `Google Drive Video ${videoId.slice(0, 8)}`,
    thumbnail: `https://drive.google.com/thumbnail?id=${encodeURIComponent(videoId)}&sz=w1000`,
  };
}
