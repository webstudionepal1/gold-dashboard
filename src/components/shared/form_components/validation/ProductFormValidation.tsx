import * as z from "zod";

// Validation schemas for each form page

// Wastage Schema
export const wastageSchema = z.object({
  type: z.enum(["fixed", "per"], {
    required_error: "Wastage type is required",
  }),
  value: z.number().min(0, "Wastage value cannot be negative"),
});

// Page 1: Basic Information Schema - Dynamic based on product type
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
  productType: z.enum(["normal", "gold", "silver", "diamond", "stone_gems"], {
    required_error: "Product type is required",
  }),
  category: z.string().optional(),
  subCategory: z.string().optional(),
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

// Product Variant Schema - Stock fields removed as they're not needed
export const productVariantSchema = z.object({
  sku: z.string().optional(),
  name: z.string().optional(),
  price: z.number().optional(),
  wt: z.number().min(0, "Weight cannot be negative").optional(),
  unit: z.enum(["grams", "kg", "pieces", "carats"]).optional(),
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
  visibleAs: z.array(z.string()),
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
        const lowestPrice = Math.min(
          ...data.variants.map((v) => (v.price || 0) as number)
        );
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
  2: z.object({
    length: z.number().min(0, "Length cannot be negative").optional(),
    claspType: z.string().optional(),
    rhodoumFinishes: z.boolean().optional(),
    shape: z.string().optional(),
    quantity: z.number().min(0, "Quantity cannot be negative").optional(),
    totalCarat: z.number().min(0, "Total carat cannot be negative").optional(),
    color: z.string().optional(),
    clarity: z.string().optional(),
    dimension: z.number().min(0, "Dimension cannot be negative").optional(),
    gender: z.enum(["male", "female", "unisex"]).optional(),
    makingCharges: z
      .number()
      .min(0, "Making charges cannot be negative")
      .optional(),
  }),
  3: productVariantsSchema,
  4: z.object({
    stones: z
      .array(
        z.object({
          name: z.string().min(1, "Stone name is required"),
          weight: z.number().min(0, "Weight cannot be negative"),
          price: z.number().min(0, "Price cannot be negative"),
          color: z.string().min(1, "Color is required"),
        })
      )
      .optional(),
    occasions: z.array(z.string()).optional(),
  }),
  5: z.object({
    images: z.array(z.union([z.instanceof(File), z.string()])).optional(),
    existingImages: z.array(z.string()).optional(),
  }),
  6: z.object({
    tags: z.array(z.string().min(1, "Tag cannot be empty")).optional(),
    visibleAs: z.array(z.string()).optional(),
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
  }),
  7: z.object({
    isActive: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
  }),
};

// Helper function to validate a specific step
export const validateStep = (step: number, data: any) => {
  const schema =
    stepValidationSchemas[step as keyof typeof stepValidationSchemas];
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
    return {
      success: false,
      errors: [{ path: "", message: "Validation error" }],
    };
  }
};

