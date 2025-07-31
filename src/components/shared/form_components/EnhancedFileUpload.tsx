import React, { useCallback, useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Socket } from "socket.io-client";
import { apiClient } from "../../../server/utils/ApiGateway";
import EnhancedProgressBar from "./EnhancedProgressBar";
import { useUploadProgress } from "../../../hooks/useUploadProgress";
import SocketManager from "../../../utils/SocketManager";

// Import the SocketManager's interface
type UploadProgressData = {
  uploadId: string;
  filename: string;
  totalSize: number;
  uploadedSize: number;
  percentage: number;
  currentChunk: number;
  totalChunks: number;
  status: "initializing" | "uploading" | "completed" | "failed" | "paused";
  error?: string;
};

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

// Mapping function to convert SocketManager data to component interface
const mapSocketDataToProgress = (data: UploadProgressData): UploadProgress => {
  return {
    uploadId: data.uploadId,
    filename: data.filename,
    totalSize: data.totalSize,
    uploadedSize: data.uploadedSize,
    percentage: data.percentage,
    currentChunk: data.currentChunk,
    totalChunks: data.totalChunks,
    status: data.status,
    error: data.error,
  };
};

interface EnhancedFileUploadProps {
  label?: string;
  documentType: string;
  onUploadComplete?: (url: string, filename: string) => void;
  onUploadError?: (error: string) => void;
  onUploadProgress?: (progress: UploadProgress) => void;
  maxFileSize?: number; // in MB
  acceptedFileTypes?: string[];
  disabled?: boolean;
}

