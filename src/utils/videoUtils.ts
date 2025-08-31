/**
 * Utility functions for video handling and URL generation
 */

// Get the API base URL from environment variables
const getApiBaseUrl = (): string => {
  return (
    import.meta.env.VITE_API_LOCAL_URL || "http://localhost:8080/api/v1/en/"
  );
};

/**
 * Convert a video object path to a streaming URL
 * @param objectPath - The object path from MinIO (e.g., "banner/1234567890-video.mp4")
 * @returns The full streaming URL
 */
export const getVideoStreamUrl = (objectPath: string): string => {
  if (!objectPath) {
    return "";
  }

  // Clean the video path for streaming
  let cleanPath = objectPath;

  // Remove /ridisidi/ prefix if present
  if (cleanPath.startsWith("/ridisidi/")) {
    cleanPath = cleanPath.substring("/ridisidi/".length);
  }

  // Remove leading slash if present
  if (cleanPath.startsWith("/")) {
    cleanPath = cleanPath.slice(1);
  }

  // Construct the streaming URL
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}video/stream/${cleanPath}`;
};

/**
 * Check if a URL is already a streaming URL
 * @param url - The URL to check
 * @returns True if it's already a streaming URL
 */
export const isStreamingUrl = (url: string | null | undefined): boolean => {
  if (!url || typeof url !== "string") {
    return false;
  }
  return url.includes("/video/stream/");
};

/**
 * Convert any video URL/path to a proper streaming URL
 * @param urlOrPath - Either a full URL or an object path
 * @returns The proper streaming URL
 */
export const ensureStreamingUrl = (
  urlOrPath: string | null | undefined
): string => {
  if (!urlOrPath || typeof urlOrPath !== "string") {
    return "";
  }

  // If it's already a streaming URL, return as is
  if (isStreamingUrl(urlOrPath)) {
    return urlOrPath;
  }

  // If it's a full HTTP URL but not a streaming URL, extract the path
  if (urlOrPath.startsWith("http")) {
    try {
      const url = new URL(urlOrPath);
      const pathParts = url.pathname.split("/");
      // Look for common patterns like /banner/, /video/, etc.
      const relevantPathIndex = pathParts.findIndex((part) =>
        ["banner", "video", "uploads"].includes(part)
      );

      if (relevantPathIndex !== -1) {
        const objectPath = pathParts.slice(relevantPathIndex).join("/");
        return getVideoStreamUrl(objectPath);
      }
    } catch (error) {
      console.warn("Failed to parse URL:", urlOrPath, error);
    }
  }

  // Clean the path and convert to streaming URL
  let cleanPath = urlOrPath;

  // Remove /ridisidi/ prefix if present
  if (cleanPath.startsWith("/ridisidi/")) {
    cleanPath = cleanPath.substring("/ridisidi/".length);
  }

  // Remove leading slash if present
  if (cleanPath.startsWith("/")) {
    cleanPath = cleanPath.slice(1);
  }

  // Assume it's an object path and convert to streaming URL
  return getVideoStreamUrl(cleanPath);
};

/**
 * Get video metadata URL from object path
 * @param objectPath - The object path from MinIO
 * @returns The metadata URL
 */
export const getVideoMetadataUrl = (objectPath: string): string => {
  if (!objectPath) {
    return "";
  }

  const cleanPath = objectPath.startsWith("/")
    ? objectPath.slice(1)
    : objectPath;
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}video/metadata/${cleanPath}`;
};

/**
 * Extract object path from a streaming URL
 * @param streamingUrl - The streaming URL
 * @returns The object path
 */
export const extractObjectPath = (
  streamingUrl: string | null | undefined
): string => {
  if (!streamingUrl || typeof streamingUrl !== "string") {
    return "";
  }
  const match = streamingUrl.match(/\/video\/stream\/(.+)$/);
  return match ? match[1] : "";
};

/**
 * Test if a video file exists and is accessible
 * @param objectPath - The object path to test
 * @returns Promise with test result
 */
export const testVideoFile = async (
  objectPath: string
): Promise<{
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}> => {
  try {
    const baseUrl = getApiBaseUrl();
    const testUrl = `${baseUrl}video/test/${objectPath}`;

    const response = await fetch(testUrl);
    const result = await response.json();

    return result;
  } catch (error) {
    return {
      success: false,
      message: "Failed to test video file",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
