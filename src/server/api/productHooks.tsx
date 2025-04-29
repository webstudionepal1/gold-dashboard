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
}
export interface IFetchSubCategory extends IBaseProductSubCategory {
  _id: string;
  name: string;
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
  _id?: string
  name?: string;
  description?: string;
  category?: string
  subCategory?: string
  variant?: Array<{
    price?: number;
    wt?: number;
    unit?: string;
    totalStock?: number;
    usedStock?: number;
    remainingStock?: number;
    reorderPoint?: number;
  }>;
  makingCharges?: number;
  length?: number;
  claspType?: string
  rhodoumFinishes?: boolean;
  shape?: string;
  quantity?: number;
  totalCarat?: number;
  color?: string;
  clarity?: string;
  dimension?: number;
  tags?: string[];
  visibleAs?: string;
  images?: string[];
}
export interface IFetchProduct {
  _id: string;
  name: string;
  description: string;
  category: IFetchCategory;
  subCategory: IFetchSubCategory;
  variant:[{
    price: number,
    wt: number,
     unit:string,
     totalStock: number
     usedStock: number
     remainingStock: number
     reorderPoint: number
  }],
  makingCharges:number;
  length: number;
  claspType: IFetchClasps;
  rhodoumFinishes: boolean;
  shape:string;
  quantity: number;
  totalCarat: number;
  color:string;
  clarity: string;
  dimension: number;
  tags: string[];
  visibleAs: string;
  images: string[];
}

//clasps interfaces
export interface IFetchClasps {
  name: string;
  images?: string[];
  _id: string;
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
    queryKey: ["clasptype"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchClasps[] }>("calsptype", {
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
      const res = await apiClient.post("calsptype", body);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Product clasp created successfully");
      queryClient.invalidateQueries({ queryKey: ["clasptype"] });
    },
    onError(err: string) {
      toast.error(err || "Error creating product clasp");
    },
  });
};

export const useUpdateProductClaspsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["clasptype"],
    mutationFn: async ({ id, body }: { id: string; body: FormData }) => {
      const res = await apiClient.patch(`calsptype/${id}`, body);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Product clasp updated successfully");
      queryClient.invalidateQueries({ queryKey: ["clasptype"] });
    },
    onError(err: string) {
      toast.error(err || "Error updating product clasp");
    },
  });
};

export const useDeleteProductClaspsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["clasptype"],
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`calsptype/${id}`);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Product clasp deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["clasptype"] });
    },
    onError(err: string) {
      toast.error(err || "Error deleting product clasp");
    },
  });
};
