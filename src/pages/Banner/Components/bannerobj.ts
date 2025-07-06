// import { get } from "lodash";

// export interface IBannerFormData {
//   title: string;
//   description: string;
//   category: string;
//   subCategory: string;
//   priority: number;
//   // image: File[];
//   image: File | null;
//   existingImage?: string;
//   existingMobImage?: string;
//   mobImage: File | null;
//   // mobImage: File[];
//   locations: string[]; // Adjust this based on actual usage (array or single string)
// }
// export const generateBannerFormDefaultValue = (
//   state: string,
//   editData?: any
// ) => {
//   if (state === "add") {
//     return {
//       // General Information
//       title: "",
//       description: "",
//       category: "",
//       subCategory: "",

//       // Price
//       priority: 0,
//       image: [],
//       mobImage: [],
//       locations: [],
//     };
//   } else {
//     return {
//       title: get(editData, "title", ""),
//       description: get(editData, "description", ""),
//       category: get(editData, "category", ""),
//       subCategory: get(editData, "subCategory", ""),
//       priority: get(editData, "priority", 0),
//       image: [],
//       existingImage: get(editData, "image[0]"),
//       mobImage: [],
//       existingMobImage: get(editData, "mobImage[0]"),
//       locations: get(editData, "locations", []),
//     };
//   }
// };

import { get } from "lodash";

export interface IBannerFormData {
  title: string;
  description: string;
  category: string;
  subCategory: string;
  priority: number;
  image: File | null; // Changed to File | null for single file
  existingImage?: string;
  existingMobImage?: string;
  mobImage: File | null; // Changed to File | null for single file
  locations: string[];
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
      // Price
      priority: 0,
      image: null, // Null for new form, single file
      mobImage: null, // Null for new form, single file
      locations: [],
    };
  } else {
    return {
      title: get(editData, "title", ""),
      description: get(editData, "description", ""),
      category: get(editData, "category", ""),
      subCategory: get(editData, "subCategory", ""),
      priority: get(editData, "priority", 0),
      image: null, // Null for edit, new file will be uploaded
      existingImage: get(editData, "image[0]"),
      mobImage: null, // Null for edit, new file will be uploaded
      existingMobImage: get(editData, "mobImage[0]"),
      locations: get(editData, "locations", []),
    };
  }
};
