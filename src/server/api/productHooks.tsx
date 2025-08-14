import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";
import capitalize from "lodash/capitalize";
import { toast } from "react-toastify";
export interface IParams {
  [key: string]: string;
}

export interface IBaseProductSubCategory {
  _id?: string;
  name?: string;
  slug?: string; // For SEO-friendly URLs
  description?: string;
  totalProducts?: number;
  isActive?: boolean;
  category?: string;
  sortOrder?: number; // For ordering subcategories
  images?: string[]; // Array of image URLs
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
  };
}
export interface IFetchSubCategory extends IBaseProductSubCategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

export interface IProductCategory {
  _id?: string;
  name?: string;
  slug?: string; // For SEO-friendly URLs
  description?: string;
  totalProducts?: number;
  isActive?: boolean;
  subCategory?: IProductCategory[];
  sortOrder?: number; // For ordering categories
  images?: string[]; // Array of image URLs (changed from single image)
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
  };
}
export interface IFetchCategory extends IProductCategory {
  _id: string;
  name: string;
  slug: string;
}
export interface StockItem {
  usedStock: number;
  price: number;
  unit: string;
  _id: string;
  wt: number;
  remainingStock: number;
  totalStock: number;
}

export interface IBaseProduct {
  _id?: string;
  name?: string;
  slug?: string;
  description?: string;
  category?: string;
  subCategory?: string;
  variant?: Array<{
    sku?: string; // Optional - auto-generated if not provided
    price?: number;
    wt?: number;
    unit?: string;
    totalStock?: number;
    usedStock?: number;
    remainingStock?: number;
    reorderPoint?: number;
    costPrice?: number;
  }>;
  makingCharges?: number;

  // Required product type from server model
  productType?: "gold" | "silver" | "platinum" | "diamond";

  // Stones configuration
  stones?: Array<{
    name: string;
    weight: string;
    price: string;
    color: string;
  }>;

  // Wastage configuration
  wastage?: {
    type: "fixed" | "per";
    value: number;
  };

  // Other charges
  others?: Array<{
    name: string;
    value: number;
  }>;

  // Occasions and Collections references
  occasions?: string[]; // Array of occasion ObjectIds
  collections?: string[]; // Array of collection ObjectIds

  length?: number;
  claspType?: string;
  rhodoumFinishes?: boolean;
  shape?: string;
  quantity?: number;
  totalCarat?: number;
  color?: string;
  clarity?: string;
  dimension?: number;
  gender?: "male" | "female" | "unisex"; // Target gender

  // SEO and marketing
  tags?: string[];
  visibleAs?: string;
  images?: string[];
  averageRating?: number;
  numberOfReviews?: number;
  reviews?: string[]; // Array of review ObjectIds

  // Status and inventory
  isActive?: boolean;
  isFeatured?: boolean;
  newArrivalsDate?: Date; // Track when product was marked as newArrivals
}
export interface IFetchProduct {
  _id: string;
  name: string;
  slug: string;
  ratings: number;
  description: string;
  category: IFetchCategory;
  subCategory: IFetchSubCategory;
  averageRating?: number;
  numberOfReviews?: number;
  reviews: string[]; // Array of review ObjectIds
  variants: Array<{
    _id?: string;
    sku?: string; // Optional - auto-generated if not provided
    price: number;
    wt: number;
    unit: string;
    totalStock: number;
    usedStock: number;
    remainingStock: number;
    reorderPoint: number;
    costPrice?: number;
    isActive: boolean;
  }>;
  makingCharges: number;

  // Required product type from server model
  productType: "gold" | "silver" | "platinum" | "diamond";

  // Stones configuration
  stones: Array<{
    name: string;
    weight: string;
    price: string;
    color: string;
  }>;

  // Wastage configuration
  wastage: {
    type: "fixed" | "per";
    value: number;
  };

  // Other charges
  others: Array<{
    name: string;
    value: number;
  }>;

  // Occasions and Collections references
  occasions?: IFetchOccasion[]; // Populated occasion objects
  collections?: IFetchCollection[]; // Populated collection objects

