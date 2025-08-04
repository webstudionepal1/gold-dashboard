import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";
import { toast } from "react-toastify";

export interface IParams {
  [key: string]: string | number | boolean;
}

// Smart Collection Condition Interfaces
export interface IConditionRule {
  field: string;
  operator:
    | "equals"
    | "not_equals"
    | "contains"
    | "not_contains"
    | "starts_with"
    | "ends_with"
    | "greater_than"
    | "less_than"
    | "greater_than_or_equal"
    | "less_than_or_equal"
    | "in"
    | "not_in"
    | "exists"
    | "not_exists"
    | "between";
  value: any;
  valueType: "string" | "number" | "boolean" | "array" | "date";
}

export interface IConditionGroup {
  rules: IConditionRule[];
  operator: "AND" | "OR";
}

export interface ISmartCollectionConditions {
  groups: IConditionGroup[];
  operator: "AND" | "OR";
  isAutomatic: boolean;
  manualProductIds?: string[];
  excludedProductIds?: string[];
}

export interface IFetchCollection {
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
  conditions?: ISmartCollectionConditions;

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
  createdAt?: string;
  updatedAt?: string;
}

// Get all collections
export const useGetAllCollectionsQuery = (params: IParams = {}) => {
  return useQuery({
    queryKey: ["collections", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchCollection[] }>(
        "collection",
        {
          params,
        }
      );
      return res?.data?.data;
    },
  });
};

// Get collection by ID
export const useGetCollectionByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["collection", id],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchCollection }>(
        `collection/${id}`
      );
      return res?.data?.data;
    },
    enabled: !!id,
  });
};

// Get featured collections
export const useGetFeaturedCollectionsQuery = (limit: number = 10) => {
  return useQuery({
    queryKey: ["collections", "featured", limit],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchCollection[] }>(
        `collection/featured?limit=${limit}`
      );
      return res?.data?.data;
    },
  });
};

// Get collections by type
export const useGetCollectionsByTypeQuery = (type: string) => {
  return useQuery({
    queryKey: ["collections", "by-type", type],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchCollection[] }>(
        `collection/by-type/${type}`
      );
      return res?.data?.data;
    },
    enabled: !!type,
  });
};

// Get collections by material
export const useGetCollectionsByMaterialQuery = (material: string) => {
  return useQuery({
    queryKey: ["collections", "by-material", material],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchCollection[] }>(
        `collection/by-material/${material}`
      );
      return res?.data?.data;
    },
    enabled: !!material,
  });
};

// Get collections by gemstone
export const useGetCollectionsByGemstoneQuery = (gemstone: string) => {
  return useQuery({
    queryKey: ["collections", "by-gemstone", gemstone],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchCollection[] }>(
        `collection/by-gemstone/${gemstone}`
      );
      return res?.data?.data;
    },
    enabled: !!gemstone,
  });
};

// Get collections by style
export const useGetCollectionsByStyleQuery = (style: string) => {
  return useQuery({
    queryKey: ["collections", "by-style", style],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchCollection[] }>(
        `collection/by-style/${style}`
      );
      return res?.data?.data;
    },
    enabled: !!style,
  });
};

// Get trending collections
export const useGetTrendingCollectionsQuery = (limit: number = 10) => {
  return useQuery({
    queryKey: ["collections", "trending", limit],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchCollection[] }>(
        `collection/trending?limit=${limit}`
      );
      return res?.data?.data;
    },
  });
};

// Get available collections
export const useGetAvailableCollectionsQuery = () => {
  return useQuery({
    queryKey: ["collections", "available"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchCollection[] }>(
        "collection/available"
      );
      return res?.data?.data;
    },
  });
};

// Get limited edition collections
export const useGetLimitedEditionCollectionsQuery = () => {
  return useQuery({
    queryKey: ["collections", "limited-edition"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchCollection[] }>(
        "collection/limited-edition"
      );
      return res?.data?.data;
    },
  });
};

// Create collection
export const useCreateCollectionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["collections"],
    mutationFn: async (body: FormData) => {
      const res = await apiClient.post("collection", body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Collection created successfully");
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
    onError(err: any) {
      // toast.error(err?.response?.data?.message || "Error creating collection");
      toast.error("Error creating collection");
    },
  });
};

// Update collection
export const useUpdateCollectionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["collections"],
    mutationFn: async ({ id, body }: { id: string; body: FormData }) => {
      const res = await apiClient.patch(`collection/${id}`, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Collection updated successfully");
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
    onError(err: any) {
      // toast.error(err?.response?.data?.message || "Error updating collection");
      toast.error("Error updating collection");
    },
  });
};

// Calculate collection price range
export const useCalculateCollectionPriceRangeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["collections", "calculate-price-range"],
    mutationFn: async (collectionId: string) => {
      const res = await apiClient.post(
        `collection/${collectionId}/calculate-price-range`
      );
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Price range calculated successfully");
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
    onError(err: any) {
      // toast.error(
      //   err?.response?.data?.message || "Error calculating price range"
      // );
      toast.error("Error calculating price range");
    },
  });
};

// Calculate all collections price ranges
export const useCalculateAllCollectionsPriceRangesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["collections", "calculate-all-price-ranges"],
    mutationFn: async () => {
      const res = await apiClient.post("collection/calculate-all-price-ranges");
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("All collection price ranges calculated successfully");
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
    onError(err: any) {
      // toast.error(
      //   err?.response?.data?.message || "Error calculating price ranges"
      // );
      toast.error("Error calculating price ranges");
    },
  });
};

// Delete collection
export const useDeleteCollectionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["collections"],
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`collection/${id}`);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Collection deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
    onError(err: any) {
      // toast.error(err?.response?.data?.message || "Error deleting collection");
      toast.error("Error deleting collection");
    },
  });
};

// Update collection products (for smart collections)
export const useUpdateCollectionProductsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["collections"],
    mutationFn: async (id: string) => {
      const res = await apiClient.post(`collection/${id}/update-products`);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Collection products updated successfully");
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
    onError(err: any) {
      // toast.error(
      //   err?.response?.data?.message || "Error updating collection products"
      // );
      toast.error("Error updating collection products");
    },
  });
};

// Preview collection products
export const usePreviewCollectionProductsMutation = () => {
  return useMutation({
    mutationKey: ["collections", "preview-products"],
    mutationFn: async ({
      collectionId,
      conditions,
    }: {
      collectionId?: string;
      conditions: ISmartCollectionConditions;
    }) => {
      // If we have a collection ID, use the existing collection endpoint
      if (collectionId) {
        const res = await apiClient.post(
          `collection/${collectionId}/preview-products`
        );
        return res?.data?.data;
      }

      // For new collections, use the new endpoint that accepts conditions directly
      const res = await apiClient.post(
        "collection/preview-products-by-conditions",
        {
          conditions,
        }
      );
      return res?.data?.data;
    },
    onError(err: any) {
      console.error("Error previewing collection products:", err);
    },
  });
};

// Get collection condition fields
export const useGetCollectionConditionFieldsQuery = () => {
  return useQuery({
    queryKey: ["collection-condition-fields"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: any[] }>(
        "collection/condition-fields"
      );
      return res?.data?.data;
    },
  });
};
