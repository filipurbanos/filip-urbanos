/** Client-safe URL helpers (no Node / Blob SDK imports). */

export function isManagedUploadUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith("/uploads/")) return true;
  try {
    const host = new URL(url).hostname;
    return host.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export function isPlayableMediaUrl(url: string): boolean {
  return (
    url.startsWith("/uploads/") ||
    url.startsWith("/media/") ||
    isManagedUploadUrl(url)
  );
}
