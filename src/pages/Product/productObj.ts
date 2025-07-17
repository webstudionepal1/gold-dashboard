import * as z from "zod";
type VisibilityType =
  | "featured"
  | "bestsellers"
  | "newarrivals"
  | "recommended"
  | "";

type ProductVariant = {
  sku?: string; // Made optional - will be auto-generated if not provided
  price: number;
  wt: number;
  unit: string;
  totalStock: number;
  usedStock: number;
  remainingStock: number;
  reorderPoint: number;
  costPrice?: number;
  isActive: boolean;
};

export interface IProductStone {
  stone: string; // ObjectId as string
  quantity: number;
  totalPrice: number;
  isOptional: boolean;
  isDefault: boolean;
}

export interface IProductFormValues {
  name: string;
  slug?: string;
  description: string;
  category: string;
  subCategory: string;
  variants: ProductVariant[];
  makingCharges: number;

  // Physical properties
  length: number;
  claspType?: string;
  rhodoumFinishes: boolean;
  shape: string;
  quantity: number;
  totalCarat?: number;
  color?: string;
  clarity: string;
  dimension: number;

  // Stones
  stones?: IProductStone[];

  // Occasions
  occasions?: string[]; // Array of occasion ObjectIds as strings

  // SEO and marketing
  tags: string[];
  visibleAs: VisibilityType;

  // Status flags
  isActive: boolean;
  isFeatured: boolean;

  // Metadata
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
    vendor?: string;
    barcode?: string;
    compareAtPrice?: number;
  };
}

export interface UploadedImage {
  name: string;
  url: string;
  file: File;
}

export const categoryColumns = [
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Description",
    key: "description",
  },
  {
    title: "Total Products",
    key: "totalProducts",
  },
];

export const subCategoryColumns = [
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Category",
    key: "category",
  },
  {
    title: "Description",
    key: "description",
  },
  {
    title: "Total Products",
    key: "totalProducts",
  },
];

export const occasionColumns = [
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Description",
    key: "description",
  },
  {
    title: "Total Products",
    key: "totalProducts",
  },
  {
    title: "Image",
    key: "image",
  },
  {
    title: "Video",
    key: "video",
  },
  {
    title: "Status",
    key: "isActive",
  },
];

import { get } from "lodash";
export const generateProductDefaultValue = (state: string, editData?: any) => {
  if (state === "add") {
    return {
      name: "",
      description: "",
      category: "",
      subCategory: "",
      variants: [
        {
          sku: "", // Optional - will be auto-generated if left empty
          price: 0,
          wt: 0,
          unit: "grams",
          totalStock: 0,
          usedStock: 0,
          remainingStock: 0,
          reorderPoint: 10,
          isActive: true,
        },
      ],
      makingCharges: 0,
      length: 0,
      claspType: "",
      rhodoumFinishes: true,
      shape: "",
      quantity: 0,
      clarity: "",
      dimension: 0,
      stones: [],
      occasions: [],
      visibleAs: "featured",
      isActive: true,
      isFeatured: false,
      tags: ["Featured"],
    };
  } else {
    return {
      name: get(editData, "name", ""),
      description: get(editData, "description", ""),
      category: get(editData, "category", ""),
      subCategory: get(editData, "subCategory", ""),
      variants: get(editData, "variants", [
        {
          sku: "",
          price: 0,
          wt: 0,
          unit: "grams",
          totalStock: 0,
          usedStock: 0,
          remainingStock: 0,
          reorderPoint: 10,
          isActive: true,
        },
      ]),
      makingCharges: get(editData, "makingCharges", 0),
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
      visibleAs: get(editData, "visibleAs", "featured"),
      isActive: get(editData, "isActive", true),
      isFeatured: get(editData, "isFeatured", false),
      tags: get(editData, "tags", ["Featured"]),
      metadata: get(editData, "metadata"),
    };
  }
};

export const productFormSchema = z.object({
  // General Information
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().min(1, "Sub Category is required"),

  // Variants
  variants: z
    .array(
      z.object({
        sku: z.string().optional(), // Made optional - will be auto-generated if not provided
        price: z.number().min(1, "Price must be greater than 0"),
        wt: z.number().min(0, "Weight cannot be negative"),
        unit: z.string().min(1, "Unit is required"),
        totalStock: z.number().min(0, "Total stock cannot be negative"),
        usedStock: z.number().min(0, "Used stock cannot be negative"),
        remainingStock: z.number().min(0, "Remaining stock cannot be negative"),
        reorderPoint: z.number().min(0, "Reorder point cannot be negative"),
        costPrice: z
          .number()
          .min(0, "Cost price cannot be negative")
          .optional(),
        isActive: z.boolean(),
      })
    )
    .min(1, "At least one variant is required"),

  // Making charges
  makingCharges: z.number().min(0, "Making charges cannot be negative"),

  // Product Specification
  length: z.number().min(1, "Length is required"),
  claspType: z.string().optional(),
  rhodoumFinishes: z.boolean(),
  quantity: z.number().min(0, "Quantity cannot be negative"),
  totalCarat: z.number().min(0, "Total carat cannot be negative").optional(),
  color: z.string().optional(),

  // Material Information
  shape: z.string().min(1, "Shape is required"),
  clarity: z.string().min(1, "Clarity is required"),
  dimension: z.number().min(1, "Dimension is required"),

  // Stones (optional)
  stones: z
    .array(
      z.object({
        stone: z.string().min(1, "Stone is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        totalPrice: z.number().min(0, "Total price cannot be negative"),
        isOptional: z.boolean(),
        isDefault: z.boolean(),
      })
    )
    .optional(),

  // Occasions (optional)
  occasions: z.array(z.string()).optional(),

  // Visibility Option (single selection)
  visibleAs: z.enum([
    "",
    "featured",
    "bestsellers",
    "newarrivals",
    "recommended",
  ]),

  // Status flags
  isActive: z.boolean(),
  isFeatured: z.boolean(),

  // Tags
  tags: z.array(z.string()).min(1, "At least one tag is required"),

  // Metadata (optional)
  metadata: z
    .object({
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
      keywords: z.array(z.string()).optional(),
      vendor: z.string().optional(),
      barcode: z.string().optional(),
      compareAtPrice: z.number().min(0).optional(),
    })
    .optional(),
});
