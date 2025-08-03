import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiClient } from "../utils/ApiGateway";

export interface IItem {
  item: string;
  quantity: number;
  price: number;
  paidAmount: number;
}

export interface IProducts {
  product: string;
  quantity: number;
  price: number;
  paidAmount: number;
  wt: number;
}

export interface IFetchExpenses {
  _id: string;
  expenseCategory: IFetchExpensesCategory;
  date: string;
  description: string;
  amount: number;
  images: string[];
}
export interface IFetchExpensesCategory {
  _id?: string;
  name: string;
  description: string;
}
interface IUpdateProps {
  id: string;
  body: FormData;
  headers?: { [key: string]: string };
}

interface IUpdateCategoryProps {
  id: string;
  body: IFetchExpensesCategory;
}
export const useGetExpensesQuery = (params = {}) => {
  return useQuery({
    queryKey: ["expense", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchExpenses[] }>("expense", {
        params,
      });
      return res?.data?.data;
    },
  });
};

// get geExpensesCategory

export const useGetExpenseCategoryQuery = (params = {}) => {
  return useQuery({
    queryKey: ["expense/category", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchExpensesCategory[] }>(
        "expense/category",
        {
          params,
        }
      );
      return res?.data?.data;
    },
  });
};

export const useCreateExpenseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["expense"],
    mutationFn: async (body: FormData) => {
      const res = await apiClient.post("expense", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Expense created successfully");
      queryClient.invalidateQueries({ queryKey: ["expense"] });
    },
    onError(err: string) {
      // toast.error(err || "Error creating expense");
      toast.error("Error creating expense");
    },
  });
};

export const useCreateExpenseCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["expense/category"],
    mutationFn: async (body: IFetchExpensesCategory) => {
      const res = await apiClient.post("expense/category", body, {});
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Expense Category created successfully");
      queryClient.invalidateQueries({ queryKey: ["expense/category"] });
    },
    onError(err: string) {
      // toast.error(err || "Error creating expense category");
      toast.error("Error creating expense category");
    },
  });
};

export const useUpdateExpenseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["expense"],
    mutationFn: async ({ id, body }: { id: string; body: FormData }) => {
      const res = await apiClient.patch(`expense/${id}`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Expense updated successfully");
      queryClient.invalidateQueries({ queryKey: ["expense"] });
    },
    onError(err: string) {
      // toast.error(err || "Error updating Expense");
      toast.error("Error updating Expense");
    },
  });
};

export const useUpdateExpenseCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["expense/category"],
    mutationFn: async ({ id, body }: IUpdateCategoryProps) => {
      const res = await apiClient.patch(`expense/category/${id}`, body);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Expense Category updated successfully");
      queryClient.invalidateQueries({ queryKey: ["expense/category"] });
    },
    onError(err: string) {
      // toast.error(err || "Error updating Expense Category");
      toast.error("Error updating Expense Category");
    },
  });
};

export const useDeleteExpenseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["expense"],
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`expense/${id}`);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Expense deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["expense"] });
    },
    onError(err: string) {
      // toast.error(err || "Error deleting expense");
      toast.error("Error deleting expense");
    },
  });
};

export const useDeleteExpenseCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["expense/category"],
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`expense/category/${id}`);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Expense category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["expense/category"] });
    },
    onError(err: string) {
      // toast.error(err || "Error deleting expense category");
      toast.error("Error deleting expense category");
    },
  });
};
