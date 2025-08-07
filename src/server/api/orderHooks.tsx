import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";
import { toast } from "react-toastify";
import {
  handleMutationError,
  handleMutationSuccess,
} from "../../utils/errorHandler";
import type {
  Order,
  OrdersResponse,
  OrderResponse,
  OrderFilters,
  UpdateOrderRequest,
  CreateOrderRequest,
} from "../../types/order";

interface ShippingAddress {
  fullname: string;
  address: string;
  phone: string;
  landmark: string;
  email: string;
}

export interface IOrderSummary {
  _id: string; // optional but usually needed for view actions
  createdAt: string;
  totalAmount: number;
  orderStatus: string;
}

interface BillingAddress {
  fullname: string;
  address: string;
  landmark: string;
  phone: string;
  email: string;
}

interface BillDetails {
  subTotalItemPrice: number;
  shippingCost: number;
  discount: number;
  coupon: any[];
  totalBill: number;
}

interface OrderTimeline {
  canceled: {
    reason: string | null;
  };
  orderCreated: string;
  orderConfirmation: string | null;
  pickUp: string | null;
  deliveryAssignment: string | null;
  outForDelivery: string | null;
  orderHandOver: string | null;
  deliveryCompletion: string | null;
}

interface TransactionDetails {
  image: string;
  transactionId: string;
  payment: number;
  remainingPayment: number;
  paymentMethod: string;
}

interface SelectedVariant {
  price: number;
  wt: number;
  unit: string;
  quantity: number;
}

interface OrderedProduct {
  selectedVariant: SelectedVariant;
  quantity: number;
  product: {
    _id: string;
    name: string;
    images?: string[];
  };
}

interface ICustomer {
  name: string;
  email: string;
  _id: string;
}
export interface IFetchOrder {
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  billDetails: BillDetails;
  orderTimeline: OrderTimeline;
  transactionDetails: TransactionDetails;
  _id: string;
  customer: ICustomer;
  orderedProducts: OrderedProduct[];
  orderStatus: string;
  paymentStatus: string;
  totalAmount: number;
  deliveryStatus: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface IParams {
  id: string;
  body: any;
}
export const useGetAllOrdersQuery = (params: OrderFilters = {}) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: async (): Promise<Order[]> => {
      const res = await apiClient.get<OrdersResponse>("order", {
        params,
      });
      return res?.data?.data || [];
    },
  });
};
export const useGetOrderById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async (): Promise<Order | null> => {
      if (!id) return null;
      const res = await apiClient.get<OrderResponse>(`order/${id}`);
      return res?.data?.data || null;
    },
    enabled: !!id,
  });
};
export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["orders"],
    mutationFn: async (body: FormData) => {
      const res = await apiClient.post("order", body);
      return res?.data?.data;
    },
    onSuccess() {
      handleMutationSuccess("Order created successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError(error: any) {
      handleMutationError(error, "Error creating order");
    },
  });
};

export const useUpdateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["orders"],
    mutationFn: async ({ id, body }: IParams) => {
      const res = await apiClient.patch(`order/${id}`, body);
      return res?.data?.data;
    },
    onSuccess() {
      handleMutationSuccess("Order updated successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError(error: any) {
      handleMutationError(error, "Error updating order");
    },
  });
};

export const useDeleteOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["orders"],
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`order/${id}`);
      return res?.data?.data;
    },
    onSuccess() {
      handleMutationSuccess("Order deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError(error: any) {
      handleMutationError(error, "Error deleting order");
    },
  });
};
