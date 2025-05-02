import * as z from "zod";
type VisibilityType =
  | "featured"
  | "bestsellers"
  | "newarrivals"
  | "recommended"
  | "";

type ProductVariant = {
  price: number;
  wt: number;
  unit?: string;
};

export interface IProductFormValues {
  name: string;
  description: string;
  category: string;
  subCategory: string;
  variant: ProductVariant[];
  length: number;
  claspType?: string;
  rhodoumFinishes: boolean;
  shape: string;
  clarity: string;
  dimension: number;
  visibleAs: VisibilityType;
  tags: string[];
}

export interface UploadedImage {
  name: string;
  url: string;
  file: File;
}

export const categoryColumns = [
  { title: "S.N", key: "sn" },
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
  { title: "S.N", key: "sn" },
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

import { get } from "lodash";
export const generateProductDefaultValue = (state: string, editData?: any) => {
  if (state === "add") {
    return {
      name: "",
      description: "",
      category: "",
      subCategory: "",
      variant: [{ price: 0, wt: 0, unit: "gm" }],
      length: 0,
      claspType: "",
      rhodoumFinishes: true,
      shape: "",
      clarity: "",
      dimension: 0,
      visibleAs: "featured",
      tags: ["Featured"],
    };
  } else {
    console.log("editDat", editData);
    const cata = {
      name: get(editData, "name", ""),
      description: get(editData, "description", ""),
      category: get(editData, "category._id", ""),
      subCategory: get(editData, "subCategory._id", ""),
      variant: get(editData, "variant", [{ price: 0, wt: 0, unit: "gm" }]),
      length: get(editData, "length", 0),
      claspType: get(editData, "claspType._id", ""),
      rhodoumFinishes: get(editData, "rhodoumFinishes", true),
      shape: get(editData, "shape", ""),
      clarity: get(editData, "clarity", ""),
      dimension: get(editData, "dimension", 0),
      visibleAs: get(editData, "visibleAs", "featured"),
      tags: get(editData, "tags", ["Featured"]),
    };
    console.log(cata);
    return cata;
  }
};

export const productFormSchema = z.object({
  // General Information
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().min(1, "Sub Category is required"),

  // Price
  variant: z
    .array(
      z.object({
        price: z.number().min(1),
        wt: z.number().min(1, "Size is required"),
      })
    )
    .min(1, "At least one variant is required"),

  // Product Specification
  length: z.number().min(1, "Length is required"),
  claspType: z.string().optional(),
  rhodoumFinishes: z.boolean(),

  // Material Information
  shape: z.string().min(1, "Shape is required"),
  clarity: z.string().min(1, "Clarity is required"),
  dimension: z.number().min(1, "Dimension is required"),

  // Visibility Option (single selection)
  visibleAs: z.enum([
    "",
    "featured",
    "bestsellers",
    "newarrivals",
    "recommended",
  ]),

  // Tags
  tags: z.array(z.string()).min(1, "At least one tag is required"),
});

export const productListColumns = [
  { title: "S.N", key: "sn" },
  { title: "IMage", key: "image" },
  {
    title: "Product",
    key: "product",
  },
  {
    title: "Category",
    key: "categ",
  },
  {
    title: "Sub Category",
    key: "subCateg",
  },
  {
    title: "Price",
    key: "price",
  },
  {
    title: "Stock",
    key: "stock",
  },
];
