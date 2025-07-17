import React, { useState } from "react";
import { ensureStreamingUrl, getVideoStreamUrl } from "../utils/videoUtils";

const TestVideoStreaming: React.FC = () => {
  const [testUrl, setTestUrl] = useState("");
  const [streamingUrl, setStreamingUrl] = useState("");
  const [error, setError] = useState("");

  const handleTest = () => {
    try {
      setError("");
      const converted = ensureStreamingUrl(testUrl);
      setStreamingUrl(converted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const testUrls = [
    "banner/1234567890-test.mp4",
    "http://localhost:4000/api/v1/en/video/stream/banner/test.mp4",
    "https://gold-api.webstudiomatrix.com/banner/video.mp4",
    "banner/uploads/video-file.mp4",
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Video Streaming Test</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">URL Conversion Test</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test URL/Path:
          </label>
          <input
            type="text"
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a video URL or object path"
          />
        </div>

        <button
          onClick={handleTest}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4">
          Convert to Streaming URL
        </button>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}

        {streamingUrl && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600">
              <strong>Streaming URL:</strong> {streamingUrl}
            </p>
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-md font-medium mb-2">Quick Test URLs:</h3>
          <div className="space-y-2">
            {testUrls.map((url, index) => (
              <button
                key={index}
                onClick={() => setTestUrl(url)}
                className="block w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">
                {url}
              </button>
            ))}
          </div>
        </div>
      </div>

      {streamingUrl && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Video Preview</h2>

          {/* Test direct URL access */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-700 mb-2">
              <strong>Testing URL:</strong>
              <a
                href={streamingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline ml-2">
                Open in new tab
              </a>
            </p>
            <button
              onClick={() => {
                fetch(streamingUrl, { method: "HEAD" })
                  .then((response) => {
                    console.log("HEAD request response:", response);
                    if (response.ok) {
                      setError("");
                      console.log("Video URL is accessible");
                    } else {
                      setError(`Video URL returned status: ${response.status}`);
                    }
                  })
                  .catch((err) => {
                    console.error("HEAD request failed:", err);
                    setError(`Failed to access video URL: ${err.message}`);
                  });
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
              Test URL Access
            </button>
          </div>

          <video
            src={streamingUrl}
            controls
            preload="metadata"
            muted
            playsInline
            className="w-full max-w-md h-48 rounded-lg border border-gray-200"
            style={{
              backgroundColor: "#f3f4f6",
              objectFit: "cover",
            }}
            onError={(e) => {
              console.error("Video error:", e);
              console.log("Video error details:", e.currentTarget.error);
              setError(
                `Failed to load video. Error: ${
                  e.currentTarget.error?.message || "Unknown error"
                }`
              );
            }}
            onLoadStart={() => {
              console.log("Video loading started");
              setError("");
            }}
            onLoadedMetadata={(e) => {
              console.log("Video metadata loaded");
              e.currentTarget.currentTime = 0.1;
            }}
            onCanPlay={() => {
              console.log("Video can play");
            }}
            onClick={(e) => {
              const video = e.currentTarget;
              if (video.paused) {
                video.play().catch((err) => console.error("Play failed:", err));
              } else {
                video.pause();
              }
            }}>
            Your browser does not support the video tag.
          </video>

          <div className="mt-4 text-sm text-gray-600">
            <p>
              <strong>Current URL:</strong> {streamingUrl}
            </p>
            <p>
              <strong>Expected format:</strong>{" "}
              /api/v1/en/video/stream/[object-path]
            </p>
            <p>
              <strong>Click video to play/pause</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestVideoStreaming;
