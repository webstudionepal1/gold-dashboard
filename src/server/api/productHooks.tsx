import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";
import capitalize from "lodash/capitalize";
import { toast } from "react-toastify";
import { handleMutationError } from "../../utils/errorHandler";
export interface IParams {
  [key: string]: string | number | boolean | undefined;
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
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
  image?: string;
  totalProducts?: number;
  isActive?: boolean;
  subCategory?: IProductCategory[];
}
export interface IFetchCategory extends IProductCategory {
  _id: string;
  name: string;
}

export interface IBaseProduct {
  _id?: string;
  name?: string;
  slug?: string;
  description?: string;
  category?: string;
  subCategory?: string;
  variant?: Array<{
    price?: number;
    wt?: number;
    unit?: string;
  }>;
  makingCharges?: number;
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
  averageRating?: number;
  numberOfReviews?: number;
}
export interface IFetchProduct {
  _id: string;
  name: string;
  ratings: number;
  description: string;
  category: IFetchCategory;
  subCategory: IFetchSubCategory;
  averageRating?: number;
  numberOfReviews?: number;
  variants: Array<{
    price: number;
    wt: number;
    unit: string;
    isActive: boolean;
  }>;
  makingCharges: number;
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
  productType?: string;
  images: string[];
  video?: string[];
  videoThumbnail?: string[];
  isActive: boolean;
  wastage?: {
    type: "fixed" | "per";
    value: number;
  };
  stones?: Array<{
    name: string;
    weight: string;
    price: string;
    color: string;
  }>;
  others?: Array<{
    name: string;
    value: number;
  }>;
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
    queryKey: ["products", params],
    queryFn: async () => {
      const res = await apiClient.get<{
        data: {
          products: IFetchProduct[];
          pagination?: {
            currentPage: number;
            totalPages: number;
            totalCount: number;
            limit: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
            nextPage: number | null;
            prevPage: number | null;
          };
          searchQuery?: string;
          appliedFilters?: Record<string, unknown>;
        };
      }>("search", {
        params: {
          ...params,
        },
      });
      return res?.data?.data;
    },
  });
};

// Alternative query for getting all products without stock filter (for gift/package creation)
export const useGetAllProductsForGiftsQuery = (params: IParams = {}) => {
  return useQuery({
    queryKey: ["products-for-gifts", params],
    queryFn: async () => {
      const res = await apiClient.get<{
        data: IFetchProduct[] | { products: IFetchProduct[] };
      }>("product", {
        params: { limit: 500, ...params },
      });
      const data = res?.data?.data;
      if (Array.isArray(data)) return data;
      if (data && typeof data === "object" && Array.isArray(data.products)) {
        return data.products;
      }
      return [];
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
    queryKey: ["products", id],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchProduct }>(`product/${id}`);
      return res?.data?.data;
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
      queryClient.invalidateQueries({ queryKey: ["products-for-gifts"] });
    },
    onError(err: unknown) {
      handleMutationError(err, "Error creating products");
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
    onMutate() {
      toast.dismiss();
    },
    onSuccess() {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError(err: any) {
      const errorMessage =
        err ||
        err?.data?.message ||
        err?.response?.data?.message ||
        "Error updating product category";
      toast.error(errorMessage);
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
    onError(err: any) {
      const errorMessage =
        err ||
        err?.data?.message ||
        err?.response?.data?.message ||
        "Error updating product category";
      toast.error(errorMessage);
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
    onError(err: any) {
      console.log(err, "error");
      const errorMessage =
        err ||
        err?.data?.message ||
        err?.response?.data?.message ||
        "Error updating product category";
      toast.error(errorMessage);
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
    onError(err: any) {
      const errorMessage =
        err ||
        err?.data?.message ||
        err?.response?.data?.message ||
        "Error updating product category";
      toast.error(errorMessage);
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
      toast.error(err);
    },
  });
};

// Product sub category
export const useGetAllProductSubCategoriesQuery = (
  params: IParams = {},
  options = { enabled: true }
) => {
  const stableQueryKey = params && JSON.stringify(params);
  return useQuery({
    queryKey: ["subcategory", stableQueryKey],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchSubCategory[] }>(
        "subcategory",
        { params }
      );
      const raw = res?.data?.data;
      return Array.isArray(raw) ? raw : [];
    },
    enabled: options.enabled,
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
      console.log("err", err);
      // toast.error(err || "Error creating product subcategory");
      toast.error(err);
    },
    onMutate() {
      toast.dismiss();
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
      toast.error(err);
    },
    onMutate() {
      toast.dismiss();
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
      toast.error(err);
    },
    onMutate() {
      toast.dismiss();
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
