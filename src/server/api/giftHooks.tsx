import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";
import { toast } from "react-toastify";
import {
  handleMutationError,
  handleMutationSuccess,
} from "../../utils/errorHandler";

export interface IParams {
  [key: string]: string | number | boolean | undefined;
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  type?: "gift" | "package";
  occasion?: string;
  setType?: "necklace_set" | "bridal_set" | "earring_set" | "bracelet_set" | "ring_set" | "custom";
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
}

export interface IFetchCategory {
  _id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  subCategory: IFetchSubCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface IFetchSubCategory {
  _id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IFetchClaspType {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProductVariant {
  price: number;
  wt: number;
  unit: string;
}

export interface IFetchProduct {
  _id: string;
  name: string;
  description: string;
  category: IFetchCategory;
  subCategory: IFetchSubCategory;
  variant: IProductVariant[];
  makingCharges: number;
  length: number;
  claspType: IFetchClaspType;
  rhodoumFinishes: boolean;
  shape: string;
  quantity: number;
  totalCarat: number;
  color: string;
  clarity: string;
  dimension: number;
  tags: string[];
  visibleAs: string;
  images: string[];
  averageRating: number;
  numberOfReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface IGiftProduct {
  product: IFetchProduct;
  quantity: number;
  isOptional: boolean;
  alternativeProducts: IFetchProduct[];
}

export interface IFetchGift {
  _id: string;
  name: string;
  description: string;
  type: "gift" | "package"; // Distinguish between gifts and packages

  // Product collection
  products: IGiftProduct[];

  // Pricing strategy
  pricingType: "fixed" | "calculated" | "discounted";
  fixedPrice?: number; // For fixed pricing
  discountPercentage?: number; // For discounted pricing (% off total product prices)
  discountAmount?: number; // For discounted pricing (fixed amount off)
  totalPrice?: number; // Legacy field for backward compatibility
  finalPrice?: number; // Legacy field for backward compatibility

  // Categorization
  category?: string; // Reference to category ID
  setCategory?: string; // Reference to set category for jewelry sets
  occasion?: string; // e.g., "Wedding", "Anniversary", "Birthday"
  tags: string[];

  // Set-specific features
  setType?: "necklace_set" | "bridal_set" | "earring_set" | "bracelet_set" | "ring_set" | "custom";
  complementaryProducts?: string[]; // Suggested additional product IDs
  setTheme?: string; // e.g., "Traditional", "Modern", "Vintage"
  metalType?: string; // e.g., "Gold", "Silver", "Platinum"
  stoneType?: string; // e.g., "Diamond", "Ruby", "Emerald"

  // Availability
  isActive: boolean;
  isAvailable: boolean;
  availableFrom?: string; // Date string
  availableTo?: string; // Date string

  // Stock management
  stockType: "unlimited" | "limited" | "based_on_products";
  totalStock?: number; // For limited stock
  usedStock?: number;
  remainingStock?: number;

  // Media and presentation
  images: string[];
  featuredImage?: string;

  // SEO and visibility
  slug?: string;
  visibleAs: string; // How it appears in listings

  // Ratings and reviews
  averageRating?: number;
  numberOfReviews?: number;
  reviews?: string[]; // Array of review IDs

  // Metadata
  weight?: number; // Total estimated weight
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };

  // Special features
  isCustomizable: boolean; // Whether customers can modify the set
  allowPartialPurchase: boolean; // Whether customers can buy individual items from the set

  // Business logic
  minimumOrderQuantity?: number;
  maximumOrderQuantity?: number;

  // Legacy fields for backward compatibility
  priority?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IGiftResponse {
  success: boolean;
  message: string;
  data: {
    gifts: IFetchGift[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export interface ICreateGiftData {
  name: string;
  description: string;
  type: "gift" | "package"; // Distinguish between gifts and packages

  // Product collection
  products: {
    product: string;
    quantity: number;
    isOptional: boolean;
    alternativeProducts?: string[];
  }[];

  // Pricing strategy
  pricingType: "fixed" | "calculated" | "discounted";
  fixedPrice?: number; // For fixed pricing
  discountPercentage?: number; // For discounted pricing (% off total product prices)
  discountAmount?: number; // For discounted pricing (fixed amount off)

  // Categorization
  category?: string; // Reference to category ID
  setCategory?: string; // Reference to set category for jewelry sets
  occasion?: string; // e.g., "Wedding", "Anniversary", "Birthday"
  tags?: string[];

  // Set-specific features
  setType?: "necklace_set" | "bridal_set" | "earring_set" | "bracelet_set" | "ring_set" | "custom";
  complementaryProducts?: string[]; // Suggested additional product IDs
  setTheme?: string; // e.g., "Traditional", "Modern", "Vintage"
  metalType?: string; // e.g., "Gold", "Silver", "Platinum"
  stoneType?: string; // e.g., "Diamond", "Ruby", "Emerald"

  // Availability
  isActive?: boolean;
  isAvailable?: boolean;
  availableFrom?: string; // Date string
  availableTo?: string; // Date string

  // Stock management
  stockType?: "unlimited" | "limited" | "based_on_products";
  totalStock?: number; // For limited stock
  usedStock?: number;
  remainingStock?: number;

  // Media and presentation
  images?: string[];
  featuredImage?: string;

  // SEO and visibility
  slug?: string;
  visibleAs?: string; // How it appears in listings

  // Ratings and reviews
  averageRating?: number;
  numberOfReviews?: number;
  reviews?: string[]; // Array of review IDs

  // Metadata
  weight?: number; // Total estimated weight
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };

  // Special features
  isCustomizable?: boolean; // Whether customers can modify the set
  allowPartialPurchase?: boolean; // Whether customers can buy individual items from the set

  // Business logic
  minimumOrderQuantity?: number;
  maximumOrderQuantity?: number;

  // Legacy fields for backward compatibility
  priority?: number;
}

export interface IUpdateGiftData extends Partial<ICreateGiftData> {
  _id: string;
}

// Get all gifts with pagination and filters
export const useGetAllGiftsQuery = (params: IParams = {}) => {
  return useQuery({
    queryKey: ["gifts", params],
    queryFn: async () => {
      try {
        const res = await apiClient.get<IGiftResponse | { success: boolean; message: string; data: IFetchGift[] }>("gift", {
          params,
        });
        
        // Handle both response formats
        if (res?.data) {
          // If data is directly an array (new format)
          if (Array.isArray(res.data.data)) {
            return {
              success: res.data.success,
              message: res.data.message,
              data: res.data.data,
              pagination: { currentPage: 1, totalPages: 1, totalItems: res.data.data.length, itemsPerPage: res.data.data.length }
            };
          }
          // If data has gifts property (old format)
          return res.data;
        }
        
        return { data: { gifts: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0, itemsPerPage: 20 } }, success: false, message: "No data" };
      } catch (error) {
        console.error("Error fetching gifts:", error);
        return { data: { gifts: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0, itemsPerPage: 20 } }, success: false, message: "Error fetching gifts" };
      }
    },
  });
};

// Get gift by ID
export const useGetGiftByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["gift", id],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchGift }>(`gift/${id}`);
      return res?.data?.data;
    },
    enabled: !!id,
  });
};

