# Enhanced Upload Progress Tracking Guide

This guide explains the comprehensive upload progress tracking system implemented in the application, including real-time progress indicators, upload speed calculation, and time estimation features.

## Overview

The upload progress system provides detailed real-time feedback during file uploads, including:

- **Real-time progress percentage** with visual progress bars
- **Upload speed calculation** with smoothing algorithms
- **Time remaining estimation** based on current upload speed
- **Chunk-by-chunk progress** for large file uploads
- **File size tracking** (uploaded vs total)
- **Upload cancellation** capability
- **Status indicators** (initializing, uploading, completed, failed, paused)
- **Animated visual feedback** for better user experience

## Components

### 1. EnhancedProgressBar Component

A comprehensive progress bar component with advanced features:

```tsx
import EnhancedProgressBar from "./components/shared/form_components/EnhancedProgressBar";

<EnhancedProgressBar
  progress={progressData}
  onCancel={handleCancel}
  showDetailedStats={true}
  showTimeRemaining={true}
  showUploadSpeed={true}
/>
```

**Features:**
- Visual progress bar with percentage
- Upload speed display (bytes/second)
- Time remaining estimation
- File size progress (uploaded/total)
- Chunk progress for multipart uploads
- Cancel button for active uploads
- Status-based color coding
- Animated progress indicators

### 2. useUploadProgress Hook

A custom hook for managing upload progress state and calculations:

```tsx
import { useUploadProgress } from "../hooks/useUploadProgress";

const { progress, metrics, isUploading, setProgress, resetMetrics } = useUploadProgress();
```

**Returns:**
- `progress`: Current upload progress data
- `metrics`: Calculated metrics (speed, time remaining, etc.)
- `isUploading`: Boolean indicating if upload is active
- `setProgress`: Function to update progress
- `resetMetrics`: Function to reset all metrics

### 3. Enhanced Upload Components

Both `VideoUploadField` and `EnhancedFileUpload` components now include the enhanced progress tracking:

```tsx
import VideoUploadField from "./components/shared/form_components/VideoUploadField";
import EnhancedFileUpload from "./components/shared/form_components/EnhancedFileUpload";

// Video upload with progress
<VideoUploadField
  onUploadComplete={handleComplete}
  onUploadError={handleError}
  maxFileSize={200}
/>

// General file upload with progress
<EnhancedFileUpload
  documentType="banner"
  onUploadComplete={handleComplete}
  onUploadError={handleError}
  maxFileSize={200}
/>
```

## Progress Data Structure

```typescript
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
  uploadSpeed: number;      // bytes per second
  averageSpeed: number;     // bytes per second
  timeRemaining: number;    // seconds
  elapsedTime: number;      // seconds
  eta: Date | null;         // estimated time of arrival
}
```

## Real-time Updates

The progress tracking uses WebSocket connections for real-time updates:

1. **Client subscribes** to upload progress using the upload ID
2. **Server emits progress events** as chunks are uploaded
3. **Client receives updates** and calculates additional metrics
4. **Progress bar updates** in real-time with smooth animations

## Upload Speed Calculation

The system calculates upload speed using a smoothing algorithm:

1. **Measures bytes uploaded** between progress updates
2. **Calculates instantaneous speed** for each update
3. **Maintains speed history** (last 10 measurements)
4. **Applies smoothing** to reduce speed fluctuations
5. **Displays smoothed speed** for better user experience

## Time Remaining Estimation

Time remaining is calculated using:

```
timeRemaining = (totalSize - uploadedSize) / smoothedUploadSpeed
```

The estimation becomes more accurate as the upload progresses and more speed data is collected.

## Chunked Upload Progress

For large files (>5MB), the system uses chunked uploads:

1. **File is split** into 5MB chunks
2. **Each chunk is uploaded** separately using presigned URLs
3. **Progress is updated** after each chunk completion
4. **Chunk progress is displayed** (e.g., "Chunk 3 of 10")
5. **Overall progress** is calculated based on total bytes uploaded

## Error Handling

The progress system handles various error scenarios:

- **Network interruptions**: Upload can be resumed
- **Server errors**: Clear error messages displayed
- **File validation errors**: Immediate feedback
- **Upload cancellation**: Clean state reset

## Usage Examples

### Basic Progress Tracking

```tsx
const MyUploadComponent = () => {
  const { progress, metrics, isUploading, setProgress } = useUploadProgress();

  return (
    <div>
      {progress && (
        <EnhancedProgressBar
          progress={progress}
          showDetailedStats={true}
          showTimeRemaining={true}
          showUploadSpeed={true}
        />
      )}
    </div>
  );
};
```

### Custom Progress Display

```tsx
const CustomProgress = ({ progress, metrics }) => {
  if (!progress) return null;

  return (
    <div>
      <div>Progress: {progress.percentage}%</div>
      <div>Speed: {formatBytes(metrics.uploadSpeed)}/s</div>
      <div>Time left: {formatTime(metrics.timeRemaining)}</div>
      <div>Size: {formatBytes(progress.uploadedSize)} / {formatBytes(progress.totalSize)}</div>
    </div>
  );
};
```

## Best Practices

1. **Always show progress** for uploads larger than 1MB
2. **Provide cancel option** for long uploads
3. **Display clear error messages** when uploads fail
4. **Use appropriate file size limits** (200MB recommended)
5. **Test with various file sizes** and network conditions
6. **Implement retry logic** for failed uploads

## Browser Compatibility

The progress tracking system is compatible with:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Considerations

- Progress updates are throttled to prevent UI lag
- Speed calculations use efficient algorithms
- WebSocket connections are properly managed
- Memory usage is optimized for large file uploads

## Troubleshooting

### Common Issues

1. **Progress not updating**: Check WebSocket connection
2. **Incorrect speed calculation**: Verify progress data consistency
3. **Time estimation inaccurate**: Allow more time for speed stabilization
4. **Upload stuck**: Check network connectivity and server status

### Debug Information

Enable debug logging to troubleshoot issues:

```javascript
// In browser console
localStorage.setItem('debug', 'upload:*');
```

This will show detailed upload progress information in the console.
