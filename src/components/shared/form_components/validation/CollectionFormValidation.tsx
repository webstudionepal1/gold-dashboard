import * as z from "zod";

// Validation schemas for each form page
export const basicInformationSchema = z.object({
  name: z
    .string()
    .min(1, "Collection name is required")
    .max(100, "Collection name cannot exceed 100 characters")
    .trim(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    .trim(),
  description: z
    .string()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),
  shortDescription: z
    .string()
    .max(500, "Short description cannot exceed 500 characters")
    .optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
});

export const collectionPropertiesSchema = z.object({
  materialType: z.string().optional(),
  gemstoneType: z.string().optional(),
  styleCategory: z.string().optional(),
  priceRange: z
    .object({
      min: z.number().min(0, "Minimum price cannot be negative").optional(),
      max: z.number().min(0, "Maximum price cannot be negative").optional(),
      currency: z.string().min(1, "Currency is required"),
    })
    .refine(
      (data) => {
        if (data.min && data.max) {
          return data.min < data.max;
        }
        return true;
      },
      {
        message: "Maximum price must be greater than minimum price",
        path: ["max"],
      }
    ),
});

export const smartCollectionRulesSchema = z
  .object({
    collectionMode: z.enum(["manual", "automatic", "hybrid"]),
    conditions: z.object({
      groups: z.array(z.any()).optional(),
      operator: z.enum(["AND", "OR"]),
      isAutomatic: z.boolean(),
      manualProductIds: z.array(z.string()).optional(),
      excludedProductIds: z.array(z.string()).optional(),
    }),
  })
  .refine(
    (data) => {
      // For automatic and hybrid modes, require at least one condition group
      if (
        data.collectionMode === "automatic" ||
        data.collectionMode === "hybrid"
      ) {
        return data.conditions.groups && data.conditions.groups.length > 0;
      }
      return true;
    },
    {
      message:
        "At least one condition group is required for automatic collections",
      path: ["conditions", "groups"],
    }
  );

export const mediaAssetsSchema = z.object({
  images: z.array(z.string()).max(10, "Maximum 10 images allowed"),
  bannerImage: z.string().optional(),
  video: z.string().optional(),
});

export const seoMarketingSchema = z.object({
  metadata: z.object({
    seoTitle: z
      .string()
      .max(60, "SEO title should be under 60 characters for optimal display")
      .optional(),
    seoDescription: z
      .string()
      .max(
        160,
        "SEO description should be under 160 characters for optimal display"
      )
      .optional(),
    keywords: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    targetAudience: z
      .enum(["men", "women", "unisex", "children", ""])
      .optional(),
    seasonality: z.enum(["spring", "summer", "autumn", "winter", "year-round"]),
    popularity: z.number().min(0).max(100).optional(),
    trendingScore: z.number().min(0).max(100).optional(),
  }),
});

export const availabilityTimingSchema = z
  .object({
    isLimitedEdition: z.boolean(),
    availableFrom: z.string().optional(),
    availableUntil: z.string().optional(),
    sortOrder: z.number().min(0, "Sort order cannot be negative"),
  })
  .refine(
    (data) => {
      if (data.availableFrom && data.availableUntil) {
        const fromDate = new Date(data.availableFrom);
        const untilDate = new Date(data.availableUntil);
        return fromDate < untilDate;
      }
      return true;
    },
    {
      message: "Available until date must be after available from date",
      path: ["availableUntil"],
    }
  )
  .refine(
    (data) => {
      if (data.availableFrom) {
        const fromDate = new Date(data.availableFrom);
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Reset time to start of day
        return fromDate >= now;
      }
      return true;
    },
    {
      message: "Available from date cannot be in the past",
      path: ["availableFrom"],
    }
  );

// Base availability schema without refinements
export const baseAvailabilityTimingSchema = z.object({
  isLimitedEdition: z.boolean(),
  availableFrom: z.string().optional(),
  availableUntil: z.string().optional(),
  sortOrder: z.number().min(0, "Sort order cannot be negative"),
});

// Base smart collection rules schema without refinements
export const baseSmartCollectionRulesSchema = z.object({
  collectionMode: z.enum(["manual", "automatic", "hybrid"]),
  conditions: z.object({
    groups: z.array(z.any()).optional(),
    operator: z.enum(["AND", "OR"]),
    isAutomatic: z.boolean(),
    manualProductIds: z.array(z.string()).optional(),
    excludedProductIds: z.array(z.string()).optional(),
  }),
});

