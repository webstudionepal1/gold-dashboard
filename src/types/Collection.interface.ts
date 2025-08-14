// =====================================================
// COLLECTION INTERFACES
// =====================================================

// Re-export the existing collection interface from hooks for consistency
export interface Collection {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  totalProducts: number;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;

  // Collection type and categorization
  collectionType:
    | "material"
    | "gemstone"
    | "style"
    | "occasion"
    | "product_type"
    | "designer"
    | "price_range"
    | "seasonal"
    | "custom";

  // Smart Collection System
  collectionMode: "manual" | "automatic" | "hybrid";

  // Visual assets
  images: string[];
  bannerImage?: string;
  video?: string;

  // Collection properties specific to jewelry
  materialType?:
    | "gold"
    | "silver"
    | "platinum"
    | "rose_gold"
    | "white_gold"
    | "mixed"
    | "other";
  gemstoneType?:
    | "diamond"
    | "ruby"
    | "emerald"
    | "sapphire"
    | "pearl"
    | "mixed"
    | "none"
    | "other";
  styleCategory?:
    | "vintage"
    | "modern"
    | "classic"
    | "contemporary"
    | "minimalist"
    | "bohemian"
    | "luxury"
    | "other";

  // Price range for collection
  priceRange?: {
    min: number;
    max: number;
    currency: string;
  };

  // Collection availability and timing
  isLimitedEdition: boolean;
  availableFrom?: Date;
  availableUntil?: Date;

  // SEO and marketing
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
    tags?: string[];
    targetAudience?: "men" | "women" | "unisex" | "children";
    seasonality?: "spring" | "summer" | "autumn" | "winter" | "year-round";
    popularity?: number;
    trendingScore?: number;
  };

  // Audit fields
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Form data interface for creating/updating collections
export interface CollectionFormData {
  name: string;
  slug?: string;
  description: string;
  collectionType: "seasonal" | "bridal" | "casual" | "formal" | "traditional" | "modern";
  materialType: "gold" | "silver" | "platinum" | "diamond" | "mixed";
  gemstoneType?: "diamond" | "ruby" | "emerald" | "sapphire" | "pearl" | "mixed" | "none";
  styleCategory: "classic" | "contemporary" | "vintage" | "minimalist" | "statement" | "ethnic";
  isActive?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
  images: string[];
  bannerImage?: string;
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
    targetAudience?: string[];
    priceRange?: {
      min: number;
      max: number;
    };
  };
}

// Collection filters for search and filtering
export interface CollectionFilters {
  search?: string;
  collectionType?: string;
  materialType?: string;
  gemstoneType?: string;
  styleCategory?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

// Collection pagination
export interface CollectionPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

// Collection list response
export interface CollectionListResponse {
  collections: Collection[];
  pagination: CollectionPagination;
  filters: CollectionFilters;
}

// Constants for collection types
export const COLLECTION_TYPES = [
  { value: "material", label: "Material" },
  { value: "gemstone", label: "Gemstone" },
  { value: "style", label: "Style" },
  { value: "occasion", label: "Occasion" },
  { value: "product_type", label: "Product Type" },
  { value: "designer", label: "Designer" },
  { value: "price_range", label: "Price Range" },
  { value: "seasonal", label: "Seasonal" },
  { value: "custom", label: "Custom" },
] as const;

export const COLLECTION_MODES = [
  { value: "manual", label: "Manual" },
  { value: "automatic", label: "Automatic" },
  { value: "hybrid", label: "Hybrid" },
] as const;

export const MATERIAL_TYPES = [
  { value: "gold", label: "Gold" },
  { value: "silver", label: "Silver" },
  { value: "platinum", label: "Platinum" },
  { value: "rose_gold", label: "Rose Gold" },
  { value: "white_gold", label: "White Gold" },
  { value: "mixed", label: "Mixed" },
  { value: "other", label: "Other" },
] as const;

export const GEMSTONE_TYPES = [
  { value: "diamond", label: "Diamond" },
  { value: "ruby", label: "Ruby" },
  { value: "emerald", label: "Emerald" },
  { value: "sapphire", label: "Sapphire" },
  { value: "pearl", label: "Pearl" },
  { value: "mixed", label: "Mixed" },
  { value: "none", label: "None" },
  { value: "other", label: "Other" },
] as const;

export const STYLE_CATEGORIES = [
  { value: "vintage", label: "Vintage" },
  { value: "modern", label: "Modern" },
  { value: "classic", label: "Classic" },
  { value: "contemporary", label: "Contemporary" },
  { value: "minimalist", label: "Minimalist" },
  { value: "bohemian", label: "Bohemian" },
  { value: "luxury", label: "Luxury" },
  { value: "other", label: "Other" },
] as const;
