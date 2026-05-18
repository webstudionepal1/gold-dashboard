const LEGACY_PREFIXES = [
  /^https?:\/\/[^/]+\//,
  /^\/ridisidi\//,
];

/**
 * Display URL for <img src> and media players.
 * Supports Cloudinary HTTPS URLs and legacy local /uploads/ paths.
 */
export function resolveMediaUrl(path?: string | null): string {
  if (!path || path === "null" || path === "undefined") {
    return "/no-image.png";
  }

  const url = String(path).trim();

  if (url.startsWith("http://") || url.startsWith("https://")) {
    if (/res\.cloudinary\.com/i.test(url)) {
      return url;
    }
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes("cloudinary.com")) {
        return url;
      }
      return parsed.pathname.startsWith("/") ? parsed.pathname : `/${parsed.pathname}`;
    } catch {
      return url;
    }
  }

  let local = url;
  for (const re of LEGACY_PREFIXES) {
    local = local.replace(re, "/");
  }

  if (!local.startsWith("/")) {
    local = local.startsWith("uploads/") ? `/${local}` : `/uploads/${local}`;
  }

  return local;
}

/** Value to persist in the database */
export function toStoragePath(path: string): string {
  if (!path) return "";
  const trimmed = path.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return resolveMediaUrl(trimmed);
}

export function resolveMediaUrls(paths?: (string | null)[]): string[] {
  if (!paths?.length) return [];
  return paths.map((p) => resolveMediaUrl(p)).filter(Boolean);
}
