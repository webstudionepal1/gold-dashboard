import { useState, useEffect, useCallback } from "react";

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

interface UseUploadProgressReturn {
  progress: UploadProgress | null;
  metrics: UploadMetrics;
  isUploading: boolean;
  setProgress: (progress: UploadProgress | null) => void;
  resetMetrics: () => void;
}

export const useUploadProgress = (): UseUploadProgressReturn => {
  const [progress, setProgress] = useState<UploadProgress | null>(null);
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

  // Calculate metrics when progress updates
  useEffect(() => {
    if (!progress) {
      setMetrics({
        uploadSpeed: 0,
        averageSpeed: 0,
        timeRemaining: 0,
        elapsedTime: 0,
        eta: null,
      });
      return;
    }

    const now = Date.now();

    // Initialize start time on first progress update
    if (!startTime && progress.status === "uploading") {
      setStartTime(now);
      setLastUpdateTime(now);
      setLastUploadedSize(progress.uploadedSize);
      return;
    }

    if (!startTime || !lastUpdateTime) return;

    const elapsedTime = (now - startTime) / 1000; // seconds
    const timeSinceLastUpdate = (now - lastUpdateTime) / 1000; // seconds
    const sizeDiff = progress.uploadedSize - lastUploadedSize;

    // Calculate current upload speed
    let currentSpeed = 0;
    if (timeSinceLastUpdate > 0 && sizeDiff > 0) {
      currentSpeed = sizeDiff / timeSinceLastUpdate; // bytes per second
    }

    // Update speed history (keep last 10 measurements for smoothing)
    let newSpeedHistory: number[] = [];
    setSpeedHistory((prevHistory) => {
      newSpeedHistory = [...prevHistory, currentSpeed].slice(-10);
      return newSpeedHistory;
    });

    // Calculate average speed
    const averageSpeed = progress.uploadedSize / elapsedTime;

    // Calculate smoothed speed from recent history
    const smoothedSpeed =
      newSpeedHistory.length > 0
        ? newSpeedHistory.reduce((sum, speed) => sum + speed, 0) /
          newSpeedHistory.length
        : currentSpeed;

    // Calculate time remaining
    const remainingBytes = progress.totalSize - progress.uploadedSize;
    const timeRemaining =
      smoothedSpeed > 0 ? remainingBytes / smoothedSpeed : 0;

    // Calculate ETA
    const eta = timeRemaining > 0 ? new Date(now + timeRemaining * 1000) : null;

    setMetrics({
      uploadSpeed: smoothedSpeed,
      averageSpeed,
      timeRemaining,
      elapsedTime,
      eta,
    });

    setLastUpdateTime(now);
    setLastUploadedSize(progress.uploadedSize);
  }, [progress, startTime, lastUpdateTime, lastUploadedSize]);

  const resetMetrics = useCallback(() => {
    setStartTime(null);
    setLastUpdateTime(null);
    setLastUploadedSize(0);
    setSpeedHistory([]);
    setMetrics({
      uploadSpeed: 0,
      averageSpeed: 0,
      timeRemaining: 0,
      elapsedTime: 0,
      eta: null,
    });
  }, []);

  const handleSetProgress = useCallback(
    (newProgress: UploadProgress | null) => {
      setProgress(newProgress);

      // Reset metrics when upload is completed, failed, or cancelled
      if (
        !newProgress ||
        newProgress.status === "completed" ||
        newProgress.status === "failed"
      ) {
        resetMetrics();
      }
    },
    [resetMetrics]
  );

  const isUploading =
    progress?.status === "uploading" || progress?.status === "initializing";

  return {
    progress,
    metrics,
    isUploading,
    setProgress: handleSetProgress,
    resetMetrics,
  };
};

export default useUploadProgress;