// Complete form schema
export const completeCollectionFormSchema = basicInformationSchema
  .merge(collectionPropertiesSchema)
  .merge(baseSmartCollectionRulesSchema)
  .merge(mediaAssetsSchema)
  .merge(seoMarketingSchema)
  .merge(baseAvailabilityTimingSchema)
  .refine(
    (data) => {
      if (
        data.availableFrom &&
        data.availableUntil &&
        typeof data.availableFrom === "string" &&
        typeof data.availableUntil === "string"
      ) {
        const fromDate = new Date(data.availableFrom);
        const untilDate = new Date(data.availableUntil);
        return fromDate < untilDate;
      }
      return true;
    },
    {
      message: "Available until date must be after available from date",
      path: ["availableUntil"],
    }
  )
  .refine(
    (data) => {
      if (data.availableFrom && typeof data.availableFrom === "string") {
        const fromDate = new Date(data.availableFrom);
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Reset time to start of day
        return fromDate >= now;
      }
      return true;
    },
    {
      message: "Available from date cannot be in the past",
      path: ["availableFrom"],
    }
  );

// Validation helper functions
export const validateStep = (
  stepNumber: number,
  data: any
): { isValid: boolean; errors: string[] } => {
  try {
    switch (stepNumber) {
      case 1:
        basicInformationSchema.parse(data);
        break;
      case 2:
        collectionPropertiesSchema.parse(data);
        break;
      case 3:
        baseSmartCollectionRulesSchema.parse(data);
        break;
      case 4:
        mediaAssetsSchema.parse(data);
        break;
      case 5:
        seoMarketingSchema.parse(data);
        break;
      case 6:
        baseAvailabilityTimingSchema.parse(data);
        break;
      default:
        return { isValid: false, errors: ["Invalid step number"] };
    }
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map((err) => err.message),
      };
    }
    return { isValid: false, errors: ["Validation error occurred"] };
  }
};

export const validateCompleteForm = (
  data: any
): { isValid: boolean; errors: Record<string, string[]> } => {
  try {
    completeCollectionFormSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const path = err.path.join(".");
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });
      return { isValid: false, errors };
    }
    return {
      isValid: false,
      errors: { general: ["Validation error occurred"] },
    };
  }
};

// Field-specific validation functions
export const validateField = (
  fieldName: string,
  value: any,
  context?: any
): { isValid: boolean; errors: string[] } => {
  try {
    switch (fieldName) {
      case "name":
        z.string()
          .min(1, "Collection name is required")
          .max(100, "Collection name cannot exceed 100 characters")
          .parse(value);
        break;
      case "slug":
        z.string()
          .min(1, "Slug is required")
          .regex(
            /^[a-z0-9-]+$/,
            "Slug can only contain lowercase letters, numbers, and hyphens"
          )
          .parse(value);
        break;
      case "shortDescription":
        if (value)
          z.string()
            .max(500, "Short description cannot exceed 500 characters")
            .parse(value);
        break;
      case "description":
        if (value)
          z.string()
            .max(2000, "Description cannot exceed 2000 characters")
            .parse(value);
        break;
      case "seoTitle":
        if (value)
          z.string()
            .max(
              60,
              "SEO title should be under 60 characters for optimal display"
            )
            .parse(value);
        break;
      case "seoDescription":
        if (value)
          z.string()
            .max(
              160,
              "SEO description should be under 160 characters for optimal display"
            )
            .parse(value);
        break;
      case "priceRange":
        collectionPropertiesSchema.shape.priceRange.parse(value);
        break;
      case "sortOrder":
        z.number().min(0, "Sort order cannot be negative").parse(value);
        break;
      case "images":
        z.array(z.string()).max(10, "Maximum 10 images allowed").parse(value);
        break;
      default:
        return { isValid: true, errors: [] };
    }
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map((err) => err.message),
      };
    }
    return { isValid: false, errors: ["Validation error occurred"] };
  }
};

// Custom validation hooks
export const useFormValidation = () => {
  const validateStepData = (stepNumber: number, data: any) => {
    return validateStep(stepNumber, data);
  };

  const validateFieldData = (fieldName: string, value: any, context?: any) => {
    return validateField(fieldName, value, context);
  };

  const validateCompleteFormData = (data: any) => {
    return validateCompleteForm(data);
  };

  return {
    validateStep: validateStepData,
    validateField: validateFieldData,
    validateCompleteForm: validateCompleteFormData,
  };
};

// Error message helpers
export const getFieldErrorMessage = (
  fieldName: string,
  errors: string[]
): string => {
  if (errors.length === 0) return "";
  return errors[0]; // Return the first error message
};

export const hasFieldError = (
  fieldName: string,
  validationState: any
): boolean => {
  return validationState[fieldName]?.errors?.length > 0;
};

export const getStepErrorCount = (
  stepNumber: number,
  validationState: any
): number => {
  const stepFields = getStepFields(stepNumber);
  return stepFields.reduce((count, field) => {
    return count + (validationState[field]?.errors?.length || 0);
  }, 0);
};

// Helper function to get fields for each step
const getStepFields = (step: number): string[] => {
  switch (step) {
    case 1:
      return ["name", "slug", "shortDescription", "description"];
    case 2:
      return ["materialType", "gemstoneType", "styleCategory", "priceRange"];
    case 3:
      return ["collectionMode", "conditions"];
    case 4:
      return ["images", "bannerImage", "video"];
    case 5:
      return ["sortOrder", "availableFrom", "availableUntil"];
    default:
      return [];
  }
};