  length: number;
  claspType: IFetchClasps;
  rhodoumFinishes: boolean;
  shape: string;
  quantity: number;
  gender: string;
  totalCarat: number;
  color: string;
  clarity: string;
  dimension: number;
  tags: string[];
  visibleAs: string;
  images: string[];
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

//clasps interfaces
export interface IFetchClasps {
  name: string;
  images?: string[];
  _id: string;
  isActive: boolean;
}

//occasion interfaces
export interface IFetchOccasion {
  _id: string;
  name: string;
  slug: string;
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
    popularity?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

//collection interfaces
export interface IFetchCollection {
  _id: string;
  name: string;
  slug: string;
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

//Products routes
export const useGetAllProductsQuery = (params: IParams = {}) => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchProduct[] }>("product", {
        params,
      });
      return res?.data?.data;
    },
  });
};
export const useGetProductById = (id: string) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchProduct }>(`product/${id}`);
      return res?.data?.data;
    },
  });
};

export const useGetProductByIdQuery = (
  id: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchProduct }>(`product/${id}`);
      return res?.data;
    },
    enabled: !!id && options?.enabled !== false,
  });
};

export const useCreateProductsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["products"],
    mutationFn: async (body: FormData) => {
      const res = await apiClient.post("product", body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError(err: any) {
      toast.error(capitalize(err || 'Error Creating Product'));
    },
  });
};
export const useUpdateProductsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["products"],
    mutationFn: async ({
      id,
      body,
    }: {
      id: string | undefined;
      body: FormData;
    }) => {
      const res = await apiClient.patch(`product/${id}`, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res?.data?.data;
    },

    onSuccess() {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError(err: any) {
      console.error("Product update error:", err);
      toast.error(
        err?.response?.data?.message || err?.message || "Error updating product"
      );
    },
  });
};

export const useDeleteProductsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["products"],
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`product/${id}`);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError(err: string) {
      // toast.error(err || "Error deleting products");
      toast.error("Error deleting products");
    },
  });
};

//Product category
export const useGetAllProductCategoriesQuery = (params: IParams = {}) => {
  return useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchCategory[] }>("category", {
        params,
      });
      return res?.data?.data;
    },
  });
};

export const useCreateProductCategoriesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["category"],
    mutationFn: async (body: IProductCategory | FormData) => {
      const isFormData = body instanceof FormData;
      const res = await apiClient.post("category", body, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
      });
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Product category created successfully");
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
    onError(err: string) {
      // toast.error(err || "Error creating product category");
      toast.error("Error creating product category");
    },
  });
};
export const useUpdateProductCategoriesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["category"],
    mutationFn: async ({
      id,
      body,
    }: {
      id: string | undefined;
      body: IProductCategory | FormData;
    }) => {
      const isFormData = body instanceof FormData;
      const res = await apiClient.patch(`category/${id}`, body, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
      });
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Product category updated successfully");
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
    onError(err: string) {
      // toast.error(err || "Error updating product category");
      toast.error("Error updating product category");
    },
  });
};

export const useDeleteProductCategoriesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["category"],
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`category/${id}`);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Product category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
    onError(err: string) {
      // toast.error(err || "Error deleting product category");
      toast.error("Error deleting product category");
    },
  });
};

// Product sub category
export const useGetAllProductSubCategoriesQuery = (params: IParams = {}) => {
  return useQuery({
    queryKey: ["subcategory"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchSubCategory[] }>(
        "subcategory",
        { params }
      );
      return res?.data?.data;
    },
  });
};

export const useCreateProductSubCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["subcategory"],
    mutationFn: async (body: IBaseProductSubCategory) => {
      const res = await apiClient.post("subcategory", body);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Product subcategory created successfully");
      queryClient.invalidateQueries({ queryKey: ["subcategory"] });
    },
    onError(err: string) {
      // toast.error(err || "Error creating product subcategory");
      toast.error("Error creating product subcategory");
    },
  });
};

export const useUpdateProductSubCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["subcategory"],
    mutationFn: async ({
      id,
      body,
    }: {
      id: string | undefined;
      body: IBaseProductSubCategory;
    }) => {
      const res = await apiClient.patch(`subcategory/${id}`, body);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Product subcategory updated successfully");
      queryClient.invalidateQueries({ queryKey: ["subcategory"] });
    },
    onError(err: string) {
      // toast.error(err || "Error updating product subcategory");
      toast.error("Error updating product subcategory");
    },
  });
};

export const useDeleteProductSubCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["subcategory"],
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`subcategory/${id}`);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Product subcategory deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["subcategory"] });
    },
    onError(err: string) {
      // toast.error(err || "Error deleting product subcategory");
      toast.error("Error deleting product subcategory");
    },
  });
};
// Product clasp
export const useGetAllProductClaspsQuery = (params: IParams = {}) => {
  return useQuery({
    queryKey: ["clasptype"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchClasps[] }>("clasptype", {
        params,
      });
      return res?.data?.data;
    },
  });
};

