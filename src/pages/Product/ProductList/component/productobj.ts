import { get } from "lodash";
export const generateProductDefaultValue = (state:string, editData?: any) => {
  if (state === "add") {
    return {
      // General Information
      name: "",
      description: "",
      category: "",
      subCategory: "",

      // Price
      variant: [{ price: 0, size: "", unit: "gm" }],

      // Product Specification
      length: 0,
      claspType: "",
      rhodoumFinishes: true,

      // Material Information
      shape: "",
      clarity: "",
      dimension: 0,

      // Visibility Option (single selection)
      visibleAs: "featured",

      // Tags
      tags: ["Featured"],
    };
  } else {
    return {
      name: get(editData, "name", ""),
      description: get(editData, "description", ""),
      category: get(editData, "category", ""),
      subCategory: get(editData, "subCategory", ""),

      variant: get(editData, "variant", [{ price: 0, size: "", unit: "gm" }]),

      length: get(editData, "length", 0),
      claspType: get(editData, "claspType", ""),
      rhodoumFinishes: get(editData, "rhodoumFinishes", true),

      shape: get(editData, "shape", ""),
      clarity: get(editData, "clarity", ""),
      dimension: get(editData, "dimension", 0),

      visibleAs: get(editData, "visibleAs", "featured"),

      tags: get(editData, "tags", ["Featured"]),
    };
  }
};

