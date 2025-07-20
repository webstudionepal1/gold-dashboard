import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";
import { toast } from "react-toastify";
export interface IParams {
  [key: string]: string;
}

export interface IBaseProductSubCategory {
  _id?: string;
  name?: string;
  description?: string;
  totalProducts?: number;
  isActive?: boolean;
  category?: string;
}
export interface IFetchSubCategory extends IBaseProductSubCategory {
  _id: string;
  name: string;
  category: string;
}

export interface IProductCategory {
  _id?: string;
  name?: string;
  description?: string;
  totalProducts?: number;
  isActive?: boolean;
  subCategory?: IProductCategory[];
}
export interface IFetchCategory extends IProductCategory {
  _id: string;
  name: string;
}
export interface IProductVariant {
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

export interface IBaseProduct {
  name?: string;
  slug?: string;
  description?: string;
  category?: string | IProductCategory;
  subCategory?: string | IBaseProductSubCategory;
  variants?: IProductVariant[];
  makingCharges?: number;

  // Physical properties
  length?: number;
  claspType?: string;
  rhodoumFinishes?: boolean;
  shape?: string;
  quantity?: number;
  totalCarat?: number;
  color?: string;
  clarity?: string;
  dimension?: number;

  // SEO and marketing
  tags?: string[];
  visibleAs?: string;
  images?: string[];

  // Reviews and ratings
  averageRating?: number;
  numberOfReviews?: number;
  reviews?: string[];

  // Status and inventory
  isActive?: boolean;
  isFeatured?: boolean;

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
  _id?: string;
}
export interface IFetchProduct extends IBaseProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string | IProductCategory;
  subCategory: string | IBaseProductSubCategory;
  variants: IProductVariant[];
  makingCharges: number;

  // Reviews and ratings
  averageRating: number;
  numberOfReviews: number;

  // Status and inventory
  isActive: boolean;
  isFeatured: boolean;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

//clasps interfaces
export interface IFetchClasps {
  name: string;
  images?: string[];
  _id: string;
}

//occasion interfaces
export interface IFetchOccasion {
  _id: string;
  name: string;
  slug: string;
  description: string;
  totalProducts: number;
  isActive: boolean;
  image: string;
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
    onError(err: string) {
      toast.error(err || "Error creating products");
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
      const res = await apiClient.patch(`product/${id}`, body);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError(err: string) {
      toast.error(err || "Error creating products");
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
      toast.error(err || "Error deleting products");
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
    mutationFn: async (body: IProductCategory) => {
      const res = await apiClient.post("category", body);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Product category created successfully");
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
    onError(err: string) {
      toast.error(err || "Error creating product category");
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
      body: IProductCategory;
    }) => {
      const res = await apiClient.patch(`category/${id}`, body);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Product category updated successfully");
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
    onError(err: string) {
      toast.error(err || "Error updating product category");
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
      toast.error(err || "Error deleting product category");
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
      toast.error(err || "Error creating product subcategory");
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
      toast.error(err || "Error updating product subcategory");
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
      toast.error(err || "Error deleting product subcategory");
    },
  });
};
// Product clasp
export const useGetAllProductClaspsQuery = (params: IParams = {}) => {
  return useQuery({
    queryKey: ["clasp"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchClasps[] }>("clasptype", {
        params,
      });
      return res?.data?.data;
    },
  });
};

// Product occasions
export const useGetAllProductOccasionsQuery = (params: IParams = {}) => {
  return useQuery({
    queryKey: ["occasions"],
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
    mutationFn: async (body: Partial<IFetchOccasion>) => {
      const res = await apiClient.post("occasion", body);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Occasion created successfully");
      queryClient.invalidateQueries({ queryKey: ["occasions"] });
    },
    onError(err: string) {
      toast.error(err || "Error creating occasion");
    },
  });
};

export const useUpdateProductOccasionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["occasions"],
    mutationFn: async ({
      id,
      body,
    }: {
      id: string;
      body: Partial<IFetchOccasion>;
    }) => {
      const res = await apiClient.patch(`occasion/${id}`, body);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Occasion updated successfully");
      queryClient.invalidateQueries({ queryKey: ["occasions"] });
    },
    onError(err: string) {
      toast.error(err || "Error updating occasion");
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
      toast.success("Occasion deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["occasions"] });
    },
    onError(err: string) {
      toast.error(err || "Error deleting occasion");
    },
  });
};

// SKU validation hook
export const useValidateSKUQuery = (sku: string, excludeProductId?: string) => {
  return useQuery({
    queryKey: ["validate-sku", sku, excludeProductId],
    queryFn: async () => {
      if (!sku || sku.trim() === "") {
        return { isUnique: true };
      }
      const params = excludeProductId ? { excludeProductId } : {};
      const res = await apiClient.get(
        `validate-sku/${encodeURIComponent(sku)}`,
        {
          params,
        }
      );
      return res?.data?.data;
    },
    enabled: !!sku && sku.trim() !== "",
    staleTime: 30000, // Cache for 30 seconds
  });
};

// Stone interfaces and hooks
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
  createdAt?: Date;
  updatedAt?: Date;
}

export const useGetAllStonesQuery = (params: IParams = {}) => {
  return useQuery({
    queryKey: ["stones", params],
    queryFn: async () => {
      try {
        const res = await apiClient.get<{
          success: boolean;
          message: string;
          data: {
            stones: IFetchStone[];
            pagination: any;
            filters: any;
          };
        }>("stone", {
          params,
        });

        console.log("Stones API response:", res?.data);

        // Handle different response structures
        if (res?.data?.data?.stones) {
          return res.data.data.stones;
        } else if (Array.isArray(res?.data?.data)) {
          return res.data.data;
        } else if (Array.isArray(res?.data)) {
          return res.data;
        }

        return [];
      } catch (error) {
        console.error("Error fetching stones:", error);
        return [];
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Stone CRUD operations
export interface ICreateStoneData {
  name: string;
  type: "diamond" | "ruby" | "emerald" | "sapphire" | "pearl" | "other";
  color: string;
  clarity: string;
  cut: string;
  carat: number;
  pricePerCarat: number;
  shape: string;
  certification?: string;
  description?: string;
  images?: string[];
}

export interface IUpdateStoneData extends Partial<ICreateStoneData> {
  isActive?: boolean;
}

export const useCreateStoneMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ICreateStoneData) => {
      const res = await apiClient.post("stone", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stones"] });
      toast.success("Stone created successfully");
    },
    onError: (error: any) => {
      console.error("Error creating stone:", error);
      toast.error(error?.response?.data?.message || "Failed to create stone");
    },
  });
};

export const useUpdateStoneMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: IUpdateStoneData;
    }) => {
      const res = await apiClient.put(`stone/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stones"] });
      toast.success("Stone updated successfully");
    },
    onError: (error: any) => {
      console.error("Error updating stone:", error);
      toast.error(error?.response?.data?.message || "Failed to update stone");
    },
  });
};

export const useDeleteStoneMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`stone/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stones"] });
      toast.success("Stone deleted successfully");
    },
    onError: (error: any) => {
      console.error("Error deleting stone:", error);
      toast.error(error?.response?.data?.message || "Failed to delete stone");
    },
  });
};

export const useGetStoneByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["stone", id],
    queryFn: async () => {
      try {
        const res = await apiClient.get<{
          success: boolean;
          message: string;
          data: IFetchStone;
        }>(`stone/${id}`);

        return res.data.data;
      } catch (error) {
        console.error("Error fetching stone:", error);
        throw error;
      }
    },
    enabled: !!id,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
