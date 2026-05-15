import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";

export interface ITransaction {
  orderId: string;
  transactionId: string;
  paymentMethod: string;
  payment: number;
  remainingPayment: number;
  totalAmount: number;
  paymentStatus: string;
  paymentDate: string;
  orderDate: string;
  customerName: string;
  customerPhone: string;
  orderStatus?: string;
  image?: string;
}

export interface TransactionResponse {
  success: boolean;
  message: string;
  data: ITransaction[];
}

interface TransactionQueryParams {
  fromDate?: string;
  toDate?: string;
}

export const useGetTransactionsQuery = (params: TransactionQueryParams = {}) => {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: async () => {
      const res = await apiClient.get<TransactionResponse>("transactions", {
        params,
      });
      return res?.data?.data;
    },
  });
};
