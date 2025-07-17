import React, { useState } from "react";
import VideoUploadField from "../components/shared/form_components/VideoUploadField";

const TestUpload: React.FC = () => {
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleUploadComplete = (url: string) => {
    setUploadedUrl(url);
    setUploadStatus("Upload completed successfully!");
    console.log("Upload completed:", url);
  };

  const handleUploadError = (error: string) => {
    setUploadStatus(`Upload failed: ${error}`);
    console.error("Upload error:", error);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Video Upload Test</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          Test Video Upload Progress
        </h2>

        <VideoUploadField
          label="Select Video File"
          onUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
          maxFileSize={200}
        />

        {uploadStatus && (
          <div
            className={`mt-4 p-3 rounded ${
              uploadStatus.includes("failed")
                ? "bg-red-50 border border-red-200 text-red-700"
                : "bg-green-50 border border-green-200 text-green-700"
            }`}>
            <p>{uploadStatus}</p>
          </div>
        )}

        {uploadedUrl && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-medium text-blue-900 mb-2">Uploaded Video</h3>
            <video
              src={uploadedUrl}
              controls
              className="w-full max-w-md rounded">
              Your browser does not support the video tag.
            </video>
            <p className="text-sm text-blue-700 mt-2">
              URL:{" "}
              <code className="bg-blue-100 px-1 rounded">{uploadedUrl}</code>
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">Debug Information</h3>
        <p className="text-sm text-gray-600">
          Open browser console to see detailed upload progress logs.
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Expected behavior: You should see "Uploading Video..." with a spinner
          when upload starts.
        </p>
      </div>
    </div>
  );
};

export default TestUpload;
