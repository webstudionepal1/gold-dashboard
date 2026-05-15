/**
 * Local media URLs — files live under public/uploads and are served at /uploads/...
 * No Vite env or external MinIO base URL.
 */

const LEGACY_PREFIXES = [
  /^https?:\/\/[^/]+\//,
  /^\/ridisidi\//,
];

/** Display URL for <img src> — always a browser path under public/ */
export function resolveMediaUrl(path?: string | null): string {
  if (!path || path === "null" || path === "undefined") {
    return "/no-image.png";
  }

  let url = String(path).trim();

  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      const parsed = new URL(url);
      url = parsed.pathname;
    } catch {
      return url;
    }
  }

  for (const re of LEGACY_PREFIXES) {
    url = url.replace(re, "/");
  }

  if (!url.startsWith("/")) {
    url = url.startsWith("uploads/") ? `/${url}` : `/uploads/${url}`;
  }

  return url;
}

/** Path to store in database (relative to public) */
export function toStoragePath(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    try {
      return new URL(path).pathname;
    } catch {
      return path;
    }
  }
  return resolveMediaUrl(path);
}

export function resolveMediaUrls(paths?: (string | null)[]): string[] {
  if (!paths?.length) return [];
  return paths.map((p) => resolveMediaUrl(p)).filter(Boolean);
}
