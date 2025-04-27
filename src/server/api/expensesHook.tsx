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

  //   items: IItem[];
  //   products: IProducts[];
  //   supplier: string;
  //   discount: number;
  //   discountType: string;
  //   totalAmount: number;
  //   paid: number;
  //   createdAt: Date;
  //   updatedAt: Date;
  //   createdBy: string;
}
interface IFetchExpensesCategory {
  _id: string;
  name: string;
  description: string;
}
interface IUpdateProps {
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
    mutationFn: async (body: IFetchExpensesCategory) => {
      const res = await apiClient.post("expense", body);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Expense created successfully");
      queryClient.invalidateQueries({ queryKey: ["expense"] });
    },
    onError(err: string) {
      toast.error(err || "Error creating expense");
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
      toast.error(err || "Error deleting expense");
    },
  });
};
