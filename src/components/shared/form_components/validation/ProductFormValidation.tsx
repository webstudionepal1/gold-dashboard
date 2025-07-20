import * as z from "zod";

// Validation schemas for each form page

// Page 1: Basic Information Schema
export const basicProductInformationSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(200, "Product name cannot exceed 200 characters")
    .trim(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    .trim()
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description cannot exceed 2000 characters")
    .trim(),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().min(1, "Sub-category is required"),
});

// Page 2: Product Specifications Schema
export const productSpecificationsSchema = z.object({
  length: z.number().min(0, "Length cannot be negative"),
  claspType: z.string().optional(),
  rhodoumFinishes: z.boolean(),
  shape: z.string().min(1, "Shape is required"),
  quantity: z.number().min(0, "Quantity cannot be negative"),
  totalCarat: z.number().min(0, "Total carat cannot be negative").optional(),
  color: z.string().optional(),
  clarity: z.string().min(1, "Clarity is required"),
  dimension: z.number().min(0, "Dimension cannot be negative"),
  makingCharges: z.number().min(0, "Making charges cannot be negative"),
});

// Product Variant Schema
export const productVariantSchema = z.object({
  sku: z.string().optional(),
  price: z.number().min(0, "Price cannot be negative"),
  wt: z.number().min(0, "Weight cannot be negative"),
  unit: z.enum(["grams", "kg", "pieces", "carats"]),
  totalStock: z.number().min(0, "Total stock cannot be negative"),
  usedStock: z.number().min(0, "Used stock cannot be negative"),
  remainingStock: z.number().min(0, "Remaining stock cannot be negative"),
  reorderPoint: z.number().min(0, "Reorder point cannot be negative"),
  costPrice: z.number().min(0, "Cost price cannot be negative").optional(),
  isActive: z.boolean(),
});

// Page 3: Product Variants Schema
export const productVariantsSchema = z.object({
  variants: z
    .array(productVariantSchema)
    .min(1, "At least one variant is required")
    .refine(
      (variants) => {
        // Check for duplicate SKUs
        const skus = variants
          .map((v) => v.sku)
          .filter((sku) => sku && sku.trim() !== "");
        const uniqueSkus = new Set(skus);
        return skus.length === uniqueSkus.size;
      },
      {
        message: "SKUs must be unique across all variants",
        path: ["variants"],
      }
    )
    .refine(
      (variants) => {
        // Validate stock calculations
        return variants.every(
          (variant) =>
            variant.remainingStock === variant.totalStock - variant.usedStock
        );
      },
      {
        message: "Remaining stock must equal total stock minus used stock",
        path: ["variants"],
      }
    ),
});

// Product Stone Schema
export const productStoneSchema = z.object({
  stone: z.string().min(1, "Stone selection is required"),
  quantity: z.number().min(1, "Stone quantity must be at least 1"),
  totalPrice: z.number().min(0, "Stone price cannot be negative"),
  isOptional: z.boolean(),
  isDefault: z.boolean(),
});

// Page 4: Stones and Occasions Schema
export const stonesOccasionsSchema = z.object({
  stones: z.array(productStoneSchema).optional(),
  occasions: z.array(z.string()).optional(),
});

// Page 5: Media Assets Schema
export const productMediaAssetsSchema = z.object({
  images: z
    .array(z.string().url("Invalid image URL"))
    .max(10, "Maximum 10 images allowed")
    .optional(),
});

// Page 6: SEO & Marketing Schema
export const productSEOMarketingSchema = z.object({
  tags: z
    .array(z.string().min(1, "Tag cannot be empty"))
    .min(1, "At least one tag is required"),
  visibleAs: z.enum(["featured", "bestSellers", "newArrivals", "normal"]),
  metadata: z
    .object({
      seoTitle: z
        .string()
        .max(60, "SEO title cannot exceed 60 characters")
        .optional(),
      seoDescription: z
        .string()
        .max(160, "SEO description cannot exceed 160 characters")
        .optional(),
      keywords: z.array(z.string()).optional(),
      vendor: z
        .string()
        .max(100, "Vendor name cannot exceed 100 characters")
        .optional(),
      barcode: z
        .string()
        .max(50, "Barcode cannot exceed 50 characters")
        .optional(),
      compareAtPrice: z
        .number()
        .min(0, "Compare at price cannot be negative")
        .optional(),
    })
    .optional(),
});

