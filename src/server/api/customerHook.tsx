import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../utils/ApiGateway";
import { toast } from "react-toastify";
export interface IParams {
  [key: string]: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  dob: string;
  gender: string;
  status: string;
  phone: string;
  license: string;
  licenseNumber: string;
  billBook: string[];
  citizenship: string[];
  vehicle: {
    type: string;
    model: string;
    number: string;
    images: string[];
    _id: string;
  };
  orders: number[];
  joinDate: string;
  image: string;
  isActive: boolean;
  role: string;
  isVerified: boolean;
  referralCode: string;
  address: string;
  addresses: {
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    isDefault: boolean;
    addressType: string;
    _id: string;
  }[];
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export const useGetCustomerQuery = (params: IParams = {}) => {
  return useQuery({
    queryKey: ["user", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IUser[] }>("user", {
        params,
      });
      return res?.data?.data;
    },
  });
};

export const useDeleteCustomerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["profile"],
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`profile/${id}`);
      return res?.data?.data;
    },
    onSuccess() {
      toast.success("Customer Deleted Successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError(err: string) {
      toast.error(err || "Error deleting Customers");
    },
  });
};
