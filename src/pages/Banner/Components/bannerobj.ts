import { get } from "lodash";

export interface IBannerFormData {
  title: string;
  description: string;
  category: string;
  subCategory: string;
  priority: number;
  image: File | null;
  mobImage: File | null;
  locations: string[]; // Adjust this based on actual usage (array or single string)
}
export const generateBannerFormDefaultValue = (
  state: string,
  editData?: any
) => {
  if (state === "add") {
    return {
      // General Information
      title: "",
      description: "",
      category: "",
      subCategory: "",

      // Price
      priority: 0,
      image: null,
      mobImage: null,
      locations: [],
    };
  } else {
    return {
      title: get(editData, "title", ""),
      description: get(editData, "description", ""),
      category: get(editData, "category", ""),
      subCategory: get(editData, "subCategory", ""),
      priority: get(editData, "priority", 0),
      image: get(editData, "image", null),
      mobImage: get(editData, "mobImage", null),

      locations: get(editData, "locations", []),
    };
  }
};
