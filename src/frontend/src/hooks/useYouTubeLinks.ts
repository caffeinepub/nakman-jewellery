/**
 * Frontend-only localStorage store for YouTube video URLs per product.
 * Keys: { [productId]: youtubeUrl }
 * Stored as JSON in localStorage under "nakman_youtube_links"
 */

const STORAGE_KEY = "nakman_youtube_links";

function readMap(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

function writeMap(map: Record<string, string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getYouTubeUrl(productId: string): string {
  return readMap()[productId] ?? "";
}

export function setYouTubeUrl(productId: string, url: string): void {
  const map = readMap();
  if (url.trim()) {
    map[productId] = url.trim();
  } else {
    delete map[productId];
  }
  writeMap(map);
}

export function getAllYouTubeLinks(): Record<string, string> {
  return readMap();
}

/**
 * Convert any YouTube URL format to a standard embed URL.
 * Handles:
 *   https://www.youtube.com/watch?v=VIDEO_ID
 *   https://youtu.be/VIDEO_ID
 *   https://www.youtube.com/embed/VIDEO_ID
 *   https://www.youtube.com/shorts/VIDEO_ID
 */
export function toYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    let videoId: string | null = null;

    if (u.hostname.includes("youtu.be")) {
      videoId = u.pathname.slice(1).split("?")[0];
    } else if (
      u.hostname.includes("youtube.com") ||
      u.hostname.includes("youtube-nocookie.com")
    ) {
      if (u.pathname.startsWith("/embed/")) {
        // Already an embed URL — just normalize it
        videoId = u.pathname.replace("/embed/", "").split("?")[0];
      } else if (u.pathname.startsWith("/shorts/")) {
        videoId = u.pathname.replace("/shorts/", "").split("?")[0];
      } else {
        videoId = u.searchParams.get("v");
      }
    }

    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  } catch {
    return null;
  }
}

/**
 * Extract a watch URL from any YouTube link (for "Subscribe" / "Open" button).
 */
export function toYouTubeWatchUrl(url: string): string {
  const embedUrl = toYouTubeEmbedUrl(url);
  if (!embedUrl) return url;
  try {
    const u = new URL(embedUrl);
    const videoId = u.pathname.replace("/embed/", "").split("?")[0];
    return `https://www.youtube.com/watch?v=${videoId}`;
  } catch {
    return url;
  }
}
