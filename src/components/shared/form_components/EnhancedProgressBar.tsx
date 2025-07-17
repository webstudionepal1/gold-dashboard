import React, { useState, useEffect } from "react";

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

interface EnhancedProgressBarProps {
  progress: UploadProgress;
  onCancel?: () => void;
  showDetailedStats?: boolean;
  showTimeRemaining?: boolean;
  showUploadSpeed?: boolean;
}

const EnhancedProgressBar: React.FC<EnhancedProgressBarProps> = ({
  progress,
  onCancel,
  showDetailedStats = true,
  showTimeRemaining = true,
  showUploadSpeed = true,
}) => {
  const [uploadSpeed, setUploadSpeed] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [startTime] = useState<number>(Date.now());
  const [lastUploadedSize, setLastUploadedSize] = useState<number>(0);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());

  // Calculate upload speed and time remaining
  useEffect(() => {
    const now = Date.now();
    const timeDiff = (now - lastUpdateTime) / 1000; // seconds
    const sizeDiff = progress.uploadedSize - lastUploadedSize;

    if (timeDiff > 0 && sizeDiff > 0) {
      const currentSpeed = sizeDiff / timeDiff; // bytes per second
      setUploadSpeed(currentSpeed);

      // Calculate time remaining
      const remainingBytes = progress.totalSize - progress.uploadedSize;
      const estimatedTimeRemaining = remainingBytes / currentSpeed;
      setTimeRemaining(estimatedTimeRemaining);
    }

    setLastUploadedSize(progress.uploadedSize);
    setLastUpdateTime(now);
  }, [progress.uploadedSize, lastUploadedSize, lastUpdateTime]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds) || seconds <= 0) return "Calculating...";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getStatusColor = () => {
    switch (progress.status) {
      case "initializing":
        return "bg-yellow-500";
      case "uploading":
        return "bg-blue-600";
      case "completed":
        return "bg-green-600";
      case "failed":
        return "bg-red-600";
      case "paused":
        return "bg-gray-500";
      default:
        return "bg-blue-600";
    }
  };

  const getStatusText = () => {
    switch (progress.status) {
      case "initializing":
        return "Initializing...";
      case "uploading":
        return "Uploading";
      case "completed":
        return "Completed";
      case "failed":
        return "Failed";
      case "paused":
        return "Paused";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header with filename and status */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
          <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
            {progress.filename}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{getStatusText()}</span>
          <span className="text-sm font-semibold text-gray-700">
            {progress.percentage}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative w-full bg-gray-200 rounded-full h-3 mb-3">
        <div
          className={`h-3 rounded-full transition-all duration-300 ${getStatusColor()}`}
          style={{ width: `${Math.min(progress.percentage, 100)}%` }}
        />
        {/* Animated stripes for active upload */}
        {progress.status === "uploading" && (
          <div
            className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"
            style={{ width: `${Math.min(progress.percentage, 100)}%` }}
          />
        )}
      </div>

      {/* Detailed statistics */}
      {showDetailedStats && (
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 mb-3">
          <div>
            <span className="font-medium">Size:</span>{" "}
            {formatBytes(progress.uploadedSize)} / {formatBytes(progress.totalSize)}
          </div>
          <div>
            <span className="font-medium">Chunks:</span>{" "}
            {progress.currentChunk} / {progress.totalChunks}
          </div>
          {showUploadSpeed && uploadSpeed > 0 && (
            <div>
              <span className="font-medium">Speed:</span>{" "}
              {formatBytes(uploadSpeed)}/s
            </div>
          )}
          {showTimeRemaining && timeRemaining > 0 && (
            <div>
              <span className="font-medium">Time left:</span>{" "}
              {formatTime(timeRemaining)}
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500">
          Upload ID: {progress.uploadId.substring(0, 8)}...
        </div>
        {progress.status === "uploading" && onCancel && (
          <button
            onClick={onCancel}
            className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
          >
            Cancel Upload
          </button>
        )}
      </div>

      {/* Error message */}
      {progress.error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {progress.error}
        </div>
      )}
    </div>
  );
};

export default EnhancedProgressBar;
