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

interface UploadMetrics {
  uploadSpeed: number; // bytes per second
  averageSpeed: number; // bytes per second
  timeRemaining: number; // seconds
  elapsedTime: number; // seconds
  eta: Date | null; // estimated time of arrival
}

interface UploadProgressBarProps {
  progress: UploadProgress;
  onCancel?: () => void;
  externalMetrics?: UploadMetrics;
}

const UploadProgressBar: React.FC<UploadProgressBarProps> = ({
  progress,
  onCancel,
  externalMetrics,
}) => {
  const [metrics, setMetrics] = useState<UploadMetrics>({
    uploadSpeed: 0,
    averageSpeed: 0,
    timeRemaining: 0,
    elapsedTime: 0,
    eta: null,
  });
  const [startTime, setStartTime] = useState<number | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number | null>(null);
  const [lastUploadedSize, setLastUploadedSize] = useState<number>(0);
  const [speedHistory, setSpeedHistory] = useState<number[]>([]);

  // Initialize start time when upload begins
  useEffect(() => {
    if (progress.status === "uploading" && !startTime) {
      const now = Date.now();
      setStartTime(now);
      setLastUpdateTime(now);
      setLastUploadedSize(progress.uploadedSize);
    }
  }, [progress.status, startTime, progress.uploadedSize]);

  // Calculate metrics when progress updates
  useEffect(() => {
    if (!startTime || progress.status !== "uploading") return;

    const now = Date.now();
    const elapsedTime = (now - startTime) / 1000; // seconds

    if (lastUpdateTime && now - lastUpdateTime > 500) {
      // Update every 500ms
      const timeDiff = (now - lastUpdateTime) / 1000; // seconds
      const sizeDiff = progress.uploadedSize - lastUploadedSize;
      const currentSpeed = sizeDiff / timeDiff; // bytes per second

      // Add to speed history (keep last 10 measurements for smoothing)
      const newSpeedHistory = [...speedHistory, currentSpeed].slice(-10);
      setSpeedHistory(newSpeedHistory);

      // Calculate smoothed speed (average of recent measurements)
      const smoothedSpeed =
        newSpeedHistory.reduce((sum, speed) => sum + speed, 0) /
        newSpeedHistory.length;

      // Calculate average speed since start
      const averageSpeed = progress.uploadedSize / elapsedTime;

      // Calculate time remaining
      const remainingBytes = progress.totalSize - progress.uploadedSize;
      const timeRemaining =
        smoothedSpeed > 0 ? remainingBytes / smoothedSpeed : 0;

      // Calculate ETA
      const eta =
        timeRemaining > 0 ? new Date(now + timeRemaining * 1000) : null;

      setMetrics({
        uploadSpeed: smoothedSpeed,
        averageSpeed,
        timeRemaining,
        elapsedTime,
        eta,
      });

      setLastUpdateTime(now);
      setLastUploadedSize(progress.uploadedSize);
    }
  }, [progress, startTime, lastUpdateTime, lastUploadedSize, speedHistory]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatSpeed = (bytesPerSecond: number): string => {
    return formatBytes(bytesPerSecond) + "/s";
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600)
      return `${Math.round(seconds / 60)}m ${Math.round(seconds % 60)}s`;
    return `${Math.round(seconds / 3600)}h ${Math.round(
      (seconds % 3600) / 60
    )}m`;
  };

  const getStatusColor = () => {
    switch (progress.status) {
      case "initializing":
        return "bg-blue-400";
      case "uploading":
        return "bg-blue-500";
      case "completed":
        return "bg-green-600";
      case "failed":
        return "bg-red-500";
      case "paused":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
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

  // Use external metrics if provided, otherwise use internal metrics
  const displayMetrics = externalMetrics || metrics;

  return (
    <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()} relative`}>
            {progress.status === "uploading" && (
              <div
                className={`absolute inset-0 rounded-full ${getStatusColor()} animate-ping opacity-75`}
              />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {getStatusText()}
            </span>
            {progress.status === "uploading" &&
              displayMetrics.uploadSpeed > 0 && (
                <span className="text-xs text-gray-500">
                  {formatSpeed(displayMetrics.uploadSpeed)}
                </span>
              )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">
            {Math.round(progress.percentage)}%
          </div>
          {progress.status === "uploading" &&
            displayMetrics.timeRemaining > 0 && (
              <div className="text-xs text-gray-500">
                {formatTime(displayMetrics.timeRemaining)} left
              </div>
            )}
        </div>
      </div>

      {/* Filename */}
      <div className="mb-2">
        <p className="text-sm text-gray-600 truncate" title={progress.filename}>
          {progress.filename}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-3 overflow-hidden relative shadow-inner">
        <div
          className={`h-4 rounded-full transition-all duration-300 ease-out relative ${getStatusColor()}`}
          style={{
            width: `${Math.min(Math.max(progress.percentage, 0), 100)}%`,
          }}>
          {/* Animated shimmer effect for active uploads */}
          {progress.status === "uploading" && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
          )}

          {/* Animated stripes for uploading state */}
          {progress.status === "uploading" && progress.percentage > 5 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
          )}
        </div>

        {/* Progress percentage overlay */}
        {progress.percentage > 10 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-white drop-shadow-sm">
              {Math.round(progress.percentage)}%
            </span>
          </div>
        )}
      </div>

      {/* Progress Details */}
      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          {/* File Size Progress */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 font-medium">File Size</div>
              <div className="text-sm font-semibold text-gray-900">
                {formatBytes(progress.uploadedSize)} /{" "}
                {formatBytes(progress.totalSize)}
              </div>
            </div>
          </div>

          {/* Chunks Progress */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 font-medium">Chunks</div>
              <div className="text-sm font-semibold text-gray-900">
                {progress.currentChunk} / {progress.totalChunks}
              </div>
            </div>
          </div>

          {/* Upload Speed */}
          {metrics.uploadSpeed > 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 font-medium">Speed</div>
                <div className="text-sm font-semibold text-gray-900">
                  {formatSpeed(metrics.uploadSpeed)}
                </div>
              </div>
            </div>
          )}

          {/* Time Remaining */}
          {metrics.timeRemaining > 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 font-medium">
                  Time Left
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {formatTime(metrics.timeRemaining)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Metrics */}
      {metrics.elapsedTime > 0 && (
        <div className="border-t border-gray-200 pt-3 mb-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">Elapsed:</span>
                <span>{formatTime(metrics.elapsedTime)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className="font-medium">Avg:</span>
                <span>{formatSpeed(metrics.averageSpeed)}</span>
              </div>
            </div>
            {metrics.eta && (
              <div className="flex items-center space-x-1">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-medium">ETA:</span>
                <span>{metrics.eta.toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Transfer Summary */}
      {progress.status === "completed" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold text-green-800">
              Upload Completed Successfully!
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs text-green-700">
            <div>
              <span className="font-medium">Total Size:</span>
              <div className="font-semibold">
                {formatBytes(progress.totalSize)}
              </div>
            </div>
            <div>
              <span className="font-medium">Total Time:</span>
              <div className="font-semibold">
                {formatTime(metrics.elapsedTime)}
              </div>
            </div>
            <div>
              <span className="font-medium">Avg Speed:</span>
              <div className="font-semibold">
                {formatSpeed(metrics.averageSpeed)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Performance Metrics */}
      {progress.status === "uploading" && metrics.uploadSpeed > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-blue-800">
              Transfer Performance
            </span>
            <div className="flex items-center space-x-1 text-xs text-blue-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white rounded p-2">
              <div className="text-blue-600 font-medium">Current Speed</div>
              <div className="text-lg font-bold text-blue-800">
                {formatSpeed(metrics.uploadSpeed)}
              </div>
            </div>
            <div className="bg-white rounded p-2">
              <div className="text-blue-600 font-medium">Data Transferred</div>
              <div className="text-lg font-bold text-blue-800">
                {((progress.uploadedSize / progress.totalSize) * 100).toFixed(
                  1
                )}
                %
              </div>
            </div>
            <div className="bg-white rounded p-2">
              <div className="text-blue-600 font-medium">Throughput</div>
              <div className="text-lg font-bold text-blue-800">
                {metrics.averageSpeed > 0
                  ? formatSpeed(metrics.averageSpeed)
                  : "Calculating..."}
              </div>
            </div>
            <div className="bg-white rounded p-2">
              <div className="text-blue-600 font-medium">Efficiency</div>
              <div className="text-lg font-bold text-blue-800">
                {metrics.averageSpeed > 0 && metrics.uploadSpeed > 0
                  ? `${Math.min(
                      100,
                      (metrics.uploadSpeed / metrics.averageSpeed) * 100
                    ).toFixed(0)}%`
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {progress.error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-red-800">Upload Failed</p>
          </div>
          <p className="text-sm text-red-600 mt-1 ml-8">{progress.error}</p>
        </div>
      )}

      {/* Cancel Button */}
      {onCancel && progress.status === "uploading" && (
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center space-x-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span>Cancel Upload</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadProgressBar;
