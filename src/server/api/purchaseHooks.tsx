import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiClient } from "../utils/ApiGateway";
// import { IFetchSupplier } from "./supplierHooks";
import { IFetchProduct } from "./productHooks";

export interface IItem {
  item: string;
  quantity?: number;
  price: number;
  paidAmount: number;
}

export interface IProducts {
  product: string;
  quantity?: number;
  price: number;
  paidAmount: number;
  wt?: number;
}

export interface IFetchPurchase {
  _id: string;
  billNo: string;
  items: IItem[];
  products: IProducts[];
  supplier: string;
  discount: number;
  discountType: string;
  totalAmount: number;
  paid: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
interface IPurchase {
  _id?: string;
  billNo?: string;
  items?: IItem[];
  products?: IProducts[];
  supplier?: string;
  discount?: number;
  discountType?: string;
  totalAmount?: number;
  paid?: number;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
}
interface IUpdateProps {
  id: string;
  body: IPurchase;
}
export const useGetPurchasesQuery = (params = {}) => {
  return useQuery({
    queryKey: ["purchases", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchPurchase[] }>("purchase", {
        params,
      });
      return res?.data?.data;
    },
  });
};

export const useCreatePurchaseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["purchases"],
    mutationFn: async (body: IPurchase) => {
      const res = await apiClient.post("purchase", body);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Purchase created successfully");
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
    onError(err: string) {
      toast.error(err || "Error creating purchase");
    },
  });
};

export const useUpdatePurchaseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["purchases"],
    mutationFn: async ({ id, body }: IUpdateProps) => {
      const res = await apiClient.patch(`purchase/${id}`, body);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Purchase updated successfully");
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
    onError(err: string) {
      toast.error(err || "Error updating purchase");
    },
  });
};

export const useDeletePurchaseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["purchases"],
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`purchase/${id}`);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Purchase deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
    onError(err: string) {
      toast.error(err || "Error deleting purchase");
    },
  });
};

// getraw materials
export interface IItems {
  name?: string;
  usedStock?: number;
  unit?: string;
  remainingStock?: number;
  totalStock?: number;
}
export interface IFetchItems {
  name: string;
  unit?: string;
  usedStock: number;
  remainingStock: number;
  totalStock: number;
  _id: string;
}
export const useGetRawMaterialsQuery = (params = {}) => {
  return useQuery({
    queryKey: ["rawitem", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchItems[] }>("rawitem", {
        params,
      });
      return res?.data?.data;
    },
  });
};

export const useCreateRawMaterialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["rawitem"],
    mutationFn: async (body: IItems) => {
      const res = await apiClient.post("rawitem", body);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Raw Material created successfully");
      queryClient.invalidateQueries({ queryKey: ["rawitem"] });
    },
    onError(err: string) {
      toast.error(err || "Error creating raw material");
    },
  });
};
export const useUpdateRawItemsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["rawitem"],
    mutationFn: async ({ id, body }: { id: string; body: IItems }) => {
      const res = await apiClient.patch(`rawitem/${id}`, body);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Raw Material updated successfully");
      queryClient.invalidateQueries({ queryKey: ["rawitem"] });
    },
    onError(err: string) {
      toast.error(err || "Error updating raw material");
    },
  });
};
export const useDeleteRawMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["rawitem"],
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`rawitem/${id}`);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Raw Material deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["rawitem"] });
    },
    onError(err: string) {
      toast.error(err || "Error deleting raw material");
    },
  });
};
// purchase - return hooks
export interface IReturnItem {
  item: any;
  quantity?: number;
}
export interface IReturnProduct {
  product: IFetchProduct;
  quantity: number;
  reason: string;
}
export interface IFetchPurchaseReturn {
  _id: string;
  purchase: string;
  returnNo: string;
  items: IReturnItem[];
  products: IReturnProduct[];
  totalReturnAmount: number;
  refundAmount: number;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface IPurchaseReturn {
  _id?: string;
  purchase?: string;
  returnNo?: string;
  items?: IReturnItem[];
  totalReturnAmount?: number;
  refundAmount?: number;
  reason?: string;
}
interface IUpdatePurchaseReturn {
  id: string;
  body: IPurchaseReturn;
}
export const useGetPurchaseReturnQuery = (params = {}) => {
  return useQuery({
    queryKey: ["purchase-return", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchPurchaseReturn[] }>(
        "purchase/return",
        {
          params,
        }
      );
      return res?.data?.data;
    },
  });
};

export const useCreatePurchaseReturnMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["purchase-return"],
    mutationFn: async (body: IPurchaseReturn) => {
      const res = await apiClient.post("purchase/return", body);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Purchase return created successfully");
      queryClient.invalidateQueries({ queryKey: ["purchase-return"] });
    },
    onError(err: string) {
      toast.error(err || "Error creating purchase return");
    },
  });
};

export const useUpdatePurchaseReturnMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["purchase-return"],
    mutationFn: async ({ id, body }: IUpdatePurchaseReturn) => {
      const res = await apiClient.patch(`purchase/return/${id}`, body);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Purchase return updated successfully");
      queryClient.invalidateQueries({ queryKey: ["purchase-return"] });
    },
    onError(err: string) {
      toast.error(err || "Error updating purchase return");
    },
  });
};

export const useDeletePurchasReturnMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["purchase-return"],
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`purchase/return/${id}`);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Purchase return deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["purchase-return"] });
    },
    onError(err: string) {
      toast.error(err || "Error deleting purchase return");
    },
  });
};
