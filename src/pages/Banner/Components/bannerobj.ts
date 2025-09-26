import { get } from "lodash";

export interface IBannerFormData {
  title: string;
  description?: string;
  category: string;
  subCategory: string;
  priority: number;
  image: File | null; // Changed to File | null for single file
  existingImage?: string | null;
  existingMobImage?: string | null;
  mobImage: File | null; // Changed to File | null for single file
  locations: string[];
  video: File | null; // Video file
  existingVideo?: string | null;
  videoThumbnail: File | null; // Video thumbnail file
  existingVideoThumbnail?: string | null;
}

export const generateBannerFormDefaultValue = (
  state: string,
  editData?: any
): IBannerFormData => {
  if (state === "add") {
    return {
      // General Information
      title: "",
      description: "",
      category: "",
      subCategory: "",
      priority: 0,
      image: null,
      existingImage: null, // add this
      mobImage: null,
      existingMobImage: null, // add this
      video: null,
      existingVideo: null, // add this
      videoThumbnail: null,
      existingVideoThumbnail: null, // add this
      locations: [],
    };
  } else {
    return {
      title: get(editData, "title", ""),
      description: get(editData, "description", ""),
      category: get(editData, "category", ""),
      subCategory: get(editData, "subCategory", ""),
      priority: get(editData, "priority", 0),

      // Main Web Image
      image: null,
      existingImage: get(editData, "image[0]", null),

      // Mobile Image
      mobImage: null,
      existingMobImage: get(editData, "mobImage[0]", null),

      // Video
      video: null,
      existingVideo: get(editData, "video[0]", null),

      // Video Thumbnail
      videoThumbnail: null,
      existingVideoThumbnail: get(editData, "videoThumbnail[0]", null),

      locations: get(editData, "locations", []),
    };
  }
};
