import * as z from "zod";
import { get } from "lodash";

export type VisibilityType =
  | "featured"
  | "bestsellers"
  | "newarrivals"
  | "recommended"
  | "popular";

type ProductVariant = {
  sku?: string; // Made optional - will be auto-generated if not provided
  price: number;
  wt: number;
  unit?: string;
};

export interface IProductStone {
  name: string;
  weight: string;
  price: string;
  color: string;
}

export interface IProductFormValues {
  name: string;
  slug?: string;
  description: string;
  category: string;
  subCategory?: string;
  variant: ProductVariant[];

  // Required product type from server model
  productType: "gold" | "silver" | "platinum" | "diamond";

  // Stones configuration
  stones: IProductStone[];

  // Wastage configuration
  wastage: {
    type: "fixed" | "per";
    value: number;
  };

  // Other charges
  others: Array<{
    name: string;
    value: number;
  }>;

  // Occasions and Collections references
  occasions?: string[]; // Array of occasion ObjectIds as strings
  collections?: string[]; // Array of collection ObjectIds as strings

  length: number;
  claspType?: string;
  rhodoumFinishes: boolean;
  shape: string;
  quantity: number;
  totalCarat?: number;
  color?: string;
  clarity: string;
  dimension: number;
  gender?: "male" | "female" | "unisex"; // Target gender

  // SEO and marketing
  tags: string[];
  images: File | null; // Changed from 'image' to 'images' to match form field
  existingImage?: string;
}

export interface UploadedImage {
  name: string;
  url: string;
  file: File;
}

export const productFormSchema = z
  .object({
    // General Information
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    category: z.string().min(1, "Category is required"),
    subCategory: z.string().optional(),

    // Required product type
    productType: z.enum(["gold", "silver", "platinum", "diamond"], {
      required_error: "Product type is required",
    }),

    // Price - Fixed validation
    variant: z
      .array(
        z.object({
          sku: z.string().optional(), // Optional - auto-generated if not provided
          price: z.number().min(0.01, "Price must be greater than 0"),
          wt: z.number().min(0.01, "Weight must be greater than 0"),
          unit: z.string().optional().default("gm"),
          costPrice: z.number().optional(),
        })
      )
      .min(1, "At least one variant is required"),

    // Stones configuration
    stones: z.array(
      z.object({
        name: z.string().min(1, "Stone name is required"),
        weight: z.string().min(1, "Stone weight is required"),
        price: z.string().min(1, "Stone price is required"),
        color: z.string().min(1, "Stone color is required"),
      })
    ).default([]),

    // Wastage configuration
    wastage: z.object({
      type: z.enum(["fixed", "per"], {
        required_error: "Wastage type is required",
      }),
      value: z.number().min(0, "Wastage value must be non-negative"),
    }),

    // Other charges
    others: z.array(
      z.object({
        name: z.string().min(1, "Other charge name is required"),
        value: z.number().min(0, "Other charge value must be non-negative"),
      })
    ).default([]),

    // Occasions and Collections
    occasions: z.array(z.string()).optional(),
    collections: z.array(z.string()).optional(),

    // Product Specification
    length: z.number().min(0.01, "Length must be greater than 0"),
    claspType: z.string().optional(),
    rhodoumFinishes: z.boolean(),
    gender: z.enum(["male", "female", "unisex"]).optional(),

    // Material Information
    shape: z.string().min(1, "Shape is required"),
    clarity: z.string().min(1, "Clarity is required"),
    dimension: z.number().min(0.01, "Dimension must be greater than 0"),

    // Image - Fixed field name
    images: z.instanceof(File).nullable(),
    existingImage: z.string().optional(),

    // Visibility Option (single selection) - Fixed enum
    visibleAs: z.enum([
      "featured",
      "bestsellers",
      "newarrivals",
      "recommended",
      "popular",
    ]),

    // Tags
    tags: z.array(z.string()).min(1, "At least one tag is required"),
  })
  .refine(
    (data) => {
      // For new products, require an image
      // For updates, allow either new image or existing image
      return data.images !== null || data.existingImage;
    },
    {
      message: "At least one image is required",
      path: ["images"],
    }
  );

export const categoryColumns = [
  { title: "S.N", key: "sn" },
  { title: "Name", key: "name" },
  { title: "Description", key: "description" },
  { title: "Total Products", key: "totalProducts" },
];

export const subCategoryColumns = [
  { title: "S.N", key: "sn" },
  { title: "Name", key: "name" },
  // { title: "Category", key: "category" },
  { title: "Description", key: "description" },
  { title: "Total Products", key: "totalProducts" },
];

export const generateProductDefaultValue = (state: string, editData?: any) => {
  if (state === "add") {
    return {
      name: "",
      description: "",
      category: "",
      subCategory: "",
      productType: "gold" as const,
      variant: [{ price: 0, wt: 0, unit: "gm" }],
      stones: [],
      wastage: { type: "per" as const, value: 0 },
      others: [],
      occasions: [],
      collections: [],
      length: 0,
      claspType: "",
      rhodoumFinishes: true,
      shape: "",
      quantity: 0,
      clarity: "",
      dimension: 0,
      gender: undefined,
      visibleAs: "featured" as VisibilityType,
      tags: ["Featured"],
      images: null, // Changed from 'image' to 'images'
    };
  } else {
    const data = {
      name: get(editData, "name", ""),
      description: get(editData, "description", ""),
      category: get(editData, "category._id", ""),
      subCategory: get(editData, "subCategory._id", ""),
      productType: get(editData, "productType", "gold"),
      variant: get(editData, "variants", [{ price: 0, wt: 0, unit: "gm" }]),
      stones: get(editData, "stones", []),
      wastage: get(editData, "wastage", { type: "per", value: 0 }),
      others: get(editData, "others", []),
      occasions: get(editData, "occasions", []).map((occ: any) =>
        typeof occ === "object" ? occ._id : occ
      ),
      collections: get(editData, "collections", []).map((col: any) =>
        typeof col === "object" ? col._id : col
      ),
      length: get(editData, "length", 0),
      claspType: (() => {
        const claspTypeValue = get(editData, "claspType", "");
        if (
          claspTypeValue &&
          typeof claspTypeValue === "object" &&
          claspTypeValue._id
        ) {
          return claspTypeValue._id;
        }
        return claspTypeValue || "";
      })(),
      rhodoumFinishes: get(editData, "rhodoumFinishes", true),
      shape: get(editData, "shape", ""),
      quantity: get(editData, "quantity", 0),
      totalCarat: get(editData, "totalCarat"),
      color: get(editData, "color"),
      clarity: get(editData, "clarity", ""),
      dimension: get(editData, "dimension", 0),
      gender: get(editData, "gender"),
      visibleAs: get(editData, "visibleAs", "featured") as VisibilityType,
      tags: get(editData, "tags", ["Featured"]),
      images: null, // Changed from 'image' to 'images'
      existingImage: get(editData, "images[0]", undefined),
    };
    return data;
  }
};

export const productListColumns = [
  { title: "S.N", key: "sn" },
  { title: "Image", key: "image" },
  { title: "Product", key: "product" },
  { title: "Category", key: "categ" },
  { title: "Sub Category", key: "subCate" },
  // { title: "Price", key: "price" },
  // { title: "Stock", key: "stock" },
  // { title: "Sold", key: "sold" },
];

export const occasionColumns = [
  { title: "S.N", key: "sn" },
  { title: "Image", key: "image" },
  { title: "Name", key: "name" },
  { title: "Description", key: "description" },
  { title: "Total Products", key: "totalProducts" },
  // { title: "Status", key: "status" },
];
