import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { apiClient } from "../../../server/utils/ApiGateway";
import UploadProgressBar from "./UploadProgressBar";
import { useUploadProgress } from "../../../hooks/useUploadProgress";
import { ensureStreamingUrl } from "../../../utils/videoUtils";

interface UploadProgress {
  uploadId: string;
  filename: string;
  totalSize: number;
  uploadedSize: number;
  percentage: number;
  currentChunk: number;
  totalChunks: number;
  status: "initializing" | "uploading" | "completed" | "failed" | "paused";
  error?: string;
}

interface VideoUploadFieldProps {
  label?: string;
  value?: File | string | null;
  onChange?: (file: File | null) => void;
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: string) => void;
  disabled?: boolean;
  maxFileSize?: number; // in MB
  existingVideoUrl?: string; // For editing existing banners
}

const VideoUploadField: React.FC<VideoUploadFieldProps> = ({
  label,
  value,
  onChange,
  onUploadComplete,
  onUploadError,
  disabled = false,
  maxFileSize = 200, // 200MB default
  existingVideoUrl,
}) => {
  const {
    progress: uploadProgress,
    setProgress: setUploadProgress,
    metrics,
  } = useUploadProgress();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Clear internal state when value becomes null (form reset)
  useEffect(() => {
    if (value === null) {
      setUploadedUrl(null);
      setPreviewUrl(null);
      setError(null);
      setUploadProgress(null);
    }
  }, [value, setUploadProgress]);

  // Create preview URL when file changes
  useEffect(() => {
    if (value && typeof value !== "string") {
      // For File objects, create a blob URL
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof value === "string") {
      // For string values, ensure they use streaming URLs
      const streamingUrl = ensureStreamingUrl(value);
      setPreviewUrl(streamingUrl);
    } else if (uploadedUrl) {
      // For uploaded URLs, ensure they use streaming URLs
      const streamingUrl = ensureStreamingUrl(uploadedUrl);
      setPreviewUrl(streamingUrl);
    } else if (existingVideoUrl) {
      // For existing video URLs, ensure they use streaming URLs
      const streamingUrl = ensureStreamingUrl(existingVideoUrl);
      setPreviewUrl(streamingUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [value, existingVideoUrl, uploadedUrl]);

  const removeVideo = () => {
    setPreviewUrl(null);
    setUploadedUrl(null);
    if (onChange) {
      onChange(null);
    }
  };

  // Handle file upload
  const handleFileUpload = useCallback(
    async (file: File) => {
      if (disabled) {
        console.log("🚫 Upload blocked - disabled:", disabled);
        return;
      }

      console.log("🚀 Starting file upload:", file.name, "Size:", file.size);
      setError(null);
      setIsUploading(true);
      setUploadedUrl(null);

      try {
        // Validate file size
        const maxSizeBytes = maxFileSize * 1024 * 1024;
        if (file.size > maxSizeBytes) {
          throw new Error(`File size exceeds ${maxFileSize}MB limit`);
        }

        // Validate file type
        const allowedTypes = [
          "video/mp4",
          "video/webm",
          "video/avi",
          "video/mov",
          "video/quicktime",
        ];
        if (!allowedTypes.includes(file.type)) {
          throw new Error(
            "Unsupported file type. Please use MP4, WebM, AVI, or MOV format."
          );
        }

        // Initialize upload session
        console.log("Initializing upload session for:", file.name, file.size);
        const initResponse = await apiClient.post(
          "enhanced-upload/initialize",
          {
            filename: file.name,
            fileSize: file.size,
            mimeType: file.type,
            documentType: "banner",
          }
        );

        console.log("Upload initialization response:", initResponse.data);

        if (!initResponse.data.success) {
          throw new Error(initResponse.data.message);
        }

        const { uploadId, useMultipart, presignedUrls } =
          initResponse.data.data;

        console.log("Upload session created:", {
          uploadId,
          useMultipart,
          urlCount: presignedUrls?.length,
        });

        // Set initial progress to show upload has started
        const totalChunks = useMultipart ? presignedUrls.length : 1;
        setUploadProgress({
          uploadId,
          filename: file.name,
          totalSize: file.size,
          uploadedSize: 0,
          percentage: 0,
          currentChunk: 0,
          totalChunks: totalChunks,
          status: "initializing",
        });

        console.log("About to start upload - useMultipart:", useMultipart);
        console.log("Presigned URLs:", presignedUrls);

        if (useMultipart) {
          console.log("Starting multipart upload with presigned URLs");
          // Handle multipart upload for large files using presigned URLs
          await handlePresignedMultipartUpload(file, uploadId, presignedUrls);
        } else {
          console.log("Starting single file upload with presigned URL");
          // Handle single file upload using presigned URL
          await handlePresignedSingleUpload(file, uploadId, presignedUrls[0]);
        }
      } catch (error) {
        console.error("Video upload error:", error);
        setIsUploading(false);
        setUploadProgress(null);

        let errorMessage = "Upload failed";
        if (error instanceof Error) {
          errorMessage = error.message;
          // Provide more user-friendly error messages for common issues
          if (
            error.message.includes("network") ||
            error.message.includes("timeout")
          ) {
            errorMessage =
              "Network error. Please check your connection and try again.";
          } else if (
            error.message.includes("memory") ||
            error.message.includes("crash")
          ) {
            errorMessage =
              "File too large for browser to handle. Please try a smaller file.";
          }
        }

        setError(errorMessage);
        onUploadError?.(errorMessage);
      }
    },
    [disabled, maxFileSize, onUploadComplete, onUploadError]
  );

  // Handle single file upload using presigned URL
  const handlePresignedSingleUpload = async (
    file: File,
    uploadId: string,
    presignedUrl: string
  ) => {
    try {
      // Update progress to show upload starting
      if (uploadProgress) {
        setUploadProgress({
          ...uploadProgress,
          status: "uploading",
          percentage: 10,
        });
      }

      // Upload directly to MinIO using presigned URL
      const response = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      // Update progress to show upload completing
      if (uploadProgress) {
        setUploadProgress({
          ...uploadProgress,
          percentage: 90,
          uploadedSize: file.size,
        });
      }

      // Get ETag from response headers
      const etag = response.headers.get("ETag");

      // Notify backend of completion
      const completionResponse = await apiClient.post(
        `enhanced-upload/complete/${uploadId}`,
        {
          etag: etag,
        }
      );

      // Handle completion response
      if (completionResponse.data.success && completionResponse.data.data) {
        const data = completionResponse.data.data;
        console.log("🎉 Single file upload completed:", data);

        if (uploadProgress) {
          setUploadProgress({
            ...uploadProgress,
            percentage: 100,
            status: "completed",
          });
        }

        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(null);
          if (data.url || data.path) {
            const objectPath = data.path || data.url;
            const streamingUrl = ensureStreamingUrl(objectPath);
            console.log(
              "Single file upload completed with path:",
              objectPath,
              "-> streaming URL:",
              streamingUrl
            );
            setUploadedUrl(streamingUrl);
            onUploadComplete?.(streamingUrl);
          }
        }, 500);
      }
    } catch (error) {
      console.error("Single file upload error:", error);
      throw error;
    }
  };

  // Handle multipart upload using presigned URLs
  const handlePresignedMultipartUpload = async (
    file: File,
    uploadId: string,
    presignedUrls: string[]
  ) => {
    const chunkSize = 5 * 1024 * 1024; // 5MB chunks
    const totalChunks = Math.ceil(file.size / chunkSize);

    console.log(
      `Starting presigned multipart upload with ${totalChunks} chunks of ${
        chunkSize / 1024 / 1024
      }MB each`
    );
    console.log("Presigned URLs received:", presignedUrls.length);
    console.log(
      "First presigned URL:",
      presignedUrls[0]?.substring(0, 100) + "..."
    );

    // Track failed chunks for retry
    const failedChunks: number[] = [];
    const maxRetries = 3;

    // First upload pass - try to upload all chunks
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      try {
        await uploadChunkWithPresignedUrl(
          file,
          uploadId,
          chunkIndex,
          chunkSize,
          presignedUrls[chunkIndex]
        );
        console.log(
          `✅ Successfully uploaded chunk ${chunkIndex + 1}/${totalChunks}`
        );

        // Progress will be updated via HTTP response from the backend
      } catch (error) {
        console.error(
          `Failed to upload chunk ${chunkIndex + 1}/${totalChunks}:`,
          error
        );
        failedChunks.push(chunkIndex);
      }
    }

    // Retry failed chunks
    if (failedChunks.length > 0) {
      console.log(`Retrying ${failedChunks.length} failed chunks...`);

      for (let retry = 0; retry < maxRetries; retry++) {
        if (failedChunks.length === 0) break;

        console.log(
          `Retry attempt ${retry + 1}/${maxRetries} for ${
            failedChunks.length
          } chunks`
        );
        const chunksToRetry = [...failedChunks];
        failedChunks.length = 0; // Clear the array

        for (const chunkIndex of chunksToRetry) {
          try {
            await uploadChunkWithPresignedUrl(
              file,
              uploadId,
              chunkIndex,
              chunkSize,
              presignedUrls[chunkIndex]
            );
            console.log(
              `Successfully uploaded chunk ${
                chunkIndex + 1
              }/${totalChunks} on retry ${retry + 1}`
            );
          } catch (error) {
            console.error(
              `Failed to upload chunk ${
                chunkIndex + 1
              }/${totalChunks} on retry ${retry + 1}:`,
              error
            );
            failedChunks.push(chunkIndex);
          }
        }
      }
    }

    // Final check - if we still have failed chunks, mark the last chunk as the last one anyway
    // to trigger server-side completion with whatever chunks we have
    if (failedChunks.length > 0) {
      console.warn(
        `Upload completing with ${
          failedChunks.length
        } failed chunks: [${failedChunks.join(", ")}]`
      );

      // Send a special completion signal
      try {
        const formData = new FormData();
        formData.append("isLastChunk", "true");
        formData.append("totalChunks", totalChunks.toString());
        formData.append("failedChunks", JSON.stringify(failedChunks));

        await apiClient.post(`enhanced-upload/complete/${uploadId}`, formData);
      } catch (error) {
        console.error("Failed to send completion signal:", error);
        throw error;
      }
    }
  };

  // Helper function to upload a single chunk using presigned URL with HTTP fallback
  const uploadChunkWithPresignedUrl = async (
    file: File,
    uploadId: string,
    chunkIndex: number,
    chunkSize: number,
    presignedUrl: string
  ): Promise<void> => {
    const start = chunkIndex * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    // Upload chunk directly to MinIO using presigned URL
    const response = await fetch(presignedUrl, {
      method: "PUT",
      body: chunk,
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });

    if (!response.ok) {
      throw new Error(`Chunk upload failed with status: ${response.status}`);
    }

    // Get ETag from response headers
    const etag = response.headers.get("ETag");
    if (!etag) {
      throw new Error("No ETag received from chunk upload");
    }

    // Notify backend about successful chunk upload
    console.log(`🔄 Confirming chunk ${chunkIndex + 1} upload to backend...`);
    const confirmResponse = await apiClient.post(
      `enhanced-upload/chunk/${uploadId}`,
      {
        chunkIndex: chunkIndex.toString(),
        etag: etag.replace(/"/g, ""), // Remove quotes from ETag
      }
    );

    console.log("📥 Chunk confirmation response:", confirmResponse.data);

    if (!confirmResponse.data.success) {
      throw new Error(`Server reported error: ${confirmResponse.data.message}`);
    }

    // Use chunk response data for progress tracking
    if (confirmResponse.data.data) {
      const data = confirmResponse.data.data;
      console.log("📊 Using chunk response progress data:", data);

      const progress: UploadProgress = {
        uploadId: uploadId,
        filename: file.name,
        totalSize: file.size,
        uploadedSize: Math.round((file.size * (data.percentage || 0)) / 100),
        percentage: Math.round(data.percentage || 0),
        currentChunk: (data.chunkIndex || 0) + 1,
        totalChunks: data.totalChunks || 1,
        status: data.completed ? "completed" : "uploading",
      };

      console.log("📊 Setting chunk response progress:", progress);
      setUploadProgress(progress);

      // Handle completion via chunk response
      if (data.completed && data.completionData) {
        console.log(
          "🎉 Upload completed via chunk response:",
          data.completionData
        );
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(null);
          const objectPath =
            data.completionData.path || data.completionData.url;
          const streamingUrl = ensureStreamingUrl(objectPath);
          console.log(
            "Multipart upload completed with path:",
            objectPath,
            "-> streaming URL:",
            streamingUrl
          );
          setUploadedUrl(streamingUrl);
          onUploadComplete?.(streamingUrl);
        }, 500);
      }
    }

    return;
  };

  // Cancel upload
  const cancelUpload = useCallback(async () => {
    if (uploadProgress?.uploadId) {
      try {
        // Call backend API to cancel upload
        await apiClient.post(
          `enhanced-upload/cancel/${uploadProgress.uploadId}`
        );
      } catch (error) {
        console.error("Failed to cancel upload:", error);
      }
      setIsUploading(false);
      setUploadProgress(null);
    }
  }, [uploadProgress]);

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0 && !isUploading) {
        const file = acceptedFiles[0];
        onChange?.(file);
        handleFileUpload(file);
      }
    },
    [handleFileUpload, isUploading, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled: disabled || isUploading,
    accept: {
      "video/mp4": [".mp4"],
      "video/webm": [".webm"],
      "video/avi": [".avi"],
      "video/mov": [".mov"],
      "video/quicktime": [".mov"],
    },
    maxSize: maxFileSize * 1024 * 1024,
  });

  return (
    <div className="flex flex-col space-y-2">
      {label && (
        <label className="text-sm font-medium text-[#b7b7b7]">{label}</label>
      )}

      {/* Video Preview */}
      {previewUrl && (
        <div className="relative inline-block">
          <video
            src={previewUrl}
            controls
            preload="metadata"
            muted
            playsInline
            className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200"
            style={{
              backgroundColor: "#f3f4f6",
            }}
            onError={(e) => {
              console.error("Video preview error:", e);
              console.log("Failed video URL:", previewUrl);
              console.log("Video error details:", e.currentTarget.error);
            }}
            onLoadStart={() => {
              console.log("Video preview loading:", previewUrl);
            }}
            onLoadedMetadata={(e) => {
              console.log("Video metadata loaded:", {
                duration: e.currentTarget.duration,
                videoWidth: e.currentTarget.videoWidth,
                videoHeight: e.currentTarget.videoHeight,
                url: previewUrl,
              });
              // Seek to a small time to show a frame
              e.currentTarget.currentTime = 0.1;
            }}
            onCanPlay={() => {
              console.log("Video can play");
            }}
            onPlay={() => {
              console.log("Video started playing");
            }}
            onPause={() => {
              console.log("Video paused");
            }}
            onClick={(e) => {
              console.log("Video clicked");
              const video = e.currentTarget;
              if (video.paused) {
                video.play().catch((err) => console.error("Play failed:", err));
              } else {
                video.pause();
              }
            }}>
            Your browser does not support the video tag.
          </video>
          <button
            type="button"
            onClick={removeVideo}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors">
            ×
          </button>
        </div>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition duration-200 ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : isUploading
            ? "border-gray-300 bg-gray-50 cursor-not-allowed"
            : previewUrl || uploadedUrl
            ? "border-green-500 bg-green-50"
            : "border-gray-300 hover:border-[#e08c28]"
        }`}>
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center space-y-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            className={`${
              isUploading
                ? "text-gray-400"
                : uploadedUrl
                ? "text-green-600"
                : "text-gray-600"
            }`}>
            <path fill="currentColor" d="M8 5v14l11-7z" />
          </svg>

          {isUploading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-blue-600 font-medium">Uploading Video...</p>
              <p className="text-sm text-gray-500">
                Please wait while your video is being uploaded
              </p>
            </div>
          ) : previewUrl || uploadedUrl ? (
            <div className="text-center">
              <p className="text-green-600 font-medium">Video Selected</p>
              <p className="text-sm text-gray-500">
                {typeof value === "string"
                  ? "Existing video"
                  : value?.name || "Video file"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Click to change video
              </p>
            </div>
          ) : isDragActive ? (
            <p className="text-blue-600">Drop the video file here...</p>
          ) : (
            <div className="text-center">
              <p className="text-gray-500">
                Drag and drop a video file here to upload
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Max size: {maxFileSize}MB | Supported: MP4, WebM, AVI, MOV
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && uploadProgress && (
        <div className="mt-4">
          <UploadProgressBar
            progress={uploadProgress}
            onCancel={cancelUpload}
            externalMetrics={metrics}
          />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Success Display */}
      {uploadedUrl && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">Video uploaded successfully!</p>
        </div>
      )}
    </div>
  );
};

export default VideoUploadField;
