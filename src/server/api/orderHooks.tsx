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
  landmark?: string; // Make optional for compatibility
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
  landmark?: string; // Make optional for compatibility
  phone: string;
  email: string;
}

interface BillDetails {
  subTotalItemPrice?: number; // Make optional for compatibility
  shippingCost: number;
  discount: number;
  coupon?: any[]; // Make optional for compatibility
  totalBill?: number; // Make optional for compatibility
}

interface OrderTimeline {
  canceled?: {
    reason: string | null;
  };
  orderCreated?: string;
  orderConfirmation?: string | null;
  pickUp?: string | null;
  deliveryAssignment?: string | null;
  outForDelivery?: string | null;
  orderHandOver?: string | null;
  deliveryCompletion?: string | null;
}

interface TransactionDetails {
  image?: string; // Make optional for compatibility
  transactionId?: string; // Make optional for compatibility
  payment?: number; // Make optional for compatibility
  remainingPayment?: number; // Make optional for compatibility
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
  transactionDetails?: TransactionDetails; // Make optional for compatibility
  _id: string;
  customer: ICustomer;
  orderedProducts: OrderedProduct[];
  orderStatus: string;
  paymentStatus: string;
  totalAmount: number;
  deliveryStatus?: string; // Make optional for compatibility
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
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
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
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
    onSuccess: (data, variables: IParams) => {
      handleMutationSuccess("Order updated successfully");

      // Invalidate all order-related queries for immediate UI updates
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      // Specifically invalidate the individual order query
      queryClient.invalidateQueries({ queryKey: ["orders", variables.id] });

      // Optionally update the cache directly for immediate feedback
      queryClient.setQueryData(["orders", variables.id], (oldData: any) => {
        if (oldData) {
          return { ...oldData, ...variables.body };
        }
        return oldData;
      });
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

// Custom hook for managing order cache efficiently
export const useOrderCache = () => {
  const queryClient = useQueryClient();

  const prefetchOrder = (id: string) => {
    queryClient.prefetchQuery({
      queryKey: ["orders", id],
      queryFn: async (): Promise<Order | null> => {
        const res = await apiClient.get<OrderResponse>(`order/${id}`);
        return res?.data?.data || null;
      },
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  const invalidateOrderCache = (id?: string) => {
    if (id) {
      queryClient.invalidateQueries({ queryKey: ["orders", id] });
    } else {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  };

  const updateOrderInCache = (id: string, updates: Partial<Order>) => {
    queryClient.setQueryData(["orders", id], (oldData: Order | null) => {
      if (oldData) {
        return { ...oldData, ...updates };
      }
      return oldData;
    });
  };

  const getOrderFromCache = (id: string): Order | undefined => {
    return queryClient.getQueryData(["orders", id]);
  };

  return {
    prefetchOrder,
    invalidateOrderCache,
    updateOrderInCache,
    getOrderFromCache,
  };
};
