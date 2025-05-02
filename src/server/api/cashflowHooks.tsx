import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";
import { toast } from "react-toastify";

export enum CashFlowType {
  SALE = "sale", // Revenue from product sales
  PURCHASE = "purchase", // Cost of purchasing inventory
  EXPENSE = "expense", // General business expenses
  REFUND = "refund", // Customer refunds
  SUPPLIER_RETURN = "supplierReturn", // Returns to suppliers
  CUSTOMER_DEPOSIT = "customerDeposit", // Customer deposits for custom jewelry
  ADJUSTMENT = "adjustment", // Manual accounting adjustments
  OTHER_INCOME = "otherIncome", // Other income sources
}

// Payment methods
export enum PaymentMethod {
  CASH = "cash",
  BANK_TRANSFER = "bankTransfer",
  CREDIT_CARD = "creditCard",
  DEBIT_CARD = "debitCard",
  MOBILE_PAYMENT = "mobilePayment",
  CHEQUE = "cheque",
  STORE_CREDIT = "storeCredit",
  OTHER = "other",
}
export interface IFetchCashFlow {
  transactionDate: Date;
  transactionType: CashFlowType;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceId?: string;
  referenceModel: "Order" | "Purchase" | "Expense" | "PurchaseReturn" | "Other";
  referenceNumber?: string;
  description?: string;
  tags?: string[];
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export const useGetAllCashflowQuery = (params = {}) => {
  return useQuery({
    queryKey: ["cashflow", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchCashFlow[] }>("cashflow", {
        params,
      });
      return res?.data?.data;
    },
  });
};

export const useDeleteCashflowMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["cashflow"],
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`cashflow/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashflow"] });
      toast.success("Cashflow deleted successfully");
    },
    onError(err: string) {
      toast.error(err || "Error Deleting cashflow");
    },
  });
};