const EnhancedFileUpload: React.FC<EnhancedFileUploadProps> = ({
  label,
  documentType,
  onUploadComplete,
  onUploadError,
  onUploadProgress,
  maxFileSize = 200, // 200MB default
  acceptedFileTypes = ["video/*", "image/*"],
  disabled = false,
}) => {
  const { progress, metrics, isUploading, setProgress } = useUploadProgress();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socketManager = SocketManager.getInstance();

  // Initialize WebSocket connection using SocketManager
  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const socketConnection = await socketManager.getConnection();
        setSocket(socketConnection);

        // Set up upload event listeners
        const handleUploadProgress = (progressData: UploadProgressData) => {
          console.log("Upload progress:", progressData);
          const mappedProgress = mapSocketDataToProgress(progressData);
          setProgress(mappedProgress);
          onUploadProgress?.(mappedProgress);
        };

        const handleUploadComplete = (data: any) => {
          console.log("Upload completed:", data);
          setProgress(null);
          if (data.success && data.url) {
            onUploadComplete?.(data.url, progress?.filename || "");
          } else {
            onUploadError?.(data.error || "Upload failed");
          }
        };

        const handleUploadError = (data: any) => {
          console.log("Upload error:", data);
          setProgress(null);
          setError(data.error);
          onUploadError?.(data.error);
        };

        socketManager.onUploadComplete(handleUploadComplete);
        socketManager.onUploadError(handleUploadError);
        socketConnection.on("upload-progress", handleUploadProgress);

        return () => {
          socketConnection.off("upload-progress", handleUploadProgress);
          socketManager.removeUploadListeners({
            "upload-complete": handleUploadComplete,
            "upload-error": handleUploadError,
          });
        };
      } catch (error) {
        console.error("Failed to initialize socket:", error);
        setError("Failed to initialize connection");
      }
    };

    const cleanup = initializeSocket();

    return () => {
      cleanup?.then((cleanupFn) => cleanupFn?.());
    };
  }, [onUploadComplete, onUploadError, onUploadProgress]);

  // Handle file upload
  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!socket || disabled) return;

      setError(null);

      try {
        // Validate file size
        const maxSizeBytes = maxFileSize * 1024 * 1024;
        if (file.size > maxSizeBytes) {
          throw new Error(`File size exceeds ${maxFileSize}MB limit`);
        }

        // Initialize upload session
        const initResponse = await apiClient.post(
          "enhanced-upload/initialize",
          {
            filename: file.name,
            fileSize: file.size,
            mimeType: file.type,
            documentType,
          }
        );

        if (!initResponse.data.success) {
          throw new Error(initResponse.data.message);
        }

        const { uploadId, useMultipart, chunkSize } = initResponse.data.data;

        // Subscribe to upload progress using SocketManager
        socketManager.subscribeToUploadProgress(uploadId, (progressData) => {
          const mappedProgress = mapSocketDataToProgress(progressData);
          setProgress(mappedProgress);
          onUploadProgress?.(mappedProgress);
        });

        if (useMultipart) {
          // Handle multipart upload
          await handleMultipartUpload(file, uploadId, chunkSize);
        } else {
          // Handle single file upload
          await handleSingleUpload(file, uploadId);
        }
      } catch (error) {
        console.error("Upload error:", error);
        setProgress(null);
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        setError(errorMessage);
        onUploadError?.(errorMessage);
      }
    },
    [socket, disabled, maxFileSize, documentType, onUploadError]
  );

  // Handle multipart upload
  const handleMultipartUpload = async (
    file: File,
    uploadId: string,
    chunkSize: number
  ) => {
    const totalChunks = Math.ceil(file.size / chunkSize);

    console.log(
      `Starting multipart upload with ${totalChunks} chunks of ${
        chunkSize / 1024 / 1024
      }MB each`
    );

    // Track failed chunks for retry
    const failedChunks: number[] = [];
    const maxRetries = 3;

    // First upload pass - try to upload all chunks
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      try {
        await uploadSingleChunk(
          file,
          uploadId,
          chunkIndex,
          chunkSize,
          totalChunks
        );
        console.log(
          `Successfully uploaded chunk ${chunkIndex + 1}/${totalChunks}`
        );
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
            await uploadSingleChunk(
              file,
              uploadId,
              chunkIndex,
              chunkSize,
              totalChunks
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

    // If we still have failed chunks, throw an error
    if (failedChunks.length > 0) {
      throw new Error(
        `Failed to upload ${
          failedChunks.length
        } chunks after ${maxRetries} retries: [${failedChunks.join(", ")}]`
      );
    }
  };

  // Helper function to upload a single chunk
  const uploadSingleChunk = async (
    file: File,
    uploadId: string,
    chunkIndex: number,
    chunkSize: number,
    totalChunks: number
  ): Promise<void> => {
    const start = chunkIndex * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("chunkIndex", chunkIndex.toString());
    formData.append("totalChunks", totalChunks.toString());
    formData.append("isLastChunk", (chunkIndex === totalChunks - 1).toString());

    const response = await apiClient.post(
      `enhanced-upload/chunk/${uploadId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 60 second timeout per chunk
      }
    );

    if (!response.data.success) {
      throw new Error(`Server reported error: ${response.data.message}`);
    }
  };

  // Handle single file upload
  const handleSingleUpload = async (file: File, uploadId: string) => {
    // Convert file to base64 for single upload
    const fileBuffer = await file.arrayBuffer();
    const base64Data = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));

    await apiClient.post(`enhanced-upload/complete/${uploadId}`, {
      fileBuffer: base64Data,
      mimeType: file.type,
    });
  };

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0 && !isUploading) {
        handleFileUpload(acceptedFiles[0]);
      }
    },
    [handleFileUpload, isUploading]
  );

  // Cancel upload
  const cancelUpload = useCallback(async () => {
    if (progress?.uploadId) {
      socketManager.cancelUpload(progress.uploadId);
      setProgress(null);
    }
  }, [progress, socketManager]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled: disabled || isUploading,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize: maxFileSize * 1024 * 1024,
  });

  // Enhanced Progress bar component
  const ProgressBar = () => {
    if (!progress) return null;

    return (
      <EnhancedProgressBar
        progress={progress}
        onCancel={cancelUpload}
        showDetailedStats={true}
        showTimeRemaining={true}
        showUploadSpeed={true}
      />
    );
  };

  return (
    <div className="flex flex-col space-y-2">
      {label && (
        <label className="text-sm font-medium text-[#b7b7b7]">{label}</label>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-10 text-center cursor-pointer transition duration-200 ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : isUploading
            ? "border-gray-300 bg-gray-50 cursor-not-allowed"
            : "border-gray-300 hover:border-[#e08c28]"
        }`}>
        <input {...getInputProps()} ref={fileInputRef} />

        <div className="flex flex-col items-center justify-center space-y-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className={isUploading ? "text-gray-400" : "text-gray-600"}>
            <path
              fill="currentColor"
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
            />
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M17.5 11c-2.121 0-3.182 0-3.841-.659S13 8.621 13 6.5s0-3.182.659-3.841S15.379 2 17.5 2s3.182 0 3.841.659S22 4.379 22 6.5s0 3.182-.659 3.841S19.621 11 17.5 11m.75-6.5a.75.75 0 0 0-1.5 0v1.25H15.5a.75.75 0 0 0 0 1.5h1.25V8.5a.75.75 0 0 0 1.5 0V7.25h1.25a.75.75 0 0 0 0-1.5h-1.25z"
              clipRule="evenodd"
            />
          </svg>

          {isUploading ? (
            <div className="text-center">
              <p className="text-blue-600 font-medium">Uploading...</p>
              <p className="text-sm text-gray-500">
                Please wait while your file is being uploaded
              </p>
            </div>
          ) : isDragActive ? (
            <p className="text-blue-600">Drop the file here...</p>
          ) : (
            <div className="text-center">
              <p className="text-gray-500">
                Drag and drop a file here to upload
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Max size: {maxFileSize}MB | Supported:{" "}
                {acceptedFileTypes.join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar />

      {/* Error Display */}
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default EnhancedFileUpload;