// Create gift mutation
export const useCreateGiftMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ICreateGiftData) => {
      const res = await apiClient.post<{ data: IFetchGift }>("gift", data);
      return res?.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["gifts"] });
      handleMutationSuccess("Gift created successfully");
    },
    onError: (error) => {
      handleMutationError(error, "Failed to create gift");
    },
  });
};

// Update gift mutation
export const useUpdateGiftMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ICreateGiftData> }) => {
      const res = await apiClient.patch<{ data: IFetchGift }>(`gift/${id}`, data);
      return res?.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["gifts"] });
      queryClient.invalidateQueries({ queryKey: ["gift"] });
      handleMutationSuccess("Gift updated successfully");
    },
    onError: (error) => {
      handleMutationError(error, "Failed to update gift");
    },
  });
};

// Delete gift mutation
export const useDeleteGiftMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`gift/${id}`);
      return res?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gifts"] });
      handleMutationSuccess("Gift deleted successfully");
    },
    onError: (error) => {
      handleMutationError(error, "Failed to delete gift");
    },
  });
};

// Toggle gift status mutation
export const useToggleGiftStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await apiClient.patch(`gift/${id}/status`, { isActive });
      return res?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gifts"] });
      queryClient.invalidateQueries({ queryKey: ["gift"] });
      handleMutationSuccess("Gift status updated successfully");
    },
    onError: (error) => {
      handleMutationError(error, "Failed to update gift status");
    },
  });
};