// Page 7: Inventory & Status Schema
export const productInventoryStatusSchema = z.object({
  isActive: z.boolean(),
  isFeatured: z.boolean(),
});

// Complete form schema
export const completeProductFormSchema = basicProductInformationSchema
  .merge(productSpecificationsSchema)
  .merge(productVariantsSchema)
  .merge(stonesOccasionsSchema)
  .merge(productMediaAssetsSchema)
  .merge(productSEOMarketingSchema)
  .merge(productInventoryStatusSchema)
  .refine(
    (data) => {
      // Validate that featured products are active
      if (data.isFeatured && !data.isActive) {
        return false;
      }
      return true;
    },
    {
      message: "Featured products must be active",
      path: ["isFeatured"],
    }
  )
  .refine(
    (data) => {
      // Validate that if compareAtPrice is set, it should be higher than the lowest variant price
      if (data.metadata?.compareAtPrice && data.variants.length > 0) {
        const lowestPrice = Math.min(...data.variants.map((v) => v.price));
        return data.metadata.compareAtPrice > lowestPrice;
      }
      return true;
    },
    {
      message: "Compare at price must be higher than the product price",
      path: ["metadata", "compareAtPrice"],
    }
  );

// Individual step validation schemas
export const stepValidationSchemas = {
  1: basicProductInformationSchema,
  2: productSpecificationsSchema,
  3: productVariantsSchema,
  4: stonesOccasionsSchema,
  5: productMediaAssetsSchema,
  6: productSEOMarketingSchema,
  7: productInventoryStatusSchema,
};

// Helper function to validate a specific step
export const validateStep = (step: number, data: any) => {
  const schema = stepValidationSchemas[step as keyof typeof stepValidationSchemas];
  if (!schema) {
    return { success: true, errors: [] };
  }

  try {
    schema.parse(data);
    return { success: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      };
    }
    return { success: false, errors: [{ path: "", message: "Validation error" }] };
  }
};

// Helper function to get fields for each step
export const getStepFields = (step: number): string[] => {
  switch (step) {
    case 1:
      return ["name", "slug", "description", "category", "subCategory"];
    case 2:
      return [
        "length",
        "claspType",
        "rhodoumFinishes",
        "shape",
        "quantity",
        "totalCarat",
        "color",
        "clarity",
        "dimension",
        "makingCharges",
      ];
    case 3:
      return ["variants"];
    case 4:
      return ["stones", "occasions"];
    case 5:
      return ["images"];
    case 6:
      return ["tags", "visibleAs", "metadata"];
    case 7:
      return ["isActive", "isFeatured"];
    default:
      return [];
  }
};

// Helper function to get step title and description
export const getStepInfo = (step: number) => {
  const stepInfo = {
    1: {
      title: "Basic Information",
      description: "Product name, description, and categorization",
    },
    2: {
      title: "Specifications",
      description: "Physical properties and characteristics",
    },
    3: {
      title: "Variants & Pricing",
      description: "SKU, pricing, and inventory management",
    },
    4: {
      title: "Stones & Occasions",
      description: "Gemstones and suitable occasions",
    },
    5: {
      title: "Media Assets",
      description: "Product images and media",
    },
    6: {
      title: "SEO & Marketing",
      description: "Search optimization and marketing",
    },
    7: {
      title: "Status & Review",
      description: "Final settings and review",
    },
  };

  return stepInfo[step as keyof typeof stepInfo] || { title: "", description: "" };
};
