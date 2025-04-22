import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";
import { toast } from "react-toastify";

interface ShippingAddress {
  fullname: string;
  address: string;
  phone: string;
  landmark: string;
  email: string;
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
  product: string;
}

interface IFetchOrder {
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  billDetails: BillDetails;
  orderTimeline: OrderTimeline;
  transactionDetails: TransactionDetails;
  _id: string;
  customer: string;
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
const useGetAllOrdersQuery = (params = {}) => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFetchOrder[] }>("order", {
        params,
      });
      return res?.data?.data;
    },
  });
};
export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["order"],
    mutationFn: async (body: FormData) => {
      const res = await apiClient.post("order", body);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Order created successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError(error: string) {
      toast.error(error || "Error creating order");
    },
  });
};

export const useUpdateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["order"],
    mutationFn: async ({ id, body }: IParams) => {
      const res = await apiClient.patch(`order/${id}`, body);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Order updated successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError(error: string) {
      toast.error(error || "Error updating order");
    },
  });
};

export const useDeleteOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["order"],
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`order/${id}`);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Order deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError(error: string) {
      toast.error(error || "Error deleting order");
    },
  });
};