export const useCreateProductClaspsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["clasptype"],
    mutationFn: async (body: FormData) => {
      const res = await apiClient.post("clasptype", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Product clasp created successfully");
      queryClient.invalidateQueries({ queryKey: ["clasptype"] });
    },
    onError(err: string) {
      // toast.error(err || "Error creating product clasp");
      toast.error("Error creating product clasp");
    },
  });
};

export const useUpdateProductClaspsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["clasptype"],
    mutationFn: async ({ id, body }: { id: string; body: FormData }) => {
      const res = await apiClient.patch(`clasptype/${id}`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Product clasp updated successfully");
      queryClient.invalidateQueries({ queryKey: ["clasptype"] });
    },
    onError(err: string) {
      // toast.error(err || "Error updating product clasp");
      toast.error("Error updating product clasp");
    },
  });
};

export const useDeleteProductClaspsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["clasptype"],
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`clasptype/${id}`);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Product clasp deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["clasptype"] });
    },
    onError(err: string) {
      // toast.error(err || "Error deleting product clasp");
      toast.error("Error deleting product clasp");
    },
  });
};

// Stone-related exports (placeholders for now - these should be moved to a separate stoneHooks.tsx file)
export interface IFetchStone {
  _id: string;
  name: string;
  type: "diamond" | "ruby" | "emerald" | "sapphire" | "pearl" | "other";
  color: string;
  clarity: string;
  cut: string;
  carat: number;
  pricePerCarat: number;
  totalPrice: number;
  shape: string;
  certification?: string;
  description?: string;
  images: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const useGetAllStonesQuery = (params: IParams = {}) => {
  return useQuery({
    queryKey: ["stone", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: { stones: IFetchStone[] } }>(
        "stone",
        {
          params,
        }
      );
      return res?.data?.data?.stones;
    },
  });
};

export const useCreateStoneMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["stone"],
    mutationFn: async (body: FormData) => {
      const res = await apiClient.post("stone", body);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Stone created successfully");
      queryClient.invalidateQueries({ queryKey: ["stone"] });
    },
    onError(err: string) {
      // toast.error(err || "Error creating stone");
      toast.error("Error creating stone");
    },
  });
};

export const useUpdateStoneMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["stone"],
    mutationFn: async ({ id, body }: { id: string; body: FormData }) => {
      const res = await apiClient.put(`stone/${id}`, body);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Stone updated successfully");
      queryClient.invalidateQueries({ queryKey: ["stone"] });
    },
    onError(err: string) {
      // toast.error(err || "Error updating stone");
      toast.error("Error updating stone");
    },
  });
};

export const useDeleteStoneMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["stones"],
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`stone/${id}`);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Stone deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["stones"] });
    },
    onError(err: string) {
      // toast.error(err || "Error deleting stone");
      toast.error("Error deleting stone");
    },
  });
};

// Product Occasions exports
export const useGetAllProductOccasionsQuery = (params: IParams = {}) => {
  return useQuery({
    queryKey: ["occasions", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchOccasion[] }>("occasion", {
        params,
      });
      return res?.data?.data;
    },
  });
};

export const useCreateProductOccasionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["occasions"],
    mutationFn: async (body: FormData) => {
      const res = await apiClient.post("occasion", body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Product occasion created successfully");
      queryClient.invalidateQueries({ queryKey: ["occasions"] });
    },
    onError(err: string) {
      // toast.error(err || "Error creating product occasion");
      toast.error("Error creating product occasion");
    },
  });
};

export const useUpdateProductOccasionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["occasions"],
    mutationFn: async ({ id, body }: { id: string; body: FormData }) => {
      const res = await apiClient.patch(`occasion/${id}`, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Product occasion updated successfully");
      queryClient.invalidateQueries({ queryKey: ["occasions"] });
    },
    onError(err: string) {
      // toast.error(err || "Error updating product occasion");
      toast.error("Error updating product occasion");
    },
  });
};

export const useDeleteProductOccasionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["occasions"],
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`occasion/${id}`);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Product occasion deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["occasions"] });
    },
    onError(err: string) {
      // toast.error(err || "Error deleting product occasion");
      toast.error("Error deleting product occasion");
    },
  });
};

// SKU validation export
export const useValidateSKUQuery = (sku: string) => {
  return useQuery({
    queryKey: ["validate-sku", sku],
    queryFn: async () => {
      const res = await apiClient.get(`product/validate-sku/${sku}`);
      return res?.data;
    },
    enabled: !!sku && sku.length > 0,
  });
};