// Helper function to get fields for each step
export const getStepFields = (step: number, productType?: string): string[] => {
  switch (step) {
    case 1:
      return ["name", "description", "productType"];
    case 2:
      // For normal products, no specifications are required
      if (productType === "normal") {
        return [];
      }
      return ["length", "dimension", "makingCharges", "color", "totalCarat"];
    case 3:
      return ["variants"];
    case 4:
      // For normal products, stones and occasions are optional
      if (productType === "normal") {
        return [];
      }
      return ["stones", "occasions"];
    case 5:
      return ["images", "existingImages"];
    case 6:
      return ["tags"];
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

  return (
    stepInfo[step as keyof typeof stepInfo] || { title: "", description: "" }
  );
};

// Conditional validation schema based on product type requirements
export const conditionalProductFormSchema = z
  .object({
    // Basic fields that are always present
    name: z
      .string()
      .min(1, "Product name is required")
      .max(200, "Product name cannot exceed 200 characters")
      .trim(),
    productType: z.enum(["normal", "gold", "silver", "diamond", "stone_gems"], {
      required_error: "Product type is required",
    }),
    description: z
      .string()
      .min(1, "Description is required")
      .max(2000, "Description cannot exceed 2000 characters")
      .trim(),

    // Fields that are required for specific product types
    category: z.string().optional(),
    subCategory: z.string().optional(),
    length: z.number().min(0, "Length cannot be negative").optional(),
    dimension: z.number().min(0, "Dimension cannot be negative").optional(),
    makingCharges: z
      .number()
      .min(0, "Making charges cannot be negative")
      .optional(),
    color: z.string().optional(),
    clarity: z.string().optional(),
    totalCarat: z.number().min(0, "Total carat cannot be negative").optional(),
    wastage: wastageSchema.optional(),

    // Variants array - always required
    variants: z
      .array(productVariantSchema)
      .min(1, "At least one variant is required"),

    // Optional fields
    stones: z
      .array(
        z.object({
          name: z.string().min(1, "Stone name is required"),
          weight: z.number().min(0, "Weight cannot be negative"),
          price: z.number().min(0, "Price cannot be negative"),
          color: z.string().min(1, "Color is required"),
        })
      )
      .optional(),

    occasions: z.array(z.string()).optional(),
    otherCharges: z
      .array(
        z.object({
          name: z.string().min(1, "Charge name is required"),
          price: z.number().min(0, "Price cannot be negative"),
        })
      )
      .optional(),

    // Media and marketing
    images: z.array(z.union([z.instanceof(File), z.string()])).optional(),
    existingImages: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    visibleAs: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
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
  })
  .refine(
    (data) => {
      // For normal products: only require name, description, and price
      if (data.productType === "normal") {
        return true; // Basic validation already covers name, description, and price in variants
      }
      return true;
    },
    {
      message: "Normal products require product name, description, and price",
      path: ["productType"],
    }
  )
  .refine(
    (data) => {
      // For gold, silver, or diamond products: require category
      if (
        data.productType === "gold" ||
        data.productType === "silver" ||
        data.productType === "diamond" ||
        data.productType === "stone_gems"
      ) {
        return !!(data.category && data.category.trim() !== "");
      }
      return true;
    },
    {
      message: "Category is required for gold, silver, and diamond products",
      path: ["category"],
    }
  )
  .refine(
    (data) => {
      // For gold, silver, or diamond products: require subCategory
      if (
        data.productType === "gold" ||
        data.productType === "silver" ||
        data.productType === "diamond" ||
        data.productType === "stone_gems"
      ) {
        return !!(data.subCategory && data.subCategory.trim() !== "");
      }
      return true;
    },
    {
      message:
        "Sub-category is required for gold, silver, and diamond products",
      path: ["subCategory"],
    }
  )
  .refine(
    (data) => {
      // For gold or silver products: require wastage
      if (data.productType === "gold" || data.productType === "silver") {
        return !!data.wastage;
      }
      return true;
    },
    {
      message: "Wastage is required for gold and silver products",
      path: ["wastage"],
    }
  )
  .refine(
    (data) => {
      // For gold, silver, or diamond products: require totalCarat
      if (
        data.productType === "gold" ||
        data.productType === "silver" ||
        data.productType === "diamond" ||
        data.productType === "stone_gems"
      ) {
        return !!(data.totalCarat && data.totalCarat > 0);
      }
      return true;
    },
    {
      message: "Total carat is required for gold, silver, and diamond products",
      path: ["totalCarat"],
    }
  )
  .refine(
    (data) => {
      // For gold, silver, or diamond products: require making charges
      if (
        data.productType === "gold" ||
        data.productType === "silver" ||
        data.productType === "diamond" ||
        data.productType === "stone_gems"
      ) {
        return !!(data.makingCharges && data.makingCharges >= 0);
      }
      return true;
    },
    {
      message:
        "Making charges are required for gold, silver, and diamond products",
      path: ["makingCharges"],
    }
  )
  .refine(
    (data) => {
      // For diamond products: require clarity
      if (data.productType === "diamond" || data.productType === "stone_gems") {
        return !!(data.clarity && data.clarity.trim() !== "");
      }
      return true;
    },
    {
      message: "Clarity is required for diamond and stone/gem products",
      path: ["clarity"],
    }
  )
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
      // For non-normal products, weight and unit are required in variants
      if (data.productType !== "normal" && data.variants.length > 0) {
        return data.variants.every((variant) => {
          return variant.wt !== undefined && variant.wt > 0 && variant.unit;
        });
      }
      return true;
    },
    {
      message:
        "Weight and unit are required for gold, silver, and diamond products",
      path: ["variants"],
    }
  );

// Export the conditional schema as the main validation schema
export const mainProductFormSchema = conditionalProductFormSchema;
