export interface ProductVariant {
  _id?: string;
  sku: string;
  price: number;
  wt: number;
  unit: string;
  totalStock: number;
  usedStock: number;
  remainingStock: number;
  reorderPoint: number;
  costPrice?: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  subCategory: string;
  variants: ProductVariant[];
  makingCharges: number;

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

  // SEO and marketing
  tags: string[];
  visibleAs: string;
  images: string[];

  // Reviews and ratings
  averageRating: number;
  numberOfReviews: number;

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
  reviews?: {
    average: number;
    count: number;
    items: Array<{
      author: string;
      rating: number;
      verified: boolean;
      text: string;
    }>;
  };

  // Status and inventory
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

  // Audit fields
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;

}
