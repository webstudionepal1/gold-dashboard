import React, { useState } from "react";
import VideoUploadField from "../shared/form_components/VideoUploadField";
import EnhancedFileUpload from "../shared/form_components/EnhancedFileUpload";

const UploadProgressDemo: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleVideoUploadComplete = (url: string) => {
    setVideoUrl(url);
    setUploadStatus("Video upload completed successfully!");
    console.log("Video uploaded:", url);
  };

  const handleVideoUploadError = (error: string) => {
    setUploadStatus(`Video upload failed: ${error}`);
    console.error("Video upload error:", error);
  };

  const handleFileUploadComplete = (url: string, filename: string) => {
    setFileUrl(url);
    setUploadStatus(`File "${filename}" uploaded successfully!`);
    console.log("File uploaded:", url, filename);
  };

  const handleFileUploadError = (error: string) => {
    setUploadStatus(`File upload failed: ${error}`);
    console.error("File upload error:", error);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Enhanced Upload Progress Demo
        </h1>
        <p className="text-gray-600 mb-6">
          This demo showcases the enhanced upload progress tracking features including:
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
          <li>Real-time progress percentage and visual progress bar</li>
          <li>Upload speed calculation and display</li>
          <li>Time remaining estimation</li>
          <li>Chunk-by-chunk progress for large files</li>
          <li>File size tracking (uploaded/total)</li>
          <li>Upload cancellation capability</li>
          <li>Animated progress indicators</li>
          <li>Status indicators (initializing, uploading, completed, failed)</li>
        </ul>
      </div>

      {/* Status Display */}
      {uploadStatus && (
        <div className={`p-4 rounded-lg ${
          uploadStatus.includes("failed") 
            ? "bg-red-50 border border-red-200 text-red-700"
            : "bg-green-50 border border-green-200 text-green-700"
        }`}>
          <p className="font-medium">{uploadStatus}</p>
        </div>
      )}

      {/* Video Upload Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Video Upload with Enhanced Progress
        </h2>
        <p className="text-gray-600 mb-4">
          Upload videos up to 200MB with chunked upload and detailed progress tracking.
          Supports MP4, WebM, AVI, and MOV formats.
        </p>
        
        <VideoUploadField
          label="Select Video File"
          onUploadComplete={handleVideoUploadComplete}
          onUploadError={handleVideoUploadError}
          maxFileSize={200}
        />

        {videoUrl && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Uploaded Video
            </h3>
            <video
              src={videoUrl}
              controls
              className="w-full max-w-md rounded-lg shadow-sm"
            >
              Your browser does not support the video tag.
            </video>
            <p className="text-sm text-gray-600 mt-2">
              Video URL: <code className="bg-gray-200 px-1 rounded">{videoUrl}</code>
            </p>
          </div>
        )}
      </div>

      {/* General File Upload Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          General File Upload with Enhanced Progress
        </h2>
        <p className="text-gray-600 mb-4">
          Upload any file type with enhanced progress tracking. Supports both single
          and multipart uploads based on file size.
        </p>
        
        <EnhancedFileUpload
          label="Select Any File"
          documentType="demo"
          onUploadComplete={handleFileUploadComplete}
          onUploadError={handleFileUploadError}
          maxFileSize={200}
          acceptedFileTypes={["*/*"]}
        />

        {fileUrl && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Uploaded File
            </h3>
            <p className="text-sm text-gray-600">
              File URL: <code className="bg-gray-200 px-1 rounded">{fileUrl}</code>
            </p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              View/Download File
            </a>
          </div>
        )}
      </div>

      {/* Progress Features Explanation */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Progress Tracking Features
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Real-time Metrics
            </h3>
            <ul className="text-gray-600 space-y-1">
              <li>• Upload percentage with visual progress bar</li>
              <li>• Current upload speed (bytes/second)</li>
              <li>• Time remaining estimation</li>
              <li>• Uploaded size vs total size</li>
              <li>• Current chunk vs total chunks</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Enhanced UX
            </h3>
            <ul className="text-gray-600 space-y-1">
              <li>• Animated progress indicators</li>
              <li>• Status-based color coding</li>
              <li>• Upload cancellation</li>
              <li>• Error handling and display</li>
              <li>• Upload ID tracking</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Technical Implementation</h4>
          <p className="text-blue-800 text-sm">
            The progress tracking uses WebSocket connections for real-time updates,
            presigned URLs for direct cloud uploads, and chunked uploads for large files.
            The progress calculation includes speed smoothing and ETA estimation algorithms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadProgressDemo;
