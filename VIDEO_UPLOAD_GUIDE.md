# Video Upload Feature Guide

## Overview

A dedicated video upload page has been created with enhanced upload capabilities, real-time progress tracking, and improved handling of large video files.

## Features

### 🎥 **Video Upload Page**
- **Location**: `/video-upload` in your application
- **Navigation**: Added to sidebar under "Video Upload" menu item
- **Purpose**: Centralized place for uploading and managing video files

### 🚀 **Enhanced Upload Capabilities**
- **Large File Support**: Up to 200MB video files
- **Supported Formats**: MP4, WebM, AVI, MOV, QuickTime
- **Real-time Progress**: Live progress tracking with WebSocket
- **Chunked Upload**: Automatic chunking for files >50MB
- **Upload Cancellation**: Cancel uploads in progress
- **Error Recovery**: Better error handling and reporting

### 📊 **Progress Tracking**
- **Real-time Updates**: See upload progress as it happens
- **Chunk Information**: Track individual chunk uploads
- **Upload Speed**: Monitor upload performance
- **Status Indicators**: Clear status messages (initializing, uploading, completed, failed)

## How to Use

### 1. **Access the Video Upload Page**
- Navigate to the sidebar menu
- Click on "Video Upload" (with video library icon)
- You'll be taken to `/video-upload`

### 2. **Upload a Video**
1. **Select Category**: Choose the appropriate video category:
   - Banner Video
   - Product Video
   - Advertisement
   - Tutorial Video
   - Testimonial
   - Promotional Video

2. **Upload File**: 
   - Drag and drop a video file onto the upload area
   - Or click to browse and select a file
   - Maximum file size: 200MB
   - Supported formats: MP4, WebM, AVI, MOV

3. **Monitor Progress**:
   - Real-time progress bar shows upload percentage
   - Chunk progress (e.g., "Chunk 5 of 15")
   - Upload speed and data transferred
   - Current status (uploading, completed, etc.)

4. **Manage Upload**:
   - Cancel upload if needed
   - View any error messages
   - Get success confirmation when complete

### 3. **View Uploaded Videos**
- Recently uploaded videos appear in a list below the upload area
- Each video shows:
  - Filename and file size
  - Upload timestamp
  - Video category
  - Action buttons (View, Copy URL, Remove)

## Technical Details

### **Backend Endpoints**
- `POST /api/v1/en/enhanced-upload/initialize` - Start upload session
- `POST /api/v1/en/enhanced-upload/chunk/:uploadId` - Upload file chunks
- `POST /api/v1/en/enhanced-upload/complete/:uploadId` - Complete upload
- `GET /api/v1/en/enhanced-upload/progress/:uploadId` - Get progress
- `DELETE /api/v1/en/enhanced-upload/cancel/:uploadId` - Cancel upload
- `POST /api/v1/en/enhanced-upload/single` - Single file upload (fallback)

### **WebSocket Events**
- Real-time progress updates
- Upload completion notifications
- Error notifications
- Upload cancellation confirmations

### **Configuration**
```env
MULTIPART_THRESHOLD_MB=50      # Files >50MB use chunked upload
UPLOAD_CHUNK_SIZE_MB=10        # 10MB chunks
MAX_CONCURRENT_CHUNKS=3        # 3 simultaneous chunk uploads
UPLOAD_TIMEOUT_MINUTES=10      # 10 minutes timeout per chunk
MAX_VIDEO_SIZE_MB=200          # Maximum video file size
```

## Benefits Over Previous System

### **Before (Old System)**
- ❌ 60-second timeout causing failures
- ❌ No progress tracking
- ❌ Single upload attempt
- ❌ Poor error handling
- ❌ No user feedback during upload

### **After (Enhanced System)**
- ✅ 5-minute timeout per chunk (much more reliable)
- ✅ Real-time progress tracking
- ✅ Chunked uploads for large files
- ✅ Comprehensive error handling
- ✅ Live user feedback and cancellation
- ✅ Better success rates for large files

## Troubleshooting

### **Common Issues**

1. **Upload Timeout**
   - **Cause**: Network issues or very large files
   - **Solution**: Check internet connection, try smaller chunks
   - **Prevention**: Use stable internet for large uploads

2. **WebSocket Connection Failed**
   - **Cause**: Network restrictions or server issues
   - **Solution**: Refresh page, check server status
   - **Fallback**: Upload will still work without real-time progress

3. **File Too Large**
   - **Cause**: File exceeds 200MB limit
   - **Solution**: Compress video or split into smaller files
   - **Alternative**: Contact admin to increase limits

4. **Unsupported Format**
   - **Cause**: File format not in supported list
   - **Solution**: Convert to MP4, WebM, AVI, or MOV
   - **Tools**: Use video conversion software

### **Best Practices**

1. **Stable Connection**: Use reliable internet for large uploads
2. **File Preparation**: Compress videos when possible
3. **Category Selection**: Choose appropriate video category
4. **Monitor Progress**: Keep browser tab open during upload
5. **Error Handling**: Read error messages and retry if needed

## Integration with Existing System

### **Sidebar Navigation**
- Added "Video Upload" menu item with video library icon
- Positioned after Products section for easy access

### **Route Configuration**
- Route: `/video-upload`
- Component: `VideoUpload.tsx`
- Protected route (requires authentication)

### **File Storage**
- Videos stored in MinIO object storage
- Organized by date and category
- Public URLs generated for access

## Future Enhancements

1. **Video Preview**: Thumbnail generation and preview
2. **Batch Upload**: Multiple file upload support
3. **Resume Upload**: Resume interrupted uploads
4. **Compression**: Automatic video compression
5. **Analytics**: Upload performance metrics
6. **Notifications**: Email/push notifications for completion

## Getting Started

1. **Start the server**: `npm run dev`
2. **Navigate to**: `/video-upload` in your application
3. **Select category**: Choose appropriate video type
4. **Upload video**: Drag and drop or browse for file
5. **Monitor progress**: Watch real-time upload progress
6. **Manage videos**: View, copy URLs, or remove uploaded videos

The video upload feature is now ready to handle your large video files efficiently with excellent user experience and reliability!
