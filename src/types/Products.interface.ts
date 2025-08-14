export interface ProductVariant {
  _id?: string;
  sku?: string; // Optional - auto-generated if not provided
  price: number;
  wt: number;
  unit: string;
  totalStock: number;
  usedStock: number;
  remainingStock: number;
  reorderPoint: number;
  costPrice?: number; // For profit margin calculations
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Product {
  _id: string;
  name: string;
  slug: string; // For SEO-friendly URLs
  description: string;
  category: string;
  subCategory: string;
  variants: ProductVariant[];
  makingCharges: number;

  // Required product type from server model
  productType: "gold" | "silver" | "platinum" | "diamond";

  // Stones configuration
  stones: {
    name: string;
    weight: string;
    price: string;
    color: string;
  }[];

  // Wastage configuration
  wastage: {
    type: "fixed" | "per";
    value: number;
  };

  // Other charges
  others: {
    name: string;
    value: number;
  }[];

  // Occasions and Collections references
  occasions?: string[]; // Array of occasion ObjectIds
  collections?: string[]; // Array of collection ObjectIds

  // Physical properties
  length?: number;
  claspType?: string;
  rhodoumFinishes: boolean;
  shape?: string;
  quantity: number;
  totalCarat?: number;
  color?: string;
  clarity?: string;
  dimension?: number;
  gender?: "male" | "female" | "unisex"; // Target gender

  // SEO and marketing
  tags: string[];
  visibleAs: string;
  images: string[];

  // Reviews and ratings
  averageRating: number;
  numberOfReviews: number;
  reviews: string[]; // Array of review ObjectIds

  // Legacy/mock properties for backward compatibility
  id?: string;
  title?: string;
  price?: number;
  originalPrice?: number;
  rating?: number;
  onSale?: boolean;
  image?: string;
  status?: string;
  inventory?: {
    sku: number;
    stockQty: number;
    reorderLevel: number;
  };
  specifications?: {
    length: string;
    claspType: string;
    rhodiumFinish: string;
  };
  natural?: {
    shape: string;
    color: string;
    quantity: string;
    clarity: string;
    totalcarat: string;
    carat: string;
  };


  // Status and inventory
  isActive: boolean;
  isFeatured: boolean;
  newArrivalsDate?: Date; // Track when product was marked as newArrivals

  // Enhanced Metadata
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
    vendor?: string;
    barcode?: string;
    compareAtPrice?: number;
  };

  // Audit fields
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// =====================================================
// CATEGORY INTERFACES
// =====================================================

export interface Category {
  _id: string;
  name: string;
  slug: string; // For SEO-friendly URLs
  description: string;
  totalProducts: number;
  isActive: boolean;
  subCategory: string[]; // Array of SubCategory ObjectIds
  sortOrder: number; // For ordering categories
  images: string[]; // Array of image URLs
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubCategory {
  _id: string;
  name: string;
  slug: string; // For SEO-friendly URLs
  description: string;
  totalProducts: number;
  isActive: boolean;
  category: string; // Parent category ObjectId
  sortOrder: number; // For ordering subcategories
  images: string[]; // Array of image URLs
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// =====================================================
// CLASP TYPE INTERFACE
// =====================================================

export interface ClaspType {
  _id: string;
  name: string;
  images: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// =====================================================
// OCCASION INTERFACE
// =====================================================

export interface Occasion {
  _id: string;
  name: string;
  slug: string; // For SEO-friendly URLs
  description: string;
  totalProducts: number;
  isActive: boolean;
  sortOrder: number;
  image: string[];
  video: string;
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
    seasonality?: "spring" | "summer" | "autumn" | "winter" | "year-round";
    popularity?: number; // For trending occasions
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// =====================================================
// COLLECTION INTERFACE
// =====================================================

export interface Collection {
  _id: string;
  name: string;
  slug: string; // For SEO-friendly URLs
  description: string;
  collectionType: "seasonal" | "bridal" | "casual" | "formal" | "traditional" | "modern";
  materialType: "gold" | "silver" | "platinum" | "diamond" | "mixed";
  gemstoneType?: "diamond" | "ruby" | "emerald" | "sapphire" | "pearl" | "mixed" | "none";
  styleCategory: "classic" | "contemporary" | "vintage" | "minimalist" | "statement" | "ethnic";
  totalProducts: number;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
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
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
