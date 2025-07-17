# Banner Video Upload Integration Guide

## Overview

The enhanced video upload functionality has been successfully integrated into the existing Banner Add/Edit page, allowing users to upload videos alongside images in a unified interface.

## Features Integrated

### 🎥 **Video Upload in Banner Form**
- **Location**: Banner Add/Edit page (`/banner/add-banner` or `/banner/:id`)
- **Integration**: Added as a third section after Web Image and Mobile Image
- **Optional Field**: Video upload is optional, not required for banner creation

### 🚀 **Enhanced Upload Capabilities**
- **Large File Support**: Up to 200MB video files
- **Supported Formats**: MP4, WebM, AVI, MOV, QuickTime
- **Real-time Progress**: Live progress tracking with WebSocket
- **Chunked Upload**: Automatic chunking for files >50MB
- **Upload Cancellation**: Cancel uploads in progress
- **Error Recovery**: Better error handling and reporting

## How to Use

### 1. **Access Banner Form**
- Navigate to Banner section in sidebar
- Click "Add Banner" or edit an existing banner
- You'll see three upload sections:
  1. Upload Web Image (required)
  2. Upload Mobile Image (required)
  3. Upload Video (optional) ← **NEW**

### 2. **Upload Video**
1. **Fill Required Fields**: Complete title, description, category, etc.
2. **Upload Images**: Upload both web and mobile images (required)
3. **Upload Video (Optional)**:
   - Drag and drop a video file onto the video upload area
   - Or click to browse and select a file
   - Maximum file size: 200MB
   - Supported formats: MP4, WebM, AVI, MOV

4. **Monitor Progress**:
   - Real-time progress bar shows upload percentage
   - Upload status indicators (uploading, completed, failed)
   - Cancel option during upload

5. **Submit Form**: Click submit to create/update the banner with video

### 3. **Form Behavior**
- **Video is Optional**: You can create banners without videos
- **Form Validation**: Video field doesn't block form submission
- **Progress Tracking**: Real-time feedback during video upload
- **Error Handling**: Clear error messages if upload fails

## Technical Implementation

### **Frontend Changes**

#### 1. **VideoUploadField Component** (`src/components/shared/form_components/VideoUploadField.tsx`)
- Specialized video upload component for form integration
- WebSocket integration for real-time progress
- File validation and error handling
- Drag-and-drop interface with visual feedback

#### 2. **Banner Form Updates** (`src/pages/Banner/Components/AddBannerForm.tsx`)
- Added `video` field to form schema (optional)
- Integrated VideoUploadField component
- Updated form submission to include video file
- Added video field to form validation

#### 3. **Banner Interface Updates** (`src/pages/Banner/Components/bannerobj.ts`)
- Added `video: File | null` to IBannerFormData interface
- Updated default values to include video field
- Updated form generation functions

### **Backend Integration**
- Uses existing enhanced upload endpoints
- Video files stored in MinIO with banner document type
- Multipart upload for large video files
- WebSocket progress tracking

### **Form Structure**
```typescript
interface IBannerFormData {
  title: string;
  description: string;
  category: string;
  subCategory: string;
  priority: number;
  image: File | null;        // Required
  mobImage: File | null;     // Required
  video: File | null;        // Optional - NEW
  locations: string[];
}
```

## User Interface

### **Video Upload Section**
```
┌─────────────────────────────────────┐
│ Upload Video (Optional)             │
├─────────────────────────────────────┤
│                                     │
│  [▶]  Drag and drop a video file    │
│       here to upload                │
│                                     │
│  Max size: 200MB                    │
│  Supported: MP4, WebM, AVI, MOV     │
│                                     │
└─────────────────────────────────────┘
```

### **During Upload**
```
┌─────────────────────────────────────┐
│ Upload Video (Optional)             │
├─────────────────────────────────────┤
│ video.mp4                      75%  │
│ ████████████████░░░░░░░░░░░░░░░░░░░ │
│ 150MB / 200MB              Cancel  │
└─────────────────────────────────────┘
```

### **Upload Complete**
```
┌─────────────────────────────────────┐
│ Upload Video (Optional)             │
├─────────────────────────────────────┤
│                                     │
│  [✓]  Video Uploaded Successfully!  │
│       video.mp4                     │
│                                     │
└─────────────────────────────────────┘
```

## Benefits

### **Unified Interface**
- ✅ All banner assets (images + video) in one place
- ✅ Consistent user experience with existing image uploads
- ✅ No need for separate video upload page
- ✅ Integrated form validation and submission

### **Enhanced Reliability**
- ✅ 5-minute timeout per chunk vs 60 seconds total
- ✅ Real-time progress tracking
- ✅ Upload cancellation capability
- ✅ Better error handling and recovery

### **Optional Integration**
- ✅ Video upload is optional, doesn't break existing workflow
- ✅ Backward compatible with existing banners
- ✅ Progressive enhancement of banner functionality

## Configuration

### **Environment Variables**
```env
# Enhanced upload configuration (already configured)
MULTIPART_THRESHOLD_MB=50      # Files >50MB use chunked upload
UPLOAD_CHUNK_SIZE_MB=10        # 10MB chunks
MAX_CONCURRENT_CHUNKS=3        # 3 simultaneous chunk uploads
UPLOAD_TIMEOUT_MINUTES=10      # 10 minutes timeout per chunk
MAX_VIDEO_SIZE_MB=200          # Maximum video file size
```

### **File Validation**
- **Max Size**: 200MB
- **Formats**: MP4, WebM, AVI, MOV, QuickTime
- **Required**: No (optional field)
- **Validation**: Client-side and server-side

## Troubleshooting

### **Common Issues**

1. **Video Upload Timeout**
   - **Cause**: Network issues or very large files
   - **Solution**: Check internet connection, try smaller files
   - **Prevention**: Use stable internet for large uploads

2. **Unsupported Format**
   - **Cause**: File format not in supported list
   - **Solution**: Convert to MP4, WebM, AVI, or MOV
   - **Prevention**: Check file format before upload

3. **Form Submission Issues**
   - **Cause**: Video upload in progress during form submit
   - **Solution**: Wait for video upload to complete before submitting
   - **Prevention**: Monitor upload progress before submitting

### **Best Practices**

1. **Upload Order**: Upload images first, then video
2. **File Size**: Compress videos when possible to reduce upload time
3. **Format**: Use MP4 for best compatibility
4. **Connection**: Use stable internet for large video uploads
5. **Patience**: Allow time for large video uploads to complete

## Migration Notes

### **Existing Banners**
- Existing banners without videos continue to work normally
- Video field is optional and backward compatible
- No data migration required

### **Form Behavior**
- Form submission works with or without video
- Video upload doesn't block other form operations
- Progressive enhancement approach

## Future Enhancements

1. **Video Preview**: Show video thumbnail after upload
2. **Video Compression**: Automatic compression before upload
3. **Multiple Videos**: Support for multiple video uploads
4. **Video Metadata**: Extract and display video information
5. **Streaming**: Video streaming capabilities

## Getting Started

1. **Start the server**: `npm run dev`
2. **Navigate to**: Banner section → Add Banner
3. **Fill form**: Complete required fields (title, description, images)
4. **Upload video**: Optionally upload a video file
5. **Submit**: Create banner with video included

The video upload feature is now seamlessly integrated into your banner creation workflow, providing enhanced multimedia capabilities while maintaining the familiar interface!
